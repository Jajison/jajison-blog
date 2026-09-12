"""离线检查本内容包的链接、课程顺序、格式、图示与练习 ZIP。"""
from pathlib import Path
import json
import re
import sys
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree
from zipfile import ZipFile
from package_workshop import workshop_files

ROOT = Path(__file__).resolve().parents[1]
errors = []
link_count = 0


def fail(path, message):
    errors.append(f"{path.relative_to(ROOT)}: {message}")


def prose_only(path, source):
    fence = None
    lines = []
    for number, line in enumerate(source.splitlines(), 1):
        marker = re.match(r"^\s*(~{3,}|" + chr(96) + r"{3,})", line)
        if marker:
            token = marker.group(1)
            if fence is None:
                fence = (token[0], len(token), number)
            elif token[0] == fence[0] and len(token) >= fence[1]:
                fence = None
            lines.append("")
        else:
            lines.append(line if fence is None else "")
    if fence:
        fail(path, f"第 {fence[2]} 行代码围栏未闭合")
    return "\n".join(lines)


markdown = sorted(ROOT.rglob("*.md"))
for path in markdown:
    source = path.read_text(encoding="utf-8")
    prose = prose_only(path, source)
    if prose.count("<details>") != prose.count("</details>"):
        fail(path, "details 标签未配对")
    if prose.count("<summary>") != prose.count("</summary>"):
        fail(path, "summary 标签未配对")
    for match in re.finditer(r"(!?)\[([^\]]*)\]\(([^)]+)\)", prose):
        image, label, target = match.groups()
        if image and not label.strip():
            fail(path, "图片缺少替代文字")
        target = target.strip().strip("<>")
        url = urlsplit(target)
        if url.scheme or url.netloc or not url.path:
            continue
        link_count += 1
        destination = (path.parent / unquote(url.path)).resolve()
        if not destination.is_relative_to(ROOT):
            fail(path, f"链接指向内容包之外：{target}")
        elif not destination.is_file():
            fail(path, f"相对链接不存在：{target}")

def read_frontmatter(path):
    source = path.read_text(encoding="utf-8")
    match = re.match(r"\A---\n(.*?)\n---\n", source, re.S)
    if not match:
        fail(path, "缺少 YAML frontmatter")
        return {}, source
    fields = dict(re.findall(r"^([a-z]+):\s*(.+)$", match.group(1), re.M))
    return fields, source


curriculum_path = ROOT / "curriculum.json"
try:
    curriculum = json.loads(curriculum_path.read_text(encoding="utf-8"))
    tracks = curriculum["tracks"]
    if not isinstance(tracks, list):
        raise ValueError("tracks 必须是列表")
except (OSError, ValueError, KeyError, TypeError) as error:
    fail(curriculum_path, f"无法读取路线配置：{error}")
    tracks = []

planned = []
track_ids = set()
for track in tracks:
    if not isinstance(track, dict) or any(not isinstance(track.get(key), str) or not track[key].strip() for key in ("id", "title", "description", "level")):
        fail(curriculum_path, "每条路线必须有非空 id、title、description、level")
        continue
    if track["id"] in track_ids:
        fail(curriculum_path, f"路线 id 重复：{track['id']}")
    track_ids.add(track["id"])
    if not isinstance(track.get("pages"), list) or not track["pages"]:
        fail(curriculum_path, f"路线 {track['id']} 缺少页面列表")
        continue
    for slug in track["pages"]:
        if not isinstance(slug, str) or not re.fullmatch(r"(?:learn|guides)/[a-z0-9][a-z0-9-]*", slug):
            fail(curriculum_path, f"无效文章 slug：{slug!r}")
            continue
        if slug in planned:
            fail(curriculum_path, f"文章重复分配到路线：{slug}")
        planned.append(slug)
        if not (ROOT / "content" / (slug + ".md")).is_file():
            fail(curriculum_path, f"计划文章不存在：{slug}")
if len(tracks) != 8 or len(set(planned)) != 36:
    fail(curriculum_path, "本版必须完整提供 8 条路线与 36 篇不同文章")

required = {"title", "description", "duration", "prerequisites", "outcome", "tags"}
articles, lessons = {}, {}
article_paths = sorted((ROOT / "content/learn").glob("*.md")) + sorted((ROOT / "content/guides").glob("*.md"))
for path in article_paths:
    fields, source = read_frontmatter(path)
    is_lesson = path.parent.name == "learn"
    required_fields = required | ({"lesson", "stage"} if is_lesson else {"level"})
    missing = required_fields - fields.keys()
    if missing:
        fail(path, "缺少字段：" + ", ".join(sorted(missing)))
        continue
    try:
        if int(fields["duration"]) <= 0:
            raise ValueError("duration")
    except ValueError:
        fail(path, "duration 必须为有效正整数")
        continue
    slug = path.relative_to(ROOT / "content").with_suffix("").as_posix()
    articles[slug] = (fields, path)
    if is_lesson:
        try:
            number = int(fields["lesson"])
        except ValueError:
            fail(path, "lesson 必须为有效正整数")
            continue
        lessons[path.stem] = (number, fields, path)
        if number <= 0 or not path.name.startswith(f"{number:02}-"):
            fail(path, "文件名前缀与 lesson 不一致")
    for field in required_fields:
        if not fields[field].strip().strip("\"'").strip():
            fail(path, f"字段不能为空：{field}")
    for phrase in ("完成标准", "<summary>"):
        if phrase not in source:
            fail(path, f"缺少学习闭环：{phrase}")
    if re.search(r"\b(?:TODO|TBD)\b|正文待补", source):
        fail(path, "正文存在未完成占位符")
    prose = prose_only(path, source)
    if len(re.findall(r"(?<!\\)\$\$", prose)) % 2:
        fail(path, "展示公式的 $$ 未配对")
    for number, line in enumerate(prose.splitlines(), 1):
        if len(re.findall(r"(?<!\\)\$\$", line)) == 1 and line.strip() != "$$":
            fail(path, f"第 {number} 行：跨行展示公式的 $$ 必须独占一行，否则可能吞掉后续正文")

if sorted(row[0] for row in lessons.values()) != list(range(1, 21)):
    errors.append("content/learn: 课程编号必须恰好为 01–20")
for slug in sorted(set(articles) - set(planned)):
    fail(curriculum_path, f"文章未纳入任何路线：{slug}")

dependencies = {}
for slug, (fields, path) in articles.items():
    dependencies[slug] = []
    prerequisites = fields["prerequisites"]
    if not (prerequisites.startswith("[") and prerequisites.endswith("]")):
        fail(path, "prerequisites 必须是方括号列表")
        continue
    for entry in prerequisites[1:-1].split(","):
        entry = entry.strip().strip("\"'")
        if not entry:
            continue
        prerequisite = entry if "/" in entry else "learn/" + entry
        if prerequisite in dependencies[slug]:
            fail(path, f"前置课程重复：{entry}")
        dependencies[slug].append(prerequisite)
        if prerequisite not in articles:
            fail(path, f"前置课程不存在：{entry}")
        elif slug.startswith("learn/") and prerequisite.startswith("learn/") and path.stem in lessons and prerequisite.split("/", 1)[1] in lessons and lessons[prerequisite.split("/", 1)[1]][0] >= lessons[path.stem][0]:
            fail(path, f"前置课程必须早于本课：{entry}")

visited, active = set(), []
def visit(slug):
    if slug in active:
        errors.append("先修关系存在循环：" + " → ".join(active[active.index(slug):] + [slug]))
        return
    if slug in visited:
        return
    active.append(slug)
    for prerequisite in dependencies.get(slug, []):
        visit(prerequisite)
    active.pop()
    visited.add(slug)
for slug in dependencies:
    visit(slug)

labs = ROOT / "content/labs.md"
if not labs.is_file():
    fail(labs, "缺少原理实验室页面")
else:
    fields, _ = read_frontmatter(labs)
    if not {"title", "description"}.issubset(fields):
        fail(labs, "实验室需要 title 与 description 元数据")

svg_files = sorted((ROOT / "content/assets").glob("*.svg"))
for path in svg_files:
    try:
        svg = ElementTree.parse(path).getroot()
        ns = "{http://www.w3.org/2000/svg}"
        for tag in ("title", "desc"):
            if not (svg.findtext(ns + tag) or "").strip():
                fail(path, f"SVG 缺少 {tag}")
    except ElementTree.ParseError as error:
        fail(path, f"SVG 无法解析：{error}")
if len(svg_files) != 7:
    errors.append("content/assets: 应有 7 张解释图；先运行 tools/make_diagrams.py")

archive_path = ROOT / "content/downloads/ai-workshop.zip"
if not archive_path.is_file():
    fail(archive_path, "缺少练习 ZIP；先运行 tools/package_workshop.py")
else:
    workshop = ROOT / "content/downloads/workshop"
    try:
        public_files = workshop_files(workshop)
    except ValueError as error:
        fail(workshop, str(error))
        public_files = {}
    with ZipFile(archive_path) as archive:
        names = archive.namelist()
        if len(names) != len(set(names)):
            fail(archive_path, "ZIP 有重复条目")
        for name in names:
            parts = Path(name).parts
            if len(parts) < 2 or parts[0] != "ai-workshop" or ".." in parts:
                fail(archive_path, f"ZIP 路径不正确：{name}")
                continue
            relative = Path(*parts[1:])
            if any(p in (".venv", ".git", "__pycache__") for p in parts) or relative.name.startswith(".env"):
                fail(archive_path, f"ZIP 含环境或缓存：{name}")
            if relative.parts[0] == "output" and relative.name != ".gitkeep":
                fail(archive_path, f"ZIP 混入运行结果：{name}")
            original = workshop / relative
            if not original.is_file() or archive.read(name) != original.read_bytes():
                fail(archive_path, f"ZIP 与当前源码不同：{name}")
        expected = {"ai-workshop/" + relative for relative in public_files}
        for name in sorted(expected - set(names)):
            fail(archive_path, f"ZIP 漏打包当前源码：{name}")
        for name in sorted(set(names) - expected):
            fail(archive_path, f"ZIP 含非公开或已删除文件：{name}")
        for name in ("hello.py", "report.py", "list_notes.sh", "search_notes.py", "todo.html", "README.md", "eval-cases.json", "input/records.json", "output/.gitkeep", "sqlite_lab.py", "api_lab.py", "api_client.py", "evaluate_retrieval.py", "controlled_loop.py", "lab_common.py", "input/retrieval-cases.json"):
            if "ai-workshop/" + name not in names:
                fail(archive_path, f"ZIP 缺少必要文件：{name}")

if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(1)
print(f"PASS：{len(markdown)} 份 Markdown，8 路线 / {len(articles)} 篇文章 / 20 基础课，{link_count} 个相对链接，7 张 SVG，实验室、先修无环、练习 ZIP 全集合与源码一致。")
print("范围：离线结构检查；不验证外部网址、网站路由或 AI 回答质量。")

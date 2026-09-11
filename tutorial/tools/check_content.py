"""离线检查本内容包的链接、课程顺序、格式、图示与练习 ZIP。"""
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree
from zipfile import ZipFile

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

required = {"title", "description", "lesson", "stage", "duration", "prerequisites", "outcome", "tags"}
lessons = {}
for path in sorted((ROOT / "content/learn").glob("*.md")):
    source = path.read_text(encoding="utf-8")
    match = re.match(r"\A---\n(.*?)\n---\n", source, re.S)
    if not match:
        fail(path, "缺少 YAML frontmatter")
        continue
    fields = dict(re.findall(r"^([a-z]+):\s*(.+)$", match.group(1), re.M))
    missing = required - fields.keys()
    if missing:
        fail(path, "缺少字段：" + ", ".join(sorted(missing)))
        continue
    try:
        number = int(fields["lesson"])
        if int(fields["duration"]) <= 0:
            raise ValueError("duration")
    except ValueError:
        fail(path, "lesson / duration 必须为有效正整数")
        continue
    lessons[path.stem] = (number, fields, path)
    if not path.name.startswith(f"{number:02}-"):
        fail(path, "文件名前缀与 lesson 不一致")
    for phrase in ("完成标准", "<summary>"):
        if phrase not in source:
            fail(path, f"缺少学习闭环：{phrase}")
    if re.search(r"\b(?:TODO|TBD)\b|正文待补", source):
        fail(path, "正文存在未完成占位符")

if sorted(row[0] for row in lessons.values()) != list(range(1, 21)):
    errors.append("content/learn: 课程编号必须恰好为 01–20")
for slug, (number, fields, path) in lessons.items():
    prerequisites = fields["prerequisites"]
    if not (prerequisites.startswith("[") and prerequisites.endswith("]")):
        fail(path, "prerequisites 必须是方括号列表")
        continue
    for entry in prerequisites[1:-1].split(","):
        entry = entry.strip().strip("\"'")
        if not entry:
            continue
        if entry not in lessons:
            fail(path, f"前置课程不存在：{entry}")
        elif lessons[entry][0] >= number:
            fail(path, f"前置课程必须早于本课：{entry}")

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
    with ZipFile(archive_path) as archive:
        names = archive.namelist()
        if len(names) != len(set(names)):
            fail(archive_path, "ZIP 有重复条目")
        for name in names:
            parts = Path(name).parts
            if not parts or parts[0] != "ai-workshop" or ".." in parts:
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
        for name in ("hello.py", "report.py", "list_notes.sh", "search_notes.py", "todo.html", "README.md", "eval-cases.json", "input/records.json", "output/.gitkeep"):
            if "ai-workshop/" + name not in names:
                fail(archive_path, f"ZIP 缺少必要文件：{name}")

if errors:
    print("\n".join(errors), file=sys.stderr)
    sys.exit(1)
print(f"PASS：{len(markdown)} 份 Markdown，20 课，{link_count} 个相对链接，7 张 SVG，练习 ZIP 与源码一致。")
print("范围：离线结构检查；不验证外部网址、网站路由或 AI 回答质量。")

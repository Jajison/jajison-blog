"""在临时副本验证教程中的真实命令，不改动原练习数据。"""
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content/downloads/workshop"


class WorkshopTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="ai-workshop-check-")
        self.addCleanup(self.temp.cleanup)
        self.work = Path(self.temp.name) / "workshop"
        shutil.copytree(SOURCE, self.work)

    def run_command(self, *args, success=True):
        result = subprocess.run(args, cwd=self.work, capture_output=True, text=True, encoding="utf-8", timeout=10)
        if success:
            self.assertEqual(result.returncode, 0, result.stderr)
        else:
            self.assertNotEqual(result.returncode, 0, result.stdout)
            self.assertNotIn("Traceback", result.stderr)
        return result

    def py(self, script, *args, success=True):
        return self.run_command(sys.executable, script, *args, success=success)

    def write_records(self, value):
        path = self.work / "input/test.json"
        path.write_text(json.dumps(value, ensure_ascii=False), encoding="utf-8")
        return "input/test.json"

    def test_preview_save_and_no_overwrite(self):
        original = (self.work / "input/records.json").read_bytes()
        before = sorted(p.relative_to(self.work) for p in self.work.rglob("*"))
        preview = self.py("report.py").stdout
        for expected in ("任务：4 条", "已完成：3 条", "待办：1 条", "总耗时：120 分钟", "已完成任务耗时：90 分钟"):
            self.assertIn(expected, preview)
        self.assertEqual(before, sorted(p.relative_to(self.work) for p in self.work.rglob("*")))
        self.py("report.py", "--output", "output/report.md")
        target = self.work / "output/report.md"
        saved = target.read_bytes()
        self.assertIn("当前为预览", preview)
        self.assertNotIn("当前为预览", saved.decode())
        failure = self.py("report.py", "--output", "output/report.md", success=False)
        self.assertIn("未被覆盖", failure.stderr)
        self.assertEqual(saved, target.read_bytes())
        self.assertEqual(original, (self.work / "input/records.json").read_bytes())

    def test_change_one_field_and_empty_input(self):
        rows = json.loads((self.work / "input/records.json").read_text())
        rows[1]["minutes"] = 40
        out = self.py("report.py", "--input", self.write_records(rows)).stdout
        self.assertIn("总耗时：130 分钟", out)
        self.assertIn("已完成任务耗时：90 分钟", out)
        out = self.py("report.py", "--input", self.write_records([])).stdout
        self.assertIn("任务：0 条", out)
        self.assertIn("总耗时：0 分钟", out)

    def test_invalid_records_fail_without_output(self):
        good = {"id": "W1", "task": "测试任务", "status": "done", "minutes": 45}
        bad_cases = [
            (None, "最外层"), (["wrong"], "对象"), ([{}], "缺少字段"),
            ([dict(good, id=" ")], "非空文字"),
            ([good, dict(good, id=" W1 ")], "编号重复"),
            ([dict(good, status="unknown")], "status"),
            ([dict(good, minutes=value) for value in ["40分钟"]], "minutes"),
            ([dict(good, minutes=-1)], "minutes"),
            ([dict(good, minutes=True)], "minutes"),
        ]
        for records, message in bad_cases:
            with self.subTest(message=message, records=records):
                result = self.py("report.py", "--input", self.write_records(records), "--output", "output/invalid.md", success=False)
                self.assertIn(message, result.stderr)
                self.assertFalse((self.work / "output/invalid.md").exists())

    def test_paths_encoding_and_markdown_cells(self):
        missing = self.py("report.py", "--input", "missing.json", success=False)
        self.assertIn("输入文件不存在", missing.stderr)
        broken = self.work / "input/broken.json"
        broken.write_text('{"oops":', encoding="utf-8")
        self.assertIn("有效的 UTF-8 JSON", self.py("report.py", "--input", str(broken), success=False).stderr)
        path = self.work / "input/with spaces.json"
        path.write_text(json.dumps([{"id": "W1", "task": "甲|乙\n丙", "status": "done", "minutes": 0}], ensure_ascii=False), encoding="utf-8-sig")
        result = self.py("report.py", "--input", str(path)).stdout
        self.assertIn("甲\\|乙 丙", result)

    @unittest.skipUnless(shutil.which("sh"), "当前环境没有 POSIX sh，跳过 Shell；Windows 可在 WSL 运行")
    def test_shell_files_empty_missing_and_spaces(self):
        result = self.run_command("sh", "list_notes.sh", "input").stdout
        lines = result.splitlines()
        self.assertEqual(len(lines), 2)
        for line, name in zip(lines, ("monday", "tuesday")):
            self.assertRegex(line, rf"input/{name}\.txt:\s+2 行$")
        folder = self.work / "notes with spaces"
        folder.mkdir()
        self.assertIn("没有找到", self.run_command("sh", "list_notes.sh", str(folder)).stdout)
        (folder / "a b.txt").write_text("第一行\n第二行\n", encoding="utf-8")
        self.assertRegex(self.run_command("sh", "list_notes.sh", str(folder)).stdout, r"a b\.txt:\s+2 行")
        self.assertIn("目录不存在", self.run_command("sh", "list_notes.sh", "missing-notes", success=False).stderr)
        # 同时执行正文中的片段，避免讲解代码与下载版分离。
        lesson = (ROOT / "content/learn/06-shell.md").read_text(encoding="utf-8")
        snippet = next(block for block in re.findall(r"~~~sh\n(.*?)\n~~~", lesson, re.S) if "for file" in block)
        (self.work / "lesson-shell.sh").write_text(snippet + "\n", encoding="utf-8")
        self.assertEqual(self.run_command("sh", "lesson-shell.sh").stdout, result)

    def test_search_sources_and_true_no_match(self):
        result = self.py("search_notes.py", "报名 截止").stdout
        self.assertIn("2026 年 9 月 18 日 18:00", result)
        citations = re.findall(r"\[([^]:]+):L(\d+)\] (.+)", result)
        self.assertTrue(citations)
        for filename, line_number, excerpt in citations:
            lines = (self.work / "knowledge" / filename).read_text(encoding="utf-8").splitlines()
            self.assertEqual(lines[int(line_number) - 1].strip(), excerpt)
        self.assertIn("20 人", self.py("search_notes.py", "名额 上限", "--limit", "1").stdout)
        self.assertIn("证据不足", self.py("search_notes.py", "餐费 报销").stdout)
        self.assertIn("证据不足", self.py("search_notes.py", "预算 审批").stdout)
        self.py("search_notes.py", "   ", success=False)
        self.py("search_notes.py", "报名", "--limit", "0", success=False)
        shutil.rmtree(self.work / "knowledge")
        self.assertIn("资料目录不存在", self.py("search_notes.py", "报名", success=False).stderr)

    def test_hello_and_python_lesson_snippet(self):
        self.assertEqual(self.py("hello.py").stdout.splitlines(), ["你好，AI 工作台已准备好。", "下一步：运行 report.py，先预览再保存。"])
        lesson = (ROOT / "content/learn/07-python.md").read_text(encoding="utf-8")
        snippet = re.search(r"~~~python\n(.*?)\n~~~", lesson, re.S).group(1)
        (self.work / "mini.py").write_text(snippet + "\n", encoding="utf-8")
        self.assertEqual(self.py("mini.py").stdout.strip(), "45")


if __name__ == "__main__":
    print(f"环境：Python {sys.version.split()[0]} / {sys.platform}", flush=True)
    unittest.main(verbosity=2)

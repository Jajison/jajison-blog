"""把虚构工作记录转换为 Markdown；默认预览，保存时拒绝覆盖。"""
import argparse
import json
import sys
from pathlib import Path


def load_records(path):
    return validate_records(json.loads(path.read_text(encoding="utf-8-sig")))


def validate_records(records):
    if not isinstance(records, list):
        raise ValueError("最外层必须是列表，例如 []。")
    seen = set()
    for number, record in enumerate(records, 1):
        if not isinstance(record, dict):
            raise ValueError(f"第 {number} 条记录必须是对象。")
        for key in ("id", "task", "status", "minutes"):
            if key not in record:
                raise ValueError(f"第 {number} 条缺少字段：{key}")
        for key in ("id", "task"):
            if not isinstance(record[key], str) or not record[key].strip():
                raise ValueError(f"第 {number} 条的 {key} 必须是非空文字。")
        record_id = record["id"].strip()
        if record_id in seen:
            raise ValueError(f"编号重复：{record_id}")
        seen.add(record_id)
        if record["status"] not in ("done", "pending"):
            raise ValueError(f"第 {number} 条的 status 只能是 done 或 pending。")
        if type(record["minutes"]) is not int or record["minutes"] < 0:
            raise ValueError(f"第 {number} 条的 minutes 必须是非负整数，例如 45。")
    return records


def cell(value):
    return str(value).replace("\\", "\\\\").replace("|", "\\|").replace("\n", " ").replace("\r", " ")


def render(records):
    done = [item for item in records if item["status"] == "done"]
    total_minutes = sum(item["minutes"] for item in records)
    done_minutes = sum(item["minutes"] for item in done)
    lines = [
        "# 工作记录汇总", "",
        f"- 任务：{len(records)} 条",
        f"- 已完成：{len(done)} 条",
        f"- 待办：{len(records) - len(done)} 条",
        f"- 总耗时：{total_minutes} 分钟",
        f"- 已完成任务耗时：{done_minutes} 分钟", "",
        "| 编号 | 任务 | 状态 | 分钟 |",
        "| --- | --- | --- | --- |",
    ]
    for item in records:
        status = "已完成" if item["status"] == "done" else "待办"
        lines.append(f"| {cell(item['id'])} | {cell(item['task'])} | {status} | {item['minutes']} |")
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description="工作记录汇总：默认预览，指定 --output 才保存。")
    parser.add_argument("--input", default="input/records.json", help="输入 JSON 路径")
    parser.add_argument("--output", help="新的 Markdown 输出路径；不能覆盖已有文件")
    args = parser.parse_args()
    try:
        content = render(load_records(Path(args.input)))
        if args.output:
            target = Path(args.output)
            target.parent.mkdir(parents=True, exist_ok=True)
            with target.open("x", encoding="utf-8", newline="\n") as handle:
                handle.write(content)
            print(f"已保存：{target}")
        else:
            print(content, end="")
            print("\n当前为预览。保存请指定 --output output/report.md")
    except FileExistsError:
        print("错误：输出文件已存在。请换一个新文件名，原文件未被覆盖。", file=sys.stderr)
        return 1
    except FileNotFoundError:
        print("错误：输入文件不存在。请确认当前目录与 --input 路径。", file=sys.stderr)
        return 1
    except (json.JSONDecodeError, UnicodeError):
        print("错误：输入不是有效的 UTF-8 JSON。请检查编码、双引号、逗号与括号。", file=sys.stderr)
        return 1
    except ValueError as error:
        print(f"错误：{error}", file=sys.stderr)
        return 1
    except OSError as error:
        print(f"文件操作失败：{error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

"""练习共享的统计与排他保存；不读取个人目录或调用外部服务。"""
import json
from pathlib import Path


def summary(records):
    done = [row for row in records if row["status"] == "done"]
    return {
        "count": len(records),
        "done": len(done),
        "pending": len(records) - len(done),
        "total_minutes": sum(row["minutes"] for row in records),
        "done_minutes": sum(row["minutes"] for row in done),
    }


def output_json(value, destination=None):
    text = json.dumps(value, ensure_ascii=False, indent=2) + "\n"
    if destination:
        path = Path(destination)
        path.parent.mkdir(parents=True, exist_ok=True)
        try:
            with path.open("x", encoding="utf-8", newline="\n") as handle:
                handle.write(text)
        except FileExistsError:
            raise ValueError("输出文件已存在，原文件未被覆盖；请使用新文件名。") from None
    print(text, end="")

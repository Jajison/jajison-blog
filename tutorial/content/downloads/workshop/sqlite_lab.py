"""用事务导入虚构记录，再用参数化 SQL 查询。默认只使用内存数据库。"""
import argparse
from pathlib import Path
import sqlite3
import sys

from lab_common import output_json, summary
from report import load_records


def build_database(records, connection, status):
    # with 成功时提交，任一步失败时回滚；主键也在数据库层约束唯一性。
    with connection:
        connection.execute("BEGIN")
        connection.execute("CREATE TABLE tasks (id TEXT PRIMARY KEY, task TEXT NOT NULL, "
                           "status TEXT NOT NULL CHECK(status IN ('done', 'pending')), "
                           "minutes INTEGER NOT NULL CHECK(minutes >= 0))")
        connection.executemany("INSERT INTO tasks VALUES (?, ?, ?, ?)", [
            (row["id"].strip(), row["task"], row["status"], row["minutes"]) for row in records
        ])
    connection.row_factory = sqlite3.Row
    if status == "all":
        selected = connection.execute("SELECT * FROM tasks ORDER BY id").fetchall()
    else:
        # 数据通过参数传递，不能把读者输入拼接成 SQL。
        selected = connection.execute("SELECT * FROM tasks WHERE status = ? ORDER BY id", (status,)).fetchall()
    rows = [dict(row) for row in selected]
    return {"status_filter": status, "summary": summary(rows), "tasks": rows}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", default="input/records.json", help="UTF-8 JSON 工作记录")
    parser.add_argument("--status", choices=("all", "done", "pending"), default="all")
    parser.add_argument("--database", help="可选：新 SQLite 文件路径；拒绝覆盖。省略则不存盘")
    args = parser.parse_args()
    created = None
    connection = None
    try:
        records = load_records(Path(args.input))
        if args.database:
            target = Path(args.database)
            target.parent.mkdir(parents=True, exist_ok=True)
            # 在 sqlite3.connect 之前独占预留，已有数据库绝不被打开修改。
            with target.open("x"):
                pass
            created = target
        connection = sqlite3.connect(str(created) if created else ":memory:")
        result = build_database(records, connection, args.status)
        connection.close()
        connection = None
        result["database"] = str(created) if created else ":memory:"
        output_json(result)
    except (OSError, ValueError, OverflowError, sqlite3.Error) as error:
        if connection:
            connection.close()
        if created:
            created.unlink(missing_ok=True)
        message = "数据库文件已存在，原文件未被覆盖。" if isinstance(error, FileExistsError) else str(error)
        print(f"错误：{message}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

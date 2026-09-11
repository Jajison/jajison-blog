"""离线关键词检索；只输出候选原文，不调用模型或生成答案。"""
import argparse
import sys
from pathlib import Path


def search(query, limit):
    terms = list(dict.fromkeys(query.casefold().split()))
    folder = Path(__file__).resolve().parent / "knowledge"
    if not folder.is_dir():
        raise FileNotFoundError("knowledge 资料目录不存在；请重新解压完整练习包。")
    hits = []
    for path in sorted(folder.glob("*.md")):
        for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            if not line.strip() or line.startswith("#"):
                continue
            score = sum(term in line.casefold() for term in terms)
            if score:
                hits.append((score, path.name, line_number, line.strip()))
    hits.sort(key=lambda row: (-row[0], row[1], row[2]))
    return hits[:limit]


def main():
    parser = argparse.ArgumentParser(description="用空格分隔关键词，在 knowledge 中只读搜索。")
    parser.add_argument("query", help="例如：报名 截止")
    parser.add_argument("--limit", type=int, default=3, help="最多返回 1–10 条，默认 3")
    args = parser.parse_args()
    if not args.query.strip():
        parser.error("请至少提供一个关键词。")
    if not 1 <= args.limit <= 10:
        parser.error("--limit 必须介于 1 和 10 之间。")
    try:
        hits = search(args.query, args.limit)
    except (OSError, UnicodeError) as error:
        print(f"读取资料失败：{error}", file=sys.stderr)
        return 1
    if not hits:
        print("证据不足：没有匹配片段。可换关键词再查；不能据此编造答案。")
    else:
        print("以下是关键词匹配的候选原文，不代表它们一定能回答问题：")
        for _, name, number, line in hits:
            print(f"[{name}:L{number}] {line}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

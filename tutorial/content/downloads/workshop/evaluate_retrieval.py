"""评估逐行关键词检索，不评估模型答案；所有 relevant 是人工标注的文件行号。"""
import argparse
import json
from pathlib import Path
import re
import sys

from lab_common import output_json
from search_notes import search


def load_cases(path):
    cases = json.loads(path.read_text(encoding="utf-8-sig"))
    if not isinstance(cases, list) or not cases:
        raise ValueError("评估集必须是非空列表")
    seen = set()
    for case in cases:
        if not isinstance(case, dict) or not isinstance(case.get("id"), str) or not case["id"].strip():
            raise ValueError("每例必须有非空 id")
        if case["id"] in seen:
            raise ValueError("评估 id 重复")
        seen.add(case["id"])
        if not isinstance(case.get("query"), str) or not case["query"].strip():
            raise ValueError("query 必须是非空文字")
        relevant = case.get("relevant")
        if not isinstance(relevant, list) or not all(isinstance(item, str) for item in relevant) or len(relevant) != len(set(relevant)):
            raise ValueError("relevant 必须是无重复的行号列表")
        for item in relevant:
            match = re.fullmatch(r"([\w-]+\.md):L([1-9][0-9]*)", item)
            if not match:
                raise ValueError(f"无效来源：{item}")
            document = Path(__file__).resolve().parent / "knowledge" / match[1]
            if not document.is_file() or int(match[2]) > len(document.read_text(encoding="utf-8").splitlines()):
                raise ValueError(f"标注来源不存在：{item}")
    return cases


def evaluate(cases, limit):
    rows, positives, negatives = [], [], []
    for case in cases:
        hits = search(case["query"], limit)
        found = [f"{name}:L{line}" for _, name, line, _ in hits]
        relevant = set(case["relevant"])
        correct = relevant.intersection(found)
        row = {"id": case["id"], "query": case["query"], "expected": case["relevant"], "retrieved": found}
        if relevant:
            row.update({"recall_at_k": len(correct) / len(relevant),
                        "precision_at_k": len(correct) / limit,
                        "reciprocal_rank": next((1 / rank for rank, item in enumerate(found, 1) if item in relevant), 0.0)})
            positives.append(row)
        else:
            row["correct_no_answer"] = not found
            negatives.append(row)
        rows.append(row)
    mean = lambda key: sum(row[key] for row in positives) / len(positives) if positives else None
    return {"retriever": "line keyword matching; no model", "k": limit,
            "positive_cases": len(positives), "negative_cases": len(negatives),
            "recall_at_k": mean("recall_at_k"), "precision_at_k": mean("precision_at_k"),
            "mrr": mean("reciprocal_rank"),
            "no_answer_accuracy": sum(row["correct_no_answer"] for row in negatives) / len(negatives) if negatives else None,
            "metric_note": "正例按问题宏平均；Precision@k 的分母固定为 k；无该类样本时返回 null。无答案准确率只衡量空候选。",
            "cases": rows}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cases", default="input/retrieval-cases.json")
    parser.add_argument("--limit", type=int, default=3, help="返回前 k 条，1–10")
    parser.add_argument("--output", help="可选新 JSON 文件路径；拒绝覆盖")
    args = parser.parse_args()
    if not 1 <= args.limit <= 10:
        parser.error("--limit 必须介于 1 和 10 之间")
    try:
        output_json(evaluate(load_cases(Path(args.cases)), args.limit), args.output)
    except (OSError, ValueError) as error:
        print(f"评估失败：{error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

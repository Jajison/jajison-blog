"""确定性策略控制的只读工具循环：无 LLM，无自动回答，不执行检索资料里的指令。"""
import argparse
import math
from pathlib import Path
import re
import subprocess
import sys
import time

from lab_common import output_json


def fallback_query(query):
    # 公开固定规则，展示“策略”和“执行控制”分离，不把它冒充模型决策。
    keywords = [word for word in ("报名", "截止", "名额", "上限", "活动", "日期", "status", "minutes", "预算", "审批", "餐费", "报销") if word in query]
    return " ".join(keywords) if keywords else query


def run_loop(query, max_calls, timeout):
    deadline = time.monotonic() + timeout
    queries = list(dict.fromkeys([query, fallback_query(query)]))
    events = []
    reason = "no_result"
    evidence = []
    for current in queries:
        if len(events) >= max_calls:
            reason = "budget_exhausted"
            break
        remaining = deadline - time.monotonic()
        if remaining <= 0:
            reason = "timeout"
            break
        event = {"call": len(events) + 1, "tool": "search_notes", "query": current}
        events.append(event)
        try:
            result = subprocess.run([sys.executable, str(Path(__file__).with_name("search_notes.py")), current, "--limit", "3"],
                                    capture_output=True, text=True, encoding="utf-8", timeout=remaining)
        except subprocess.TimeoutExpired:
            event["status"] = "timeout"
            reason = "timeout"
            break
        except OSError as error:
            event.update({"status": "tool_error", "error": str(error)})
            reason = "tool_error"
            break
        event["returncode"] = result.returncode
        if result.returncode:
            event.update({"status": "tool_error", "error": result.stderr.strip()})
            reason = "tool_error"
            break
        evidence = [{"source": source, "text": text} for source, text in re.findall(r"^\[([^\]\n]+:L\d+)\] (.+)$", result.stdout, re.M)]
        event.update({"status": "ok", "evidence_count": len(evidence)})
        if evidence:
            reason = "evidence_found"
            break
    return {"policy": "deterministic keyword fallback; no LLM", "question": query,
            "max_calls": max_calls, "timeout_seconds": timeout, "calls_used": len(events),
            "stop_reason": reason, "events": events, "evidence": evidence,
            "note": "候选片段不是最终答案。控制器只允许固定检索工具；资料文本没有工具执行权限。"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("query", help="先原样检索，无结果时最多尝试一次固定关键词提取")
    parser.add_argument("--max-calls", type=int, default=2, help="工具调用上限，1–5；策略最多两轮")
    parser.add_argument("--timeout", type=float, default=3.0, help="整个工具循环的墙钟秒数，>0 且 <=30")
    parser.add_argument("--output", help="可选新 JSON 日志；拒绝覆盖")
    args = parser.parse_args()
    if not args.query.strip() or len(args.query) > 1000:
        parser.error("query 必须是 1–1000 字符的非空文字")
    if not 1 <= args.max_calls <= 5:
        parser.error("--max-calls 必须介于 1 和 5 之间")
    if not math.isfinite(args.timeout) or not 0 < args.timeout <= 30:
        parser.error("--timeout 必须 >0 且 <=30")
    try:
        output_json(run_loop(args.query.strip(), args.max_calls, args.timeout), args.output)
    except (OSError, ValueError) as error:
        print(f"记录失败：{error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

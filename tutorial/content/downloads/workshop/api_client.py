"""向本机 API 发出真实 HTTP 请求；省略 --input 查询任务，指定它则提交 JSON 汇总。"""
import argparse
import math
from pathlib import Path
import sys
from urllib.error import HTTPError, URLError
from urllib.request import ProxyHandler, Request, build_opener


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8001)
    parser.add_argument("--status", choices=("all", "done", "pending"), default="all", help="GET 筛选；POST 时不使用")
    parser.add_argument("--input", help="可选：发送到 POST /api/summarize 的 JSON 文件")
    parser.add_argument("--timeout", type=float, default=3, help="网络请求超时秒数，>0 且 <=30")
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error("端口必须在 1–65535 之间")
    if not math.isfinite(args.timeout) or not 0 < args.timeout <= 30:
        parser.error("--timeout 必须 >0 且 <=30")
    try:
        base = f"http://127.0.0.1:{args.port}"
        if args.input:
            data = Path(args.input).read_bytes()
            request = Request(base + "/api/summarize", data=data, headers={"Content-Type": "application/json"}, method="POST")
        else:
            request = Request(base + "/api/tasks?status=" + args.status)
        # 本机练习不借用系统 HTTP 代理，避免把请求交给其他服务。
        opener = build_opener(ProxyHandler({}))
        with opener.open(request, timeout=args.timeout) as response:
            print(response.read().decode("utf-8"), end="")
    except HTTPError as error:
        print(f"HTTP {error.code}：{error.read().decode('utf-8', errors='replace').strip()}", file=sys.stderr)
        return 1
    except (OSError, UnicodeError, URLError) as error:
        print(f"请求失败：{error}。请确认本机服务正在运行且端口一致。", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

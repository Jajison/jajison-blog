"""仅在 127.0.0.1 运行的 JSON API 练习，无账户、外部请求或持久化写入。"""
import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import sys
from urllib.parse import parse_qs, urlsplit

from lab_common import summary
from report import load_records, validate_records

MAX_BODY = 65536


def handler_for(records):
    class Handler(BaseHTTPRequestHandler):
        server_version = "WorkshopAPI/1.0"

        def setup(self):
            super().setup()
            self.connection.settimeout(3)

        def send_json(self, status, value):
            data = (json.dumps(value, ensure_ascii=False) + "\n").encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("X-Content-Type-Options", "nosniff")
            self.end_headers()
            try:
                self.wfile.write(data)
            except (BrokenPipeError, ConnectionResetError):
                pass

        def do_GET(self):
            url = urlsplit(self.path)
            if url.path == "/api/health":
                return self.send_json(200, {"ok": True, "storage": "read-only snapshot"})
            if url.path != "/api/tasks":
                return self.send_json(404, {"error": "接口不存在"})
            query = parse_qs(url.query, keep_blank_values=True)
            status = query.get("status", ["all"])
            if set(query) - {"status"} or len(status) != 1 or status[0] not in ("all", "done", "pending"):
                return self.send_json(400, {"error": "status 仅允许 all、done、pending；不能重复或添加其他参数"})
            selected = [row for row in records if status[0] == "all" or row["status"] == status[0]]
            self.send_json(200, {"tasks": selected, "summary": summary(selected)})

        def do_POST(self):
            if urlsplit(self.path).path != "/api/summarize":
                return self.send_json(404, {"error": "接口不存在"})
            if self.headers.get("Content-Type", "").split(";", 1)[0].strip().lower() != "application/json":
                return self.send_json(415, {"error": "Content-Type 必须为 application/json"})
            if self.headers.get("Transfer-Encoding"):
                return self.send_json(400, {"error": "本练习不支持分块传输，请提供 Content-Length"})
            if self.headers.get("Content-Length") is None:
                return self.send_json(411, {"error": "缺少 Content-Length"})
            try:
                size = int(self.headers["Content-Length"])
                if size < 0:
                    raise ValueError()
            except ValueError:
                return self.send_json(400, {"error": "Content-Length 必须是非负整数"})
            if size > MAX_BODY:
                return self.send_json(413, {"error": f"请求超过 {MAX_BODY} 字节限制"})
            try:
                raw = self.rfile.read(size)
                if len(raw) != size:
                    raise ValueError("请求正文不完整")
                incoming = validate_records(json.loads(raw.decode("utf-8-sig")))
            except TimeoutError:
                return self.send_json(408, {"error": "读取请求超过 3 秒"})
            except (UnicodeError, ValueError, RecursionError) as error:
                return self.send_json(400, {"error": f"无效记录：{error}"})
            self.send_json(200, summary(incoming))

    return Handler


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8001, help="0–65535；0 由系统选择空闲端口")
    parser.add_argument("--input", default="input/records.json", help="启动时读取的虚构记录")
    args = parser.parse_args()
    if not 0 <= args.port <= 65535:
        parser.error("端口必须在 0–65535 之间")
    try:
        records = load_records(Path(args.input))
        with ThreadingHTTPServer(("127.0.0.1", args.port), handler_for(records)) as server:
            print(f"READY http://127.0.0.1:{server.server_port} （Ctrl+C 停止）", flush=True)
            server.serve_forever()
    except KeyboardInterrupt:
        print("服务已停止。")
    except (OSError, ValueError) as error:
        print(f"启动失败：{error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

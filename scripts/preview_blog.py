"""Preview the built site at its GitHub Pages subpath, bound to this computer."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1] / 'public'
PREFIX = '/jajison-blog'

class PagesHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        request_path = unquote(urlsplit(path).path)
        if request_path == PREFIX or request_path.startswith(PREFIX + '/'):
            request_path = request_path[len(PREFIX):]
        else:
            return str(ROOT / '__outside_site__')
        target = (ROOT / request_path.lstrip('/')).resolve()
        if not target.is_relative_to(ROOT):
            return str(ROOT / '__outside_site__')
        if not target.exists() and not target.suffix and target.with_suffix('.html').is_file():
            target = target.with_suffix('.html')
        return str(target)

if __name__ == '__main__':
    print('Preview: http://127.0.0.1:8765/jajison-blog/ (Ctrl+C to stop)', flush=True)
    try:
        ThreadingHTTPServer(('127.0.0.1', 8765), PagesHandler).serve_forever()
    except KeyboardInterrupt:
        print('\nPreview stopped.')

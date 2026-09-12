"""Check the generated GitHub Pages artifact, including its repository subpath."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'public'
BASE = '/jajison-blog/'

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.links = []
        self.ids = set()
        self.h1 = 0
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        attr = dict(attrs)
        if attr.get('id'):
            self.ids.add(attr['id'])
        if tag == 'h1':
            self.h1 += 1
        for name in ('href', 'src'):
            if attr.get(name):
                self.links.append((tag, attr[name]))

errors = []
files = [p for p in OUTPUT.rglob('*.html') if 'downloads' not in p.relative_to(OUTPUT).parts]
pages = {p.resolve(): Page(p.read_text(encoding='utf-8')) for p in files}
count = 0
for file, page in pages.items():
    if file.name != '404.html' and page.h1 != 1:
        errors.append(f'{file.relative_to(OUTPUT)}: expected one h1, found {page.h1}')
    for tag, link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc or link.startswith('//'):
            continue
        path = unquote(url.path)
        if path.startswith('/'):
            if path != BASE.rstrip('/') and not path.startswith(BASE):
                errors.append(f'{file.relative_to(OUTPUT)}: link escapes Pages subpath: {link}')
                continue
            dest = OUTPUT / path[len(BASE):]
        elif path:
            dest = file.parent / path
        else:
            dest = file
        dest = dest.resolve()
        if dest.is_dir():
            dest = dest / 'index.html'
        elif not dest.is_file() and not dest.suffix:
            dest = dest.with_suffix('.html')
        if not dest.is_file() or not dest.is_relative_to(OUTPUT):
            errors.append(f'{file.relative_to(OUTPUT)}: missing local target: {link}')
            continue
        count += 1
        if url.fragment and dest in pages and unquote(url.fragment) not in pages[dest].ids:
            # External library scripts handle search and tag filters; ordinary anchor links must resolve.
            errors.append(f'{file.relative_to(OUTPUT)}: missing anchor: {link}')

for required in ['index.html', 'start.html', 'learn/06-shell.html', 'learn/14-transformer.html', 'learn/20-evaluation.html', 'downloads/ai-workshop.zip', 'downloads/workshop/eval-cases.json', 'downloads/workshop/todo.html', '.nojekyll', 'static/contentIndex.json']:
    if not (OUTPUT / required).is_file():
        errors.append(f'missing deployment file: {required}')
if len(list((OUTPUT / 'learn').glob('[0-9][0-9]-*.html'))) != 20:
    errors.append('expected exactly 20 published lessons')
index = json.loads((OUTPUT / 'static/contentIndex.json').read_text(encoding='utf-8'))
if len([key for key in index if key.startswith('learn/') and key != 'learn/index']) != 20:
    errors.append('search index must contain all 20 lessons')
if any('无题' in str(value.get('title', '')) for value in index.values()):
    errors.append('missing frontmatter title in search index')
if len([key for key, value in index.items() if isinstance(value.get('title'), str)]) < 29:
    errors.append('incomplete search index')
if any(key.startswith('downloads/') for key in index):
    errors.append('exercise source files leaked into the article search index')
source = ROOT / 'tutorial/content/downloads/ai-workshop.zip'
if source.read_bytes() != (OUTPUT / 'downloads/ai-workshop.zip').read_bytes():
    errors.append('published exercise ZIP differs from source')
if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print(f'PASS: {len(files)} HTML pages, {count} local links/assets/anchors, 20 lessons, Pages subpath, raw downloads and search index.')

"""Check the generated GitHub Pages artifact, including its repository subpath."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'public'
BASE = '/jajison-blog/'
sys.path.insert(0, str(ROOT / 'tutorial/tools'))
from package_workshop import workshop_files

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.links = []
        self.ids = set()
        self.h1 = 0
        self.math = 0
        self.math_depth = 0
        self.display_math = 0
        self.math_sources = 0
        self.unnamed_math = 0
        self.math_errors = []
        self.experiments = set()
        self.course_entries = []
        self.catalog = None
        self.read_control = False
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        attr = dict(attrs)
        if attr.get('id'):
            self.ids.add(attr['id'])
        if tag == 'h1':
            self.h1 += 1
        classes = (attr.get('class') or '').split()
        if tag == 'mjx-container' or 'katex' in classes:
            self.math += 1
        if tag == 'mjx-container':
            self.math_depth += 1
            if attr.get('display') == 'true':
                self.display_math += 1
        if tag == 'svg' and self.math_depth and not (attr.get('aria-label') or '').strip():
            self.unnamed_math += 1
        if tag == 'details' and 'math-source' in classes:
            self.math_sources += 1
        if tag == 'merror' or attr.get('data-mml-node') == 'merror' or 'data-mjx-error' in attr or 'katex-error' in classes:
            self.math_errors.append(attr.get('data-mjx-error') or attr.get('title') or 'invalid formula')
        if attr.get('data-lab'):
            self.experiments.add(attr['data-lab'])
        if attr.get('data-course-entry'):
            self.course_entries.append(attr['data-course-entry'])
        if attr.get('id') == 'learning-data':
            self.catalog = attr.get('data-catalog')
        if 'data-mark-read' in attr:
            self.read_control = True
        for name in ('href', 'src'):
            if attr.get(name):
                self.links.append((tag, attr[name]))
    def handle_endtag(self, tag):
        if tag == 'mjx-container':
            self.math_depth = max(0, self.math_depth - 1)

errors = []
files = [p for p in OUTPUT.rglob('*.html') if 'downloads' not in p.relative_to(OUTPUT).parts]
pages = {p.resolve(): Page(p.read_text(encoding='utf-8')) for p in files}
count = 0
for file, page in pages.items():
    if file.name != '404.html' and page.h1 != 1:
        errors.append(f'{file.relative_to(OUTPUT)}: expected one h1, found {page.h1}')
    if page.math_errors:
        errors.append(f'{file.relative_to(OUTPUT)}: formula renderer reported an error: {"; ".join(page.math_errors)}')
    if page.unnamed_math:
        errors.append(f'{file.relative_to(OUTPUT)}: {page.unnamed_math} formula SVGs lack accessible names')
    if page.display_math != page.math_sources:
        errors.append(f'{file.relative_to(OUTPUT)}: every display formula needs a matching copyable source block')
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

try:
    tracks = json.loads((ROOT / 'tutorial/curriculum.json').read_text(encoding='utf-8'))['tracks']
    planned = [slug for track in tracks for slug in track['pages']]
    if len(tracks) != 8 or len(planned) != 36 or len(set(planned)) != 36:
        errors.append('curriculum must contain 8 tracks and 36 unique articles')
except (OSError, ValueError, KeyError, TypeError) as error:
    errors.append(f'cannot read curriculum: {error}')
    planned = []
for required in ['index.html', 'start.html', 'labs.html', 'learn/06-shell.html', 'learn/14-transformer.html', 'learn/20-evaluation.html', 'downloads/ai-workshop.zip', 'downloads/workshop/eval-cases.json', 'downloads/workshop/todo.html', '.nojekyll', 'static/contentIndex.json'] + [slug + '.html' for slug in planned]:
    if not (OUTPUT / required).is_file():
        errors.append(f'missing deployment file: {required}')
if len(list((OUTPUT / 'learn').glob('[0-9][0-9]-*.html'))) != 20:
    errors.append('expected exactly 20 published lessons')
try:
    index = json.loads((OUTPUT / 'static/contentIndex.json').read_text(encoding='utf-8'))
except (OSError, ValueError) as error:
    errors.append(f'cannot read search index: {error}')
    index = {}
for slug in planned + ['labs']:
    if slug not in index or not index[slug].get('title'):
        errors.append(f'curriculum/lab page missing from search index: {slug}')
    page = pages.get((OUTPUT / (slug + '.html')).resolve())
    if page and slug in planned and not page.read_control:
        errors.append(f'{slug}: missing reading progress control')
if len([key for key in index if key.startswith('learn/') and key != 'learn/index']) != 20:
    errors.append('search index must contain all 20 lessons')
if any('无题' in str(value.get('title', '')) for value in index.values()):
    errors.append('missing frontmatter title in search index')
if len([key for key, value in index.items() if isinstance(value.get('title'), str)]) < 46:
    errors.append('incomplete search index')
if any(key.startswith('downloads/') for key in index):
    errors.append('exercise source files leaked into the article search index')
source = ROOT / 'tutorial/content/downloads/ai-workshop.zip'
published_zip = OUTPUT / 'downloads/ai-workshop.zip'
if not source.is_file() or not published_zip.is_file() or source.read_bytes() != published_zip.read_bytes():
    errors.append('published exercise ZIP differs from source')
try:
    download_files = workshop_files(ROOT / 'tutorial/content/downloads/workshop')
    published_downloads = OUTPUT / 'downloads/workshop'
    actual = {path.relative_to(published_downloads).as_posix() for path in published_downloads.rglob('*') if path.is_file()}
    if actual != set(download_files):
        errors.append('published raw downloads differ from complete public source file set')
    for relative, source_file in download_files.items():
        target = published_downloads / relative
        if not target.is_file() or target.read_bytes() != source_file.read_bytes():
            errors.append(f'published raw download differs from source: {relative}')
except (OSError, ValueError) as error:
    errors.append(f'cannot validate raw downloads: {error}')

labs = pages.get((OUTPUT / 'labs.html').resolve())
if labs:
    if labs.experiments != {'softmax', 'attention', 'cache'}:
        errors.append('labs must include all three interactive experiment panels')
    if not {'temperature', 'logits', 'softmax-result', 'query-position', 'causal-mask', 'attention-output', 'cache-kvHeads', 'cache-tokens', 'cache-gib'}.issubset(labs.ids):
        errors.append('labs are missing their computed result outputs')

home = pages.get((OUTPUT / 'index.html').resolve())
if home:
    if home.course_entries != planned:
        errors.append('home course entries must follow the complete curriculum order')
    try:
        catalog = json.loads(home.catalog or 'null')
        if not isinstance(catalog, list) or [entry.get('slug') for entry in catalog] != planned:
            errors.append('reading progress catalog differs from curriculum')
        elif any(not entry.get('title') or not entry.get('href') for entry in catalog):
            errors.append('reading progress catalog contains incomplete titles or links')
    except (ValueError, TypeError, AttributeError) as error:
        errors.append(f'invalid reading progress catalog: {error}')

# These pages contain central formulas. A title alone must not let raw TeX pass as a rendered lesson.
for slug in ['guides/math-for-ai', 'guides/neural-networks', 'guides/attention-and-position', 'learn/14-transformer', 'learn/15-llm']:
    page = pages.get((OUTPUT / (slug + '.html')).resolve())
    if page and page.math == 0:
        errors.append(f'{slug}: expected rendered mathematical notation')
if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print(f'PASS: {len(files)} HTML pages, {count} local links/assets/anchors, 8 tracks / 36 articles / 20 core lessons, labs, rendered formulas, Pages subpath, complete downloads and search index.')

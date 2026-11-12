"""Loopback-only preview of Next.js static export with extensionless routes."""
import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

class Handler(SimpleHTTPRequestHandler):
    def _rewrite(self):
        path = self.path.split('?', 1)[0]
        candidate = Path(self.translate_path(path))
        if not Path(path).suffix and candidate.with_suffix('.html').is_file():
            self.path = path + '.html'

    def do_GET(self):
        self._rewrite()
        super().do_GET()

    def do_HEAD(self):
        self._rewrite()
        super().do_HEAD()

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=4317)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1] / 'out'
    def handler(*a, **kw):
        return Handler(*a, directory=str(root), **kw)
    print(f'KAI local preview: http://127.0.0.1:{args.port}', flush=True)
    ThreadingHTTPServer(('127.0.0.1', args.port), handler).serve_forever()

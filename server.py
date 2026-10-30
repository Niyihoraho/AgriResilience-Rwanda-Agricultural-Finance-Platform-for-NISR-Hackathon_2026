"""
server.py
AgriResilience Rwanda — Production & Demo Web Server.
Serves the modern React/Tailwind/Shadcn-styled frontend on port 8000.
Works on any machine with standard Python — zero extra dependencies needed.
"""

import os
import sys
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler

BASE_DIR = Path(__file__).resolve().parent
DIST_DIR = BASE_DIR / "frontend" / "dist"

if not DIST_DIR.exists():
    print(f"Error: Production build not found at {DIST_DIR}")
    print("Please run 'cd frontend && npm run build' first.")
    sys.exit(1)

class SinglePageAppHandler(SimpleHTTPRequestHandler):
    """Serves static files from frontend/dist and routes all non-file paths to index.html."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST_DIR), **kwargs)

    def do_GET(self):
        # If requested path is not a file, serve index.html (SPA routing fallback)
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path):
            self.path = "/index.html"
        return super().do_GET()

def run_server(port=8000):
    server_address = ("", port)
    httpd = HTTPServer(server_address, SinglePageAppHandler)
    print("=" * 65)
    print("       AGRIRESILIENCE RWANDA - WEB PLATFORM SERVER            ")
    print("=" * 65)
    print(f"Server running at: http://localhost:{port}")
    print("Press Ctrl+C to stop.")
    print("=" * 65)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    run_server(port)

#!/usr/bin/env bash
# setup.sh - Build and run the CADA tribute site on your own server.
# Usage:
#   chmod +x setup.sh
#   ./setup.sh            # install + build + (re)start via pm2
#   ./setup.sh dev        # run dev server
#   ./setup.sh build      # build only
#   ./setup.sh start      # start built server (no rebuild)
#   ./setup.sh nginx      # print example nginx config for cada.au

set -euo pipefail

APP_NAME="cada"
PORT="${PORT:-8081}"
HOST="${HOST:-0.0.0.0}"
DOMAIN="${DOMAIN:-cada.au}"

cd "$(dirname "$0")"

have() { command -v "$1" >/dev/null 2>&1; }

ensure_runtime() {
  if ! have node; then
    echo "Node.js not found. Install Node 20+ first:"
    echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    exit 1
  fi
  if ! have bun && ! have npm; then
    echo "Need bun or npm. Install bun: curl -fsSL https://bun.sh/install | bash"
    exit 1
  fi
}

install_deps() {
  if have bun; then
    echo "==> Installing deps with bun"
    bun install
  else
    echo "==> Installing deps with npm"
    npm install
  fi
}

build_app() {
  echo "==> Building"
  if have bun; then bun run build; else npm run build; fi
}

write_node_server() {
  cat > server.mjs <<'EOF'
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { extname, join, normalize } from "node:path";
import { pathToFileURL } from "node:url";

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8081);
const CLIENT_DIR = join(process.cwd(), "dist", "client");
const SERVER_ENTRY = join(process.cwd(), "dist", "server", "server.js");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function sendWebResponse(res, webRes) {
  res.writeHead(webRes.status, webRes.statusText, Object.fromEntries(webRes.headers));
  if (!webRes.body) return res.end();
  return webRes.body.pipeTo(
    new WritableStream({
      write(chunk) {
        res.write(Buffer.from(chunk));
      },
      close() {
        res.end();
      },
      abort(error) {
        res.destroy(error);
      },
    }),
  );
}

async function tryStatic(req, res) {
  if (!req.url || req.method !== "GET") return false;
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(url.pathname);
  const normalizedPath = normalize(pathname).replace(/^[/\\]+/, "");
  if (normalizedPath.startsWith("..")) return false;

  const filePath = join(CLIENT_DIR, normalizedPath || "index.html");
  try {
    await readFile(filePath, { flag: "r" });
  } catch {
    return false;
  }

  res.writeHead(200, {
    "content-type": mimeTypes[extname(filePath)] || "application/octet-stream",
    "cache-control": normalizedPath.includes("assets/") ? "public, max-age=31536000, immutable" : "no-cache",
  });
  createReadStream(filePath).pipe(res);
  return true;
}

const serverBuild = (await import(pathToFileURL(SERVER_ENTRY).href)).default;

createServer(async (req, res) => {
  try {
    if (await tryStatic(req, res)) return;
    const request = new Request(`http://${req.headers.host || "localhost"}${req.url || "/"}`, {
      method: req.method,
      headers: req.headers,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : req,
      duplex: "half",
    });
    await sendWebResponse(res, await serverBuild.fetch(request, {}, {}));
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("Internal Server Error");
  }
}).listen(PORT, HOST, () => {
  console.log(`CADA listening on http://${HOST}:${PORT}`);
});
EOF
}

start_app() {
  if [ ! -f "dist/server/server.js" ] || [ ! -d "dist/client" ]; then
    echo "No build output found. Building first..."
    install_deps
    build_app
  fi

  write_node_server

  if have pm2; then
    echo "==> (Re)starting via pm2 on ${HOST}:${PORT}"
    HOST="$HOST" PORT="$PORT" pm2 startOrReload ecosystem.config.cjs --only "$APP_NAME" --update-env
    pm2 save
  else
    echo "pm2 not found — starting in foreground on ${HOST}:${PORT}"
    echo "(install pm2 for background: npm i -g pm2)"
    HOST="$HOST" PORT="$PORT" node server.mjs
  fi
}

print_nginx() {
  cat <<EOF
# /etc/nginx/sites-available/${DOMAIN}
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    return 301 https://${DOMAIN}\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN} www.${DOMAIN};

    ssl_certificate     /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# Then:
#   sudo ln -s /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/
#   sudo nginx -t && sudo systemctl reload nginx
#   sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}
EOF
}

cmd="${1:-all}"
case "$cmd" in
  dev)
    ensure_runtime; install_deps
    if have bun; then bun run dev; else npm run dev; fi
    ;;
  build)
    ensure_runtime; install_deps; build_app
    ;;
  start)
    ensure_runtime; start_app
    ;;
  nginx)
    print_nginx
    ;;
  all|"")
    ensure_runtime; install_deps; build_app; start_app
    ;;
  *)
    echo "Usage: $0 [dev|build|start|nginx|all]"; exit 1
    ;;
esac

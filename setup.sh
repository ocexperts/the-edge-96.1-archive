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
PORT="${PORT:-3000}"
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

start_app() {
  if [ ! -d ".output" ]; then
    echo "No .output/ found. Run: ./setup.sh build"
    exit 1
  fi

  if have pm2; then
    echo "==> (Re)starting via pm2 on ${HOST}:${PORT}"
    HOST="$HOST" PORT="$PORT" pm2 startOrReload ecosystem.config.cjs --only "$APP_NAME" 2>/dev/null || \
      HOST="$HOST" PORT="$PORT" pm2 start .output/server/index.mjs --name "$APP_NAME" --update-env
    pm2 save
  else
    echo "pm2 not found — starting in foreground on ${HOST}:${PORT}"
    echo "(install pm2 for background: npm i -g pm2)"
    HOST="$HOST" PORT="$PORT" node .output/server/index.mjs
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

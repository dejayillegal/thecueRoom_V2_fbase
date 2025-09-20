#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

trap 'kill 0' EXIT

start_web() {
  pushd "${ROOT_DIR}/apps/web" >/dev/null
  echo "🚀 Starting Next.js on http://localhost:3000"
  npm run dev -- --hostname 0.0.0.0 &
  popd >/dev/null
}

start_mobile() {
  pushd "${ROOT_DIR}/apps/mobile" >/dev/null
  echo "📱 Starting Expo development server"
  npm run start -- --clear &
  popd >/dev/null
}

start_web
start_mobile

wait

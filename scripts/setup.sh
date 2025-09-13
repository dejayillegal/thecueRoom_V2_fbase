#!/usr/bin/env bash
set -euo pipefail

if ! command -v pnpm >/dev/null 2>&1; then
  npm install -g pnpm@9.0.0
fi

cp -n .env.example .env || true
pnpm install

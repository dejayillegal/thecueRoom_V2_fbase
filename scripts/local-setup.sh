#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

check_node() {
  if ! command -v node >/dev/null 2>&1; then
    echo "❌ Node.js is not installed. Install Node.js 20.19.5 (use nvm) before continuing." >&2
    exit 1
  fi

  local version
  version="$(node -v)"
  if [[ ! "${version}" =~ ^v20\. ]]; then
    echo "❌ Detected ${version}. Please switch to Node.js 20 (see .nvmrc)." >&2
    exit 1
  fi

  echo "✅ Node.js ${version} detected."
}

install_deps() {
  local app_path="$1"
  if [[ ! -d "${app_path}" ]]; then
    echo "⚠️ Skipping ${app_path}; directory not found."
    return
  fi

  pushd "${app_path}" >/dev/null
  echo "📦 Installing dependencies in ${app_path}"
  if [[ -f package-lock.json ]]; then
    npm ci || npm install
  else
    npm install
  fi
  popd >/dev/null
}

bootstrap_env() {
  local example="$1"
  local target="$2"

  if [[ -f "${target}" ]]; then
    return
  fi

  if [[ -f "${example}" ]]; then
    cp "${example}" "${target}"
    echo "📝 Created ${target} from template."
  else
    echo "⚠️ Missing example env file: ${example}" >&2
  fi
}

check_node
install_deps "${ROOT_DIR}/apps/web"
install_deps "${ROOT_DIR}/apps/mobile"

bootstrap_env "${ROOT_DIR}/apps/web/.env.example" "${ROOT_DIR}/apps/web/.env.local"
bootstrap_env "${ROOT_DIR}/apps/mobile/.env.example" "${ROOT_DIR}/apps/mobile/.env"
bootstrap_env "${ROOT_DIR}/packages/db/.env.example" "${ROOT_DIR}/packages/db/.env"

cat <<'MSG'
🎉 Environment ready!

Next steps:
  1. Populate the env files that were created.
  2. Run `npm run dev` (or `./scripts/dev.sh`) from the repo root to start web + mobile together.
  3. Run `npm run test` to execute workspace smoke tests.
MSG

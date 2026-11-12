#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."
if [[ -x .local/node-v24.13.0-linux-x64/bin/node ]]; then
  exec .local/node-v24.13.0-linux-x64/bin/node "${1:-scripts/sandbox/play.mjs}"
fi
exec node "${1:-scripts/sandbox/play.mjs}"

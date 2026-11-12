#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."
test "$(uname -sm)" = 'Linux x86_64'
mkdir -p .local/sandbox-2.14.0
curl --fail --show-error --location --max-time 120 \
  https://s3-us-west-1.amazonaws.com/build.nearprotocol.com/nearcore/Linux-x86_64/2.14.0/near-sandbox.tar.gz \
  -o .local/sandbox-2.14.0.tar.gz
# Hash of the official archive used for M1B; detects changes on subsequent runs.
echo 'a0ba004218b218bd74351795e7ce2eda4a2b6af5cd3e252bd5e8bfe3c8f2e691  .local/sandbox-2.14.0.tar.gz' | sha256sum --check
tar -xzf .local/sandbox-2.14.0.tar.gz --strip-components=1 -C .local/sandbox-2.14.0
chmod +x scripts/sandbox/near-sandbox
.local/sandbox-2.14.0/near-sandbox --version

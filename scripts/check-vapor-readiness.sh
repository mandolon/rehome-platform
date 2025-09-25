#!/usr/bin/env bash
set -euo pipefail
missing=()
for f in vapor.yml backend/.env.vapor.staging backend/.env.vapor.production infra/vapor/README.md; do
  [[ -f "$f" ]] || missing+=("$f")
done
if (( ${#missing[@]} )); then
  echo "Missing files: ${missing[*]}" >&2
  exit 1
fi
echo "Vapor readiness files present."

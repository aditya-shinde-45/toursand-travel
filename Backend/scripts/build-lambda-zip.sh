#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$ROOT_DIR/.build/lambda"
ARTIFACT_DIR="$ROOT_DIR/.artifacts"
ARTIFACT_PATH="$ARTIFACT_DIR/aditya-tours-backend.zip"

if ! command -v zip >/dev/null 2>&1; then
  echo "zip command is required to build the Lambda artifact" >&2
  exit 1
fi

rm -rf "$BUILD_DIR" "$ARTIFACT_PATH"
mkdir -p "$BUILD_DIR" "$ARTIFACT_DIR"

cp -R "$ROOT_DIR/src" "$BUILD_DIR/src"
cp "$ROOT_DIR/package.json" "$BUILD_DIR/package.json"
cp "$ROOT_DIR/package-lock.json" "$BUILD_DIR/package-lock.json"

pushd "$BUILD_DIR" >/dev/null
npm ci --omit=dev
zip -qr "$ARTIFACT_PATH" src node_modules package.json package-lock.json
popd >/dev/null

echo "Created Lambda artifact at $ARTIFACT_PATH"
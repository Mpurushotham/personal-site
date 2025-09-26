#!/usr/bin/env bash
# Creates a zip of the examples/devsecops-pipeline folder
set -euo pipefail
cd "$(dirname "$0")/.."
ZIP_NAME="devsecops-pipeline-example.zip"
if [ -f "$ZIP_NAME" ]; then
  rm "$ZIP_NAME"
fi
zip -r "$ZIP_NAME" examples/devsecops-pipeline/
echo "Created $ZIP_NAME in $(pwd)"

#!/usr/bin/env bash
# Simple helper to create responsive variants for about-me-photo.jpeg
# Usage: ./scripts/generate_about_images.sh
# Requirements: ImageMagick (brew install imagemagick)
set -euo pipefail
SRC="$(dirname "$0")/../images/about-me-photo.jpeg"
DST_DIR="$(dirname "$0")/../images"
if [ ! -f "$SRC" ]; then
  echo "Source image not found: $SRC"
  exit 2
fi
# Use magick (newer ImageMagick) or convert if magick not present
IM_CMD="magick"
if ! command -v magick >/dev/null 2>&1; then
  if command -v convert >/dev/null 2>&1; then
    IM_CMD="convert"
  else
    echo "ImageMagick not found. Install with: brew install imagemagick" >&2
    exit 3
  fi
fi
# Generate JPEG sizes
"$IM_CMD" "$SRC" -auto-orient -resize 1600x1600\> -quality 84 "$DST_DIR/about-me-photo-1600.jpg"
"$IM_CMD" "$SRC" -auto-orient -resize 800x800\>  -quality 84 "$DST_DIR/about-me-photo-800.jpg"
"$IM_CMD" "$SRC" -auto-orient -resize 480x480\>  -quality 82 "$DST_DIR/about-me-photo-480.jpg"
# Generate WebP variants from the resized jpegs for quality and speed
"$IM_CMD" "$DST_DIR/about-me-photo-1600.jpg" -quality 80 "$DST_DIR/about-me-photo-1600.webp"
"$IM_CMD" "$DST_DIR/about-me-photo-800.jpg"  -quality 80 "$DST_DIR/about-me-photo-800.webp"
"$IM_CMD" "$DST_DIR/about-me-photo-480.jpg"  -quality 78 "$DST_DIR/about-me-photo-480.webp"

echo "Generated:
  $DST_DIR/about-me-photo-480.jpg
  $DST_DIR/about-me-photo-800.jpg
  $DST_DIR/about-me-photo-1600.jpg
  $DST_DIR/about-me-photo-480.webp
  $DST_DIR/about-me-photo-800.webp
  $DST_DIR/about-me-photo-1600.webp"
exit 0

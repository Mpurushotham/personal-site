generate_about_images.sh

This small helper script produces responsive JPEG and WebP variants from the master
`images/about-me-photo.jpeg` using ImageMagick.

Why
- The site uses `<picture>` with srcset entries for 480/800/1600 widths. These files
  must exist for the browser to select the appropriate image.

Requirements
- macOS (tested)
- ImageMagick installed (recommended via Homebrew):
  brew install imagemagick

Usage (from repository root)

```bash
# Make script executable (once)
chmod +x ./scripts/generate_about_images.sh
# Run it
./scripts/generate_about_images.sh
```

After running
- The script will create the following files in `images/`:
  - about-me-photo-480.jpg
  - about-me-photo-800.jpg
  - about-me-photo-1600.jpg
  - about-me-photo-480.webp
  - about-me-photo-800.webp
  - about-me-photo-1600.webp

Commit options
- You can commit the generated files (they are static assets used by GitHub Pages).
- If you prefer not to commit generated files, add them to `.gitignore` and generate
  them in CI or during your deployment steps. However, for GitHub Pages it's common
  to commit the static images so the site is fully self-contained.

Notes
- The script prefers `magick` (ImageMagick v7+). If you have an older ImageMagick
  where only `convert` exists, the script will fall back to `convert`.
- Adjust quality/resize parameters in the script if you want different tradeoffs.
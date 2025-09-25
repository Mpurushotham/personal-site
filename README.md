# Static mirror of binyam.io

This is a static snapshot suitable for GitHub Pages hosting. Captured on 2025-09-25.

Publish steps:
1. Create a new empty GitHub repository (no README/license).
2. In this folder, run:
   git remote add origin <YOUR_REPO_URL>
   git push -u origin main
3. In the repo Settings → Pages, choose Branch: main, Folder: / (root).

Notes:
- External analytics/fonts are referenced via their CDNs (Google Analytics, Plausible, Google Fonts). Remove those tags in `index.html` if undesired.
- Add a `CNAME` file at the repo root if using a custom domain.

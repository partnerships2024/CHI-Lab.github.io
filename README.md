# CHI Lab website (GitHub Pages)

Static site for the Computational Healthcare Intelligence Lab, ICRI-HEE. No build step.

## Publish
1. Create a repo named `<username>.github.io` (or any repo name).
2. Upload everything in this folder to the repo root (keep the `.nojekyll` file).
3. Settings > Pages > Deploy from branch > `main` / root.
4. Open `https://<username>.github.io/` (or `/<repo>/`).

## Edit content
- `data/lab.json`: headline, intro, mission, three focus areas, contact email.
- `data/team.json`: one object per researcher. To add a photo, put an image in `assets/` and set `"photo": "assets/name.jpg"`.
- `css/style.css`: colors are variables at the top.

## Preview locally
Run `python -m http.server`, then open http://localhost:8000 (JSON files do not load from file://).

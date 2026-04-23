# Alfred Ocampo — personal site

Static single-page site: `index.html`, `css/styles.css`, and `js/main.js`.

## Run locally

From this folder:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`. A local server avoids quirks with `file://` and remote fonts.

## Deploy

### GitHub Pages

1. Push the repository to GitHub.
2. Repository **Settings → Pages**.
3. **Build and deployment**: source **Deploy from a branch**, branch `main` (or `master`), folder **`/` (root)**.
4. Update `og:url` in `index.html` and the `url` field in the JSON-LD block to your real site URL.

### Netlify

1. Drag-and-drop this folder in the Netlify UI, or connect the Git repo with publish directory **`.`** (root).
2. Build command: _none_. Publish directory: **`.`**.

### Vercel

1. Import the repo in Vercel as a **static** project (no framework).
2. Output / root directory: **`.`**.

## Optional mailto form

Set `CONTACT_EMAIL` in `js/main.js`, then the contact form’s submit button enables and composes a message in the default mail client.

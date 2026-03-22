# unipath-ea

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run 
```

To build for production:

```bash
bun run build
```

## GitHub Pages + Custom Domain

This app already uses hash routing (`createWebHashHistory`) in `src/main.ts`, which avoids refresh/deep-link 404 issues on GitHub Pages.

### Deploy

1. Push to `main`.
2. In GitHub repo settings, open Pages and set Source to GitHub Actions.
3. The workflow at `.github/workflows/deploy-pages.yml` will build and deploy `dist`.

### Custom domain

1. Create `public/CNAME` containing only your domain, for example:

```text
app.example.com
```

2. Configure DNS at your domain provider:
	- For subdomain (`app.example.com`): CNAME -> `<your-github-username>.github.io`
	- For apex/root domain (`example.com`): use A/ALIAS records per GitHub Pages docs
3. In GitHub Pages settings, set the same custom domain and enable HTTPS.

### Routing note

With hash routing, your URLs look like `https://app.example.com/#/results`.
If you later want clean URLs (without `#`), switch to history mode and add a 404 fallback strategy for GitHub Pages.

This project was created using `bun init` in bun v1.3.10. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

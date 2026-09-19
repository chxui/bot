# ch-bot — CH Portfolio

Personal UI designer portfolio, published at https://i88022555-netizen.github.io/ch-bot/.

## Development

Requires Node.js 22.13+.

```sh
npm ci
npm run dev
```

## Publishing

Push changes to `main`. The GitHub Actions workflow builds and publishes `dist/` to GitHub Pages automatically. In repository Settings → Pages, the source must be GitHub Actions.

```sh
npm run build
npm run preview
```

This is a standalone static React 19 + TypeScript + Vite 8 version. It reuses the original portfolio components, Tailwind CSS, Framer Motion animations, Lucide icons and optimized WebP assets. No Sites, Cloudflare, database or secret keys are needed. The original Sites deployment is separate and unchanged.

- `app/page.tsx`: content and interactions
- `app/globals.css`: styling
- `src/main.tsx`: designer homepage entry
- `public/`: images, QR code, animation and home-screen icons
- `vite.config.ts`: `/ch-bot/` deployment base path
- `.github/workflows/pages.yml`: automatic deployment

If renaming the repository, update the Vite base path. Always use the asset helper for local image URLs so they work under the repository subpath.

Publishing this repository also publicly exposes its assets, including the WeChat contact QR code. Source image originals and development temporary files are not required.

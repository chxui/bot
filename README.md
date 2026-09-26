# bot — CH Portfolio

Personal UI designer portfolio, published at https://chxui.github.io/bot/.

## Preserved hero versions

- Default / `?version=model`: procedural Three.js mesh portrait in the established purple outfit, with a closed-mouth smile, CH badge, laptop and floating skill icons. The portrait turns in real 3D in response to the mouse across the hero. Touch and reduced-motion users see a stationary model. The previous illustration is the fallback if WebGL is unavailable.
- `?version=classic`: previous purple illustration and perspective interaction (`ch-classic-purple-smile.webp`).
- `?version=purple`: newly generated purple character with six independently moving skill icons. The character and eyes stay still.
- `?version=separated`: preserved experimental version from commit `c29b692`.
- Git backup branch: `codex/archive-hero-separated-c29b692`.

New artwork and the built-in image generation prompts are documented in `docs/purple-hero-assets.md`.

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

This is a standalone static React 19 + TypeScript + Vite 8 version. The hero model is built with Three.js and React Three Fiber; the original portfolio also uses Tailwind CSS, Framer Motion, Lucide icons and optimized WebP assets. No Sites, Cloudflare, database or secret keys are needed. The original Sites deployment is separate and unchanged.

- `app/page.tsx`: content and interactions
- `app/globals.css`: styling
- `src/main.tsx`: designer homepage entry
- `public/`: images, QR code, animation and home-screen icons
- `vite.config.ts`: `/bot/` deployment base path
- `.github/workflows/pages.yml`: automatic deployment

If renaming the repository, update the Vite base path. Always use the asset helper for local image URLs so they work under the repository subpath.

Publishing this repository also publicly exposes its assets, including the WeChat contact QR code. Source image originals and development temporary files are not required.

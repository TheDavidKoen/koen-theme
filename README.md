# Koen — portfolio theme

Custom WordPress theme for davidkoen. Presentation layer only — portfolio content
types and admin functionality live in the companion koen-core plugin.

## Stack

- Modern vanilla CSS (custom properties, grid, `clamp()`) — no CSS framework
- Vanilla JS, bundled with Vite (HMR in dev, hashed assets + manifest in prod)
- WordPress Coding Standards enforced via PHPCS; ESLint + Stylelint for assets
- CI on GitHub Actions: lint + build on every push/PR

## Development

Requires Node 22+, Composer, and a local WordPress install (Local by Flywheel).

```sh
npm install
composer install
npm run dev     # Vite dev server with HMR
npm run build   # production assets -> assets/dist/
npm run lint    # ESLint + Stylelint
composer lint   # PHPCS (WordPress Coding Standards)
```

The theme auto-detects the Vite dev server: while `npm run dev` runs, assets are
served from it (see `inc/assets.php`); otherwise the built manifest is used.
Always run `npm run build` before deploying.
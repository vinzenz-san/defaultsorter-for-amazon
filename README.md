<img src="docs/icons/logo.png" width="96" height="96" alt="DefaultSorter for Amazon logo">

# DefaultSorter for Amazon

Browser extension (Firefox &amp; Chrome) that lets you pick a default sort order for [Amazon](https://www.amazon.com/) search results — instead of Amazon's own "Featured" default — applied automatically before the results page loads.

## Features

- **Choose your default sort** from the toolbar popup: Featured (off), Best Sellers, Price low-to-high, Price high-to-low, Avg. Customer Review, or Newest Arrivals.
- **Works on every Amazon domain** (amazon.de, .com, .co.uk, .fr, and 19 more) — the internal sort keys are identical across domains, verified live against several of them.
- **No visible reload in the normal case** — a `declarativeNetRequest` rule rewrites the URL before the results page loads, not after. A `webNavigation` fallback catches the rare case where Amazon renders results via client-side JavaScript navigation (e.g. clicking a search suggestion) instead of a full page load, forcing a real reload only then.
- **Manually chosen sort orders are never overridden** — pick a different sort directly on Amazon's page any time, it's respected.
- **English/German UI**, following the browser's language by default, overridable per-language in the popup.

No account, no analytics, no data sent about you or your searches — your sort and language preference are stored locally via `browser.storage.local`. The extension makes no network requests of its own. See [`docs/privacy.html`](docs/privacy.html).

## Dev

```bash
pnpm install
```

**Load unpacked (Firefox)**: `about:debugging#/runtime/this-firefox` → Load Temporary Add-on → select `manifest.json` directly (the repo root is already Firefox-flavored).

**Load unpacked (Chrome)**: Chrome's MV3 background requires `service_worker`, which differs from Firefox's `scripts` key — the repo's `manifest.json` is Firefox-flavored, so Chrome can't load this repo directly. Instead:

```bash
pnpm dev:chrome     # or: pnpm dev:firefox
```

This stages a self-contained, Chrome-flavored (or Firefox-flavored) extension folder at `dist-unpacked/chrome` (or `dist-unpacked/firefox`) — point "Load unpacked" at that folder and re-run the script after each change.

## Release

```bash
pnpm release
```

Packages three zips into `release/` (old-version zips are kept, not deleted, so they accumulate across releases):
- `vX.Y.Z-firefox.zip` — Firefox-flavored manifest
- `vX.Y.Z-chrome.zip` — Chrome-flavored manifest (derived automatically, `background.service_worker` instead of `scripts`)
- `vX.Y.Z-source.zip` — source code bundle for AMO's review requirement (there's no build step, so this is just the repo minus `node_modules`/`release`)

See [`docs/store-listing.md`](docs/store-listing.md) for store listing copy and permission justifications.

## License

[MIT](LICENSE)

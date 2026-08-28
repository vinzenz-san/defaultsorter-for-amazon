# Changelog

## 0.7.1 — 2026-08-28

Popup's "Support this project" link is now centered instead of left-aligned.

## 0.7.0 — 2026-08-28

Toolbar icon and secondary logo mark finalized (sort-bars icon, bag-with-bars logo — both self-rendered, no Amazon trademark involved). Chrome support added via `webextension-polyfill`, vendored and loaded through `background.js`'s own `importScripts()` guard for Chrome's MV3 service worker. Release tooling: `pnpm release` packages Firefox/Chrome/source zips into `release/`, `pnpm dev:chrome` / `dev:firefox` stage a ready-to-load-unpacked folder at `dist-unpacked/<target>`. Docs site added: `docs/privacy.html`, `docs/store-listing.md`, and a landing page at `docs/index.html`.

## 0.6.0 — 2026-08-28

Popup gained a manual language override (Auto/Deutsch/English) independent of the browser's own UI language, a dark-mode-aware popup (`prefers-color-scheme`), and a donation link.

## 0.5.0 — 2026-08-28

English/German UI via the standard WebExtensions i18n system (`_locales/*/messages.json`), following the browser's language by default with English as fallback.

## 0.4.0 — 2026-08-28

Popup's on/off toggle replaced with a dropdown offering all six of Amazon's sort orders (Featured/off, Best Sellers, Price low-to-high, Price high-to-low, Avg. Customer Review, Newest Arrivals) instead of just forcing Best Sellers.

## 0.3.0 — 2026-08-28

Added a `webNavigation.onHistoryStateUpdated` fallback for the case where Amazon renders a search result via client-side JavaScript navigation (e.g. clicking a search suggestion) instead of a full page load — `declarativeNetRequest` never sees a request to rewrite in that case, so this detects the URL change directly and forces a real reload with the sort parameter applied.

## 0.2.0 — 2026-08-28

Extended from amazon.de only to all 23 supported Amazon domains (.com, .co.uk, .fr, .it, .es, .nl, .pl, .se, .com.be, .ie, .ca, .com.mx, .com.br, .co.jp, .in, .sg, .com.au, .ae, .sa, .com.tr, .co.za, .eg) — the sort key is the same internal value across domains, verified live against several of them rather than assumed.

## 0.1.0 — 2026-08-28

Initial proof of concept. Firefox-only, amazon.de only. Toolbar popup toggle forces Best Sellers sorting on search results via a `declarativeNetRequest` rule that rewrites the URL before the page loads, replacing the flicker/double-load of the original Tampermonkey userscript this was based on.

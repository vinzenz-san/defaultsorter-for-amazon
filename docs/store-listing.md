# Store listing reference

Copy-paste source for the Chrome Web Store / Firefox AMO submission forms.

## Short description (Chrome: max 132 characters)

Set a default sort order (e.g. Best Sellers) for Amazon search results instead of "Featured" — works on every Amazon domain.

## Full description

**DefaultSorter for Amazon** lets you pick a default sort order for [Amazon](https://www.amazon.com/) search results — Best Sellers, Price, Rating, or Newest — instead of Amazon's own "Featured" default, applied automatically before the results page loads.

- **Choose your default sort** from the toolbar popup: Featured (off), Best Sellers, Price low-to-high, Price high-to-low, Avg. Customer Review, or Newest Arrivals.
- **Works on every Amazon domain** — amazon.de, .com, .co.uk, .fr, and 19 more, via the same internal sort key.
- **No visible reload in the normal case** — the sort parameter is added to the URL before the results page loads, not after.
- **Manually chosen sort orders are never overridden** — pick a different sort directly on Amazon's page any time, it's respected.
- **No account, no sign-in, no tracking.** Your preference is stored locally in your browser and never leaves your device.

This is an independent, unofficial project — not affiliated with or endorsed by Amazon.

## Full description (plain text — paste as-is)

Chrome's description field doesn't render Markdown: pasting the section above literally shows the `**`/`[]()` characters and no clickable links. This is the same content converted to plain text.

```
DefaultSorter for Amazon lets you pick a default sort order for Amazon search results — Best Sellers, Price, Rating, or Newest — instead of Amazon's own "Featured" default, applied automatically before the results page loads.

- Choose your default sort from the toolbar popup: Featured (off), Best Sellers, Price low-to-high, Price high-to-low, Avg. Customer Review, or Newest Arrivals.
- Works on every Amazon domain — amazon.de, .com, .co.uk, .fr, and 19 more, via the same internal sort key.
- No visible reload in the normal case — the sort parameter is added to the URL before the results page loads, not after.
- Manually chosen sort orders are never overridden — pick a different sort directly on Amazon's page any time, it's respected.
- No account, no sign-in, no tracking. Your preference is stored locally in your browser and never leaves your device.

This is an independent, unofficial project — not affiliated with or endorsed by Amazon.
```

## Category

Productivity / Tools (Chrome) — "Einkaufen" / Shopping (Firefox AMO)

## License

MIT (matches the repo's `LICENSE` file).

## Permission justifications (for review forms)

**`storage`**
> Used to save the user's chosen default sort order and language preference locally (via `browser.storage.local`). No user data is transmitted anywhere.

**`declarativeNetRequest`**
> Rewrites the destination URL of a user-initiated Amazon search-result navigation to include the user's chosen sort parameter, before the page loads. No network requests are made by the extension itself.

**`webNavigation`**
> Detects the case where Amazon renders search results via a client-side JavaScript navigation (no full page load), so the declarativeNetRequest rule above cannot apply. Used only to notice this specific navigation pattern on the supported Amazon domains, not to read general browsing history.

**`tabs`**
> Used with `webNavigation` above to force a real page load with the chosen sort parameter applied, for the client-side-navigation case.

**Host permissions: supported Amazon domains (see `manifest.json`)**
> The extension's sole function is to rewrite the sort parameter on Amazon search-result URLs on these domains. It does not run on, read, or modify any other site.

**Single purpose (Chrome requires a one-line summary)**
> Lets users choose a default sort order for Amazon search results, applied automatically on every search.

## Privacy policy URL

`https://vinzenz-dev.de/defaultsorter-for-amazon/privacy.html`

## Screenshots needed

Not yet captured. At minimum:
1. The toolbar popup with the sort dropdown open, showing the available options.
2. An Amazon search-results page showing "Sort by: Best Sellers" (or another non-default option) already applied.

(1280×800 or 640×400 for Chrome; Firefox AMO accepts most reasonable sizes.)

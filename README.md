[![make.fun](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/xeraaGH/black-friday-deal-finder-01-e2/rank.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/xeraaGH/black-friday-deal-finder-01-e2/reward.svg)](https://make.fun/c/black-friday-deal-finder-01)

# True-Low Friday — Black Friday Deal Finder

A static deal finder for Black Friday & Cyber Monday 2026: 76 real deals across 11 stores and 12 categories, each price-checked on 27 November 2026 at its store or in a deals roundup that names the store. Every card shows the product, store, sale price, usual price, discount, a store link and when the price was checked — plus an honest verdict (true low, strong deal or routine sale) with the evidence behind it. Search and filters by category, store, discount and verdict all work, and deals can be sorted by discount, verdict, saving or price. Opening a deal shows a side-by-side comparison of the same product at every store that carries it, cheapest first, each with its own store link.

Bounty: https://make.fun/c/black-friday-deal-finder-01

## Run it

Any static server works — `app/` is the site root, no build step, no network requests. Serve it (for example `python3 -m http.server --directory app 8080`) and open http://localhost:8080 in a browser. The layout works on desktop and on a phone.

## Layout

- `app/index.html` — page shell, toolbar and method note
- `app/data.js` — the 76 checked deals (product, store, prices, verdict, evidence, source)
- `app/filters.js` — discount maths, filtering and sorting (pure functions)
- `app/compare.js` — deal cards and the detail view with cross-store comparison
- `app/main.js` — toolbar wiring, hash routing, counts
- `app/style.css` — the lantern-night theme
- `main.ts` — entry point, copies `app/` and `screenshots/` to the output directory
- `screenshots/` — 4 real renders of the site (desktop cover, compare table, phone, search)

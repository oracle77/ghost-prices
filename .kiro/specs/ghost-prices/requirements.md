# Ghost Prices — Requirements (Kiro spec-driven development)

> Spec: `.kiro/specs/ghost-prices/` · Category: **Costume Contest** · Kiroween 2026
> Status: implemented (see `tasks.md` for the checklist)

## 1. Introduction

Ghost Prices is a dark Halloween-themed tracker for Korean apartment
real-transaction prices (실거래가). Every home has a "ghost price": the
price it used to sell for. The app turns dry price history into a haunted
story — record highs are **ghost sightings**, sharp drops are **curses** —
and lets anyone summon the *Ghost of Prices Past* with a time slider.

The app is static-first: Vite + React + TypeScript, bundled sample data,
deployed free on GitHub Pages. No account, no API key, no backend.

## 2. Glossary

- **Complex (단지)**: an apartment complex, e.g. Raemian Firstage.
- **Exclusive area (전용면적)**: the unit's private floor area in m²; prices
  are tracked per area type (59㎡ / 84㎡ / 99㎡).
- **Ghost sighting**: the latest monthly price equals the series record high.
- **Curse**: the latest price is ≥ 5% below the series record high.
- **Ghost of Prices Past**: a time slider that compares a past month's price
  with the current price.
- **School overlay**: nearby elementary / middle / high schools with walking
  distance, shown per complex.

## 3. Requirements

### 3.1 Complex search & browsing

- **REQ-1**: The app SHALL list at least 8 Korean apartment complexes from
  at least 3 cities (Seoul, Yongin/Hwaseong, Busan).
- **REQ-2**: The user SHALL be able to search complexes by English name,
  Korean name, dong, gu, or city (case-insensitive substring match).
- **REQ-3**: Each complex card SHALL show the latest price, exclusive area,
  YoY change, and its haunting status (ghost / curse / quiet).

### 3.2 Price history chart

- **REQ-4**: Selecting a complex SHALL render a monthly price-history chart
  (24 months, Nov 2024 – Oct 2026) for the chosen exclusive area.
- **REQ-5**: The user SHALL be able to switch between the complex's area
  types (e.g. 59㎡ / 84㎡); the chart, status, and slider SHALL update.
- **REQ-6**: The chart SHALL mark the record-high month with a distinct
  orange "peak ghost" dot, and hovering SHALL show month + price (KRW and
  Korean 억/만 units).

### 3.3 Ghost of Prices Past (time slider)

- **REQ-7**: A slider SHALL let the user pick any past month; the app SHALL
  display that month's price, the current price, and the % change between
  them, with a one-line "ghost verdict".

### 3.4 School overlay

- **REQ-8**: Each complex SHALL show 3 nearby schools (elementary, middle,
  high) with name (EN + KO), distance in metres, and walking minutes.
- **REQ-9**: The school overlay SHALL be toggleable.

### 3.5 Watchlist

- **REQ-10**: The user SHALL be able to star complexes into a watchlist
  persisted in `localStorage` (no account), filter the list to watched-only,
  and remove entries.

### 3.6 Data honesty & sources

- **REQ-11**: Bundled data SHALL be labelled as a sample excerpt modeled on
  MOLIT public real-transaction disclosures, with the source
  (rt.molit.go.kr / data.go.kr) credited in the UI footer and README.
- **REQ-12**: The app SHALL work fully offline from bundled data; a live
  data.go.kr adapter SHALL exist as documented code only
  (`src/lib/molItApi.ts`), requiring no key at runtime.
- **REQ-13**: The app SHALL NOT present sample figures as verified live
  prices; the footer SHALL direct users to rt.molit.go.kr for verification.

### 3.7 Deployment & submission

- **REQ-14**: The app SHALL build with `npm run build` and deploy as static
  files to GitHub Pages at `https://oracle77.github.io/ghost-prices/`.
- **REQ-15**: The repo SHALL be public, MIT-licensed, contain `/.kiro` at the
  root (not git-ignored), and include an English README + Kiro usage note.
- **REQ-16**: The UI SHALL be fully English (Korean names shown as secondary
  labels), and the design SHALL be a coherent dark Halloween theme fitting
  the Costume Contest category.

## 4. Non-goals

- No live API calls, no user accounts, no server, no payments.
- No investment advice; the app is an informational demo.
- No exact per-transaction records (monthly medians only, sample data).

# Ghost Prices — Design

> Companion to `requirements.md`. Stack: Vite 8 + React 19 + TypeScript +
> Recharts 3 + Tailwind CSS 4. Static-first, GitHub Pages.

## 1. Architecture

```
ghost-prices/
├── public/favicon.svg            # 👻 ghost favicon
├── src/
│   ├── main.tsx                  # React entry
│   ├── index.css                 # Tailwind v4 theme tokens (haunt palette)
│   ├── App.tsx                   # All UI: search, cards, séance, slider,
│   │                             #   school overlay, watchlist, footer
│   ├── data/complexes.ts         # Bundled sample dataset + haunting logic
│   │                             #   (deterministic seeded series, 8 complexes
│   │                             #    × 2 areas × 24 months + schools)
│   └── lib/molItApi.ts           # OPTIONAL live-data adapter (sketch only)
│                                 #   data.go.kr RTMS API — not wired in
├── .kiro/specs/ghost-prices/     # this spec (requirements/design/tasks)
├── .kiro/steering/               # product / tech / structure guidance
└── .kiro/hooks/                  # agent hooks (see hooks/README)
```

No router, no state library: `useState` + `localStorage` is enough for a
single-page demo, and keeps the bundle small and the build fast on a
memory-constrained VM.

## 2. Data model

```ts
Complex {
  id, nameKo, nameEn, dong, gu, city,
  yearBuilt, households,
  areas: AreaSeries[],          // 2 per complex
  schools: School[]             // 3 per complex
}
AreaSeries { area: number /* m² */, history: PricePoint[24] }
PricePoint { month: "YYYY-MM", price: number /* 만원 */ }
School { nameKo, nameEn, type, distanceM, walkMin, note }
```

Monthly series are generated deterministically (`mulberry32` seeded PRNG)
by interpolating hand-set anchors. Anchors encode the publicly reported
record highs (e.g. e-Pyeonhan Sesang Suji 84.92㎡ ₩1.777B, Oct 2026;
Dongtan Station Central Xi 84.98㎡ ₩1.53B, Sep 2026). One complex
(Haeundae Xi 1st) is deliberately anchored into an 11% peak-to-now drop so
the "curse" state is demonstrable.

### Haunting logic (`hauntStatus`)

- latest month == record-high month → **👻 GHOST SIGHTING**
- latest ≥ 5% below record high → **🕯️ CURSED**
- otherwise → **😴 QUIET HAUNT**

YoY = latest vs 12 months earlier. Drop-from-peak = latest vs record high.

## 3. UI structure (single page)

1. **Header** — Creepster display title, tagline, search input, watched-only
   toggle, stats strip (complexes / sightings / cursed / schools).
2. **Complex cards** — grid; click selects the complex ("séance"); ☆ toggles
   watchlist; badge shows haunting status; YoY with ▲/▼.
3. **The Séance (detail)** — status banner, area-type tabs, Recharts
   `LineChart` (monotone, emerald line, orange `ReferenceDot` at peak,
   custom tooltip with ₩ + 억/만), **Ghost of Prices Past slider** (range
   input 0–23; then/now/delta cards + ghost verdict line), **school
   overlay** (toggleable 3-card grid).
4. **Watchlist** — localStorage-backed, click to jump, ✕ to remove.
5. **Footer** — data-source honesty note (MOLIT sample excerpt, verify at
   rt.molit.go.kr), repo link, MIT, "not investment advice".

## 4. Visual design (Costume Contest)

- Palette: near-black violet (`#0b0714` / `#120b22` / `#1b1030`), ghost
  emerald (`#34d399`), pumpkin orange (`#f97316`), blood red (`#f87171`),
  mist violet (`#c4b5fd`).
- Display font: **Creepster** (Google Fonts, graceful fallback to Georgia
  serif); body: Inter / system sans.
- Every data state has a Halloween metaphor, but numbers stay exact and
  un-embellished — the joke is the framing, never the figures.

## 5. Deployment

- `vite.config.ts`: `base: '/ghost-prices/'` for GitHub Pages project site.
- GitHub Actions (`.github/workflows/deploy.yml`): build on push to `main`,
  publish `dist/` via `actions/deploy-pages`. No secrets needed.
- Live URL: `https://oracle77.github.io/ghost-prices/`

## 6. Testing / QA

- `npm run build` must pass `tsc -b` + Vite production build.
- Manual QA script (see `tasks.md`): load page → search "Banpo" → select
  complex → switch area → drag slider to 2024-11 → toggle schools →
  star a complex → reload → watchlist persists → check footer source note.
- Target: Lighthouse-friendly static page, < 250 kB gzip JS.

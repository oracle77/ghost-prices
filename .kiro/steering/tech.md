# Steering — Tech

## Stack

- Vite 8 + React 19 + TypeScript (strict) + Tailwind CSS v4 + Recharts 3.
- Static-first: everything the app needs is bundled; `dist/` is served as-is
  from GitHub Pages. No SSR, no backend, no runtime secrets.

## Conventions

- **Prices are integers in 만원 (10,000 KRW)** in the data layer; formatting
  (`formatPrice` → ₩B/M, `formatPriceKo` → 억/만) happens only at render.
- **Deterministic data.** Sample series are generated from a seeded PRNG
  (`mulberry32`) over hand-set anchors, so builds are reproducible and the
  record-high months are stable.
- **No new dependencies without a reason.** A charting library (Recharts)
  and Tailwind are the only additions to the Vite template.
- **Keep the build light.** The VM that builds this has < 1 GB free RAM;
  run builds sequentially, avoid watch-mode + browser at the same time.
- **Accessibility basics:** buttons have titles/labels, the slider is a
  native `<input type="range">`, colour is never the only signal (badges
  carry text labels).

## Live data (future, optional)

- `src/lib/molItApi.ts` sketches the data.go.kr RTMS adapter. It is NOT
  imported by the app. Going live needs a free service key (identity
  verification may apply) stored in `.env` as `VITE_MOLIT_SERVICE_KEY` —
  never committed.

# Ghost Prices — Tasks (spec-driven checklist)

> Worked in order. Status as of 2026-11-18 (build day 1).

## Phase 1 — Scaffold & repo

- [x] 1. Create public GitHub repo `oracle77/ghost-prices` (new, post 2026-10-30)
- [x] 2. Scaffold Vite + React + TypeScript (`npm create vite`)
- [x] 3. Install Recharts + Tailwind CSS v4 (`@tailwindcss/vite`)
- [x] 4. Set `base: '/ghost-prices/'` for GitHub Pages

## Phase 2 — Data

- [x] 5. Write bundled sample dataset (`src/data/complexes.ts`):
  8 complexes, 3 cities, 2 area types each, 24 months (2024-11 → 2026-10),
  3 schools each; deterministic seeded series anchored on publicly reported
  record highs; one deliberate "curse" case (Haeundae Xi 1st, −11% from peak)
- [x] 6. Implement haunting logic: `hauntStatus`, `yoyChange`,
  `dropFromPeak`, `recordHigh`, `formatPrice` (₩B/M) + `formatPriceKo` (억/만)
- [x] 7. Sketch optional live-data adapter (`src/lib/molItApi.ts`,
  data.go.kr RTMS API — documented, NOT wired into the demo)

## Phase 3 — UI

- [x] 8. Header: title, tagline, search, watched-only toggle, stats strip
- [x] 9. Complex cards: latest price, YoY, haunt badge, watch star
- [x] 10. Séance detail: status banner, area tabs, Recharts line chart with
  peak-ghost dot + custom tooltip
- [x] 11. "Ghost of Prices Past" time slider with then/now/delta + verdict
- [x] 12. School overlay (toggleable, 3 schools per complex)
- [x] 13. Watchlist persisted in localStorage + footer with source honesty note
- [x] 14. Dark Halloween theme (Tailwind v4 tokens, Creepster display font,
  ghost favicon)

## Phase 4 — Spec evidence & docs

- [x] 15. Write `/.kiro` spec (requirements / design / tasks), steering docs,
  and hook definitions (this directory)
- [x] 16. MIT LICENSE, English README, `KIRO_USAGE.md` ("How Kiro was used"),
  `SUBMISSION.md` (Devpost draft text)
- [x] 17. GitHub Actions deploy workflow (`.github/workflows/deploy.yml`)

## Phase 5 — Verify & ship (build day 1)

- [x] 18. `npm run build` passes (tsc + Vite)
- [ ] 19. Smoke-test the production build locally (`vite preview` + Playwright
  screenshot) — pending
- [ ] 20. Push to GitHub, confirm Actions deploy, verify live URL
  `https://oracle77.github.io/ghost-prices/`
- [ ] 21. Demo video (Dec 1–2) + Devpost draft (Dec 3) — owner: user/parent
  (Devpost + YouTube accounts required; out of scope for this VM agent)

## Notes

- Kiro CLI 3.4.0 is installed on the VM (`~/.local/bin/kiro-cli`) but the
  account is **not logged in** (no Kiro account was created — account
  creation is forbidden for this agent). Therefore the CLI's AI calls could
  not be used; the spec files in `/.kiro` were authored by hand following
  Kiro's spec-driven workflow (requirements → design → tasks → implement),
  and `KIRO_USAGE.md` documents this honestly. If/when a Kiro account is
  created, the CLI can be used with `kiro-cli chat` against this spec.

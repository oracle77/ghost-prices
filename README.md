# 👻 Ghost Prices — Haunted Apartment Price Tracker

**Every home has a ghost price.**

Ghost Prices is a dark Halloween-themed tracker for Korean apartment
real-transaction prices (실거래가), built for **Kiroween 2026** in the
**Costume Contest** category. It turns dry price history into a haunted
story: record highs are 👻 **ghost sightings**, sharp drops are 🕯️
**curses**, and a time slider lets you summon the **Ghost of Prices Past**
to compare what a home cost then vs. now.

🔗 **Live demo:** https://oracle77.github.io/ghost-prices/
📹 **Demo video:** *(link added after upload — see SUBMISSION.md)*

## What it does

1. **Search a complex** — 8 well-known Korean apartment complexes across
   Seoul, Yongin/Hwaseong, and Busan, searchable by English/Korean name,
   dong, gu, or city.
2. **Price-history chart** — 24 months of monthly median transaction prices
   per exclusive area (전용면적, e.g. 59㎡ / 84㎡), with the record-high
   month marked by an orange "peak ghost" dot.
3. **Ghost of Prices Past** — a time slider that summons any past month's
   price and shows the change vs. today, with a one-line ghost verdict.
4. **School overlay** — nearby elementary / middle / high schools with
   walking distance, toggleable per complex.
5. **Watchlist** — star complexes to watch them; saved in `localStorage`,
   no account needed.

## Tech

- Vite 8 + React 19 + TypeScript + Recharts 3 + Tailwind CSS 4
- Static-first: the app ships fully offline from bundled sample data and
  deploys free on GitHub Pages (GitHub Actions workflow in
  `.github/workflows/deploy.yml`).
- No backend, no account, no API key required to run the demo.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # serve the production build locally
```

## Data — sources & honesty

The bundled dataset (`src/data/complexes.ts`) is a **sample excerpt modeled
on** the Republic of Korea Ministry of Land, Infrastructure and Transport
(MOLIT) public real-transaction price disclosures. Record-high months noted
in the data match publicly reported record prices (e.g. e-Pyeonhan Sesang
Suji 84.92㎡ ₩1.777B in Oct 2026; Dongtan Station Central Xi 84.98㎡
₩1.53B in Sep 2026). Figures are rounded monthly medians in 만원
(10,000 KRW).

- Verify any exact transaction price at **https://rt.molit.go.kr**
  (open data portal: **https://www.data.go.kr**).
- The app is an informational demo, **not investment advice**.

### Live data (optional, not wired in)

`src/lib/molItApi.ts` sketches an adapter for the free MOLIT
real-transaction open API (`data.go.kr`, `RTMSDataSvcAptTrade`). Going live
needs a free service key — set it in a local `.env` as
`VITE_MOLIT_SERVICE_KEY` (never commit it; requesting the key may require
identity verification). The demo deliberately works without it.

## Kiro

This project was built with Kiro's **spec-driven development** workflow:
requirements → design → tasks → implementation, with the spec, steering
documents, and agent hooks committed in `/.kiro` at the repo root
(see `KIRO_USAGE.md` for the full "How Kiro was used" note — the Kiro CLI
v3.4.0 is installed on the build VM, but the account was not logged in, so
the spec files were authored by hand and the CLI's AI calls were not used;
this is disclosed honestly in `KIRO_USAGE.md`).

## Disclosure (Kiroween rules)

- This is a **new project**, created during the Kiroween 2026 submission
  period (repo created 2026-11-18). No existing app was submitted.
- Data knowledge (which complexes and school zones matter) draws on the
  author's prior real-estate research; all code and bundled data files in
  this repo are newly written for this project.

## License

MIT — see [LICENSE](LICENSE).

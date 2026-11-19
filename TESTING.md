# Testing — Ghost Prices (Kiroween 2026)

Live app: https://oracle77.github.io/ghost-prices/ — no account, no API key,
no backend. Everything below works in one click.

## 2-minute judge walkthrough

1. **Open the URL.** 8 haunted complexes load (Seoul, Yongin/Hwaseong, Busan).
2. **Search** — type `Banpo` (or `헬리오`, `Busan`) in the search box; the list
   filters live. A nonsense query shows the empty state.
3. **Pick a complex** — click any card (or Tab to it and press Enter). The
   🔮 Séance section shows the haunt banner, a 24-month price chart with the
   orange "peak ghost" dot on the record-high month, and area tabs (59㎡ /
   84㎡ / 99㎡).
4. **Ghost of Prices Past** — drag the time slider back; the "Then / Change /
   Now" boxes and the one-line ghost verdict update.
5. **School overlay** — toggle "Hide/Show schools" to see nearby schools with
   walking distance.
6. **Watchlist** — tap ☆ on a card; the header counter and the watchlist
   section update, and the state survives a reload (localStorage, no account).

## Automated QA

- Script: `../qa/qa_polish.py` (Playwright 1.55 + cached Firefox, run from the
  `build/qa/` folder; `GHOST_URL` env var overrides the live URL to test a
  local preview).
- **2026-11-19 (v1, live): 27/27 checks passed** — desktop 1280×900 and mobile
  390×844, 0 console/page/request errors, all interactions above verified,
  no horizontal overflow on mobile.
- **2026-11-19 (v2 polish, local preview):** re-run recorded in
  `../STATUS.md`.

## Known limits (honest)

- Bundled prices are a **sample excerpt modeled on** MOLIT public
  real-transaction disclosures — rounded monthly medians, not a live feed.
  Record-high months match publicly reported record prices; verify any exact
  figure at https://rt.molit.go.kr. A live data.go.kr adapter is sketched in
  `src/lib/molItApi.ts` (not wired in; needs a free service key).
- School distances are approximate.
- The chart needs JavaScript (static React app); the page is not usable with
  JS disabled.

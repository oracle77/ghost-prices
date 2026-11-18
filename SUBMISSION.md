# Devpost Submission Draft — Ghost Prices (Kiroween 2026)

> DRAFT ONLY — not submitted. Devpost submission requires a Devpost account
> (user/parent action). Fill in the YouTube link after the demo video is
> uploaded (Dec 1–2), then submit by **2026-12-05 07:00 KST**.

## Project title

Ghost Prices: Haunted Apartment Price Tracker

## Category

**Costume Contest** (any app + an unforgettable Halloween UI)

## Tagline

Every home has a ghost price. 👻

## Description (English, for Devpost)

**The problem.** In Korea, apartment prices are public record — every sale
is disclosed by the government — but the data lives in spreadsheets and
official portals that feel like a haunted archive: hard to read, harder to
love. Buyers ask the same question every Halloween and every other day:
*what did this home used to cost, and is today's price a ghost or a curse?*

**What we built.** Ghost Prices is a dark Halloween-themed tracker for
Korean apartment real-transaction prices. Pick one of 8 famous complexes
— from Raemian Firstage in Banpo to Helio City in Songpa, Mapo Xi The
Centriz, and Haeundae Xi in Busan — and the app shows 24 months of monthly
median transaction prices per exclusive area (59㎡ / 84㎡ / 99㎡) on a
haunted chart. A record high is a 👻 **ghost sighting**; a drop of 5% or
more from the peak is a 🕯️ **curse**. The **Ghost of Prices Past** time
slider summons any past month's price and compares it with today. A school
overlay shows the neighbourhood's nearby elementary, middle, and high
schools with walking distances, and a watchlist (localStorage, no account)
keeps an eye on your haunted homes.

**How it works.** Static-first: Vite + React + TypeScript + Recharts +
Tailwind, bundled sample data modeled on MOLIT public real-transaction
disclosures, deployed free on GitHub Pages. No account, no API key, no
backend — judges can test it with one click. A live data.go.kr adapter is
sketched in the repo for a future live connection.

**Who it's for.** Anyone who has ever stared at a Korean apartment listing
and wondered whether the price is haunted. The metaphors are Halloween;
the numbers are real-transaction medians, honestly labelled, with the
official source (rt.molit.go.kr) credited in the app.

## Built with

Vite, React, TypeScript, Recharts, Tailwind CSS, GitHub Pages, Kiro
(spec-driven development — see KIRO_USAGE.md)

## Links

- App: https://oracle77.github.io/ghost-prices/
- Repo: https://github.com/oracle77/ghost-prices
- Demo video (YouTube, < 3 min): TODO — add link after upload

## "How Kiro was used"

See `KIRO_USAGE.md` in the repo (spec-driven development: requirements →
design → tasks in `/.kiro`, steering docs, agent hooks; Kiro CLI 3.4.0
verified on the build VM; AI agent calls not used because the CLI is not
logged in — no Kiro account was created during this build; disclosed
honestly).

## Disclosure

New project created during the Kiroween 2026 submission period (repo
created 2026-11-18). Data knowledge (which complexes and school zones
matter) draws on the author's prior real-estate research; all code and
bundled data files in this repo are newly written for this project. Bundled
prices are a sample excerpt modeled on MOLIT public disclosures — verify
exact figures at rt.molit.go.kr.

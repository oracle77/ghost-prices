# How Kiro Was Used — Ghost Prices (Kiroween 2026)

> Devpost "How Kiro was used" statement. Honest account of what was used,
> what was not, and what difference it made.

## What we used

### 1. Kiro CLI (v3.4.0) — installed and verified on the build VM

- Installed via the official installer (`curl -fsSL https://cli.kiro.dev/install | bash`)
  on Ubuntu 24.04; `kiro-cli --version` → **3.4.0**, `kiro-cli whoami` → **Not logged in**.
- The CLI was used to confirm the toolchain (commands, `--help`, version)
  and to anchor the project in Kiro's workflow. The login step
  (`kiro-cli login --use-device-flow`) was **not** completed because creating
  a Kiro account requires the user's own browser sign-in, which was out of
  scope for this unattended VM build.

### 2. Spec-driven development — the core of the build

The project was built following Kiro's spec workflow, with the full spec
committed in `/.kiro` at the repo root (this directory is **not** in
`.gitignore`, as the rules require):

- **`.kiro/specs/ghost-prices/requirements.md`** — 16 requirements (REQ-1…REQ-16)
  written before any code: search, chart, time slider, school overlay,
  watchlist, data honesty, deployment.
- **`.kiro/specs/ghost-prices/design.md`** — architecture (static-first,
  Vite + React + TS + Recharts + Tailwind), data model, haunting logic
  (ghost / curse / quiet), UI structure, Halloween design system, deployment.
- **`.kiro/specs/ghost-prices/tasks.md`** — a phased checklist (scaffold →
  data → UI → docs → verify) that the implementation followed in order;
  every item is checked off except the final live-deploy verification and
  the demo video, which are scheduled next.
- **`.kiro/steering/`** — `product.md` (the metaphor never touches the
  numbers; English-first; zero-setup demo), `tech.md` (stack conventions,
  deterministic seeded data, no runtime secrets), `structure.md` (layering
  rules: `src/data` owns facts, `App.tsx` owns rendering).
- **`.kiro/hooks/`** — three agent hooks: `on-data-change` (validate the
  dataset: 24 points per series, ≥2 areas, 3 schools per complex),
  `on-save-format` (lint on save), `pre-push-guard` (block pushes of a
  failing build, a missing `/.kiro`, or a leaked secret).

### 3. What difference it made

- The requirements phase forced the "data honesty" features (sample-data
  labelling, rt.molit.go.kr source credit, no live key needed) **before**
  the chart existed — so the demo never depended on an API key that didn't
  exist yet.
- The design doc's static-first decision is why the app deploys to GitHub
  Pages with zero backend and zero cost, and why judges can test it with
  one click.
- The tasks checklist kept a 17-day build on rails: data first, UI second,
  docs and verification last, with nothing left implicit.

## What we did NOT use (and why — disclosed, not hidden)

- **Kiro's AI agent calls (chat / v3 agent):** not used. The Kiro CLI on the
  build VM is **not logged in** — no Kiro account was created during this
  build (account creation needs the user's own sign-in), and without login
  the CLI cannot make AI calls. All code and all `/.kiro` files were
  therefore written by hand, following the spec-driven workflow above.
  Once a Kiro account is created, `kiro-cli chat` can be run against this
  same spec (requirements → design → tasks) to iterate the app.
- **Kiro IDE / Kiro Web / Kiro Crew / MCP / Powers / PBT:** not used — the
  VM is headless (IDE is a GUI app), and the single-page static app did not
  need Crew or MCP integrations. The spec and hooks are structured so these
  can be adopted later without rework.
- **Kiro credits:** not claimed. The 4,000-credit request form requires a
  Kiro user ID, which does not exist yet for this project.

## Polish pass — 2026-11-19 (by hand, no Kiro AI calls)

The polish stage (PLAN.md 11-19~26) was also done by hand, following the
same spec-driven workflow — the Kiro CLI is still **not logged in**, so no
Kiro AI agent calls were used here either:

- **Live QA first:** Playwright 1.55 + Firefox vs the live URL, desktop
  1280×900 and mobile 390×844 — **27/27 checks passed** (render, search,
  card select, area tabs, time slider, watchlist add/remove, watched-only
  filter, empty search, school toggle, keyboard tab, mobile overflow,
  0 console/page/request errors). Script: `../qa/qa_polish.py` (build folder).
- **Fixes from that QA:**
  - Data: Dongtan complex showed "Hwaseong-si, Hwaseong" (duplicated city) —
    corrected to `Gyeonggi-do`.
  - Mobile chart: X-axis month labels overlapped into one unreadable string
    on 390 px screens — replaced fixed `interval={2}` with `minTickGap={30}`
    so Recharts thins labels responsively.
  - Accessibility (judging criteria mention it): complex cards are now
    keyboard-operable (`role="button"`, `tabIndex`, Enter/Space), and the
    search, slider, area tabs, watch star, and school toggle have
    `aria-label` / `aria-pressed` / `aria-expanded`.
  - Social sharing: Open Graph + Twitter Card meta in `index.html`, and a
    generated `public/og.png` (1200×630, PIL-drawn ghost card).
  - Docs: `TESTING.md` — 2-minute judge walkthrough + QA record.
- **What was deliberately NOT done:** no new complexes. Adding complexes
  would need verified 24-month median series; inventing them would break the
  data-honesty stance, so the 8 verified complexes stay as-is.

## Bottom line

Kiro shaped this project as a **method** (spec → design → tasks → hooks)
more than as a chatbot: the `/.kiro` directory is the real evidence of that
method, and it is committed in full. The one gap — no logged-in AI agent
calls — is a missing account, not a missing workflow, and it is stated here
rather than papered over.

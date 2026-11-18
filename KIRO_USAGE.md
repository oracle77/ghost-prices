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

## Bottom line

Kiro shaped this project as a **method** (spec → design → tasks → hooks)
more than as a chatbot: the `/.kiro` directory is the real evidence of that
method, and it is committed in full. The one gap — no logged-in AI agent
calls — is a missing account, not a missing workflow, and it is stated here
rather than papered over.

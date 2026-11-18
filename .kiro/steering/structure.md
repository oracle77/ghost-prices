# Steering — Structure

```
ghost-prices/
├── .github/workflows/deploy.yml   # build + GitHub Pages deploy
├── .kiro/
│   ├── specs/ghost-prices/        # requirements.md / design.md / tasks.md
│   ├── steering/                  # product.md / tech.md / structure.md
│   └── hooks/                     # agent hook definitions (JSON)
├── public/favicon.svg
├── src/
│   ├── main.tsx
│   ├── index.css                  # Tailwind v4 @theme tokens
│   ├── App.tsx                    # the whole UI (single-page app)
│   ├── data/complexes.ts          # bundled sample data + haunting logic
│   └── lib/molItApi.ts            # optional live-data adapter (unused)
├── LICENSE                        # MIT
├── README.md                      # English, judge-facing
├── KIRO_USAGE.md                  # "How Kiro was used" (Devpost)
└── SUBMISSION.md                  # Devpost draft text (not submitted)
```

## Rules

- `src/data/` owns all facts (complexes, prices, schools). `App.tsx` owns
  all rendering. `src/lib/` owns optional integrations. Don't mix layers.
- `/.kiro` is a first-class deliverable: never add it to `.gitignore`.
- One feature = one requirement ID in `requirements.md` (REQ-n); the task
  list in `tasks.md` references those IDs implicitly by name.
- Keep files small enough to review in one screen where possible; `App.tsx`
  is the deliberate exception (single-page demo).

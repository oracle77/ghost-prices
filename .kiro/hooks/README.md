# Kiro hooks for Ghost Prices

Kiro agent hooks automate small checks when files change. These definitions
follow Kiro's hook format (event → action) and are documentation of the
workflow used during the build; they run inside Kiro IDE/CLI when a logged-in
agent session edits the repo.

## Hooks

### 1. `on-data-change` — validate the dataset when it changes
- **File:** `on-data-change.json`
- **Trigger:** any edit to `src/data/complexes.ts`
- **Action:** run `npx tsc --noEmit` (type-check) and verify every series has
  exactly 24 monthly points and every complex has ≥ 2 areas and 3 schools.
  If the check fails, the agent reports the broken complex id.

### 2. `on-save-format` — keep the codebase tidy
- **File:** `on-save-format.json`
- **Trigger:** file save in `src/`
- **Action:** run the project's formatter/linter (`npm run lint` via oxlint)
  on the changed file and fix trivial issues (unused imports, etc.).

### 3. `pre-push-guard` — never push a broken or secret-leaking build
- **File:** `pre-push-guard.json`
- **Trigger:** before `git push`
- **Action:** run `npm run build`; fail the push if the build fails, if
  `/.kiro` is missing from the tree, or if any file matches a secret pattern
  (`VITE_MOLIT_SERVICE_KEY`, `*.pem`, `ghp_`, `github_pat_`).

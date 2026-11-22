# SIS 2 — Playwright tests for practicesoftwaretesting.com + CI

Playwright Test (TypeScript). 5 suites, 18 test cases, run in GitHub Actions on every push and PR.

- [Description.md](Description.md) — what is automated, list of TCs
- [Prompt.md](Prompt.md) — AI tool, model, prompts, what was done
- [Review.md](Review.md) — review of AI output, limitations
- `screenshots/` — AI response / run results / CI evidence

## CI

[![Playwright Tests](https://github.com/<owner>/<repo>/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/<owner>/<repo>/actions/workflows/playwright.yml)

**CI system:** GitHub Actions. It is built into GitHub, where the repository already lives, needs no server of its own, is free for public repositories and supports matrices for sharding.

**Pipeline** (`.github/workflows/playwright.yml`):
- runs on every push and pull request (no branch filter), plus manual `workflow_dispatch`;
- `npm ci` with the npm cache (`setup-node` with `cache: npm`), Chromium installed with `npx playwright install --with-deps chromium`;
- the full Playwright suite (no `--grep` / `--project` filters) split into 4 shards (`--shard=i/4`) running in parallel;
- the `merge-reports` job merges the shards' blob reports into one HTML report and one JUnit file;
- artefacts: `playwright-report` (HTML), `test-results-1…4` (traces, screenshots, videos, JUnit), `junit-report`; kept for 14 days (`blob-report-N` is intermediate, 1 day).

**CI settings** (`playwright.config.ts`, when `CI=true`): `forbidOnly: true`, `retries: 2`, `workers: 2`, reporters `list`, `blob`, `junit`; `trace: 'on-first-retry'`, `fullyParallel: true` so shards split tests rather than files. `merge.config.ts` builds the merged HTML + `reports/junit-merged.xml`.

### Runtime

| Configuration | Total run time | Run tests step (slowest shard) | Run |
| --- | --- | --- | --- |
| 1 job, no sharding | X min Y s | X min Y s | [run](link) |
| 4 shards + merge | X min Y s | X min Y s | [run](link) |

Median of 3 runs via `workflow_dispatch`. Conclusion: _fill in after measuring — with only 18 fast tests each shard spends ~1 min on setup (checkout, npm ci, browser install), so the total time may drop only slightly._

### Running locally

    npm ci
    npx playwright install --with-deps chromium
    npx playwright test                 # normal run
    CI=true npx playwright test         # CI mode (bash); PowerShell: $env:CI="true"; npx playwright test; Remove-Item Env:CI

Simulate sharding and report merge:

    mkdir -p all-blob-reports
    CI=true npx playwright test --shard=1/2 && cp blob-report/*.zip all-blob-reports/
    CI=true npx playwright test --shard=2/2 && cp blob-report/*.zip all-blob-reports/
    npx playwright merge-reports --config merge.config.ts ./all-blob-reports

Set `BASE_URL` (repository variable on GitHub, env var locally) to test another host; default is `https://practicesoftwaretesting.com`.

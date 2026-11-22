# SIS 2 — Playwright tests for practicesoftwaretesting.com + CI

Playwright Test (TypeScript). 5 suites, 18 test cases, run in GitHub Actions on every push and pull request.

- [Description.md](Description.md) — what is automated, list of TCs
- [Prompt.md](Prompt.md) — AI tool, model, prompts, what was done
- [Review.md](Review.md) — review of AI output, limitations
- `screenshots/` — AI response / run results / CI evidence

## CI

[![Playwright Tests](https://github.com/nrsu/sis2-playwright2/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/nrsu/sis2-playwright2/actions/workflows/playwright.yml)

**CI system:** GitHub Actions. It is built into GitHub, where the repository already lives, needs no server of its own, is free for public repositories and supports matrices for sharding.

**Pipeline** (`.github/workflows/playwright.yml`):
- runs on every push and pull request (no branch filter), plus manual `workflow_dispatch`;
- `npm ci` with the npm cache (`setup-node` with `cache: npm`), Chromium installed with `npx playwright install --with-deps chromium`;
- the full Playwright suite (no `--grep` / `--project` filters) split into 4 shards (`--shard=i/4`) running in parallel;
- the `merge-reports` job merges the shards' blob reports into one HTML report and one JUnit file;
- artefacts: `playwright-report` (HTML), `test-results-1…4` (traces, screenshots, videos, JUnit), `junit-report`; kept for 14 days (`blob-report-N` is intermediate, 1 day).
- the runner is pinned to `ubuntu-24.04`: `ubuntu-latest` moved to Ubuntu 26.04, which the pinned Playwright version does not support.

**CI settings** (`playwright.config.ts`, when `CI=true`): `forbidOnly: true`, `retries: 2`, `workers: 2`, reporters `list`, `blob`, `junit`; `trace: 'on-first-retry'`, `fullyParallel: true` so shards split tests rather than files. `merge.config.ts` builds the merged HTML + `reports/junit-merged.xml`.

**Evidence:**
- push run and pull request run for branch `nrsu-patch-1`: see the [Actions tab](https://github.com/nrsu/sis2-playwright2/actions);
- the run graph shows 4 shard jobs in parallel and a `Merge reports` job; artefacts are listed at the bottom of each run page (screenshots in `screenshots/`).

### Runtime

| Configuration | Total run time | Run | 
| --- | --- | --- |
| 1 job, no sharding | not measured | — |
| 4 shards + merge | ~2 min 10 s (2m 8s for the push run, 2m 11s for the pull request run) | [Actions](https://github.com/nrsu/sis2-playwright2/actions) |

Conclusion: the suite has only 18 fast tests, so sharding gives little speed-up — each of the 4 shards spends about a minute on setup (checkout, `npm ci`, browser install), which is roughly the same as running all tests in one job; sharding pays off only for larger suites.

### Known limitations

Some tests (e.g. login) can fail intermittently because the public demo site is shared, slow and sometimes returns 5xx errors. `retries: 2` in CI marks such tests as flaky instead of failed, and test users are created through the API per test so tests never lock a common demo account.

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

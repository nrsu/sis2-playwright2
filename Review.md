# Review

## What the AI produced
A Playwright Test (TypeScript) project: 5 spec files / 18 tests, `playwright.config.ts` with a CI branch, `merge.config.ts`, a GitHub Actions workflow with 4 shards and a report merge job, README with CI section, Description.md and Prompt.md.

## How I reviewed / modified
- Locators: `data-test` attributes (used by the Toolshop app) instead of CSS/XPath; checked against the live site in the browser (login/account page).
- The AI had no network access, so the first real run was on GitHub Actions. It exposed problems that were then fixed:
  - `ubuntu-latest` became Ubuntu 26.04, which Playwright 1.52 does not support -> pinned `runs-on: ubuntu-24.04`.
  - Waiting for a network request (`sort=price`) was unreliable -> the sort tests now poll the rendered list until it is sorted.
  - The demo site is slow from CI runners -> `expect.timeout` raised to 15 s.
  - Pagination selector `a[aria-label*=Next]` did not exist -> locator by pagination class/text with fallbacks.
- Registration test uses a timestamp-based unique email so it is repeatable.
- Config and workflow follow the guide's templates; checked against the requirements table (1–6).

## Honest limitations
- The AI could not run the tests itself; verification was done through GitHub Actions runs.
- The public demo site can be slow or flaky; `retries: 2` in CI marks such tests as flaky instead of failed.
- Any test still red or flaky in the latest run is listed in the README.

## Student checklist
1. Run `npm install` once (creates `package-lock.json` — commit it; required by `npm ci` and `cache: npm`).
2. Push a feature branch, open a PR into `main` (push run + PR run; the second run shows the npm cache restored).
3. Time 1 shard (`shardIndex: [1]`, `shardTotal: [1]`) vs 4 shards, 3 runs each via Run workflow; fill the README table.
4. Replace `<owner>/<repo>` in the README, merge the PR so the badge shows `main`.
5. Add screenshots to `screenshots/` (run graph, artefacts, trace).

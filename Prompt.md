# Prompt

**Tool / model:** Claude Code (desktop app), Claude Sonnet 5.5 (`claude-sonnet-5-5`)

## Prompts (exact)
1. First stage (tests):
> Attached task doc "SIS 2" (Test Automation with Playwright; site https://practicesoftwaretesting.com/; at least 5 AT suites, any language; deliverables: Description.md, Prompt.md, Review.md, screenshots, public GitHub repo).
> проанализируй задачи и сделай

2. Second stage (CI homework), with the attached doc "SIS 2: CI pipeline for Playwright — step-by-step guide.docx":
> сделай домашку пожалуйста. чтобы все четко было

## What the AI did in the second stage
- Read the guide. It requires Playwright Test with TypeScript (`forbidOnly`, `--shard`, blob/JUnit reporters are features of that runner), while the first-stage tests were Python/pytest. So the 18 tests were **ported 1:1 to TypeScript** (same locators, same scenarios). The old Python version is kept outside the repo (`../sis2-playwright-python-backup`).
- Created `package.json`, `tsconfig.json`, `playwright.config.ts` (CI branch), `merge.config.ts`, `.github/workflows/playwright.yml` (4 shards + merge job), `.gitignore` per the guide, README CI section with badge, updated Description/Review.
- Followed the guide's templates for config and workflow; only changed `baseURL` default, `BASE_URL` handling (`||` so an empty repo variable falls back to the default).

## Not done by the AI (needs the student)
The AI had no network, Node.js, or GitHub access in this session, so these were not possible: `npm install` (to generate `package-lock.json`), running tests, pushing, runs on GitHub, timing table, badge on main. See the checklist in Review.md.

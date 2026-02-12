---
name: deploy-bot
description: Handles deployment tasks for the personal-web portfolio site. Use this skill when asked to build, deploy, or check deployment status on Vercel.
---

# deploy-bot

## Project Context
This is a React + TypeScript + Vite personal portfolio site deployed to **Vercel**.

## Build & Deploy
- Package manager: **pnpm**
- Build command: `pnpm build` (runs `tsc && vite build`)
- Output directory: `build/`
- Framework: Vite

## Pre-deploy Checklist
Before deploying, always run these checks in order:
1. `pnpm install --frozen-lockfile` — Install dependencies
2. `pnpm exec tsc --noEmit` — Type check
3. `pnpm test -- --run` — Run tests
4. `pnpm run build` — Production build

If any step fails, stop and report the error. Do not proceed to deploy.

## Deployment
- Production deploys happen automatically via Vercel on push to `master`.
- Preview deploys are created on pull requests to `master`.
- To trigger a deploy, create a PR or push to `master`.

## Rollback
If a deploy has issues, use `vercel rollback` or revert the commit and push to `master`.

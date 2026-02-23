# make-a-mark

Catalog of ways a program leaves marks in a codebase. Work style: concise; clear intent; min tokens.

## Agent Protocol

- Run scripts from repo root. Pass absolute paths to file-targeting scripts.
- Do not commit without a mark message. Use `scripts/mark-commit` for all commits.
- Prefer idempotent marks. Run a script twice — same result, no duplicates.
- Read `docs/mark-types.md` before choosing a mark type.
- Check `docs/usage.md` for exact invocation syntax.

## Available Marks (24)

**Git History:**
- `mark-commit` — structured commit with trailers, optional tag
- `mark-note` — git notes (metadata without changing SHA)
- `mark-branch` — conventionally-named branch

**Git Config:**
- `mark-hook` — pre-commit hook, stamps `.git/mark-trail`
- `mark-gitattributes` — drop .gitattributes

**GitHub Platform:**
- `mark-pr` — create PR via `gh pr create`
- `mark-issue` — create issue via `gh issue create`
- `mark-release` — create release via `gh release create`
- `mark-topic` — set repo topics via `gh api`

**Markdown / Docs:**
- `mark-badge` — shields.io badge in README
- `mark-changelog` — structured changelog entry
- `mark-scaffold` — drop CONTRIBUTING/SECURITY/CODE_OF_CONDUCT/CODEOWNERS/FUNDING/templates
- `mark-adr` — numbered Architecture Decision Record

**Config / Dotfiles:**
- `mark-config` — marker YAML config file
- `mark-editorconfig` — drop .editorconfig
- `mark-nodeversion` — drop .nvmrc / .node-version
- `mark-dependabot` — drop .github/dependabot.yml
- `mark-workflow` — drop GitHub Actions workflow

**Source Files:**
- `mark-header.ts` — copyright/license banner, idempotent
- `mark-watermark.ts` — build-hash injection, replaces existing
- `mark-annotate.ts` — `@generated` / `@todo` / `@fixme` / `@marked-by`
- `mark-docstring.ts` — JSDoc or Python docstring for a function

**Invisible / Forensic:**
- `mark-gitkeep` — .gitkeep in empty directories

**Package:**
- `mark-metadata.ts` — edit package.json fields + keywords

## Conventions

- Bash scripts: `#!/usr/bin/env bash` + `set -euo pipefail`. Single purpose. Minimal comments.
- TypeScript scripts: `commander` CLI, Bun runtime. Compile to `bin/` via `bun build`.
- Skills: `SKILL.md` per subdirectory. Terse imperative instructions.
- All marks must be idempotent. Running twice must not duplicate the mark.
- Validate inputs before writing. Fail loudly on missing required args.

## Build / Test

    bun install
    bun run dev              # web UI at localhost:3000

## Git

- Commit messages: `mark(<scope>): <description>`. One logical change per commit.
- Push only when user asks.
- Use `scripts/mark-commit` — never `git add .` or `git add -A`.

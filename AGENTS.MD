# make-a-mark

Catalog of ways a program leaves marks in a codebase. Work style: concise; clear intent; min tokens.

## Agent Protocol

- Run scripts from repo root. Pass absolute paths to file-targeting scripts.
- Do not commit without a mark message. Use `scripts/mark-commit` for all commits.
- Prefer idempotent marks. Run a script twice — same result, no duplicates.
- Read `docs/mark-types.md` before choosing a mark type.
- Check `docs/usage.md` for exact invocation syntax.

## Available Marks

- `mark-commit` — structured commit with trailers (`Co-Authored-By:`, `Task:`), optional tag
- `mark-header.ts` — copyright/license banner, skips shebangs, idempotent
- `mark-watermark.ts` — build-hash injection, replaces existing watermark
- `mark-hook` — pre-commit hook, stamps `.git/mark-trail`
- `mark-changelog` — structured changelog entry, newest-first
- `mark-annotate.ts` — `@generated` / `@todo` / `@fixme` / `@marked-by` comments
- `mark-config` — marker YAML config file (`.toolname.yml`)
- `mark-badge` — shields.io badge or attribution line in README
- `mark-branch` — conventionally-named branch (`prefix-<id>-<slug>`)

## Conventions

- Bash scripts: `#!/usr/bin/env bash` + `set -euo pipefail`. Single purpose. Minimal comments.
- TypeScript scripts: `commander` CLI, Bun runtime. Compile to `bin/` via `bun build`.
- Skills: `SKILL.md` per subdirectory. Terse imperative instructions.
- All marks must be idempotent. Running twice must not duplicate the mark.
- Validate inputs before writing. Fail loudly on missing required args.

## Build / Test

    bun install
    bun run build:mark-header
    bun run build:mark-watermark
    bun run build:mark-annotate

## Git

- Commit messages: `mark(<scope>): <description>`. One logical change per commit.
- Push only when user asks.
- Use `scripts/mark-commit` — never `git add .` or `git add -A`.

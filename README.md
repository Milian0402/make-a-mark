make-a-mark
===========

Catalog and demonstrate ways a program can leave a permanent mark in a codebase.

## Mark Types

### Git History
- git-commit — structured commit message with trailers + optional annotated tag
- git-note — attach metadata to a commit without changing the SHA
- branch — create a conventionally-named branch

### Git Config
- git-hook — install pre-commit hook that stamps agent identity
- gitattributes — drop .gitattributes with LF normalization and diff drivers

### GitHub Platform
- pr — create a pull request via `gh pr create`
- issue — create an issue via `gh issue create`
- release — create a release via `gh release create`
- topic — set repository topics via `gh api`

### Markdown / Docs
- badge — inject a shields.io badge or attribution line into README
- changelog — append structured entry to CHANGELOG.md
- scaffold — drop CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, CODEOWNERS, FUNDING, templates
- adr — create a numbered Architecture Decision Record

### Config / Dotfiles
- config-stamp — drop a marker YAML config file declaring tool usage
- editorconfig — drop .editorconfig with sensible defaults
- nodeversion — drop .nvmrc or .node-version
- dependabot — drop .github/dependabot.yml
- workflow — drop a GitHub Actions workflow

### Source Files
- file-header — prepend copyright/license banner to source files
- watermark — inject build-hash string into a target file
- annotate — inject `@generated`, `@todo`, `@fixme`, or `@marked-by` comment
- docstring — add JSDoc or Python docstring to a function

### Invisible / Forensic
- gitkeep — create .gitkeep in empty directories

### Package
- metadata — edit package.json fields and keywords

## Scripts

See `docs/usage.md` for invocation examples.

    # Bash scripts
    scripts/mark-commit           scripts/mark-note
    scripts/mark-branch           scripts/mark-hook
    scripts/mark-gitattributes    scripts/mark-pr
    scripts/mark-issue            scripts/mark-release
    scripts/mark-topic            scripts/mark-badge
    scripts/mark-changelog        scripts/mark-scaffold
    scripts/mark-adr              scripts/mark-config
    scripts/mark-editorconfig     scripts/mark-nodeversion
    scripts/mark-dependabot       scripts/mark-workflow
    scripts/mark-gitkeep

    # TypeScript scripts (run with bun)
    scripts/mark-header.ts        scripts/mark-watermark.ts
    scripts/mark-annotate.ts      scripts/mark-docstring.ts
    scripts/mark-metadata.ts

## Web UI

    bun run dev

Opens at `http://localhost:3000`. Browse all 24 marks by category, copy commands, view parameters.

To enable the run endpoint:

    bun app.ts --allow-run

## Skills

Each skill in `skills/` is a reusable prompt template for agent workflows.

## Setup

    cd ~/make-a-mark
    bun install

To compile standalone binaries:

    bun run build:mark-header
    bun run build:mark-watermark
    bun run build:mark-annotate
    bun run build:mark-docstring
    bun run build:mark-metadata

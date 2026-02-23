make-a-mark
===========

Catalog and demonstrate ways a program can leave a permanent mark in a codebase.

## Mark Types

- git-commit — structured commit message with trailers + optional annotated tag
- file-header — prepend copyright/license banner to source files
- watermark — inject build-hash string into a target file
- git-hook — install pre-commit hook that stamps agent identity
- changelog — append structured entry to CHANGELOG.md
- annotate — inject `@generated`, `@todo`, `@fixme`, or `@marked-by` comment
- config-stamp — drop a marker YAML config file declaring tool usage
- badge — inject a shields.io badge or attribution line into README
- branch — create a conventionally-named branch

## Scripts

- `scripts/mark-commit` — stage files and commit with `mark(<scope>): <msg>`, trailers, optional tag
- `scripts/mark-header.ts` — prepend banner to one or more files
- `scripts/mark-watermark.ts` — inject build-hash watermark into file
- `scripts/mark-hook` — install pre-commit hook into target repo
- `scripts/mark-changelog` — append changelog entry
- `scripts/mark-annotate.ts` — inject comment annotation into source file
- `scripts/mark-config` — drop marker YAML config file into repo
- `scripts/mark-badge` — inject badge or attribution line into README
- `scripts/mark-branch` — create conventionally-named branch

## Usage

See `docs/usage.md` for invocation examples.
Run TypeScript scripts with `bun scripts/<name>.ts` or build to `bin/` first.

## Skills

Each skill in `skills/` is a reusable prompt template for agent workflows.

## Setup

    cd ~/make-a-mark
    bun install

To compile standalone binaries:

    bun run build:mark-header
    bun run build:mark-watermark
    bun run build:mark-annotate

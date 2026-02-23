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

### Git Identity
- mailmap — add `.mailmap` entry for author canonicalization
- signoff — add `Signed-off-by` trailer (Developer Certificate of Origin)
- sign — GPG/SSH sign a commit or tag

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

### Enforcement
- commitlint — drop commitlint config + husky commit-msg hook
- lint-staged — drop lint-staged config + husky pre-commit hook

### Source Files
- file-header — prepend copyright/license banner to source files
- watermark — inject build-hash string into a target file
- annotate — inject `@generated`, `@todo`, `@fixme`, or `@marked-by` comment
- docstring — add JSDoc or Python docstring to a function

### License
- spdx — prepend `SPDX-License-Identifier` + `SPDX-FileCopyrightText` (REUSE standard)

### Supply Chain
- sbom — generate SPDX or CycloneDX Software Bill of Materials
- attestation — create SLSA provenance attestation (in-toto Statement v1)

### Container
- dockerfile — drop Dockerfile with OCI standard labels
- oci-labels — add/update OCI annotations in existing Dockerfile

### Well-Known
- humans — drop `humans.txt` (credits file)
- security — drop `.well-known/security.txt` (RFC 9116)
- robots — drop `robots.txt` with crawling rules

### Build
- sourcemap — inject `//# sourceMappingURL=` comment into JS/CSS files

### Observability
- otel — drop OpenTelemetry resource config with service attributes

### AI
- ai-disclosure — add `@ai-generated` disclosure comment with model/date/scope

### Invisible / Forensic
- gitkeep — create .gitkeep in empty directories

### Package
- metadata — edit package.json fields and keywords

## Scripts

See `docs/usage.md` for invocation examples.

    # Bash scripts
    scripts/mark-commit           scripts/mark-note
    scripts/mark-branch           scripts/mark-hook
    scripts/mark-gitattributes    scripts/mark-mailmap
    scripts/mark-signoff          scripts/mark-sign
    scripts/mark-pr               scripts/mark-issue
    scripts/mark-release          scripts/mark-topic
    scripts/mark-badge            scripts/mark-changelog
    scripts/mark-scaffold         scripts/mark-adr
    scripts/mark-config           scripts/mark-editorconfig
    scripts/mark-nodeversion      scripts/mark-dependabot
    scripts/mark-workflow         scripts/mark-commitlint
    scripts/mark-lint-staged      scripts/mark-sbom
    scripts/mark-attestation      scripts/mark-dockerfile
    scripts/mark-humans           scripts/mark-security
    scripts/mark-robots           scripts/mark-otel
    scripts/mark-ai-disclosure    scripts/mark-gitkeep

    # TypeScript scripts (run with bun)
    scripts/mark-header.ts        scripts/mark-watermark.ts
    scripts/mark-annotate.ts      scripts/mark-docstring.ts
    scripts/mark-metadata.ts      scripts/mark-spdx.ts
    scripts/mark-oci-labels.ts    scripts/mark-sourcemap.ts

## Web UI

    bun run dev

Opens at `http://localhost:3000`. Browse all 40 marks by category, copy commands, view parameters.

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
    bun run build:mark-spdx
    bun run build:mark-oci-labels
    bun run build:mark-sourcemap

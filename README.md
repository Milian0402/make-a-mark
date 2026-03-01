make-a-mark
===========

Catalog and demonstrate ways a program can leave a permanent mark in a codebase.

## Quick Start

    bun install
    bun run test:smoke

Then use:

- `docs/mark-types.md` to choose the right mark type
- `docs/usage.md` for exact command syntax and examples

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

## Future: AI-Driven Mark Selection

Today mark selection is manual — the user picks which marks to apply. An AI layer could learn which marks actually stick and which get reverted, ignored, or cause friction.

### How it would work

1. **Observe outcomes** — after a mark is applied, track what happens: was the commit kept or amended away? Did the badge survive the next README edit? Did the changelog entry get reformatted by a human? Was the AI-disclosure comment stripped before merge?
2. **Build a feedback loop** — score each mark type per-repo by survival rate, reviewer acceptance, and downstream tool consumption (e.g., did a scanner actually read the SBOM? did Dependabot open PRs from the config?).
3. **Recommend marks** — given a repo's language, size, team size, CI setup, and governance model, suggest which marks are worth applying and which are noise.
4. **Adaptive sequencing** — learn the right order: e.g., `mark-gitattributes` before first commit, `mark-spdx` before `mark-sbom`, `mark-commitlint` before onboarding new contributors.

### Exception list

Some content looks like boilerplate or generated text to a filter but carries real signal. These should be preserved, not stripped:

| Content type | Why it looks filterable | Why it matters |
|---|---|---|
| Event narratives in changelogs | Long prose in a file that's usually bullet points | Tells the story of *why* a breaking change happened — "we migrated auth after the March 2025 incident where..." |
| Postmortem references in ADRs | Links to external docs, names, dates | Captures organizational context that code alone can't — the decision makes no sense without the story |
| Human-written AI disclosure context | Looks like a generated `@ai-generated` block | A human adding "Claude drafted this, I reviewed and modified the error handling" is attribution, not boilerplate |
| Commit trailers with narrative | `Task: PROJ-123 — the billing race condition that hit prod on Tuesday` | Longer than typical trailers but links code to institutional memory |
| `humans.txt` personal notes | Informal text in a "metadata" file | Credits and thank-you notes are the whole point of the file — filtering them defeats the purpose |
| Security policy escalation stories | "If you find X, do Y because we learned from Z" in `security.txt` | Context about *why* the disclosure process exists, not just the contact email |
| License preamble in headers | Verbose copyright blocks | Some licenses (Apache-2.0, GPL-3.0) require specific full-text headers — trimming them violates the license |
| Funding rationale in FUNDING.yml comments | Comments explaining why specific sponsors are listed | Helps future maintainers understand sponsorship relationships |

The principle: **if removing the text loses a story that explains a decision, keep it.** Marks exist to preserve intent. A mark without its context is just noise.

## Skills

Each skill in `skills/` is a reusable prompt template for agent workflows.

## Setup

    cd ~/make-a-mark
    bun install

Quick verification:

    bun run test:smoke

To compile standalone binaries:

    bun run build:mark-header
    bun run build:mark-watermark
    bun run build:mark-annotate
    bun run build:mark-docstring
    bun run build:mark-metadata
    bun run build:mark-spdx
    bun run build:mark-oci-labels
    bun run build:mark-sourcemap

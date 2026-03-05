make-a-mark
===========

Catalog and demonstrate ways a program can leave a permanent mark in a codebase.

## Quick Start

    bun install
    bun run test:smoke

Then use:

- `docs/mark-types.md` to choose the right mark type
- `docs/usage.md` for exact command syntax and examples

## All Mark Ways (43)

Each mark is one distinct way to leave a durable trace in code, config, git metadata, or external platform metadata.

### Git History
- `mark-commit` — leave a structured commit in git history, with optional trailers and tag.
- `mark-note` — attach git note metadata to a commit without changing commit SHA.
- `mark-branch` — create a conventionally named branch as a zero-file-change mark.

### Git Config
- `mark-hook` — install a pre-commit hook that stamps `.git/mark-trail`.
- `mark-gitattributes` — add `.gitattributes` rules for line endings and diff behavior.
- `mark-blame-ignore` — track ignored commits in `.git-blame-ignore-revs` for cleaner blame.

### Git Identity
- `mark-mailmap` — add `.mailmap` mappings for author identity canonicalization.
- `mark-signoff` — add/verify `Signed-off-by` DCO signoff conventions.
- `mark-sign` — sign a commit or tag with git signing infrastructure.

### GitHub Platform
- `mark-pr` — create a GitHub pull request record.
- `mark-issue` — create a GitHub issue record.
- `mark-release` — create a GitHub release + tag record.
- `mark-topic` — set repository topics in GitHub metadata.

### Markdown / Docs
- `mark-badge` — inject a visible badge mark in `README.md`.
- `mark-changelog` — append structured release/change entries to `CHANGELOG.md`.
- `mark-citation` — add `CITATION.cff` citation metadata for research/software reuse.
- `mark-scaffold` — drop governance/community docs and templates.
- `mark-adr` — create numbered architecture decision records.

### Config / Dotfiles
- `mark-config` — drop a marker tool config file (like `.<tool>.yml`).
- `mark-editorconfig` — define editor formatting defaults in `.editorconfig`.
- `mark-gitignore` — manage idempotent ignore blocks in `.gitignore`.
- `mark-nodeversion` — pin Node runtime in `.nvmrc` or `.node-version`.
- `mark-dependabot` — enable dependency update automation config.
- `mark-workflow` — add a GitHub Actions workflow file.

### Enforcement
- `mark-commitlint` — enforce commit message policy via config + hook.
- `mark-lint-staged` — enforce staged-file lint/format checks via config + hook.

### Source Files
- `mark-header.ts` — prepend license/copyright headers in source files.
- `mark-watermark.ts` — inject/update build watermark metadata in source files.
- `mark-annotate.ts` — add `@generated`, `@todo`, `@fixme`, or `@marked-by` annotations.
- `mark-docstring.ts` — add docstrings/JSDoc blocks to functions.

### License
- `mark-spdx.ts` — prepend SPDX license/copyright headers (REUSE style).

### Supply Chain
- `mark-sbom` — generate SPDX or CycloneDX SBOM inventory artifacts.
- `mark-attestation` — generate provenance attestation artifacts.

### Container
- `mark-dockerfile` — create Dockerfile with OCI image labels.
- `mark-oci-labels.ts` — inject/update OCI labels in an existing Dockerfile.

### Well-Known
- `mark-humans` — add `humans.txt` credits metadata.
- `mark-security` — add RFC 9116 `.well-known/security.txt`.
- `mark-robots` — add crawler policy metadata in `robots.txt`.

### Build
- `mark-sourcemap.ts` — inject or remove source map linkage comments.

### Observability
- `mark-otel` — drop OpenTelemetry resource metadata config.

### AI
- `mark-ai-disclosure` — add `@ai-generated` disclosure metadata in source files.

### Invisible / Forensic
- `mark-gitkeep` — preserve empty directories with `.gitkeep`.

### Package
- `mark-metadata.ts` — edit `package.json` metadata fields and keywords.

## Scripts

See `docs/usage.md` for invocation examples.

    # Bash scripts
    scripts/mark-commit           scripts/mark-note
    scripts/mark-branch           scripts/mark-hook
    scripts/mark-gitattributes    scripts/mark-blame-ignore
    scripts/mark-mailmap          scripts/mark-citation
    scripts/mark-signoff          scripts/mark-sign
    scripts/mark-pr               scripts/mark-issue
    scripts/mark-release          scripts/mark-topic
    scripts/mark-badge            scripts/mark-changelog
    scripts/mark-scaffold         scripts/mark-adr
    scripts/mark-config           scripts/mark-editorconfig
    scripts/mark-gitignore        scripts/mark-nodeversion
    scripts/mark-dependabot       scripts/mark-workflow
    scripts/mark-commitlint       scripts/mark-lint-staged
    scripts/mark-sbom             scripts/mark-attestation
    scripts/mark-dockerfile       scripts/mark-humans
    scripts/mark-security         scripts/mark-robots
    scripts/mark-otel             scripts/mark-ai-disclosure
    scripts/mark-gitkeep

    # TypeScript scripts (run with bun)
    scripts/mark-header.ts        scripts/mark-watermark.ts
    scripts/mark-annotate.ts      scripts/mark-docstring.ts
    scripts/mark-metadata.ts      scripts/mark-spdx.ts
    scripts/mark-oci-labels.ts    scripts/mark-sourcemap.ts

## Web UI

    bun run dev

Opens at `http://localhost:3000`.

Features:

- Search and category filtering
- Per-mark argument forms generated from metadata
- Copy full command with selected arguments
- Optional run mode with stdout/stderr/history panel

To enable the run endpoint:

    bun app.ts --allow-run

Optional hardening for shared machines:

    MARK_RUN_TOKEN="replace-me" bun app.ts --allow-run

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

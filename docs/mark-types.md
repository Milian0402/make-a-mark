# Mark Types

Each mark type is a distinct way a program can leave a permanent trace in a codebase.

---

## Git Commit

A structured commit message with the format `mark(<scope>): <description>`. Supports custom trailers like `Co-Authored-By:` and `Task:` for attribution and task linking. Optional annotated tags create named reference points.

- **Where it lives**: git history
- **When to use**: every change that should be attributed to a tool or agent
- **Distinguishing trait**: exists in version control metadata, not in files

---

## Git Note

Metadata attached to a commit via `git notes add` without changing the commit SHA. Notes are stored in a separate ref namespace and can be pushed/pulled independently.

- **Where it lives**: `refs/notes/commits`
- **When to use**: adding post-hoc metadata (reviews, approvals, audit info) without rewriting history
- **Distinguishing trait**: invisible in `git log` unless `--show-notes` is used

---

## Branch

A conventionally-named branch in the format `prefix-<id>-<slug>`. Zero-cost mark requiring no file changes.

- **Where it lives**: git refs
- **When to use**: linking branches to tasks, tools, or agents
- **Distinguishing trait**: zero-cost, requires no file changes

---

## Git Hook

A pre-commit hook installed in `.git/hooks/` that appends a timestamped line to `.git/mark-trail` on every commit.

- **Where it lives**: `.git/hooks/pre-commit` and `.git/mark-trail`
- **When to use**: auditing which agents commit to a repo over time
- **Distinguishing trait**: invisible to git tracking, local-only audit trail

---

## Git Attributes

A `.gitattributes` file declaring file handling rules: LF normalization, language-specific diff drivers, and binary file markers.

- **Where it lives**: repo root as `.gitattributes`
- **When to use**: enforcing consistent line endings and diff behavior across contributors
- **Distinguishing trait**: affects how git processes files, not just metadata

---

## Git Blame Ignore Revs

A `.git-blame-ignore-revs` file entry that tells git blame to skip mechanical or noisy commits (formatting sweeps, generated rewrites).

- **Where it lives**: `.git-blame-ignore-revs` (and optionally local git config)
- **When to use**: preserving useful blame history after large refactors or bulk formatting
- **Distinguishing trait**: changes blame output without rewriting commit history

---

## Pull Request

A pull request created via `gh pr create` with conventional title and optional body, base branch, and draft mode.

- **Where it lives**: GitHub PR history
- **When to use**: proposing changes for review
- **Distinguishing trait**: visible to collaborators, triggers CI, creates discussion thread

---

## Issue

A GitHub issue created via `gh issue create` with labels for categorization.

- **Where it lives**: GitHub issue tracker
- **When to use**: tracking bugs, feature requests, or tasks
- **Distinguishing trait**: survives branch deletions and force pushes

---

## Release

A GitHub release created via `gh release create` with a version tag and notes.

- **Where it lives**: GitHub Releases page
- **When to use**: publishing versioned artifacts
- **Distinguishing trait**: creates a permanent, downloadable snapshot

---

## Topic

Repository topics set via the GitHub API. Replaces all existing topics.

- **Where it lives**: GitHub repository metadata
- **When to use**: categorizing the repo for discoverability
- **Distinguishing trait**: visible in GitHub search, no file changes needed

---

## Badge

A shields.io badge or attribution line injected into `README.md`.

- **Where it lives**: near the top of `README.md`
- **When to use**: visible attribution in the project's public face
- **Distinguishing trait**: renders as an image on GitHub

---

## Changelog

A structured entry appended to `CHANGELOG.md` in the format `## <version> — <date>`. Newest entries appear first.

- **Where it lives**: `CHANGELOG.md`
- **When to use**: recording releases or significant changes
- **Distinguishing trait**: human-readable and parseable by tooling

---

## Citation File

A `CITATION.cff` file containing software citation metadata (title, authors, version, release date, DOI).

- **Where it lives**: `CITATION.cff` in repo root
- **When to use**: making the project citable in academic and research workflows
- **Distinguishing trait**: consumed by GitHub’s citation UI and CFF tooling

---

## Scaffold

Standard project files dropped by type: CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md, CODEOWNERS, FUNDING.yml, issue templates, PR templates.

- **Where it lives**: repo root or `.github/`
- **When to use**: bootstrapping project governance and contribution guidelines
- **Distinguishing trait**: recognized by GitHub's UI (shows Contributing link, Security tab, etc.)

---

## Architecture Decision Record (ADR)

A numbered markdown file in `docs/adr/` documenting a design decision with context, decision, and consequences.

- **Where it lives**: `docs/adr/NNNN-slug.md`
- **When to use**: recording architectural decisions for future reference
- **Distinguishing trait**: numbered for ordering, survives code refactors

---

## Config Stamp

A marker YAML config file (e.g., `.triverge.yml`) dropped into the repo root declaring that a tool is used in the project.

- **Where it lives**: repo root as `.<tool>.yml`
- **When to use**: declaring tool adoption without modifying existing files
- **Distinguishing trait**: discoverable by other tools scanning for config files

---

## EditorConfig

An `.editorconfig` file with sensible defaults: spaces, LF line endings, UTF-8, trim trailing whitespace.

- **Where it lives**: repo root as `.editorconfig`
- **When to use**: enforcing consistent editor behavior across IDEs
- **Distinguishing trait**: supported by most editors without plugins

---

## Gitignore Block

A managed block inside `.gitignore` with preset patterns (`general`, `node`, `python`) inserted with stable marker comments.

- **Where it lives**: `.gitignore` in repo root
- **When to use**: adding ignore rules without duplicating lines or clobbering unrelated entries
- **Distinguishing trait**: idempotent block replacement via explicit begin/end markers

---

## Node Version

A `.nvmrc` or `.node-version` file pinning the Node.js version for the project.

- **Where it lives**: repo root
- **When to use**: ensuring contributors use the correct runtime version
- **Distinguishing trait**: auto-detected by nvm, fnm, volta, and similar tools

---

## Dependabot Config

A `.github/dependabot.yml` file enabling automated dependency updates with a weekly schedule.

- **Where it lives**: `.github/dependabot.yml`
- **When to use**: keeping dependencies current automatically
- **Distinguishing trait**: triggers automated PRs from GitHub

---

## GitHub Actions Workflow

A workflow YAML file dropped into `.github/workflows/` with configurable name and trigger.

- **Where it lives**: `.github/workflows/<name>.yml`
- **When to use**: adding CI/CD automation
- **Distinguishing trait**: executes on GitHub's infrastructure

---

## File Header

A copyright/license banner prepended to source files. Contains author, year, license SPDX identifier, and an `@generated` marker for idempotency.

- **Where it lives**: top of source files (after shebang if present)
- **When to use**: establishing ownership or license on source files
- **Distinguishing trait**: visible in every editor, persists through file moves

---

## Watermark

A build-hash string injected into a source file: date, git short SHA, and author. Uses the file's native comment syntax.

- **Where it lives**: inside source files (top, bottom, or after imports)
- **When to use**: tracking which build or agent last touched a file
- **Distinguishing trait**: includes machine-verifiable git hash

---

## Annotation

A comment annotation injected into source code: `@generated`, `@todo`, `@fixme`, or `@marked-by`. Uses the file's native comment syntax.

- **Where it lives**: inside source files at a specified line or at the top
- **When to use**: flagging generated code, deferring work, or attributing authorship
- **Distinguishing trait**: parseable by IDEs, linters, and search tools

---

## Docstring

A JSDoc block (TS/JS) or Python docstring added to a named function. Includes description, parameters, and return value.

- **Where it lives**: immediately before (JS/TS) or inside (Python) a function
- **When to use**: documenting function contracts for IDE tooltips and generated docs
- **Distinguishing trait**: affects developer experience in real-time via IDE integration

---

## Git Keep

A `.gitkeep` file placed in empty directories so git tracks them.

- **Where it lives**: inside otherwise-empty directories
- **When to use**: preserving directory structure in repos with generated or temporary content
- **Distinguishing trait**: zero-byte file, convention-based (not a git feature)

---

## Package Metadata

Fields added or modified in `package.json`: keywords, author, homepage, and other top-level values.

- **Where it lives**: `package.json`
- **When to use**: enriching npm/registry metadata or declaring project properties
- **Distinguishing trait**: consumed by package registries and tooling

---

## Mailmap

A `.mailmap` file entry mapping old author names/emails to canonical identities. Fixes `git blame` and `git shortlog` output without rewriting history.

- **Where it lives**: `.mailmap` in repo root
- **When to use**: consolidating multiple author identities (name changes, email switches)
- **Distinguishing trait**: built-in git feature, no history rewriting needed

---

## Signoff (DCO)

A `Signed-off-by:` trailer added to commit messages, certifying the Developer Certificate of Origin.

- **Where it lives**: commit message trailers
- **When to use**: certifying that contributions comply with the project's license
- **Distinguishing trait**: required by Linux kernel and many open source projects

---

## Commit Signing

GPG or SSH signature on a commit or tag, providing cryptographic proof of authorship.

- **Where it lives**: git object metadata
- **When to use**: verifying commit authenticity in security-sensitive projects
- **Distinguishing trait**: GitHub shows "Verified" badge on signed commits

---

## Commitlint Config

A `.commitlintrc.json` config file and `.husky/commit-msg` hook enforcing conventional commit message format.

- **Where it lives**: `.commitlintrc.json` + `.husky/commit-msg`
- **When to use**: enforcing consistent commit messages across a team
- **Distinguishing trait**: prevents non-conforming commits at the git level

---

## Lint-Staged Config

A `.lintstagedrc.json` config file and `.husky/pre-commit` hook running linters only on staged files.

- **Where it lives**: `.lintstagedrc.json` + `.husky/pre-commit`
- **When to use**: catching lint/format issues before they enter version control
- **Distinguishing trait**: only processes staged files, fast even on large codebases

---

## SPDX License Headers

`SPDX-License-Identifier` and `SPDX-FileCopyrightText` comments prepended to source files following the REUSE standard from the Free Software Foundation Europe.

- **Where it lives**: top of source files (after shebang if present)
- **When to use**: machine-readable license and copyright declaration per file
- **Distinguishing trait**: standardized by SPDX, recommended by FSFE's REUSE initiative

---

## SBOM (Software Bill of Materials)

A structured JSON document listing all software components, versions, licenses, and checksums. Supports SPDX 2.3 and CycloneDX 1.5 formats.

- **Where it lives**: `sbom.spdx.json` or `sbom.cdx.json` in repo root
- **When to use**: supply chain transparency, compliance with US EO 14028 and EU CRA
- **Distinguishing trait**: machine-readable inventory consumed by security scanners

---

## Provenance Attestation

An in-toto Statement v1 attestation documenting who built an artifact, when, and how. Follows the SLSA provenance specification.

- **Where it lives**: `<artifact>.attestation.json`
- **When to use**: proving artifact provenance for supply chain security
- **Distinguishing trait**: verifiable by Sigstore/cosign, required at SLSA Level 2+

---

## Dockerfile with OCI Labels

A Dockerfile with standardized `org.opencontainers.image.*` labels providing image metadata: title, source, version, creation date, vendor.

- **Where it lives**: `Dockerfile` in repo root
- **When to use**: creating container images with proper metadata
- **Distinguishing trait**: OCI-standard annotations consumed by registries and security tools

---

## OCI Label Injection

OCI annotation labels added or updated in an existing Dockerfile's `LABEL` instruction. Supports all standard `org.opencontainers.image.*` keys.

- **Where it lives**: `LABEL` instruction in Dockerfile
- **When to use**: enriching existing Dockerfiles with traceability metadata
- **Distinguishing trait**: modifies in place, idempotent replacement of existing labels

---

## humans.txt

A `humans.txt` file crediting the people behind a project with team roles, technologies used, and last update date. Standard from humanstxt.org.

- **Where it lives**: `humans.txt` in repo/site root
- **When to use**: giving human-readable credit to contributors
- **Distinguishing trait**: served by Google and other major sites, web standard

---

## security.txt (RFC 9116)

A `.well-known/security.txt` file declaring vulnerability disclosure contact information, expiry date, and security policy URL.

- **Where it lives**: `.well-known/security.txt`
- **When to use**: helping security researchers report vulnerabilities responsibly
- **Distinguishing trait**: IETF RFC 9116 standard, expected by security researchers

---

## robots.txt

A `robots.txt` file declaring crawling rules for web robots with User-agent, Allow/Disallow directives, and optional Sitemap.

- **Where it lives**: `robots.txt` in site root
- **When to use**: controlling search engine crawling behavior
- **Distinguishing trait**: de facto web standard since 1994

---

## Source Map Comment

A `//# sourceMappingURL=` comment (JS) or `/*# sourceMappingURL= */` comment (CSS) linking minified output to its source map.

- **Where it lives**: last line of JS/CSS files
- **When to use**: enabling debugging of minified/bundled code
- **Distinguishing trait**: consumed by browser DevTools and error tracking services (Sentry, Datadog)

---

## OpenTelemetry Resource Config

An `otel-resource.yaml` file declaring OpenTelemetry service resource attributes: service name, version, deployment environment, and SDK info.

- **Where it lives**: `otel-resource.yaml` in repo root
- **When to use**: configuring observability attributes for distributed tracing
- **Distinguishing trait**: follows CNCF OpenTelemetry semantic conventions

---

## AI Disclosure

An `@ai-generated` comment injected into source files declaring the AI model, generation date, and scope (full or partial). Uses the file's native comment syntax.

- **Where it lives**: top of source files (after shebang if present)
- **When to use**: disclosing AI-generated code for review and compliance
- **Distinguishing trait**: emerging industry practice for AI transparency

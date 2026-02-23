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

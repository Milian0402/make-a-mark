# Mark Types

Each mark type is a distinct way a program can leave a permanent trace in a codebase.

---

## Git Commit

A structured commit message with the format `mark(<scope>): <description>`. Supports custom trailers like `Co-Authored-By:` and `Task:` for attribution and task linking. Optional annotated tags create named reference points.

- **Where it lives**: git history
- **When to use**: every change that should be attributed to a tool or agent
- **Distinguishing trait**: the only mark that exists in version control metadata, not in files

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

## Git Hook

A pre-commit hook installed in `.git/hooks/` that appends a timestamped line to `.git/mark-trail` on every commit.

- **Where it lives**: `.git/hooks/pre-commit` and `.git/mark-trail`
- **When to use**: auditing which agents commit to a repo over time
- **Distinguishing trait**: invisible to git tracking, local-only audit trail

---

## Changelog

A structured entry appended to `CHANGELOG.md` in the format `## <version> — <date>`. Newest entries appear first.

- **Where it lives**: `CHANGELOG.md`
- **When to use**: recording releases or significant changes
- **Distinguishing trait**: human-readable and parseable by tooling

---

## Annotation

A comment annotation injected into source code: `@generated`, `@todo`, `@fixme`, or `@marked-by`. Uses the file's native comment syntax.

- **Where it lives**: inside source files at a specified line or at the top
- **When to use**: flagging generated code, deferring work, or attributing authorship
- **Distinguishing trait**: parseable by IDEs, linters, and search tools

---

## Config Stamp

A marker YAML config file (e.g., `.triverge.yml`) dropped into the repo root declaring that a tool is used in the project.

- **Where it lives**: repo root as `.<tool>.yml`
- **When to use**: declaring tool adoption without modifying existing files
- **Distinguishing trait**: discoverable by other tools scanning for config files

---

## Badge

A shields.io badge or attribution line injected into `README.md`.

- **Where it lives**: near the top of `README.md`
- **When to use**: visible attribution in the project's public face
- **Distinguishing trait**: renders as an image on GitHub, immediately visible to visitors

---

## Branch

A conventionally-named branch in the format `prefix-<id>-<slug>`.

- **Where it lives**: git refs
- **When to use**: linking branches to tasks, tools, or agents
- **Distinguishing trait**: zero-cost mark, requires no file changes

# Usage

Invocation examples for every script. Run from repo root.

Conventions:

- Pass absolute paths to file-targeting scripts.
- Re-run with `--force` when a script protects an existing file from overwrite.
- Bash `mark-*` scripts print usage and exit non-zero on `--help`; this is expected.

---

## mark-commit

    scripts/mark-commit -m "initial setup" -s repo README.md LICENSE

With trailers and tag:

    scripts/mark-commit -m "add auth module" -s auth \
      --co-author "Claude" "noreply@anthropic.com" \
      --trailer "Task" "TRIV-42" \
      --tag \
      src/auth.ts src/auth.test.ts

---

## mark-note

    scripts/mark-note -m "reviewed by claude-code"

On a specific commit:

    scripts/mark-note -m "approved for production" --commit abc1234

Overwrite existing note:

    scripts/mark-note -m "updated review" --force

---

## mark-branch

    scripts/mark-branch --prefix feat --id 42 --slug "dark mode"

With checkout:

    scripts/mark-branch --prefix fix --id 100 --slug "login bug" --checkout

---

## mark-hook

    scripts/mark-hook --agent "claude-code"

Into another repo:

    scripts/mark-hook --repo ~/other-project --agent "triverge" --force

---

## mark-gitattributes

    scripts/mark-gitattributes

Into another repo:

    scripts/mark-gitattributes --repo ~/other-project --force

---

## mark-blame-ignore

    scripts/mark-blame-ignore --commit HEAD

With git config update:

    scripts/mark-blame-ignore --commit abc1234 --configure

Custom file path:

    scripts/mark-blame-ignore --commit HEAD~1 --file .git-blame-ignore-revs --repo ~/other-project

Allow outside repo root:

    scripts/mark-blame-ignore --commit HEAD --file /tmp/global-ignore-revs --allow-outside-repo --configure

---

## mark-pr

    scripts/mark-pr --title "feat: add dark mode" --base main

Draft PR with body:

    scripts/mark-pr --title "wip: refactor auth" --body "Early draft" --draft

---

## mark-issue

    scripts/mark-issue --title "Bug: login fails" --label bug

Multiple labels:

    scripts/mark-issue --title "Feature: dark mode" --body "Add theme toggle" --label enhancement --label ui

---

## mark-release

    scripts/mark-release --tag v1.0.0 --title "Initial release"

Draft with notes:

    scripts/mark-release --tag v2.0.0-rc1 --notes "Release candidate" --draft

---

## mark-topic

    scripts/mark-topic --topics "ai,automation,devtools"

Specific repo:

    scripts/mark-topic --topics "cli,bun,typescript" --repo Milian0402/make-a-mark

---

## mark-badge

    scripts/mark-badge --label "Built with" --message "Claude" --color "blue"

With link:

    scripts/mark-badge \
      --label "Planned with" \
      --message "Triverge" \
      --color "purple" \
      --url "https://triverge.com" \
      --file README.md

---

## mark-changelog

    scripts/mark-changelog --version "1.2.0" --message "Add badge injection support"

Custom file:

    scripts/mark-changelog --version "0.1.0" --message "Initial release" --file docs/RELEASES.md

---

## mark-citation

    scripts/mark-citation --title "make-a-mark" --author "Milian0402"

With multiple authors and URL:

    scripts/mark-citation \
      --title "make-a-mark" \
      --author "Milian0402" \
      --author "Contributor Name" \
      --version "1.0.0" \
      --date "2026-03-05" \
      --message "Please cite this project in research outputs." \
      --url "https://github.com/Milian0402/make-a-mark"

With custom fields:

    scripts/mark-citation \
      --title "make-a-mark" \
      --author "Milian0402" \
      --set license=MIT \
      --set keywords="marks,metadata"

Overwrite existing citation:

    scripts/mark-citation --title "make-a-mark" --author "Milian0402" --force

---

## mark-scaffold

    scripts/mark-scaffold --type contributing
    scripts/mark-scaffold --type security
    scripts/mark-scaffold --type code-of-conduct
    scripts/mark-scaffold --type codeowners
    scripts/mark-scaffold --type funding
    scripts/mark-scaffold --type issue-template
    scripts/mark-scaffold --type pr-template

Into another repo:

    scripts/mark-scaffold --type contributing --repo ~/other-project --force

---

## mark-adr

    scripts/mark-adr --title "Use Bun as runtime"

Custom directory and status:

    scripts/mark-adr --title "Switch to PostgreSQL" --dir decisions --status "Proposed"

---

## mark-config

    scripts/mark-config --tool triverge

Into another repo:

    scripts/mark-config --tool claude --repo ~/other-project --force

---

## mark-editorconfig

    scripts/mark-editorconfig

Into another repo:

    scripts/mark-editorconfig --repo ~/other-project --force

---

## mark-gitignore

    scripts/mark-gitignore

Node preset:

    scripts/mark-gitignore --preset node

Python preset in another repo:

    scripts/mark-gitignore --preset python --repo ~/python-project

Add custom patterns into a named block:

    scripts/mark-gitignore --preset general --block build-cache --pattern .cache/ --pattern "*.tmp"

---

## mark-nodeversion

    scripts/mark-nodeversion --version 22.0.0

As .node-version:

    scripts/mark-nodeversion --version 20.11.0 --format node-version

---

## mark-dependabot

    scripts/mark-dependabot --ecosystem npm

For Python:

    scripts/mark-dependabot --ecosystem pip --repo ~/python-project

---

## mark-workflow

    scripts/mark-workflow --name "CI" --trigger push

Pull request trigger:

    scripts/mark-workflow --name "Lint" --trigger pr

Scheduled:

    scripts/mark-workflow --name "Weekly Audit" --trigger schedule

---

## mark-header.ts

    bun scripts/mark-header.ts --author "Milian0402" src/index.ts src/utils.ts

With all options:

    bun scripts/mark-header.ts \
      --author "Milian0402" \
      --license "Apache-2.0" \
      --year 2026 \
      --url "https://github.com/Milian0402/make-a-mark" \
      scripts/mark-annotate.ts

---

## mark-watermark.ts

    bun scripts/mark-watermark.ts --author "Milian0402" src/index.ts

After imports:

    bun scripts/mark-watermark.ts --placement after-imports --author "ci-bot" src/app.ts

---

## mark-annotate.ts

    bun scripts/mark-annotate.ts --type @generated src/generated.ts

With message and line:

    bun scripts/mark-annotate.ts --type @todo --message "refactor this" --line 15 src/utils.ts

Marked-by:

    bun scripts/mark-annotate.ts --type @marked-by --author "claude-code" src/index.ts

---

## mark-docstring.ts

    bun scripts/mark-docstring.ts --fn login --description "Authenticates user" src/auth.ts

With params and return:

    bun scripts/mark-docstring.ts \
      --fn processOrder \
      --description "Processes a customer order" \
      --param "orderId - the order identifier" \
      --param "options - processing options" \
      --returns "the processed order result" \
      src/orders.ts

---

## mark-metadata.ts

    bun scripts/mark-metadata.ts --set author="Milian0402" --add-keyword devtools

Multiple operations:

    bun scripts/mark-metadata.ts \
      --set homepage="https://github.com/Milian0402/make-a-mark" \
      --set license=MIT \
      --add-keyword automation \
      --add-keyword cli \
      --remove-keyword deprecated

---

## mark-gitkeep

    scripts/mark-gitkeep src/assets src/generated

---

## Web UI

Start the web interface:

    bun run dev

With run endpoint enabled:

    bun app.ts --allow-run

Opens at `http://localhost:3000`.

The UI supports search, category tabs, deep-link hash state, argument forms, copy command, and run output history.

Optional: lock down run endpoint with a token:

    MARK_RUN_TOKEN="replace-me" bun app.ts --allow-run

## mark-mailmap

    scripts/mark-mailmap --name "Milian" --email "m@example.com"

Map old email to new:

    scripts/mark-mailmap --name "Milian" --email "new@example.com" --old-email "old@example.com"

Map old name and email:

    scripts/mark-mailmap --name "Milian" --email "new@example.com" --old-name "OldName" --old-email "old@example.com"

---

## mark-signoff

    scripts/mark-signoff

Check a specific commit:

    scripts/mark-signoff --commit HEAD~1

With custom name/email:

    scripts/mark-signoff --name "Milian" --email "m@example.com"

---

## mark-sign

    scripts/mark-sign --tag v1.0.0

Check if a commit is signed:

    scripts/mark-sign --commit HEAD

---

## mark-commitlint

    scripts/mark-commitlint

Into another repo:

    scripts/mark-commitlint --repo ~/other-project --force

---

## mark-lint-staged

    scripts/mark-lint-staged

Into another repo:

    scripts/mark-lint-staged --repo ~/other-project --force

---

## mark-spdx.ts

    bun scripts/mark-spdx.ts --license MIT --copyright "Milian0402" src/index.ts

Multiple files:

    bun scripts/mark-spdx.ts --license "Apache-2.0" --copyright "MyOrg" --year 2026 src/*.ts

---

## mark-sbom

    scripts/mark-sbom --format spdx

CycloneDX format:

    scripts/mark-sbom --format cyclonedx --output bom.json

---

## mark-attestation

    scripts/mark-attestation --subject dist/app.js

Custom predicate type:

    scripts/mark-attestation --subject bin/cli --type "https://example.com/provenance/v1" --output provenance.json

---

## mark-dockerfile

    scripts/mark-dockerfile --base node:22-alpine --name myapp

With custom base image:

    scripts/mark-dockerfile --base python:3.12-slim --name myapi --force

---

## mark-oci-labels.ts

    bun scripts/mark-oci-labels.ts --title "myapp" --version "1.0" Dockerfile

Multiple labels:

    bun scripts/mark-oci-labels.ts --title "api" --source "https://github.com/org/api" --authors "team" --set com.example.env="prod" Dockerfile

---

## mark-humans

    scripts/mark-humans --name "Milian" --role "Creator"

With extras:

    scripts/mark-humans --name "Milian" --role "Developer" --twitter "@milian" --site "https://example.com"

---

## mark-security

    scripts/mark-security --contact "mailto:security@example.com"

With policy:

    scripts/mark-security --contact "https://example.com/security" --policy "https://example.com/policy" --expires "2027-01-01T00:00:00Z"

---

## mark-robots

    scripts/mark-robots

With sitemap and disallow:

    scripts/mark-robots --sitemap "https://example.com/sitemap.xml" --disallow "/admin"

---

## mark-sourcemap.ts

    bun scripts/mark-sourcemap.ts dist/app.js

Custom URL:

    bun scripts/mark-sourcemap.ts --url "https://cdn.example.com/app.js.map" dist/app.js

Remove existing:

    bun scripts/mark-sourcemap.ts --remove dist/app.js

---

## mark-otel

    scripts/mark-otel --service "my-api"

With environment:

    scripts/mark-otel --service "payment-service" --version "2.1.0" --env production

---

## mark-ai-disclosure

    scripts/mark-ai-disclosure --model "claude-opus-4" src/auth.ts

Full scope with custom date:

    scripts/mark-ai-disclosure --model "gpt-4" --scope full --date "2026-02-23" src/generated.ts src/utils.ts

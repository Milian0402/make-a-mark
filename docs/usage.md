# Usage

Invocation examples for every script. Run from repo root.

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

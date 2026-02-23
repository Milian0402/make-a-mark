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

## mark-hook

    scripts/mark-hook --agent "claude-code"

Into another repo:

    scripts/mark-hook --repo ~/other-project --agent "triverge" --force

---

## mark-changelog

    scripts/mark-changelog --version "1.2.0" --message "Add badge injection support"

Custom file:

    scripts/mark-changelog --version "0.1.0" --message "Initial release" --file docs/RELEASES.md

---

## mark-annotate.ts

    bun scripts/mark-annotate.ts --type @generated src/generated.ts

With message and line:

    bun scripts/mark-annotate.ts --type @todo --message "refactor this" --line 15 src/utils.ts

Marked-by:

    bun scripts/mark-annotate.ts --type @marked-by --author "claude-code" src/index.ts

---

## mark-config

    scripts/mark-config --tool triverge

Into another repo:

    scripts/mark-config --tool claude --repo ~/other-project --force

---

## mark-badge

    scripts/mark-badge --label "Planned with" --message "Triverge" --color "purple"

With link:

    scripts/mark-badge \
      --label "Built by" \
      --message "Claude Code" \
      --color "blue" \
      --url "https://claude.ai/code" \
      --file README.md

---

## mark-branch

    scripts/mark-branch --prefix triv --id 42 --slug "add-auth"

With checkout:

    scripts/mark-branch --prefix feat --id 100 --slug "dark mode" --checkout

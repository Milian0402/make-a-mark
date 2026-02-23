Create a structured mark commit using `scripts/mark-commit`.

## Instructions

1. Identify the files to stage. List them explicitly — never use `.` or `-A`.
2. Choose a scope that describes the area of change (e.g., `docs`, `scripts`, `config`).
3. Write a concise commit message describing _why_, not _what_.
4. Add `--co-author` if another agent or person contributed.
5. Add `--trailer` for task references (e.g., `Task TRIV-42`).
6. Use `--tag` only for milestone commits.

## Parameters

| Flag | Required | Description |
|------|----------|-------------|
| `-m` | yes | Commit message |
| `-s` | yes | Scope |
| `--tag` | no | Create annotated tag `mark/<timestamp>` |
| `--co-author <name> <email>` | no | Add Co-Authored-By trailer |
| `--trailer <key> <value>` | no | Add custom trailer (repeatable) |

## Example

    scripts/mark-commit -m "add watermark support" -s scripts \
      --co-author "Claude" "noreply@anthropic.com" \
      --trailer "Task" "TRIV-42" \
      scripts/mark-watermark.ts

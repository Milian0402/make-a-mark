Install a pre-commit hook that stamps agent identity using `scripts/mark-hook`.

## Instructions

1. Point `--repo` at the target git repository (default: current dir).
2. Set `--agent` to the name of the agent or tool being tracked.
3. The hook appends a line to `.git/mark-trail` on every commit.
4. If a pre-commit hook already exists, use `--force` to append rather than overwrite.
5. `.git/mark-trail` is not tracked by git — it is a local audit trail only.

## Parameters

| Flag | Required | Description |
|------|----------|-------------|
| `--repo <path>` | no | Target repo (default: `.`) |
| `--agent <name>` | no | Agent name (default: `unknown-agent`) |
| `--force` | no | Append to existing hook instead of aborting |

## Example

    scripts/mark-hook --repo ~/my-project --agent "claude-code" --force

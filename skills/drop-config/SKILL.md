Drop a marker YAML config file into a repo using `scripts/mark-config`.

## Instructions

1. Set `--tool` to the name of the tool being declared (e.g., `triverge`, `claude`).
2. The script creates `.<tool>.yml` in the repo root.
3. If the config file already exists, use `--force` to overwrite.
4. Edit the generated YAML to add tool-specific configuration after creation.

## Parameters

| Flag | Required | Description |
|------|----------|-------------|
| `--tool <name>` | yes | Tool name (becomes `.<name>.yml`) |
| `--repo <path>` | no | Target repo (default: `.`) |
| `--force` | no | Overwrite existing config |

## Example

    scripts/mark-config --tool triverge --repo ~/my-project

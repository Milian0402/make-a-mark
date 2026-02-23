Inject a build-hash watermark into a source file using `scripts/mark-watermark.ts`.

## Instructions

1. Choose placement: `top` (default), `bottom`, or `after-imports`.
2. Use `top` for standalone scripts. Use `after-imports` for modules with import blocks.
3. The script replaces existing watermarks — safe to run repeatedly.
4. Supported extensions: `.ts`, `.js`, `.tsx`, `.jsx`, `.css`, `.py`, `.sh`, `.bash`, `.rb`.

## Parameters

| Flag | Required | Description |
|------|----------|-------------|
| `<file>` | yes | Target file |
| `--author <name>` | no | Author name (default: `unknown`) |
| `--placement <where>` | no | `top`, `bottom`, or `after-imports` (default: `top`) |

## Example

    bun scripts/mark-watermark.ts --author "Milian0402" --placement after-imports src/index.ts

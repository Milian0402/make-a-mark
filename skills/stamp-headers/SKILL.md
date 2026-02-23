Prepend copyright/license file headers using `scripts/mark-header.ts`.

## Instructions

1. Target source files that lack a copyright header.
2. Set `--author` to the copyright holder's name.
3. Set `--license` to the SPDX identifier (default: `MIT`).
4. The script is idempotent — skips files that already contain `@generated`.
5. Shebangs are preserved: banner inserts after `#!` line.

## Parameters

| Flag | Required | Description |
|------|----------|-------------|
| `<files...>` | yes | One or more files to stamp |
| `--author <name>` | no | Copyright holder (default: `Unknown`) |
| `--license <spdx>` | no | SPDX license ID (default: `MIT`) |
| `--year <year>` | no | Copyright year (default: current) |
| `--url <url>` | no | Repository URL |

## Example

    bun scripts/mark-header.ts --author "Milian0402" --license MIT src/*.ts

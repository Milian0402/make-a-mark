export interface MarkArg {
  flag: string;
  description: string;
  required: boolean;
  default?: string;
}

export interface Mark {
  id: string;
  name: string;
  category: string;
  description: string;
  script: string;
  runtime: "bash" | "bun";
  args: MarkArg[];
  example: string;
}

export const CATEGORIES = [
  "Git History",
  "Git Config",
  "GitHub Platform",
  "Markdown / Docs",
  "Config / Dotfiles",
  "Source Files",
  "Invisible / Forensic",
  "Package",
] as const;

export const marks: Mark[] = [
  // --- Git History ---
  {
    id: "commit",
    name: "mark-commit",
    category: "Git History",
    description: "Structured commit with mark(<scope>): <msg> format, trailers, and optional annotated tag",
    script: "scripts/mark-commit",
    runtime: "bash",
    args: [
      { flag: "-m", description: "commit message", required: true },
      { flag: "-s", description: "scope", required: true },
      { flag: "--tag", description: "create annotated tag", required: false },
      { flag: "--co-author", description: "name email", required: false },
      { flag: "--trailer", description: "key value", required: false },
    ],
    example: 'scripts/mark-commit -m "add auth" -s auth src/auth.ts',
  },
  {
    id: "note",
    name: "mark-note",
    category: "Git History",
    description: "Attach metadata to a commit via git notes without changing the SHA",
    script: "scripts/mark-note",
    runtime: "bash",
    args: [
      { flag: "-m", description: "note message", required: true },
      { flag: "--commit", description: "commit ref", required: false, default: "HEAD" },
      { flag: "--force", description: "overwrite existing note", required: false },
    ],
    example: 'scripts/mark-note -m "reviewed by claude-code"',
  },
  {
    id: "branch",
    name: "mark-branch",
    category: "Git History",
    description: "Create a conventionally-named branch in prefix-<id>-<slug> format",
    script: "scripts/mark-branch",
    runtime: "bash",
    args: [
      { flag: "--prefix", description: "branch prefix", required: true },
      { flag: "--id", description: "issue or task ID", required: true },
      { flag: "--slug", description: "short description", required: true },
      { flag: "--checkout", description: "switch to branch", required: false },
    ],
    example: 'scripts/mark-branch --prefix feat --id 42 --slug "dark mode"',
  },
  // --- Git Config ---
  {
    id: "hook",
    name: "mark-hook",
    category: "Git Config",
    description: "Install pre-commit hook that stamps .git/mark-trail with agent identity",
    script: "scripts/mark-hook",
    runtime: "bash",
    args: [
      { flag: "--agent", description: "agent name", required: false, default: "unknown-agent" },
      { flag: "--repo", description: "repo path", required: false, default: "." },
      { flag: "--force", description: "append to existing hook", required: false },
    ],
    example: "scripts/mark-hook --agent claude-code",
  },
  {
    id: "gitattributes",
    name: "mark-gitattributes",
    category: "Git Config",
    description: "Drop .gitattributes with LF normalization and diff driver settings",
    script: "scripts/mark-gitattributes",
    runtime: "bash",
    args: [
      { flag: "--repo", description: "repo path", required: false, default: "." },
      { flag: "--force", description: "overwrite existing", required: false },
    ],
    example: "scripts/mark-gitattributes",
  },
  // --- GitHub Platform ---
  {
    id: "pr",
    name: "mark-pr",
    category: "GitHub Platform",
    description: "Create a pull request via gh pr create",
    script: "scripts/mark-pr",
    runtime: "bash",
    args: [
      { flag: "--title", description: "PR title", required: true },
      { flag: "--body", description: "PR description", required: false },
      { flag: "--base", description: "base branch", required: false, default: "main" },
      { flag: "--draft", description: "create as draft", required: false },
    ],
    example: 'scripts/mark-pr --title "feat: add dark mode" --base main',
  },
  {
    id: "issue",
    name: "mark-issue",
    category: "GitHub Platform",
    description: "Create a GitHub issue via gh issue create with labels",
    script: "scripts/mark-issue",
    runtime: "bash",
    args: [
      { flag: "--title", description: "issue title", required: true },
      { flag: "--body", description: "issue body", required: false },
      { flag: "--label", description: "label (repeatable)", required: false },
    ],
    example: 'scripts/mark-issue --title "Bug: login fails" --label bug',
  },
  {
    id: "release",
    name: "mark-release",
    category: "GitHub Platform",
    description: "Create a GitHub release via gh release create",
    script: "scripts/mark-release",
    runtime: "bash",
    args: [
      { flag: "--tag", description: "version tag", required: true },
      { flag: "--title", description: "release title", required: false },
      { flag: "--notes", description: "release notes", required: false },
      { flag: "--draft", description: "create as draft", required: false },
    ],
    example: 'scripts/mark-release --tag v1.0.0 --title "Initial release"',
  },
  {
    id: "topic",
    name: "mark-topic",
    category: "GitHub Platform",
    description: "Set repository topics via gh api",
    script: "scripts/mark-topic",
    runtime: "bash",
    args: [
      { flag: "--topics", description: "comma-separated topics", required: true },
      { flag: "--repo", description: "owner/repo", required: false },
    ],
    example: 'scripts/mark-topic --topics "ai,automation,devtools"',
  },
  // --- Markdown / Docs ---
  {
    id: "badge",
    name: "mark-badge",
    category: "Markdown / Docs",
    description: "Inject a shields.io badge or attribution line into README.md",
    script: "scripts/mark-badge",
    runtime: "bash",
    args: [
      { flag: "--label", description: "badge label", required: true },
      { flag: "--message", description: "badge message", required: true },
      { flag: "--color", description: "badge color", required: false, default: "blue" },
      { flag: "--url", description: "link URL", required: false },
      { flag: "--file", description: "target file", required: false, default: "README.md" },
    ],
    example: 'scripts/mark-badge --label "Built by" --message "Claude" --color blue',
  },
  {
    id: "changelog",
    name: "mark-changelog",
    category: "Markdown / Docs",
    description: "Prepend a structured entry to CHANGELOG.md",
    script: "scripts/mark-changelog",
    runtime: "bash",
    args: [
      { flag: "--version", description: "version string", required: true },
      { flag: "--message", description: "change description", required: true },
      { flag: "--file", description: "target file", required: false, default: "CHANGELOG.md" },
    ],
    example: 'scripts/mark-changelog --version 1.2.0 --message "Add badge injection"',
  },
  {
    id: "scaffold",
    name: "mark-scaffold",
    category: "Markdown / Docs",
    description: "Drop standard project files: CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, CODEOWNERS, FUNDING, templates",
    script: "scripts/mark-scaffold",
    runtime: "bash",
    args: [
      { flag: "--type", description: "contributing | security | code-of-conduct | codeowners | funding | issue-template | pr-template", required: true },
      { flag: "--repo", description: "repo path", required: false, default: "." },
      { flag: "--force", description: "overwrite existing", required: false },
    ],
    example: "scripts/mark-scaffold --type contributing",
  },
  {
    id: "adr",
    name: "mark-adr",
    category: "Markdown / Docs",
    description: "Create a numbered Architecture Decision Record in docs/adr/",
    script: "scripts/mark-adr",
    runtime: "bash",
    args: [
      { flag: "--title", description: "ADR title", required: true },
      { flag: "--dir", description: "output directory", required: false, default: "docs/adr" },
      { flag: "--status", description: "status", required: false, default: "Accepted" },
    ],
    example: 'scripts/mark-adr --title "Use Bun as runtime"',
  },
  // --- Config / Dotfiles ---
  {
    id: "config",
    name: "mark-config",
    category: "Config / Dotfiles",
    description: "Drop a marker YAML config file (.<tool>.yml) declaring tool usage",
    script: "scripts/mark-config",
    runtime: "bash",
    args: [
      { flag: "--tool", description: "tool name", required: true },
      { flag: "--repo", description: "repo path", required: false, default: "." },
      { flag: "--force", description: "overwrite existing", required: false },
    ],
    example: "scripts/mark-config --tool triverge",
  },
  {
    id: "editorconfig",
    name: "mark-editorconfig",
    category: "Config / Dotfiles",
    description: "Drop .editorconfig with sensible defaults",
    script: "scripts/mark-editorconfig",
    runtime: "bash",
    args: [
      { flag: "--repo", description: "repo path", required: false, default: "." },
      { flag: "--force", description: "overwrite existing", required: false },
    ],
    example: "scripts/mark-editorconfig",
  },
  {
    id: "nodeversion",
    name: "mark-nodeversion",
    category: "Config / Dotfiles",
    description: "Drop .nvmrc or .node-version with a specified Node.js version",
    script: "scripts/mark-nodeversion",
    runtime: "bash",
    args: [
      { flag: "--version", description: "Node.js version", required: true },
      { flag: "--format", description: "nvmrc | node-version", required: false, default: "nvmrc" },
      { flag: "--repo", description: "repo path", required: false, default: "." },
      { flag: "--force", description: "overwrite existing", required: false },
    ],
    example: "scripts/mark-nodeversion --version 22.0.0",
  },
  {
    id: "dependabot",
    name: "mark-dependabot",
    category: "Config / Dotfiles",
    description: "Drop .github/dependabot.yml with weekly update schedule",
    script: "scripts/mark-dependabot",
    runtime: "bash",
    args: [
      { flag: "--ecosystem", description: "package ecosystem", required: false, default: "npm" },
      { flag: "--repo", description: "repo path", required: false, default: "." },
      { flag: "--force", description: "overwrite existing", required: false },
    ],
    example: "scripts/mark-dependabot --ecosystem npm",
  },
  {
    id: "workflow",
    name: "mark-workflow",
    category: "Config / Dotfiles",
    description: "Drop a GitHub Actions workflow into .github/workflows/",
    script: "scripts/mark-workflow",
    runtime: "bash",
    args: [
      { flag: "--name", description: "workflow name", required: true },
      { flag: "--trigger", description: "push | pr | schedule", required: false, default: "push" },
      { flag: "--repo", description: "repo path", required: false, default: "." },
      { flag: "--force", description: "overwrite existing", required: false },
    ],
    example: 'scripts/mark-workflow --name "CI" --trigger push',
  },
  // --- Source Files ---
  {
    id: "header",
    name: "mark-header",
    category: "Source Files",
    description: "Prepend copyright/license banner with @generated marker",
    script: "scripts/mark-header.ts",
    runtime: "bun",
    args: [
      { flag: "--author", description: "copyright holder", required: false, default: "Unknown" },
      { flag: "--license", description: "SPDX identifier", required: false, default: "MIT" },
      { flag: "--year", description: "copyright year", required: false },
      { flag: "--url", description: "repository URL", required: false },
    ],
    example: 'bun scripts/mark-header.ts --author "Milian0402" src/index.ts',
  },
  {
    id: "watermark",
    name: "mark-watermark",
    category: "Source Files",
    description: "Inject build-hash watermark (date + git SHA + author)",
    script: "scripts/mark-watermark.ts",
    runtime: "bun",
    args: [
      { flag: "--author", description: "author name", required: false, default: "unknown" },
      { flag: "--placement", description: "top | bottom | after-imports", required: false, default: "top" },
    ],
    example: "bun scripts/mark-watermark.ts --author claude-code src/index.ts",
  },
  {
    id: "annotate",
    name: "mark-annotate",
    category: "Source Files",
    description: "Inject @generated, @todo, @fixme, or @marked-by comment",
    script: "scripts/mark-annotate.ts",
    runtime: "bun",
    args: [
      { flag: "--type", description: "@generated | @todo | @fixme | @marked-by", required: true },
      { flag: "--message", description: "annotation message", required: false },
      { flag: "--author", description: "author for @marked-by", required: false },
      { flag: "--line", description: "insert before line number", required: false },
    ],
    example: "bun scripts/mark-annotate.ts --type @generated src/generated.ts",
  },
  {
    id: "docstring",
    name: "mark-docstring",
    category: "Source Files",
    description: "Add JSDoc or Python docstring to a named function",
    script: "scripts/mark-docstring.ts",
    runtime: "bun",
    args: [
      { flag: "--fn", description: "function name", required: true },
      { flag: "--description", description: "short description", required: false },
      { flag: "--param", description: "param description (repeatable)", required: false },
      { flag: "--returns", description: "return description", required: false },
    ],
    example: 'bun scripts/mark-docstring.ts --fn login --description "Authenticates user" src/auth.ts',
  },
  // --- Invisible / Forensic ---
  {
    id: "gitkeep",
    name: "mark-gitkeep",
    category: "Invisible / Forensic",
    description: "Create .gitkeep in empty directories to track them in git",
    script: "scripts/mark-gitkeep",
    runtime: "bash",
    args: [],
    example: "scripts/mark-gitkeep src/assets src/generated",
  },
  // --- Package ---
  {
    id: "metadata",
    name: "mark-metadata",
    category: "Package",
    description: "Edit package.json fields: set values, add/remove keywords",
    script: "scripts/mark-metadata.ts",
    runtime: "bun",
    args: [
      { flag: "--set", description: "key=value (repeatable)", required: false },
      { flag: "--add-keyword", description: "keyword to add (repeatable)", required: false },
      { flag: "--remove-keyword", description: "keyword to remove (repeatable)", required: false },
    ],
    example: 'bun scripts/mark-metadata.ts --set author="Milian0402" --add-keyword devtools',
  },
];

export const markById = Object.fromEntries(marks.map((m) => [m.id, m]));
export const marksByCategory = marks.reduce<Record<string, Mark[]>>((acc, m) => {
  (acc[m.category] ??= []).push(m);
  return acc;
}, {});

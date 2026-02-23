import { program } from "commander";
import { readFileSync, writeFileSync } from "fs";

function detectLang(file: string): "ts" | "py" | null {
  const ext = file.slice(file.lastIndexOf(".") + 1);
  if (ext === "ts" || ext === "tsx" || ext === "js" || ext === "jsx") return "ts";
  if (ext === "py") return "py";
  return null;
}

function buildJsDoc(description: string, params: string[], returns: string): string {
  const lines = ["/**", ` * ${description || "TODO: describe"}`];
  for (const p of params) lines.push(` * @param ${p}`);
  if (returns) lines.push(` * @returns ${returns}`);
  lines.push(" */");
  return lines.join("\n");
}

function buildPyDoc(description: string, params: string[], returns: string): string {
  const lines = [`    """${description || "TODO: describe"}`];
  if (params.length || returns) {
    if (params.length) {
      lines.push("", "    Args:");
      for (const p of params) lines.push(`        ${p}`);
    }
    if (returns) {
      lines.push("", "    Returns:");
      lines.push(`        ${returns}`);
    }
  }
  lines.push('    """');
  return lines.join("\n");
}

function collect(value: string, previous: string[]): string[] {
  return [...previous, value];
}

program
  .argument("<file>", "target file")
  .requiredOption("--fn <name>", "function name to document")
  .option("--description <text>", "short description", "")
  .option("--param <p>", "parameter description (repeatable)", collect, [] as string[])
  .option("--returns <text>", "return value description", "")
  .action((file: string, opts) => {
    const lang = detectLang(file);
    if (!lang) {
      console.error(`error: unsupported file type: ${file}`);
      process.exit(1);
    }

    const content = readFileSync(file, "utf-8");
    const lines = content.split("\n");

    const fnPattern =
      lang === "py"
        ? new RegExp(`^(\\s*)def ${opts.fn}\\(`)
        : new RegExp(`(function ${opts.fn}|${opts.fn}\\s*[:=(]|async\\s+function ${opts.fn})`);

    const fnIdx = lines.findIndex((l) => fnPattern.test(l));
    if (fnIdx < 0) {
      console.error(`error: function '${opts.fn}' not found in ${file}`);
      process.exit(1);
    }

    const prevLine = lines[fnIdx - 1] ?? "";
    if (prevLine.trimEnd().endsWith("*/") || prevLine.includes('"""')) {
      console.log(`skip: ${file} already has docstring before '${opts.fn}'`);
      return;
    }

    if (lang === "py") {
      const docstring = buildPyDoc(opts.description, opts.param, opts.returns);
      lines.splice(fnIdx + 1, 0, docstring);
    } else {
      const docstring = buildJsDoc(opts.description, opts.param, opts.returns);
      lines.splice(fnIdx, 0, docstring);
    }

    writeFileSync(file, lines.join("\n"));
    console.log(`documented '${opts.fn}' in ${file}`);
  });

program.parse();

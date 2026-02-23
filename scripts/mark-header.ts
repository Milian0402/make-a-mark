import { program } from "commander";
import { readFileSync, writeFileSync } from "fs";

const MARKER = "@generated";

const commentStyles: Record<string, { start: string; end: string }> = {
  ".ts": { start: "/*", end: " */" },
  ".js": { start: "/*", end: " */" },
  ".tsx": { start: "/*", end: " */" },
  ".jsx": { start: "/*", end: " */" },
  ".css": { start: "/*", end: " */" },
  ".py": { start: '"""', end: '"""' },
  ".rb": { start: "=begin", end: "=end" },
  ".sh": { start: "#", end: "#" },
  ".bash": { start: "#", end: "#" },
};

function getExt(path: string): string {
  const dot = path.lastIndexOf(".");
  return dot >= 0 ? path.slice(dot) : "";
}

function buildBanner(
  author: string,
  license: string,
  year: string,
  url: string,
  style: { start: string; end: string }
): string {
  const lines = [
    `Copyright (c) ${year} ${author}`,
    `License: ${license}`,
    MARKER,
  ];
  if (url) lines.splice(2, 0, url);

  if (style.start === "#") {
    return lines.map((l) => `# ${l}`).join("\n");
  }
  return [style.start, ...lines.map((l) => ` * ${l}`), style.end].join("\n");
}

program
  .argument("<files...>", "files to stamp")
  .option("--author <name>", "copyright holder", "Unknown")
  .option("--license <spdx>", "SPDX license identifier", "MIT")
  .option("--year <year>", "copyright year", new Date().getFullYear().toString())
  .option("--url <url>", "repository URL", "")
  .action((files: string[], opts) => {
    for (const file of files) {
      const ext = getExt(file);
      const style = commentStyles[ext];
      if (!style) {
        console.error(`skip: unsupported extension ${ext} for ${file}`);
        continue;
      }

      let content = readFileSync(file, "utf-8");

      if (content.includes(MARKER)) {
        console.log(`skip: ${file} already has ${MARKER}`);
        continue;
      }

      const banner = buildBanner(opts.author, opts.license, opts.year, opts.url, style);
      let insertAt = 0;

      if (content.startsWith("#!")) {
        const newline = content.indexOf("\n");
        if (newline >= 0) insertAt = newline + 1;
      }

      content = content.slice(0, insertAt) + banner + "\n\n" + content.slice(insertAt);
      writeFileSync(file, content);
      console.log(`stamped: ${file}`);
    }
  });

program.parse();

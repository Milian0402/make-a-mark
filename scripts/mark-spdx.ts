import { program } from "commander";
import { readFileSync, writeFileSync } from "fs";

const MARKER = "SPDX-License-Identifier";

const commentStyles: Record<string, { line: string }> = {
  ".ts": { line: "//" },
  ".js": { line: "//" },
  ".tsx": { line: "//" },
  ".jsx": { line: "//" },
  ".go": { line: "//" },
  ".rs": { line: "//" },
  ".java": { line: "//" },
  ".c": { line: "//" },
  ".cpp": { line: "//" },
  ".css": { line: "//" },
  ".py": { line: "#" },
  ".rb": { line: "#" },
  ".sh": { line: "#" },
  ".bash": { line: "#" },
  ".yaml": { line: "#" },
  ".yml": { line: "#" },
  ".toml": { line: "#" },
};

function getExt(path: string): string {
  const dot = path.lastIndexOf(".");
  return dot >= 0 ? path.slice(dot) : "";
}

program
  .argument("<files...>", "files to stamp")
  .option("--license <spdx>", "SPDX license expression", "MIT")
  .option("--copyright <text>", "copyright holder", "Unknown")
  .option("--year <year>", "copyright year", new Date().getFullYear().toString())
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

      const prefix = style.line;
      const header = [
        `${prefix} SPDX-FileCopyrightText: ${opts.year} ${opts.copyright}`,
        `${prefix} ${MARKER}: ${opts.license}`,
      ].join("\n");

      let insertAt = 0;
      if (content.startsWith("#!")) {
        const newline = content.indexOf("\n");
        if (newline >= 0) insertAt = newline + 1;
      }

      content =
        content.slice(0, insertAt) + header + "\n\n" + content.slice(insertAt);
      writeFileSync(file, content);
      console.log(`stamped: ${file}`);
    }
  });

program.parse();

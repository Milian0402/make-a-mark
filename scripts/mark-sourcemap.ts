import { program } from "commander";
import { readFileSync, writeFileSync, existsSync } from "fs";

const MARKER = "sourceMappingURL";

const commentStyles: Record<string, { start: string; end: string }> = {
  ".js": { start: "//# ", end: "" },
  ".mjs": { start: "//# ", end: "" },
  ".cjs": { start: "//# ", end: "" },
  ".ts": { start: "//# ", end: "" },
  ".css": { start: "/*# ", end: " */" },
};

function getExt(path: string): string {
  const dot = path.lastIndexOf(".");
  return dot >= 0 ? path.slice(dot) : "";
}

program
  .argument("<files...>", "files to stamp")
  .option("--url <url>", "source map URL (default: <file>.map)")
  .option("--remove", "remove existing sourceMappingURL", false)
  .action((files: string[], opts) => {
    for (const file of files) {
      if (!existsSync(file)) {
        console.error(`error: ${file} not found`);
        process.exit(1);
      }

      const ext = getExt(file);
      const style = commentStyles[ext];
      if (!style) {
        console.error(`skip: unsupported extension ${ext} for ${file}`);
        continue;
      }

      let content = readFileSync(file, "utf-8");

      if (opts.remove) {
        const escaped = style.start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const endEsc = style.end.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(
          `\\n?${escaped}${MARKER}=.*${endEsc}\\s*$`
        );
        content = content.replace(regex, "");
        writeFileSync(file, content);
        console.log(`removed sourceMappingURL from ${file}`);
        continue;
      }

      if (content.includes(MARKER)) {
        console.log(`skip: ${file} already has ${MARKER}`);
        continue;
      }

      const mapUrl = opts.url || `${file}.map`;
      const comment = `${style.start}${MARKER}=${mapUrl}${style.end}`;

      content = content.trimEnd() + "\n" + comment + "\n";
      writeFileSync(file, content);
      console.log(`stamped: ${file}`);
    }
  });

program.parse();

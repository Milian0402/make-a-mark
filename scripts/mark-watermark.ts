import { program } from "commander";
import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const WATERMARK_MARKER = "BUILT:";

const commentMap: Record<string, (text: string) => string> = {
  ".ts": (t) => `/* ${t} */`,
  ".js": (t) => `/* ${t} */`,
  ".tsx": (t) => `/* ${t} */`,
  ".jsx": (t) => `/* ${t} */`,
  ".css": (t) => `/* ${t} */`,
  ".py": (t) => `# ${t}`,
  ".sh": (t) => `# ${t}`,
  ".bash": (t) => `# ${t}`,
  ".rb": (t) => `# ${t}`,
};

function getExt(path: string): string {
  const dot = path.lastIndexOf(".");
  return dot >= 0 ? path.slice(dot) : "";
}

function gitShortSha(): string {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
  } catch {
    return "no-git";
  }
}

program
  .argument("<file>", "target file")
  .option("--author <name>", "author name", "unknown")
  .option("--placement <where>", "top | bottom | after-imports", "top")
  .action((file: string, opts) => {
    const ext = getExt(file);
    const wrap = commentMap[ext];
    if (!wrap) {
      console.error(`error: unsupported extension ${ext}`);
      process.exit(1);
    }

    const date = new Date().toISOString();
    const sha = gitShortSha();
    const watermark = wrap(`${WATERMARK_MARKER} ${date} HASH: ${sha} BY: ${opts.author}`);

    let content = readFileSync(file, "utf-8");
    const lines = content.split("\n");

    const existingIdx = lines.findIndex((l) => l.includes(WATERMARK_MARKER));
    if (existingIdx >= 0) {
      lines[existingIdx] = watermark;
      writeFileSync(file, lines.join("\n"));
      console.log(`replaced watermark in ${file}`);
      return;
    }

    if (opts.placement === "bottom") {
      lines.push(watermark);
    } else if (opts.placement === "after-imports") {
      let lastImport = -1;
      for (let i = 0; i < lines.length; i++) {
        if (/^(import |from |require\()/.test(lines[i])) lastImport = i;
      }
      lines.splice(lastImport + 1, 0, "", watermark);
    } else {
      let insertAt = 0;
      if (lines[0]?.startsWith("#!")) insertAt = 1;
      lines.splice(insertAt, 0, watermark, "");
    }

    writeFileSync(file, lines.join("\n"));
    console.log(`watermarked ${file}`);
  });

program.parse();

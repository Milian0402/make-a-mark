import { program } from "commander";
import { readFileSync, writeFileSync } from "fs";

const ANNOTATION_TYPES = ["@generated", "@todo", "@fixme", "@marked-by"] as const;
type AnnotationType = (typeof ANNOTATION_TYPES)[number];

const commentMap: Record<string, (text: string) => string> = {
  ".ts": (t) => `// ${t}`,
  ".js": (t) => `// ${t}`,
  ".tsx": (t) => `// ${t}`,
  ".jsx": (t) => `// ${t}`,
  ".py": (t) => `# ${t}`,
  ".sh": (t) => `# ${t}`,
  ".bash": (t) => `# ${t}`,
  ".rb": (t) => `# ${t}`,
  ".css": (t) => `/* ${t} */`,
  ".html": (t) => `<!-- ${t} -->`,
};

function getExt(path: string): string {
  const dot = path.lastIndexOf(".");
  return dot >= 0 ? path.slice(dot) : "";
}

program
  .argument("<file>", "target file")
  .requiredOption("--type <type>", `annotation type: ${ANNOTATION_TYPES.join(", ")}`)
  .option("--message <msg>", "annotation message", "")
  .option("--author <name>", "author for @marked-by", "")
  .option("--line <n>", "insert before line number (1-based)", "0")
  .action((file: string, opts) => {
    const type = opts.type as AnnotationType;
    if (!ANNOTATION_TYPES.includes(type)) {
      console.error(`error: unknown type ${type}. Use: ${ANNOTATION_TYPES.join(", ")}`);
      process.exit(1);
    }

    const ext = getExt(file);
    const wrap = commentMap[ext];
    if (!wrap) {
      console.error(`error: unsupported extension ${ext}`);
      process.exit(1);
    }

    let annotation = type;
    if (type === "@marked-by" && opts.author) {
      annotation += ` ${opts.author}`;
    }
    if (opts.message) {
      annotation += `: ${opts.message}`;
    }

    const comment = wrap(annotation);
    let content = readFileSync(file, "utf-8");

    if (content.includes(annotation)) {
      console.log(`skip: ${file} already has ${type}`);
      return;
    }

    const lines = content.split("\n");
    const lineNum = parseInt(opts.line, 10);

    if (lineNum > 0 && lineNum <= lines.length) {
      lines.splice(lineNum - 1, 0, comment);
    } else {
      let insertAt = 0;
      if (lines[0]?.startsWith("#!")) insertAt = 1;
      lines.splice(insertAt, 0, comment);
    }

    writeFileSync(file, lines.join("\n"));
    console.log(`annotated ${file} with ${type}`);
  });

program.parse();

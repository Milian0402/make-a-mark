import { program } from "commander";
import { readFileSync, writeFileSync, existsSync } from "fs";

const OCI_PREFIX = "org.opencontainers.image";

const STANDARD_LABELS: Record<string, string> = {
  title: `${OCI_PREFIX}.title`,
  description: `${OCI_PREFIX}.description`,
  version: `${OCI_PREFIX}.version`,
  source: `${OCI_PREFIX}.source`,
  url: `${OCI_PREFIX}.url`,
  authors: `${OCI_PREFIX}.authors`,
  vendor: `${OCI_PREFIX}.vendor`,
  revision: `${OCI_PREFIX}.revision`,
  created: `${OCI_PREFIX}.created`,
};

program
  .argument("<dockerfile>", "path to Dockerfile")
  .option("--title <title>", "image title")
  .option("--description <desc>", "image description")
  .option("--version <ver>", "image version")
  .option("--source <url>", "source code URL")
  .option("--url <url>", "documentation URL")
  .option("--authors <names>", "image authors")
  .option("--vendor <name>", "image vendor")
  .option("--revision <rev>", "source control revision")
  .option("--set <kv...>", "custom key=value labels")
  .action((dockerfile: string, opts) => {
    if (!existsSync(dockerfile)) {
      console.error(`error: ${dockerfile} not found`);
      process.exit(1);
    }

    let content = readFileSync(dockerfile, "utf-8");
    const labels: string[] = [];

    for (const [short, full] of Object.entries(STANDARD_LABELS)) {
      const val = opts[short];
      if (val) labels.push(`${full}="${val}"`);
    }

    if (opts.set) {
      for (const kv of opts.set) {
        const eq = kv.indexOf("=");
        if (eq < 0) {
          console.error(`error: invalid --set format: ${kv} (expected key=value)`);
          process.exit(1);
        }
        labels.push(`${kv.slice(0, eq)}="${kv.slice(eq + 1)}"`);
      }
    }

    if (labels.length === 0) {
      console.error("error: at least one label required");
      process.exit(1);
    }

    if (content.includes(OCI_PREFIX)) {
      const lines = content.split("\n");
      const newLines: string[] = [];
      let inLabelBlock = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.match(/^LABEL\s/) && line.includes(OCI_PREFIX)) {
          if (!inLabelBlock) {
            inLabelBlock = true;
            const labelStr = labels.map((l) => `      ${l}`).join(" \\\n");
            newLines.push(`LABEL ${labelStr}`);
          }
          if (!line.trimEnd().endsWith("\\")) {
            inLabelBlock = false;
          }
          continue;
        }
        if (inLabelBlock) {
          if (!line.trimEnd().endsWith("\\")) {
            inLabelBlock = false;
          }
          continue;
        }
        newLines.push(line);
      }

      content = newLines.join("\n");
    } else {
      const fromIdx = content.indexOf("\n", content.indexOf("FROM"));
      if (fromIdx < 0) {
        console.error("error: no FROM instruction found in Dockerfile");
        process.exit(1);
      }

      const labelStr = labels.map((l) => `      ${l}`).join(" \\\n");
      const labelBlock = `\nLABEL ${labelStr}\n`;
      content = content.slice(0, fromIdx) + labelBlock + content.slice(fromIdx);
    }

    writeFileSync(dockerfile, content);
    console.log(`Updated ${dockerfile} with ${labels.length} OCI label(s)`);
  });

program.parse();

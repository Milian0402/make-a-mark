import { program } from "commander";
import { readFileSync, writeFileSync } from "fs";

function collect(value: string, previous: string[]): string[] {
  return [...previous, value];
}

program
  .argument("[file]", "path to package.json", "package.json")
  .option("--set <key=value>", "set a top-level field (repeatable)", collect, [] as string[])
  .option("--add-keyword <kw>", "add a keyword (repeatable)", collect, [] as string[])
  .option("--remove-keyword <kw>", "remove a keyword (repeatable)", collect, [] as string[])
  .action((file: string, opts) => {
    let pkg: Record<string, unknown>;
    try {
      pkg = JSON.parse(readFileSync(file, "utf-8"));
    } catch {
      console.error(`error: could not parse ${file}`);
      process.exit(1);
    }

    for (const kv of opts.set) {
      const eq = kv.indexOf("=");
      if (eq < 0) {
        console.error(`error: --set requires key=value format, got: ${kv}`);
        process.exit(1);
      }
      const key = kv.slice(0, eq);
      const value = kv.slice(eq + 1);
      pkg[key] = value;
      console.log(`set ${key}=${value}`);
    }

    if (opts.addKeyword.length || opts.removeKeyword.length) {
      const keywords: string[] = Array.isArray(pkg.keywords)
        ? (pkg.keywords as string[])
        : [];
      for (const kw of opts.addKeyword) {
        if (!keywords.includes(kw)) {
          keywords.push(kw);
          console.log(`added keyword: ${kw}`);
        }
      }
      for (const kw of opts.removeKeyword) {
        const idx = keywords.indexOf(kw);
        if (idx >= 0) {
          keywords.splice(idx, 1);
          console.log(`removed keyword: ${kw}`);
        }
      }
      pkg.keywords = keywords;
    }

    writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
    console.log(`updated ${file}`);
  });

program.parse();

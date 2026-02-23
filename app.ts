import { marks, marksByCategory, CATEGORIES } from "./marks";
import { readFileSync } from "fs";
import { spawnSync } from "child_process";

const ALLOW_RUN = process.argv.includes("--allow-run");
const PORT = parseInt(process.env.PORT ?? "3000", 10);

const html = readFileSync(import.meta.dir + "/public/index.html", "utf-8");

Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(html, { headers: { "Content-Type": "text/html" } });
    }

    if (url.pathname === "/api/marks") {
      return Response.json({ marks, categories: CATEGORIES, marksByCategory, runEnabled: ALLOW_RUN });
    }

    if (url.pathname === "/api/run" && req.method === "POST") {
      if (!ALLOW_RUN) {
        return Response.json({ error: "Run endpoint disabled. Start with --allow-run to enable." }, { status: 403 });
      }
      return handleRun(req);
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`make-a-mark running at http://localhost:${PORT}`);
if (ALLOW_RUN) console.log("  run endpoint enabled");

async function handleRun(req: Request): Promise<Response> {
  let body: { id: string; args: string[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }

  const mark = marks.find((m) => m.id === body.id);
  if (!mark) {
    return Response.json({ error: `unknown mark: ${body.id}` }, { status: 400 });
  }

  const args = Array.isArray(body.args) ? body.args.map(String) : [];
  const unsafe = args.find((a) => /[;&|`$<>\\]/.test(a));
  if (unsafe) {
    return Response.json({ error: `unsafe argument rejected: ${unsafe}` }, { status: 400 });
  }

  const cmd =
    mark.runtime === "bun"
      ? ["bun", mark.script, ...args]
      : [mark.script, ...args];

  const result = spawnSync(cmd[0], cmd.slice(1), {
    encoding: "utf-8",
    timeout: 10000,
    cwd: import.meta.dir,
  });

  return Response.json({
    stdout: result.stdout,
    stderr: result.stderr,
    exitCode: result.status,
  });
}

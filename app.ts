import { marks, marksByCategory, CATEGORIES } from "./marks";
import { readFileSync } from "fs";
import { spawnSync } from "child_process";
import { validateRunBody, type ApiError } from "./lib/run-validation";

const ALLOW_RUN = process.argv.includes("--allow-run");
const PORT = parseInt(process.env.PORT ?? "3000", 10);
const HOST = process.env.HOST ?? "127.0.0.1";
const RUN_TOKEN = process.env.MARK_RUN_TOKEN?.trim() || "";

const staticFiles = {
  "/": { body: readFileSync(import.meta.dir + "/public/index.html", "utf-8"), type: "text/html; charset=utf-8" },
  "/index.html": { body: readFileSync(import.meta.dir + "/public/index.html", "utf-8"), type: "text/html; charset=utf-8" },
  "/styles.css": { body: readFileSync(import.meta.dir + "/public/styles.css", "utf-8"), type: "text/css; charset=utf-8" },
  "/app.js": { body: readFileSync(import.meta.dir + "/public/app.js", "utf-8"), type: "text/javascript; charset=utf-8" },
  "/logic.js": { body: readFileSync(import.meta.dir + "/public/logic.js", "utf-8"), type: "text/javascript; charset=utf-8" },
} as const;

Bun.serve({
  hostname: HOST,
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);

    const staticMatch = staticFiles[url.pathname as keyof typeof staticFiles];
    if (staticMatch) {
      return new Response(staticMatch.body, { headers: { "Content-Type": staticMatch.type } });
    }

    if (url.pathname === "/api/marks") {
      return Response.json({
        marks,
        categories: CATEGORIES,
        marksByCategory,
        runEnabled: ALLOW_RUN,
        runRequiresToken: RUN_TOKEN.length > 0,
      });
    }

    if (url.pathname === "/api/run" && req.method === "POST") {
      if (!ALLOW_RUN) {
        return errorResponse({
          code: "RUN_DISABLED",
          message: "Run endpoint disabled. Start with --allow-run to enable.",
          status: 403,
        });
      }
      if (!authorized(req)) {
        return errorResponse({
          code: "UNAUTHORIZED",
          message: "invalid run token",
          status: 401,
        });
      }
      return handleRun(req);
    }

    return errorResponse({ code: "NOT_FOUND", message: "Not Found", status: 404 });
  },
});

console.log(`make-a-mark running at http://${HOST}:${PORT}`);
if (ALLOW_RUN) console.log("  run endpoint enabled");
if (ALLOW_RUN && RUN_TOKEN) console.log("  run endpoint requires MARK_RUN_TOKEN");

async function handleRun(req: Request): Promise<Response> {
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return errorResponse({ code: "INVALID_JSON", message: "invalid JSON", status: 400 });
  }

  const validated = validateRunBody(rawBody);
  if (!validated.ok) {
    return errorResponse(validated.error);
  }

  const mark = marks.find((m) => m.id === validated.value.id);
  if (!mark) {
    return errorResponse({
      code: "UNKNOWN_MARK",
      message: `unknown mark: ${validated.value.id}`,
      status: 400,
    });
  }

  const cmd =
    mark.runtime === "bun"
      ? ["bun", mark.script, ...validated.value.args]
      : [mark.script, ...validated.value.args];

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

function errorResponse(error: ApiError): Response {
  return Response.json(
    {
      error: {
        code: error.code,
        message: error.message,
      },
    },
    { status: error.status },
  );
}

function authorized(req: Request): boolean {
  if (!RUN_TOKEN) return true;

  const headerToken = req.headers.get("x-mark-token")?.trim() || "";
  if (headerToken && headerToken === RUN_TOKEN) return true;

  const auth = req.headers.get("authorization")?.trim() || "";
  if (auth.startsWith("Bearer ")) {
    return auth.slice("Bearer ".length).trim() === RUN_TOKEN;
  }

  return false;
}

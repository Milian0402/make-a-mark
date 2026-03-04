export const MAX_ARGS = 50;
export const MAX_ARG_LENGTH = 256;
export const MAX_ID_LENGTH = 64;
export const UNSAFE_ARG_PATTERN = /[;&|`$<>\\]/;
export const CONTROL_CHAR_PATTERN = /[\u0000-\u001F\u007F]/;

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export interface RunRequest {
  id: string;
  args: string[];
}

export function validateRunBody(body: unknown): { ok: true; value: RunRequest } | { ok: false; error: ApiError } {
  if (!isRecord(body)) {
    return fail("INVALID_BODY", "request body must be an object", 400);
  }

  const id = body.id;
  const args = body.args;

  if (typeof id !== "string" || id.trim() === "") {
    return fail("INVALID_ID", "id must be a non-empty string", 400);
  }
  if (id.length > MAX_ID_LENGTH) {
    return fail("ID_TOO_LONG", `id exceeds ${MAX_ID_LENGTH} characters`, 400);
  }
  if (!/^[a-z0-9-]+$/.test(id.trim())) {
    return fail("ID_INVALID_FORMAT", "id must match [a-z0-9-]+", 400);
  }

  if (!Array.isArray(args)) {
    return fail("INVALID_ARGS", "args must be an array", 400);
  }

  if (args.length > MAX_ARGS) {
    return fail("ARGS_TOO_MANY", `args limit is ${MAX_ARGS}`, 400);
  }

  const normalized: string[] = [];
  for (const item of args) {
    if (typeof item !== "string") {
      return fail("INVALID_ARG_TYPE", "each arg must be a string", 400);
    }

    if (item.length > MAX_ARG_LENGTH) {
      return fail("ARG_TOO_LONG", `arg exceeds ${MAX_ARG_LENGTH} characters`, 400);
    }
    if (CONTROL_CHAR_PATTERN.test(item)) {
      return fail("ARG_CONTROL_CHAR", "arg contains disallowed control characters", 400);
    }

    if (UNSAFE_ARG_PATTERN.test(item)) {
      return fail("ARG_UNSAFE", `unsafe argument rejected: ${item}`, 400);
    }

    normalized.push(item);
  }

  return { ok: true, value: { id: id.trim(), args: normalized } };
}

function fail(code: string, message: string, status: number) {
  return { ok: false as const, error: { code, message, status } };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

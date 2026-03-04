import { describe, expect, it } from "bun:test";
import { MAX_ARGS, MAX_ARG_LENGTH, MAX_ID_LENGTH, validateRunBody } from "../lib/run-validation";

describe("run validation", () => {
  it("rejects unsafe args", () => {
    const result = validateRunBody({ id: "commit", args: ["--message", "bad;rm"] });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("ARG_UNSAFE");
  });

  it("rejects too many args", () => {
    const args = Array.from({ length: MAX_ARGS + 1 }, (_, index) => `arg-${index}`);
    const result = validateRunBody({ id: "commit", args });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("ARGS_TOO_MANY");
  });

  it("rejects overlong args", () => {
    const longArg = "a".repeat(MAX_ARG_LENGTH + 1);
    const result = validateRunBody({ id: "commit", args: [longArg] });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("ARG_TOO_LONG");
  });

  it("accepts valid request", () => {
    const result = validateRunBody({ id: "commit", args: ["--message", "hello"] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual({ id: "commit", args: ["--message", "hello"] });
  });

  it("rejects malformed ids", () => {
    const result = validateRunBody({ id: "commit;rm", args: [] });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("ID_INVALID_FORMAT");
  });

  it("rejects overlong ids", () => {
    const id = "a".repeat(MAX_ID_LENGTH + 1);
    const result = validateRunBody({ id, args: [] });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("ID_TOO_LONG");
  });

  it("rejects control characters in args", () => {
    const result = validateRunBody({ id: "commit", args: ["line1\nline2"] });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("ARG_CONTROL_CHAR");
  });
});

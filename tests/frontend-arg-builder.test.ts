import { describe, expect, it } from "bun:test";
import { buildArgs, buildCommand } from "../public/logic.js";

describe("frontend arg builder", () => {
  const mark = {
    id: "sample",
    name: "sample",
    runtime: "bash",
    script: "scripts/mark-sample",
    args: [
      { flag: "--name", description: "name", required: true, takesValue: true },
      { flag: "--force", description: "force", required: false, takesValue: false },
      { flag: "--label", description: "labels", required: false, takesValue: true, repeatable: true },
    ],
  };

  it("flags missing required values", () => {
    const result = buildArgs(mark, { "--name": "", "--force": false, "--label": "" });
    expect(result.errors).toContain("--name is required");
  });

  it("handles optional boolean checked and unchecked", () => {
    const unchecked = buildArgs(mark, { "--name": "ok", "--force": false, "--label": "" });
    expect(unchecked.args).toEqual(["--name", "ok"]);

    const checked = buildArgs(mark, { "--name": "ok", "--force": true, "--label": "" });
    expect(checked.args).toEqual(["--name", "ok", "--force"]);
  });

  it("expands repeatable flags into multiple args", () => {
    const result = buildArgs(mark, {
      "--name": "ok",
      "--force": false,
      "--label": "bug,ui\ninfra",
    });

    expect(result.args).toEqual([
      "--name",
      "ok",
      "--label",
      "bug",
      "--label",
      "ui",
      "--label",
      "infra",
    ]);
  });

  it("builds copy command from the run payload", () => {
    const result = buildArgs(mark, {
      "--name": "Alpha Team",
      "--force": true,
      "--label": "ops",
    });
    const command = buildCommand(mark, result.args);

    expect(command).toBe("scripts/mark-sample --name 'Alpha Team' --force --label ops");
  });

  it("expands pair-value flags for co-author and trailer", () => {
    const special = {
      id: "commit",
      name: "commit",
      runtime: "bash",
      script: "scripts/mark-commit",
      args: [
        { flag: "--co-author", description: "name email", required: false, takesValue: true },
        { flag: "--trailer", description: "key value", required: false, takesValue: true, repeatable: true },
      ],
    };

    const result = buildArgs(special, {
      "--co-author": "Jane jane@example.com",
      "--trailer": "Task TRIV-42,Env prod",
    });

    expect(result.errors).toEqual([]);
    expect(result.args).toEqual([
      "--co-author",
      "Jane",
      "jane@example.com",
      "--trailer",
      "Task",
      "TRIV-42",
      "--trailer",
      "Env",
      "prod",
    ]);
  });
});

import { buildArgs, buildCommand, formatTimestamp } from "./logic.js";

const state = {
  data: null,
  activeCategory: "All",
  query: "",
  runnableOnly: false,
  forms: {},
  outputHistory: {},
  hashSyncLock: false,
};

const refs = {
  count: document.getElementById("count"),
  tabs: document.getElementById("tabs"),
  content: document.getElementById("content"),
  search: document.getElementById("search"),
  runnableWrap: document.getElementById("runnable-wrap"),
  runnableOnly: document.getElementById("runnable-only"),
  cardTemplate: document.getElementById("card-template"),
};

function getInitialFormState(mark) {
  const initial = {};
  for (const arg of mark.args) {
    if (!arg.takesValue) {
      initial[arg.flag] = false;
      continue;
    }
    initial[arg.flag] = arg.default ?? "";
  }
  return initial;
}

function ensureFormState(mark) {
  if (!state.forms[mark.id]) {
    state.forms[mark.id] = getInitialFormState(mark);
  }
  return state.forms[mark.id];
}

function getSearchTokens(mark) {
  return [
    mark.name,
    mark.description,
    ...mark.args.map((arg) => `${arg.flag} ${arg.description}`),
  ].join(" ").toLowerCase();
}

function markMatches(mark) {
  if (state.runnableOnly && !state.data.runEnabled) return false;
  if (!state.query) return true;
  return getSearchTokens(mark).includes(state.query.toLowerCase());
}

function getVisibleByCategory() {
  const result = {};
  for (const category of state.data.categories) {
    const source = state.data.marksByCategory[category] ?? [];
    result[category] = source.filter(markMatches);
  }
  return result;
}

function getVisibleCategories(map) {
  if (state.activeCategory === "All") {
    return state.data.categories.filter((category) => (map[category] ?? []).length > 0);
  }
  return [state.activeCategory];
}

function updateCountText(visibleMap) {
  const visibleCount = state.data.categories.reduce(
    (sum, category) => sum + (visibleMap[category]?.length ?? 0),
    0,
  );
  refs.count.textContent = `${visibleCount}/${state.data.marks.length} marks visible across ${state.data.categories.length} categories`;
}

function renderTabs(visibleMap) {
  const categories = ["All", ...state.data.categories];
  refs.tabs.innerHTML = "";

  for (const category of categories) {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (category === state.activeCategory ? " active" : "");

    const count = category === "All"
      ? state.data.categories.reduce((sum, c) => sum + (visibleMap[c]?.length ?? 0), 0)
      : visibleMap[category]?.length ?? 0;

    btn.textContent = `${category} (${count})`;
    btn.type = "button";
    btn.addEventListener("click", () => {
      state.activeCategory = category;
      syncHash({ mark: undefined });
      render();
    });
    refs.tabs.appendChild(btn);
  }
}

function makeTag(text) {
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = text;
  return tag;
}

function createInputForArg(mark, arg, formState) {
  const field = document.createElement("div");
  field.className = "field";

  if (!arg.takesValue) {
    const row = document.createElement("label");
    row.className = "boolean-row";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(formState[arg.flag]);
    input.setAttribute("data-flag", arg.flag);
    input.addEventListener("change", () => {
      formState[arg.flag] = input.checked;
    });

    const text = document.createElement("span");
    text.textContent = `${arg.flag} — ${arg.description}`;

    row.append(input, text);
    field.appendChild(row);
    return field;
  }

  const label = document.createElement("label");
  const left = document.createElement("span");
  left.textContent = `${arg.flag} — ${arg.description}`;
  label.appendChild(left);

  if (arg.required) {
    const required = document.createElement("span");
    required.className = "arg-required";
    required.textContent = "required";
    label.appendChild(required);
  }

  field.appendChild(label);

  if (Array.isArray(arg.choices) && arg.choices.length > 0) {
    const select = document.createElement("select");
    select.className = "arg-select";
    select.setAttribute("data-flag", arg.flag);

    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = arg.required ? "Select..." : "(none)";
    select.appendChild(blank);

    for (const choice of arg.choices) {
      const option = document.createElement("option");
      option.value = choice;
      option.textContent = choice;
      select.appendChild(option);
    }

    select.value = String(formState[arg.flag] ?? "");
    select.addEventListener("change", () => {
      formState[arg.flag] = select.value;
    });
    field.appendChild(select);
    return field;
  }

  const input = document.createElement("input");
  input.className = "arg-input";
  input.type = "text";
  input.setAttribute("data-flag", arg.flag);
  input.placeholder = arg.placeholder ?? (arg.repeatable ? "comma or newline separated" : "");
  input.value = String(formState[arg.flag] ?? "");

  input.addEventListener("input", () => {
    formState[arg.flag] = input.value;
  });

  field.appendChild(input);
  return field;
}

function setValidation(card, errors, warnings) {
  const area = card.querySelector(".validation");
  const messages = [...errors, ...warnings];
  area.textContent = messages.join(" | ");
}

function setRunButtonState(button, nextState) {
  button.classList.remove("running", "success", "failed");
  if (nextState !== "idle") button.classList.add(nextState);

  if (nextState === "running") {
    button.textContent = "Running...";
    button.disabled = true;
    return;
  }

  button.disabled = false;
  if (nextState === "success") button.textContent = "Run ok";
  else if (nextState === "failed") button.textContent = "Run failed";
  else button.textContent = "Run";

  if (nextState !== "idle") {
    window.setTimeout(() => {
      button.classList.remove("running", "success", "failed");
      button.textContent = "Run";
    }, 1200);
  }
}

function ensureHistory(markId) {
  if (!state.outputHistory[markId]) state.outputHistory[markId] = [];
  return state.outputHistory[markId];
}

function renderOutput(card, result) {
  const output = card.querySelector(".output");
  const meta = card.querySelector(".output-meta");
  const stdout = card.querySelector('[data-stream="stdout"]');
  const stderr = card.querySelector('[data-stream="stderr"]');
  const history = card.querySelector('[data-stream="history"]');
  const tabs = card.querySelectorAll(".btn-tab");

  output.hidden = false;
  output.open = true;
  meta.textContent = `${result.timestamp} | exit ${result.exitCode}`;

  stdout.textContent = result.stdout || "(empty)";
  stderr.textContent = result.stderr || "(empty)";

  const rows = ensureHistory(result.id)
    .map((entry) => `${entry.timestamp} | exit ${entry.exitCode}`)
    .join("\n");
  history.textContent = rows || "(no history)";

  for (const tab of tabs) {
    tab.classList.toggle("active", tab.dataset.streamTab === "stdout");
  }
  stdout.hidden = false;
  stderr.hidden = true;
  history.hidden = true;
}

function wireOutputTabs(card) {
  const tabs = card.querySelectorAll(".btn-tab");
  const streams = {
    stdout: card.querySelector('[data-stream="stdout"]'),
    stderr: card.querySelector('[data-stream="stderr"]'),
    history: card.querySelector('[data-stream="history"]'),
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.streamTab;
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      for (const [name, stream] of Object.entries(streams)) {
        stream.hidden = name !== target;
      }
    });
  });

  const copyOutput = card.querySelector(".btn-copy-output");
  copyOutput.addEventListener("click", async () => {
    const active = card.querySelector(".btn-tab.active")?.dataset.streamTab ?? "stdout";
    const text = streams[active]?.textContent ?? "";
    if (!text) return;
    await navigator.clipboard.writeText(text);
    copyOutput.textContent = "Copied";
    setTimeout(() => {
      copyOutput.textContent = "Copy output";
    }, 1200);
  });
}

function markIdFromHash() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const mark = params.get("mark");
  return mark ? mark.trim() : "";
}

function applyHash() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const category = params.get("category");
  const q = params.get("q");
  const runnable = params.get("runnable") === "1";

  if (category) state.activeCategory = category;
  if (q !== null) state.query = q;
  state.runnableOnly = runnable;

  refs.search.value = state.query;
  refs.runnableOnly.checked = state.runnableOnly;
}

function syncHash(overrides = {}) {
  if (state.hashSyncLock) return;

  const params = new URLSearchParams();
  params.set("category", overrides.category ?? state.activeCategory);
  if (state.query) params.set("q", state.query);
  if (state.runnableOnly) params.set("runnable", "1");

  const mark = overrides.mark;
  if (typeof mark === "string" && mark) params.set("mark", mark);

  state.hashSyncLock = true;
  window.location.hash = params.toString();
  state.hashSyncLock = false;
}

function renderCard(mark) {
  const node = refs.cardTemplate.content.firstElementChild.cloneNode(true);
  node.id = `card-${mark.id}`;

  node.querySelector(".card-title").textContent = mark.name;
  const tags = node.querySelector(".card-tags");
  tags.append(makeTag(mark.category));
  tags.append(makeTag(mark.runtime));

  if (state.data.runEnabled) tags.append(makeTag("runnable"));

  node.querySelector(".card-description").textContent = mark.description;

  const form = node.querySelector(".args-form");
  const formState = ensureFormState(mark);

  const requiredArgs = mark.args.filter((arg) => arg.required);
  const optionalArgs = mark.args.filter((arg) => !arg.required);

  for (const arg of requiredArgs) {
    form.appendChild(createInputForArg(mark, arg, formState));
  }

  if (optionalArgs.length > 0) {
    const advanced = document.createElement("details");
    advanced.className = "advanced";
    const summary = document.createElement("summary");
    summary.textContent = "Advanced args";
    advanced.appendChild(summary);

    for (const arg of optionalArgs) {
      advanced.appendChild(createInputForArg(mark, arg, formState));
    }
    form.appendChild(advanced);
  }

  const copyButton = node.querySelector('[data-action="copy"]');
  copyButton.addEventListener("click", async () => {
    const result = buildArgs(mark, formState);
    setValidation(node, result.errors, result.warnings);
    if (result.errors.length > 0) return;

    const command = buildCommand(mark, result.args);
    await navigator.clipboard.writeText(command);
    copyButton.textContent = "Copied";
    syncHash({ mark: mark.id });
    setTimeout(() => {
      copyButton.textContent = "Copy command";
    }, 1200);
  });

  const resetButton = node.querySelector('[data-action="reset"]');
  resetButton.addEventListener("click", () => {
    state.forms[mark.id] = getInitialFormState(mark);
    render();
    syncHash({ mark: mark.id });
  });

  const runButton = node.querySelector('[data-action="run"]');
  if (!state.data.runEnabled) {
    runButton.disabled = true;
    runButton.title = "Start with --allow-run to enable";
  }

  runButton.addEventListener("click", async () => {
    syncHash({ mark: mark.id });
    const result = buildArgs(mark, formState);
    setValidation(node, result.errors, result.warnings);

    if (result.errors.length > 0 || result.warnings.length > 0) {
      setRunButtonState(runButton, "failed");
      return;
    }

    if (!state.data.runEnabled) return;

    setRunButtonState(runButton, "running");

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: mark.id, args: result.args }),
      });

      const payload = await res.json();
      if (!res.ok || payload.error) {
        const errorText = typeof payload.error === "string"
          ? payload.error
          : payload.error?.message ?? "run failed";

        const failed = {
          id: mark.id,
          timestamp: formatTimestamp(),
          stdout: "",
          stderr: errorText,
          exitCode: payload.exitCode ?? 1,
        };

        ensureHistory(mark.id).unshift(failed);
        state.outputHistory[mark.id] = ensureHistory(mark.id).slice(0, 3);
        renderOutput(node, failed);
        setRunButtonState(runButton, "failed");
        return;
      }

      const success = {
        id: mark.id,
        timestamp: formatTimestamp(),
        stdout: payload.stdout ?? "",
        stderr: payload.stderr ?? "",
        exitCode: payload.exitCode ?? 0,
      };
      ensureHistory(mark.id).unshift(success);
      state.outputHistory[mark.id] = ensureHistory(mark.id).slice(0, 3);
      renderOutput(node, success);
      setRunButtonState(runButton, success.exitCode === 0 ? "success" : "failed");
    } catch (error) {
      const failed = {
        id: mark.id,
        timestamp: formatTimestamp(),
        stdout: "",
        stderr: error instanceof Error ? error.message : "request failed",
        exitCode: 1,
      };
      ensureHistory(mark.id).unshift(failed);
      state.outputHistory[mark.id] = ensureHistory(mark.id).slice(0, 3);
      renderOutput(node, failed);
      setRunButtonState(runButton, "failed");
    }
  });

  wireOutputTabs(node);
  return node;
}

function renderEmpty(visibleMap) {
  const hasCategoryItems = (visibleMap[state.activeCategory] ?? []).length > 0;

  if (state.activeCategory !== "All" && !hasCategoryItems) {
    return "No marks in this category.";
  }

  if (state.query || state.runnableOnly) {
    return "No matches for current filters.";
  }

  return "No marks found.";
}

function render() {
  if (!state.data) return;

  const visibleMap = getVisibleByCategory();
  updateCountText(visibleMap);

  if (state.activeCategory !== "All" && !state.data.categories.includes(state.activeCategory)) {
    state.activeCategory = "All";
  }

  renderTabs(visibleMap);

  refs.content.innerHTML = "";
  const categories = getVisibleCategories(visibleMap);

  if (categories.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = renderEmpty(visibleMap);
    refs.content.appendChild(empty);
    syncHash({ mark: undefined });
    return;
  }

  for (const category of categories) {
    const marks = visibleMap[category] ?? [];
    if (marks.length === 0) continue;

    const section = document.createElement("section");
    section.className = "section";

    const heading = document.createElement("h2");
    heading.className = "section-title";
    heading.textContent = category;

    const cards = document.createElement("div");
    cards.className = "cards";
    marks.forEach((mark) => cards.appendChild(renderCard(mark)));

    section.append(heading, cards);
    refs.content.appendChild(section);
  }

  const markId = markIdFromHash();
  if (markId) {
    const card = document.getElementById(`card-${markId}`);
    if (card) card.scrollIntoView({ block: "nearest" });
  }

  syncHash({ mark: markId || undefined });
}

async function load() {
  const response = await fetch("/api/marks");
  state.data = await response.json();

  applyHash();
  if (!state.data.runEnabled) {
    state.runnableOnly = false;
  }

  refs.runnableWrap.hidden = !state.data.runEnabled;
  refs.search.value = state.query;
  refs.runnableOnly.checked = state.runnableOnly;

  refs.search.addEventListener("input", () => {
    state.query = refs.search.value.trim();
    syncHash({ mark: undefined });
    render();
  });

  refs.runnableOnly.addEventListener("change", () => {
    state.runnableOnly = refs.runnableOnly.checked;
    syncHash({ mark: undefined });
    render();
  });

  window.addEventListener("hashchange", () => {
    if (state.hashSyncLock) return;
    applyHash();
    render();
  });

  render();
}

load().catch((error) => {
  refs.content.innerHTML = "";
  const empty = document.createElement("p");
  empty.className = "empty";
  empty.textContent = `Failed to load: ${error instanceof Error ? error.message : "unknown"}`;
  refs.content.appendChild(empty);
});

export const UNSAFE_ARG_PATTERN = /[;&|`$<>\\]/;
const FLAG_VALUE_ARITY = {
  "--co-author": 2,
  "--trailer": 2,
};

export function splitRepeatable(value) {
  return String(value)
    .split(/[,\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function buildArgs(mark, formState) {
  const args = [];
  const errors = [];
  const warnings = [];

  for (const arg of mark.args) {
    const rawValue = formState[arg.flag];

    if (!arg.takesValue) {
      const enabled = rawValue === true || rawValue === "true";
      if (arg.required && !enabled) {
        errors.push(`${arg.flag} is required`);
      }
      if (enabled) args.push(arg.flag);
      continue;
    }

    if (arg.repeatable) {
      const entries = splitRepeatable(rawValue ?? "");
      if (arg.required && entries.length === 0) {
        errors.push(`${arg.flag} is required`);
      }
      for (const entry of entries) {
        const expanded = expandValue(arg, entry, errors);
        if (!expanded) continue;
        args.push(arg.flag, ...expanded);
      }
      continue;
    }

    const value = String(rawValue ?? "").trim();
    if (arg.required && !value) {
      errors.push(`${arg.flag} is required`);
      continue;
    }
    if (value) {
      const expanded = expandValue(arg, value, errors);
      if (!expanded) continue;
      args.push(arg.flag, ...expanded);
    }
  }

  const repeatableFlags = new Set(mark.args.filter((arg) => arg.repeatable).map((arg) => arg.flag));
  const nonRepeatableCounts = new Map();
  for (const token of args) {
    if (!token.startsWith("-")) continue;
    if (repeatableFlags.has(token)) continue;
    nonRepeatableCounts.set(token, (nonRepeatableCounts.get(token) ?? 0) + 1);
  }
  for (const [flag, count] of nonRepeatableCounts.entries()) {
    if (count > 1) errors.push(`${flag} cannot be repeated`);
  }

  const unsafe = args.find((token) => UNSAFE_ARG_PATTERN.test(token));
  if (unsafe) {
    warnings.push(`Unsafe character detected in argument: ${unsafe}`);
  }

  return { args, errors, warnings };
}

export function buildCommand(mark, args) {
  const prefix = mark.runtime === "bun" ? `bun ${mark.script}` : mark.script;
  return [prefix, ...args.map(shellQuote)].join(" ");
}

export function shellQuote(token) {
  if (/^[a-zA-Z0-9._\/-]+$/.test(token)) return token;
  return `'${String(token).replace(/'/g, `'\\''`)}'`;
}

export function formatTimestamp(date = new Date()) {
  return date.toISOString().replace("T", " ").slice(0, 19) + " UTC";
}

function expandValue(arg, value, errors) {
  const arity = FLAG_VALUE_ARITY[arg.flag] ?? 1;
  if (arity === 1) return [value];

  const tokens = value.split(/\s+/).filter(Boolean);
  if (tokens.length < arity) {
    errors.push(`${arg.flag} requires ${arity} values`);
    return null;
  }

  if (arity === 2) {
    return [tokens[0], tokens.slice(1).join(" ")];
  }

  return tokens;
}

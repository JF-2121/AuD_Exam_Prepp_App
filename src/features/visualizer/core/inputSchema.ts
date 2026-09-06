import { msg, type StepText } from './types';

/**
 * Input validation for the visualizer's hand-editable JSON box.
 *
 * Every algorithm's `generateSteps` is written against one exact input shape, so an edit that
 * changes the shape — an array where an object belongs, a B-Tree node whose child count doesn't
 * match its key count — used to throw mid-render and take the whole page down to the error
 * boundary. A `Check` answers the same question *before* `generateSteps` runs, and returns a
 * translatable sentence naming the offending field instead of a stack trace.
 *
 * Like `StepText`, an issue is a catalogue key plus its vars rather than a finished sentence, so
 * validation stays locale-free and the page renders it in whichever language is active.
 */
export type InputIssue = StepText;

/** Validates one field's value. `field` is the name shown to the user when it fails. */
export type Check = (value: unknown, field: string) => InputIssue | null;

/**
 * Upper bound on any hand-typed list. Step lists grow quadratically for the O(n²) sorts and each
 * step carries a full copy of the state, so an accidental paste of a few hundred values would
 * freeze the tab rather than visualize anything.
 */
export const MAX_LIST = 64;

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/** A list of finite numbers, e.g. `[5, 3, 8]`. Empty is allowed — "no operations" is a valid run. */
export const numberList: Check = (value, field) => {
  if (!Array.isArray(value) || !value.every(isFiniteNumber)) {
    return msg('viz.input.numberList', { field });
  }
  if (value.length > MAX_LIST) return msg('viz.input.tooLong', { field, max: MAX_LIST });
  return null;
};

/** A list of non-empty strings, e.g. `["a", "b"]` — the alphabet symbols the string matchers scan. */
export const stringList: Check = (value, field) => {
  if (!Array.isArray(value) || !value.every((v) => typeof v === 'string' && v.length > 0)) {
    return msg('viz.input.stringList', { field });
  }
  if (value.length > MAX_LIST) return msg('viz.input.tooLong', { field, max: MAX_LIST });
  return null;
};

/** A list of whole numbers each within `[min, max]` — e.g. the decimal digits Rabin-Karp hashes. */
export function integerList(min: number, max: number): Check {
  return (value, field) => {
    if (
      !Array.isArray(value) ||
      !value.every((v) => isFiniteNumber(v) && Number.isInteger(v) && v >= min && v <= max)
    ) {
      return msg('viz.input.integerList', { field, min, max });
    }
    if (value.length > MAX_LIST) return msg('viz.input.tooLong', { field, max: MAX_LIST });
    return null;
  };
}

/** Wraps a list check to also reject the empty list, for fields a run cannot start without. */
export function nonEmpty(check: Check): Check {
  return (value, field) => {
    const issue = check(value, field);
    if (issue) return issue;
    if (Array.isArray(value) && value.length === 0) return msg('viz.input.nonEmpty', { field });
    return null;
  };
}

/** A whole number within `[min, max]`. */
export function integer(min: number, max: number): Check {
  return (value, field) => {
    if (!isFiniteNumber(value) || !Number.isInteger(value) || value < min || value > max) {
      return msg('viz.input.integerRange', { field, min, max });
    }
    return null;
  };
}

/** A string drawn from a fixed set — the graph algorithms' start node, for instance. */
export function oneOf(allowed: readonly string[]): Check {
  return (value, field) => {
    if (typeof value !== 'string' || !allowed.includes(value)) {
      return msg('viz.input.oneOf', { field, allowed: allowed.join(', ') });
    }
    return null;
  };
}

/**
 * Builds a validator for an object input: the value must be a plain object, and every listed field
 * must pass its own check. Reports the first failure, so the message always names one concrete
 * thing to fix rather than a list.
 */
export function shape(fields: Record<string, Check>): (input: unknown) => InputIssue | null {
  const names = Object.keys(fields);
  return (input) => {
    if (!isPlainObject(input)) return msg('viz.input.expectedObject', { fields: names.join(', ') });
    for (const name of names) {
      if (!(name in input)) return msg('viz.input.missingField', { field: name, fields: names.join(', ') });
      const issue = fields[name](input[name], name);
      if (issue) return issue;
    }
    return null;
  };
}

/** Wraps a single `Check` into a whole-input validator, for algorithms whose input is one value. */
export function only(check: Check, field = 'input'): (input: unknown) => InputIssue | null {
  return (input) => check(input, field);
}

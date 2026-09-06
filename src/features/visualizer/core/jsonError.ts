import { msg, type StepText } from './types';

/**
 * Turns a `JSON.parse` failure into something a person can act on.
 *
 * Hand-writing a nested B-Tree means balancing four levels of brackets in one line, and the
 * overwhelmingly common mistake is a `}` or `]` in the wrong place. "Invalid JSON" names none of
 * that, so this scans the text itself for the structural mistake — which yields a better sentence
 * *and* a better offset than the engine's own message — and falls back to the engine's position
 * only when the brackets do balance.
 */
export interface JsonProblem {
  /** What is wrong, as a catalogue key plus vars. */
  issue: StepText;
  /** 0-based offset the caret should point at, or `null` when nothing located it. */
  position: number | null;
}

interface Located {
  issue: StepText;
  position: number;
}

/**
 * Walks the text tracking bracket nesting, ignoring anything inside a string literal. Returns the
 * first structural mistake: a closer with no opener, a closer that doesn't match the opener it
 * lands on, an unterminated string, or openers still on the stack at the end.
 */
function scanBrackets(text: string): Located | null {
  const stack: { char: string; position: number }[] = [];
  let inString = false;
  let escaped = false;
  let stringStart = 0;
  // The last non-whitespace character seen outside a string, which is what makes a dangling comma
  // recognizable — the engine reports that one without any position at all.
  let previous: { char: string; position: number } | null = null;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === '"') {
        inString = false;
        previous = { char: '"', position: i };
      }
      continue;
    }
    if (c === '"') {
      inString = true;
      stringStart = i;
      continue;
    }
    if (/\s/.test(c)) continue;

    if (c === '{' || c === '[') {
      stack.push({ char: c, position: i });
    } else if (c === '}' || c === ']') {
      if (previous?.char === ',') {
        return { issue: msg('viz.input.jsonTrailingComma', { close: c }), position: previous.position };
      }
      const opener = stack.pop();
      const expected = c === '}' ? '{' : '[';
      if (!opener) return { issue: msg('viz.input.jsonStrayClose', { char: c }), position: i };
      if (opener.char !== expected) {
        return {
          issue: msg('viz.input.jsonMismatch', { close: c, open: opener.char, openPosition: opener.position + 1 }),
          position: i,
        };
      }
    } else if (c === ',' && (previous === null || previous.char === ',' || previous.char === '[' || previous.char === '{')) {
      return { issue: msg('viz.input.jsonEmptySlot'), position: i };
    }
    previous = { char: c, position: i };
  }

  if (inString) return { issue: msg('viz.input.jsonUnterminatedString'), position: stringStart };
  if (stack.length > 0) {
    const missing = stack
      .map((entry) => (entry.char === '{' ? '}' : ']'))
      .reverse()
      .join('');
    return { issue: msg('viz.input.jsonUnclosed', { missing, open: stack[0].char, position: stack[0].position + 1 }), position: stack[0].position };
  }
  return null;
}

/**
 * Digs an offset out of the engine's own message. V8 writes "at position 97", Firefox writes
 * "at line 1 column 98"; Safari gives neither, in which case there is simply no caret to draw.
 */
function enginePosition(text: string, error: unknown): number | null {
  const message = error instanceof Error ? error.message : '';
  const byPosition = /position (\d+)/.exec(message);
  if (byPosition) return Math.min(Number(byPosition[1]), Math.max(text.length - 1, 0));

  const byLineColumn = /line (\d+) column (\d+)/.exec(message);
  if (byLineColumn) {
    const lines = text.split('\n');
    const lineIndex = Math.min(Number(byLineColumn[1]) - 1, lines.length - 1);
    const offset = lines.slice(0, lineIndex).reduce((sum, l) => sum + l.length + 1, 0);
    return Math.min(offset + Number(byLineColumn[2]) - 1, Math.max(text.length - 1, 0));
  }
  return null;
}

export function describeJsonProblem(text: string, error: unknown): JsonProblem {
  const structural = scanBrackets(text);
  if (structural) return structural;

  const position = enginePosition(text, error);
  if (position === null) return { issue: msg('viz.invalidJson'), position: null };
  const { line, column } = lineAndColumn(text, position);
  return { issue: msg('viz.input.jsonAt', { line, column }), position };
}

function lineAndColumn(text: string, position: number): { line: number; column: number } {
  const before = text.slice(0, position);
  const line = before.split('\n').length;
  const column = position - (before.lastIndexOf('\n') + 1) + 1;
  return { line, column };
}

/** A window of the input around `position`, plus where the caret sits inside that window. */
export interface Excerpt {
  text: string;
  caret: number;
}

const WINDOW = 34;

/**
 * Cuts a fixed-width window around the offending character. Newlines and tabs become single
 * spaces so the caret below stays aligned — the substitution is 1:1, so offsets don't shift.
 */
export function excerptAround(text: string, position: number): Excerpt {
  const start = Math.max(0, position - WINDOW);
  const end = Math.min(text.length, position + WINDOW + 1);
  const body = text.slice(start, end).replace(/[\n\t\r]/g, ' ');
  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';
  return { text: prefix + body + suffix, caret: prefix.length + (position - start) };
}

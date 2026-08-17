/**
 * Minimal YAML-frontmatter parser for topic markdown files. Deliberately not a full YAML
 * parser (avoids gray-matter's Node `Buffer` dependency, which doesn't exist in the browser) —
 * supports exactly what content/README.md's schema uses: bare/quoted strings, numbers, and
 * single-line JSON array literals.
 */
export function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const [, frontmatter, content] = match;
  const data: Record<string, unknown> = {};

  for (const line of frontmatter.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) continue;
    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (rawValue.startsWith('[')) {
      data[key] = JSON.parse(rawValue);
    } else if (/^".*"$/.test(rawValue) || /^'.*'$/.test(rawValue)) {
      data[key] = rawValue.slice(1, -1);
    } else if (/^-?\d+(\.\d+)?$/.test(rawValue)) {
      data[key] = Number(rawValue);
    } else {
      data[key] = rawValue;
    }
  }

  return { data, content };
}

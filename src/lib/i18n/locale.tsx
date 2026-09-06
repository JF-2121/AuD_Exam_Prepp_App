import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { catalogues, en, type MessageKey } from './messages';

export type Locale = keyof typeof catalogues;
export const LOCALES: Locale[] = ['en', 'de'];

const STORAGE_KEY = 'aud-grind:locale';

export type Vars = Record<string, string | number>;
export type Translate = (key: MessageKey, vars?: Vars) => string;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Translate;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as string[]).includes(v);
}

/**
 * Initial locale: an explicit past choice wins, otherwise the browser's own preference — a German
 * browser lands on German without having to find the switch. Storage access is guarded because it
 * throws outright in some privacy modes.
 */
function initialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    /* storage blocked — fall through to the browser preference */
  }
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('de')) return 'de';
  return 'en';
}

/** Fills `{placeholder}` slots. A var that isn't supplied is left visible rather than silently blanked. */
function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* storage blocked — the choice just won't survive a reload */
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);

  const t = useCallback<Translate>(
    (key, vars) => {
      // `en` is the source of truth for the key set, so it is also the fallback if a catalogue
      // ever ends up missing an entry at runtime (e.g. a hand-edited build).
      const template = catalogues[locale][key] ?? en[key] ?? key;
      return interpolate(template, vars);
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside a LocaleProvider.');
  return ctx;
}

/** Convenience for the common case of only needing the translate function. */
export function useT(): Translate {
  return useLocale().t;
}

/**
 * Picks the `_one`/`_other` variant of a key. English and German share the same one/other split,
 * so a single rule covers both catalogues.
 */
export function plural(t: Translate, base: string, count: number, vars?: Vars): string {
  const key = `${base}_${count === 1 ? 'one' : 'other'}` as MessageKey;
  return t(key, { count, ...vars });
}

import { Languages } from 'lucide-react';
import { LOCALES, useLocale, type Locale } from '../lib/i18n/locale';

const LABEL: Record<Locale, string> = { en: 'EN', de: 'DE' };

/**
 * Sits at the end of the nav, next to Dashboard. A two-state segmented control rather than a
 * dropdown: with only two languages the current one and the alternative are both worth showing
 * at a glance, and switching is then a single tap.
 */
export function LanguageSwitch() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className="flex shrink-0 items-center gap-0.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] p-0.5"
      role="group"
      aria-label={t('lang.label')}
    >
      <Languages size={13} className="ml-1.5 mr-0.5 text-[var(--color-text-dim)]" aria-hidden />
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={active}
            aria-label={t(l === 'de' ? 'lang.switchToDe' : 'lang.switchToEn')}
            className={`min-h-8 rounded-[var(--radius-pill)] px-2 text-[11px] font-semibold tracking-wide transition-colors ${
              active
                ? 'bg-[var(--color-accent-fill)] text-[var(--color-on-accent-fill)]'
                : 'text-[var(--color-text-dim)] hover:text-white'
            }`}
          >
            {LABEL[l]}
          </button>
        );
      })}
    </div>
  );
}

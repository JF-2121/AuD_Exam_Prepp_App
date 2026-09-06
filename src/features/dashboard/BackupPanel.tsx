import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { downloadBackup, mergeBackup, parseBackupFile, type ImportSummary } from '../../lib/backup';
import { plural, useT, type Translate } from '../../lib/i18n/locale';
import { en as enMessages, type MessageKey } from '../../lib/i18n/messages';

type Status = { kind: 'idle' } | { kind: 'error'; message: string } | { kind: 'success'; summary: ImportSummary };

function summaryLine(s: ImportSummary, t: Translate): string {
  const parts: string[] = [];
  if (s.flashcardsUpdated) parts.push(plural(t, 'backup.flashcardsUpdated', s.flashcardsUpdated));
  if (s.quizAttemptsAdded) parts.push(plural(t, 'backup.quizAdded', s.quizAttemptsAdded));
  if (s.examAttemptsAdded) parts.push(plural(t, 'backup.examsAdded', s.examAttemptsAdded));
  if (s.reviewLogAdded) parts.push(plural(t, 'backup.reviewsAdded', s.reviewLogAdded));
  return parts.length ? parts.join(', ') + '.' : t('backup.nothingNew');
}

export function BackupPanel({ onImported }: { onImported: () => void }) {
  const t = useT();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    setBusy(true);
    try {
      await downloadBackup();
    } finally {
      setBusy(false);
    }
  }

  async function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    setBusy(true);
    setStatus({ kind: 'idle' });
    try {
      const backup = await parseBackupFile(file);
      const summary = await mergeBackup(backup);
      setStatus({ kind: 'success', summary });
      onImported();
    } catch (err) {
      const key = err instanceof Error ? err.message : '';
      const known = key in enMessages ? (key as MessageKey) : 'dash.importFailed';
      setStatus({ kind: 'error', message: t(known) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-5 sm:p-6">
      <h2 className="mb-1 text-sm font-semibold text-[var(--color-text-h)]">{t('dash.syncTitle')}</h2>
      <p className="mb-4 text-xs text-[var(--color-text-dim)]">
        {t('dash.syncBody')}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button className="btn" onClick={handleExport} disabled={busy}>
          <Download size={14} /> {t('dash.exportProgress')}
        </button>
        <button className="btn" onClick={() => fileInputRef.current?.click()} disabled={busy}>
          <Upload size={14} /> {t('dash.importProgress')}
        </button>
        <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleFileChosen} />
      </div>
      {status.kind === 'success' && (
        <p className="mt-3 text-xs text-[var(--color-good)]">{t('dash.imported', { summary: summaryLine(status.summary, t) })}</p>
      )}
      {status.kind === 'error' && <p className="mt-3 text-xs text-[var(--color-bad)]">{status.message}</p>}
    </div>
  );
}

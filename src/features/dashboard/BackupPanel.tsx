import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { downloadBackup, mergeBackup, parseBackupFile, type ImportSummary } from '../../lib/backup';

type Status = { kind: 'idle' } | { kind: 'error'; message: string } | { kind: 'success'; summary: ImportSummary };

function summaryLine(s: ImportSummary): string {
  const parts: string[] = [];
  if (s.flashcardsUpdated) parts.push(`${s.flashcardsUpdated} flashcard${s.flashcardsUpdated === 1 ? '' : 's'} updated`);
  if (s.quizAttemptsAdded) parts.push(`${s.quizAttemptsAdded} quiz attempt${s.quizAttemptsAdded === 1 ? '' : 's'} added`);
  if (s.examAttemptsAdded) parts.push(`${s.examAttemptsAdded} mock exam${s.examAttemptsAdded === 1 ? '' : 's'} added`);
  if (s.reviewLogAdded) parts.push(`${s.reviewLogAdded} review${s.reviewLogAdded === 1 ? '' : 's'} added to your streak`);
  return parts.length ? parts.join(', ') + '.' : 'Nothing new in that file — already up to date.';
}

export function BackupPanel({ onImported }: { onImported: () => void }) {
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
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Import failed.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-5 sm:p-6">
      <h2 className="mb-1 text-sm font-semibold text-[var(--color-text-h)]">Sync across your devices</h2>
      <p className="mb-4 text-xs text-[var(--color-text-dim)]">
        No accounts — export a file on one device, then import it on another to bring your flashcard progress, quiz
        history, and exam scores with you. Importing merges with what's already there; it never deletes anything.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button className="btn" onClick={handleExport} disabled={busy}>
          <Download size={14} /> Export progress
        </button>
        <button className="btn" onClick={() => fileInputRef.current?.click()} disabled={busy}>
          <Upload size={14} /> Import progress
        </button>
        <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleFileChosen} />
      </div>
      {status.kind === 'success' && (
        <p className="mt-3 text-xs text-[var(--color-good)]">Imported: {summaryLine(status.summary)}</p>
      )}
      {status.kind === 'error' && <p className="mt-3 text-xs text-[var(--color-bad)]">{status.message}</p>}
    </div>
  );
}

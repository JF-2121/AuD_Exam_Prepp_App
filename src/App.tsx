import { lazy, Suspense } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { BookOpen, CircleCheckBig, LayoutDashboard, ListChecks, Play, SquareStack, Sigma } from 'lucide-react';
import { loadExamTemplates, loadFlashcards, loadMcQuestions, loadQuestions, loadTopics } from './lib/contentLoader';
import { useLocale, useT } from './lib/i18n/locale';
import type { MessageKey } from './lib/i18n/messages';
import { LanguageSwitch } from './features/LanguageSwitch';

// Route-level code splitting: each tab's code (and its dependencies, e.g. react-markdown for
// Topics or every algorithm's generateSteps for Visualize) only loads when actually visited.
const TopicTree = lazy(() => import('./features/topics/TopicTree').then((m) => ({ default: m.TopicTree })));
const TopicPage = lazy(() => import('./features/topics/TopicPage').then((m) => ({ default: m.TopicPage })));
const VisualizerPage = lazy(() => import('./features/visualizer/VisualizerPage').then((m) => ({ default: m.VisualizerPage })));
const FlashcardReview = lazy(() => import('./features/flashcards/FlashcardReview').then((m) => ({ default: m.FlashcardReview })));
const QuizRunner = lazy(() => import('./features/quiz/QuizRunner').then((m) => ({ default: m.QuizRunner })));
const McPage = lazy(() => import('./features/mc/McPage').then((m) => ({ default: m.McPage })));
const ExamRunner = lazy(() => import('./features/exam/ExamRunner').then((m) => ({ default: m.ExamRunner })));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));

const navItems: { to: string; labelKey: MessageKey; icon: typeof BookOpen }[] = [
  { to: '/topics', labelKey: 'nav.topics', icon: BookOpen },
  { to: '/visualize', labelKey: 'nav.visualize', icon: Play },
  { to: '/flashcards', labelKey: 'nav.flashcards', icon: SquareStack },
  { to: '/mc', labelKey: 'nav.mc', icon: CircleCheckBig },
  { to: '/quiz', labelKey: 'nav.practice', icon: ListChecks },
  { to: '/exam', labelKey: 'nav.exam', icon: Sigma },
  { to: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
];

function PageFallback() {
  const t = useT();
  return <p className="text-sm text-[var(--color-text-dim)]">{t('app.loading')}</p>;
}

export default function App() {
  const { locale, t } = useLocale();
  // Content is keyed by id across locales, so switching language swaps the prose while every
  // saved attempt, SRS schedule and mastery score keeps pointing at the same items.
  const topics = loadTopics(locale);
  const flashcards = loadFlashcards(locale);
  const questions = loadQuestions(locale);
  const mcQuestions = loadMcQuestions(locale);
  const examTemplates = loadExamTemplates(locale);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col">
      <header className="nav-bar sticky top-0 z-10 flex items-center gap-3 px-4 sm:gap-6 sm:px-6">
        <Link
          to="/dashboard"
          className="flex shrink-0 items-center gap-2 text-[15px] font-semibold tracking-tight text-white"
        >
          <Sigma size={17} className="text-[var(--color-accent)]" strokeWidth={2.25} />
          {t('app.name')}
        </Link>
        <nav className="flex flex-1 gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex min-h-11 shrink-0 items-center gap-1.5 rounded-md px-3 text-xs tracking-tight transition-colors ${
                  isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-dim)] hover:text-white'
                }`
              }
            >
              <item.icon size={14} />
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>
        <LanguageSwitch />
      </header>
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 md:flex-row">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route
              path="/topics/:topicId?"
              element={
                <>
                  <aside className="w-full shrink-0 md:w-56">
                    <TopicTree topics={topics} />
                  </aside>
                  <main className="min-w-0 flex-1">
                    <TopicPage topics={topics} />
                  </main>
                </>
              }
            />
            <Route path="/visualize/:algoId?" element={<main className="min-w-0 flex-1"><VisualizerPage /></main>} />
            <Route path="/flashcards" element={<main className="min-w-0 flex-1"><FlashcardReview flashcards={flashcards} topics={topics} /></main>} />
            <Route path="/mc" element={<main className="min-w-0 flex-1"><McPage questions={mcQuestions} topics={topics} /></main>} />
            <Route path="/quiz" element={<main className="min-w-0 flex-1"><QuizRunner questions={questions} topics={topics} /></main>} />
            <Route path="/exam" element={<main className="min-w-0 flex-1"><ExamRunner examTemplates={examTemplates} questions={questions} topics={topics} /></main>} />
            <Route path="/dashboard" element={<main className="min-w-0 flex-1"><Dashboard topics={topics} flashcards={flashcards} /></main>} />
            <Route path="*" element={<main className="min-w-0 flex-1"><Dashboard topics={topics} flashcards={flashcards} /></main>} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

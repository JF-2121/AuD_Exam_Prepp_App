import { lazy, Suspense } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { BookOpen, LayoutDashboard, ListChecks, Play, SquareStack, Sigma } from 'lucide-react';
import { loadExamTemplates, loadFlashcards, loadQuestions, loadTopics } from './lib/contentLoader';

// Route-level code splitting: each tab's code (and its dependencies, e.g. react-markdown for
// Topics or every algorithm's generateSteps for Visualize) only loads when actually visited.
const TopicTree = lazy(() => import('./features/topics/TopicTree').then((m) => ({ default: m.TopicTree })));
const TopicPage = lazy(() => import('./features/topics/TopicPage').then((m) => ({ default: m.TopicPage })));
const VisualizerPage = lazy(() => import('./features/visualizer/VisualizerPage').then((m) => ({ default: m.VisualizerPage })));
const FlashcardReview = lazy(() => import('./features/flashcards/FlashcardReview').then((m) => ({ default: m.FlashcardReview })));
const QuizRunner = lazy(() => import('./features/quiz/QuizRunner').then((m) => ({ default: m.QuizRunner })));
const ExamRunner = lazy(() => import('./features/exam/ExamRunner').then((m) => ({ default: m.ExamRunner })));
const Dashboard = lazy(() => import('./features/dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));

const navItems = [
  { to: '/topics', label: 'Topics', icon: BookOpen },
  { to: '/visualize', label: 'Visualize', icon: Play },
  { to: '/flashcards', label: 'Flashcards', icon: SquareStack },
  { to: '/quiz', label: 'Practice', icon: ListChecks },
  { to: '/exam', label: 'Mock Exam', icon: Sigma },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

function PageFallback() {
  return <p className="text-sm text-[var(--color-text-dim)]">Loading…</p>;
}

export default function App() {
  const topics = loadTopics();
  const flashcards = loadFlashcards();
  const questions = loadQuestions();
  const examTemplates = loadExamTemplates();

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col">
      <header className="nav-bar sticky top-0 z-10 flex items-center gap-3 px-4 sm:gap-6 sm:px-6">
        <Link
          to="/dashboard"
          className="flex shrink-0 items-center gap-2 text-[15px] font-semibold tracking-tight text-white"
        >
          <Sigma size={17} className="text-[var(--color-accent)]" strokeWidth={2.25} />
          AuD Grind
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
              {item.label}
            </NavLink>
          ))}
        </nav>
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

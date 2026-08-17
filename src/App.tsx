import { NavLink, Route, Routes } from 'react-router-dom';
import { BookOpen, LayoutDashboard, ListChecks, Play, SquareStack, Sigma } from 'lucide-react';
import { loadExamTemplates, loadFlashcards, loadQuestions, loadTopics } from './lib/contentLoader';
import { TopicTree } from './features/topics/TopicTree';
import { TopicPage } from './features/topics/TopicPage';
import { VisualizerPage } from './features/visualizer/VisualizerPage';
import { FlashcardReview } from './features/flashcards/FlashcardReview';
import { QuizRunner } from './features/quiz/QuizRunner';
import { ExamRunner } from './features/exam/ExamRunner';
import { Dashboard } from './features/dashboard/Dashboard';

const navItems = [
  { to: '/topics', label: 'Topics', icon: BookOpen },
  { to: '/visualize', label: 'Visualize', icon: Play },
  { to: '/flashcards', label: 'Flashcards', icon: SquareStack },
  { to: '/quiz', label: 'Practice', icon: ListChecks },
  { to: '/exam', label: 'Mock Exam', icon: Sigma },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function App() {
  const topics = loadTopics();
  const flashcards = loadFlashcards();
  const questions = loadQuestions();
  const examTemplates = loadExamTemplates();

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col">
      <header className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 sm:gap-6 sm:px-6">
        <span className="flex shrink-0 items-center gap-1.5 font-semibold tracking-tight text-[var(--color-text-h)]">
          <Sigma size={17} className="text-[var(--color-accent)]" strokeWidth={2.5} />
          AuD Grind
        </span>
        <nav className="flex flex-1 gap-1 overflow-x-auto text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors ${
                  isActive
                    ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-dim)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]'
                }`
              }
            >
              <item.icon size={15} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 md:flex-row">
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
      </div>
    </div>
  );
}

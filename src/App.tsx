import { NavLink, Route, Routes } from 'react-router-dom';
import { loadExamTemplates, loadFlashcards, loadQuestions, loadTopics } from './lib/contentLoader';
import { TopicTree } from './features/topics/TopicTree';
import { TopicPage } from './features/topics/TopicPage';
import { VisualizerPage } from './features/visualizer/VisualizerPage';
import { FlashcardReview } from './features/flashcards/FlashcardReview';
import { QuizRunner } from './features/quiz/QuizRunner';
import { ExamRunner } from './features/exam/ExamRunner';
import { Dashboard } from './features/dashboard/Dashboard';

const navItems = [
  { to: '/topics', label: 'Topics' },
  { to: '/visualize', label: 'Visualize' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/quiz', label: 'Practice' },
  { to: '/exam', label: 'Mock Exam' },
  { to: '/dashboard', label: 'Dashboard' },
];

export default function App() {
  const topics = loadTopics();
  const flashcards = loadFlashcards();
  const questions = loadQuestions();
  const examTemplates = loadExamTemplates();

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col">
      <header className="flex items-center gap-6 border-b border-[var(--color-border)] px-6 py-3">
        <span className="font-semibold text-[var(--color-text-h)]">AuD Grind</span>
        <nav className="flex gap-4 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-dim)] hover:text-[var(--color-text)]')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <div className="flex flex-1 gap-6 p-6">
        <Routes>
          <Route
            path="/topics/:topicId?"
            element={
              <>
                <aside className="w-56 shrink-0">
                  <TopicTree topics={topics} />
                </aside>
                <main className="flex-1">
                  <TopicPage topics={topics} />
                </main>
              </>
            }
          />
          <Route path="/visualize/:algoId?" element={<main className="flex-1"><VisualizerPage /></main>} />
          <Route path="/flashcards" element={<main className="flex-1"><FlashcardReview flashcards={flashcards} topics={topics} /></main>} />
          <Route path="/quiz" element={<main className="flex-1"><QuizRunner questions={questions} topics={topics} /></main>} />
          <Route path="/exam" element={<main className="flex-1"><ExamRunner examTemplates={examTemplates} questions={questions} topics={topics} /></main>} />
          <Route path="/dashboard" element={<main className="flex-1"><Dashboard topics={topics} flashcards={flashcards} /></main>} />
          <Route path="*" element={<main className="flex-1"><Dashboard topics={topics} flashcards={flashcards} /></main>} />
        </Routes>
      </div>
    </div>
  );
}

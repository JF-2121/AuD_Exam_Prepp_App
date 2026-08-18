# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A student cramming for a specific course exam (currently "Algorithmen und Datenstrukturen" / AuD), studying solo, often on the go — checking topics, drilling flashcards, or running a quick quiz from a phone or tablet between other things, not only at a desk. Built as a general study tool: the intent is to reuse the same app shell for other courses/exams beyond AuD, not a one-off.

## Product Purpose

An all-in-one exam-prep app: browse topic summaries, watch interactive step-through algorithm visualizations, drill spaced-repetition flashcards, practice quiz questions, and sit timed mock exams — with a dashboard that surfaces weakest topics and a GitHub-style activity heatmap of study streak. Success is walking into the exam having actually seen the algorithms execute (not just memorized facts) and knowing which topics are still weak.

## Positioning

Two things a generic flashcard/quiz app (Anki, Quizlet) doesn't do, held equally: (1) interactive algorithm visualizers — sorting/tree/graph algorithms stepped through visually, not just described; (2) an integrated, exam-scoped workflow — topic summaries, flashcards, quiz, timed mock exam, mastery dashboard, and streak tracking all pulling from the same content and the same review history, rather than separate disconnected tools.

## Operating Context

- Deployed on Vercel, auto-deploying from `main`. Used on the go — phone and tablet are real, everyday access points, not edge cases.
- No backend, no accounts. All review history, quiz attempts, and mock exam scores are stored locally per-device via IndexedDB.
- Content is authored per-course into `content/` (topics, flashcards, questions, exam templates) from raw materials (slides/PDFs/past exams) in `raw-materials/`. The app only ever reads `content/` at runtime.
- New algorithm visualizers plug into `src/features/visualizer/` across three families (Sorting, Trees, Graphs) sharing common renderers.

## Capabilities and Constraints

- Static build (`npm run build` → `dist/`), no server-side logic required.
- Per-device local storage (IndexedDB) with a manual, account-free way to carry progress between devices: an export/import JSON backup (`src/lib/backup.ts`, surfaced on the Dashboard) that merges on import rather than overwriting. There is still no automatic/background sync — moving the file between devices is on the student.
- Since access is routinely from phone/tablet, layouts and interactions (including the algorithm visualizers) need to hold up at small viewport sizes, not just desktop.
- Currently scoped to one course (AuD) but built with the general study-tool intent in mind — course-specific content lives in data files, not hardcoded into app logic.

## Product Principles

- Seeing beats memorizing: algorithm visualizers are a first-class feature, not a bonus, and should stay as prominent as flashcards/quiz.
- One workflow, one history: topics, flashcards, quiz, exam, and dashboard should feel like one connected loop (shared content, shared progress data), not bolted-together tools.
- On-the-go first: usable well on a phone or tablet, since that's a routine real-world context, not just desktop.
- Local-first and account-free: no login friction, no network dependency to study — cross-device continuity is solved with a portable file the student controls, not a server.
- Reusable shell: keep course-specific identity (name, terminology, content) separable from the app framework so it can serve future courses.

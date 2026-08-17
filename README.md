# AuD Grind

A local study app for the "Algorithmen und Datenstrukturen" (AuD) final exam: browse topic summaries, watch interactive algorithm visualizations, drill spaced-repetition flashcards, practice quiz questions, and sit timed mock exams — with a dashboard that tracks your weakest topics.

## Running it

```bash
npm install
npm run dev
```

Open the printed `localhost` URL. No backend, no account, no internet connection needed — everything (your flashcard review history, quiz attempts, mock exam scores) is stored locally in your browser via IndexedDB.

## How the app is organized

- `content/` — all study material (topic summaries, flashcards, quiz questions, exam templates). This is the **only** thing the app reads at runtime. See `content/README.md` for the exact schema if you want to add material yourself.
- `raw-materials/` — drop unprocessed PDFs/slides here. The app never reads this folder directly; it's the inbox a future Claude session works from to author real content into `content/`.
- `src/features/` — one folder per app module: `topics`, `visualizer`, `flashcards`, `quiz`, `exam`, `dashboard`.
- `src/lib/` — shared logic: content loading, IndexedDB persistence, the SM-2 spaced-repetition scheduler, and dashboard mastery scoring.

## Adding an interactive algorithm visualizer

New algorithms plug into the framework in `src/features/visualizer/`:

1. Write a `generateSteps(input) -> AlgorithmStep[]` function (see `algorithms/sorting/insertionSort.ts` for a simple example, or `algorithms/trees/bstInsert.ts` for a tree-shaped one).
2. Reuse an existing `Renderer` (`ArrayRenderer` for array-shaped state, `TreeRenderer` for tree-shaped state) if your state shape matches — this is the common case and needs zero new UI code.
3. Register it in `src/features/visualizer/registry.ts`.

## Deploying

The app is a static build — `npm run build` outputs a self-contained `dist/` folder.

- **Render / Vercel / Netlify**: point the build command at `npm run build`, publish directory `dist`, no server-side config needed.
- **GitHub Pages** (project site, e.g. `username.github.io/AuD_Grind`): build with the repo name as the base path, then publish `dist/` to the `gh-pages` branch (e.g. via the `gh-pages` npm package or a GitHub Actions workflow):
  ```bash
  VITE_BASE_PATH=/AuD_Grind/ npm run build
  ```

## Current content coverage

18 topics across Grundlagen, Sorting, Basic Data Structures, Trees, Graphs, Advanced Design, and Complexity Theory — sourced from the course's typed summary, the shared Anki deck, exercise sheets, and a past exam + exam memory protocol. 6 algorithms have interactive step-through visualizers (Insertion/Bubble/Selection/Merge Sort, Quicksort, BST Insert). See `content/README.md` for how to extend this as more raw material comes in.

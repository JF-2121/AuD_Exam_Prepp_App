# AuD Grind

A local study app for the "Algorithmen und Datenstrukturen" (AuD) final exam: browse topic summaries, watch interactive algorithm visualizations, drill spaced-repetition flashcards, practice quiz questions, and sit timed mock exams — with a dashboard that tracks your weakest topics and a GitHub-style activity heatmap of your study streak.

**Live on Vercel**, auto-deploying from `main` on every push.

## Running it

```bash
npm install
npm run dev
```

Open the printed `localhost` URL. No backend, no account, no internet connection needed — everything (your flashcard review history, quiz attempts, mock exam scores) is stored locally in your browser via IndexedDB. Click the "AuD Grind" logo any time to jump back to the dashboard.

## How the app is organized

- `content/` — all study material (topic summaries, flashcards, quiz questions, exam templates). This is the **only** thing the app reads at runtime. See `content/README.md` for the exact schema if you want to add material yourself.
- `raw-materials/` — drop unprocessed PDFs/slides here. The app never reads this folder directly; it's the inbox a future Claude session works from to author real content into `content/`.
- `src/features/` — one folder per app module: `topics`, `visualizer`, `flashcards`, `quiz`, `exam`, `dashboard`.
- `src/lib/` — shared logic: content loading, IndexedDB persistence, the SM-2 spaced-repetition scheduler, dashboard mastery scoring, and the activity-heatmap date bucketing.

## Adding an interactive algorithm visualizer

New algorithms plug into the framework in `src/features/visualizer/`, grouped into three families (`Sorting`, `Trees`, `Graphs` — see `AlgorithmFamily` in `core/types.ts`) that the picker page and the exam-style dropdown both group by automatically:

1. Write a `generateSteps(input) -> AlgorithmStep[]` function. See `algorithms/sorting/insertionSort.ts` for a simple array-based example, `algorithms/trees/bstInsert.ts` / `bstDelete.ts` / `rbtInsert.ts` / `rbtDelete.ts` for tree-shaped ones (the RBT variants track node color and use a `TreeRenderer` that colors red/black nodes automatically), or `algorithms/graphs/dijkstra.ts` / `kruskal.ts` for graph algorithms sharing one fixed example graph (`algorithms/graphs/graphData.ts`) and a common `GraphRenderer`.
2. Reuse an existing `Renderer` if your state shape matches — this is the common case and needs zero new UI code.
3. Add a `family` and register it in `src/features/visualizer/registry.ts`.

## IndexedDB persistence — a gotcha worth knowing

The database schema is versioned (`src/lib/db.ts`). If you bump the version, be aware that `indexedDB.open()` can hang indefinitely in a browser tab if *another* tab still holds an older-version connection open — the upgrade transaction simply never fires until that tab closes. The app guards against this two ways: it self-closes its own connection when a newer version tries to open elsewhere (the `blocking` handler), and every read wrapped in `withTimeout()` falls back to an empty result after 4s instead of hanging the UI forever. If data ever looks stuck or stale, close other tabs of the app and reload.

## Deploying

The app is a static build — `npm run build` outputs a self-contained `dist/` folder.

- **Vercel** (current setup): imports the GitHub repo directly, framework auto-detected as Vite, `vercel.json` adds the SPA rewrite so deep links (e.g. `/topics/bst`) don't 404 on refresh.
- **Render / Netlify**: point the build command at `npm run build`, publish directory `dist`, no server-side config needed.
- **GitHub Pages** (project site, e.g. `username.github.io/AuD_Grind`): build with the repo name as the base path, then publish `dist/` to the `gh-pages` branch:
  ```bash
  VITE_BASE_PATH=/AuD_Grind/ npm run build
  ```

## Current content coverage

18 topics across Grundlagen, Sorting, Basic Data Structures, Trees, Graphs, Advanced Design, and Complexity Theory — sourced from the course's typed summaries, the shared Anki deck, exercise sheets, and a past exam + exam memory protocol (including real "choose exactly 2 of 4" multiple-choice questions in their original format). 11 algorithms have interactive step-through visualizers:

- **Sorting**: Insertion, Bubble, Selection, Merge Sort, Quicksort
- **Trees**: BST Insert & Delete, Red-Black Tree Insert & Delete (full fixup with rotations/recoloring)
- **Graphs**: Dijkstra's Algorithm, Kruskal's Algorithm (MST)

See `content/README.md` for how to extend content as more raw material comes in.

# AuD Grind

A local study app for the "Algorithmen und Datenstrukturen" (AuD) final exam: browse topic summaries, watch interactive algorithm visualizations, drill spaced-repetition flashcards, practice quiz questions, and sit timed mock exams — with a dashboard that tracks your weakest topics and a GitHub-style activity heatmap of your study streak.

No backend, no account, nothing to pay for or sign up to. Everything runs entirely in your own browser, and every copy is independent — see "Get your own copy" below.

## Get your own copy

You don't need to know how to code to use this. Pick whichever of the two feels easier:

- **Just want it on your own computer, nothing online?** → [Run it locally](#run-it-locally). Takes about 5 minutes the first time.
- **Want a real web link you can open from your phone, bookmark, or send to a friend?** → [Get your own hosted copy](#get-your-own-hosted-copy-self-host). One click, no terminal needed, free.

You can do either, both, or neither first — they don't depend on each other.

### Run it locally

**1. Install Node.js** (skip this if you already have it — check by opening a terminal and typing `node -v`; if you see a version number like `v20.x.x`, you're set).

Go to **[nodejs.org](https://nodejs.org)**, download the **LTS** version for your operating system, and run the installer (click Next/Continue through the defaults — nothing to configure).

**2. Get the code onto your computer.** Two ways, pick whichever you're comfortable with:

- **No terminal experience?** On this repo's GitHub page, click the green **`Code`** button → **`Download ZIP`**, then unzip it anywhere (e.g. your Desktop).
- **Comfortable with a terminal?**
  ```bash
  git clone https://github.com/JF-2121/AuD_Exam_Prepp_App.git
  cd AuD_Exam_Prepp_App
  ```

**3. Open a terminal in that folder.**

- **Windows**: open the unzipped folder in File Explorer, click the address bar, type `cmd`, press Enter.
- **Mac**: open the unzipped folder in Finder, right-click it → `New Terminal at Folder` (or open Terminal and type `cd ` then drag the folder in).

**4. Run these two commands:**

```bash
npm install
npm run dev
```

The first one only needs to happen once (it downloads everything the app needs); the second one starts the app. Wait for a line like `Local: http://localhost:5173/` to appear, then open that address in your browser.

That's it — the app is now running entirely on your machine. To stop it, go back to the terminal and press `Ctrl+C`. To run it again later, you only need step 4's second command (`npm run dev`) from inside the folder.

**Nothing is ever sent anywhere.** No internet connection is needed once it's running (except the very first load, to fetch fonts); all your progress lives in your browser via IndexedDB — see "Syncing progress across devices" below for moving it between your own devices.

### Get your own hosted copy (self-host)

This gives you a real `https://` link — like the one this project already runs on — that works from any device, with nothing installed. Every person who does this gets their **own independent copy** with their **own web address**; nobody else's progress or changes affect yours.

You'll need a free GitHub account (to hold your copy of the code) and one of these:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/JF-2121/AuD_Exam_Prepp_App)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/JF-2121/AuD_Exam_Prepp_App)

Click either button and follow the prompts — it walks you through signing in with GitHub, copying the repo into your own account, and deploying it. No configuration needed (this repo already has everything both platforms need to build it correctly); no terminal, no `npm install`, none of the steps above. A couple of minutes later you'll have a live link.

Once it's live, that link **is** the app — anyone with it (including you, on any device) can open it in a browser. It updates itself automatically whenever the underlying code changes, the same way the original does.

## Syncing progress across devices

There's no account and no server, so progress stays on whichever device studied it — by design (see Product Principles in `PRODUCT.md`). To carry it to another device (or share the app with a classmate who wants their *own* progress to follow them too), the Dashboard has a "Sync across your devices" panel:

- **Export progress** downloads a JSON file (`aud-grind-progress-<date>.json`) with your flashcard SRS state, quiz attempts, exam attempts, and review history.
- **Import progress** on another device reads that file and **merges** it into whatever's already there — it never wipes local data. Spaced-repetition state keeps whichever side reviewed a card more recently; quiz/exam/review history is deduplicated by content, so importing the same file twice (or a file with overlapping history) is safe and won't double-count stats.

Move the file over however you'd move any file — AirDrop, a cloud drive, email to yourself, USB. The logic lives in `src/lib/backup.ts`; the UI is `src/features/dashboard/BackupPanel.tsx`.

## How the app is organized

- `content/` — all study material (topic summaries, flashcards, quiz questions, exam templates). This is the **only** thing the app reads at runtime. See `content/README.md` for the exact schema if you want to add material yourself.
- `raw-materials/` — drop unprocessed PDFs/slides here. The app never reads this folder directly; it's the inbox a future Claude session works from to author real content into `content/`. (Empty as of this writing — nothing has been dropped in yet.)
- `src/features/` — one folder per app module: `topics`, `visualizer`, `flashcards`, `quiz`, `exam`, `dashboard`.
- `src/lib/` — shared logic: content loading, IndexedDB persistence, the SM-2 spaced-repetition scheduler, dashboard mastery scoring, and the activity-heatmap date bucketing.
- `PRODUCT.md` — durable product context (users, purpose, positioning, constraints) for design/dev tooling that reads it (see `.claude/skills/impeccable/`). Not read by the app itself.
- `design/` — a separate, standalone design-system reference (`design/PRODUCT.md` + `design/DESIGN.md`): a full breakdown of Apple's website (colors, type scale, spacing, component grammar, elevation rules, do's/don'ts) produced by analyzing apple.com. This app's current visual theme is a **dark-mode translation** of that system, not a copy of the folder's own (light-dominant) docs — see "Design system" below. Also not read by the app itself; it's design-tooling input only.

## Design system

The current theme (`src/index.css`) translates `design/DESIGN.md` — Apple's documented design language — into a single persistent dark canvas, since this is a dense study tool with no product photography to alternate light/dark sections around like the source marketing site does.

- **Two blues, on purpose.** Action Blue (`#0066cc`, `--color-accent-fill`) fills anything with text/icons sitting on top of it (buttons, the readiness progress bar, selected states) — it's dark enough to carry white text at AA contrast. Sky Link Blue (`#2997ff`, `--color-accent`) is for text/icons/links/borders sitting directly on the dark canvas, exactly per the source doc's own rule: Action Blue "disappears" as plain foreground content on a dark surface. Mixing these up (e.g. white text on `--color-accent`) fails contrast — check `--color-accent-fill` is used for anything filled.
- **Type**: `-apple-system, BlinkMacSystemFont` first (real San Francisco on Mac/iPhone/iPad), Inter as the doc's own named open-source substitute. Body runs at 17px/1.47 per the doc's explicit "not 16px" rule. Weight ladder is 300/400/600/700 — **weight 500 never appears anywhere**, by the source doc's own rule.
- **Shape**: two button grammars — full pill (`--radius-pill`) for the one primary action per screen (`.btn-primary`), compact 8px-radius rects for everything else (`.btn`). Cards use `--radius-card` (18px).
- **Elevation is flat.** No shadows on cards, buttons, or text — only a surface-color step (`--color-bg` → `--color-surface`) plus a 1px hairline border, per the source doc's "shadow is reserved for product photography" rule (which this app has none of, so no shadows appear at all).
- **Semantic colors** (correct/incorrect, difficulty badges, algorithm-visualizer node states) aren't in the source doc — it's a marketing site with no error states — so these are drawn from Apple's own real dark-mode system palette (system green/orange/red) instead of invented from scratch, then adjusted for AA contrast.
- Every color/radius/font is a CSS custom property in `src/index.css`'s `@theme` block — change the look by changing tokens there, not by hunting hex values through components.

## Gotchas worth knowing

**IndexedDB versioning.** The database schema is versioned (`src/lib/db.ts`). If you bump the version, be aware that `indexedDB.open()` can hang indefinitely in a browser tab if *another* tab still holds an older-version connection open — the upgrade transaction simply never fires until that tab closes. The app guards against this two ways: it self-closes its own connection when a newer version tries to open elsewhere (the `blocking` handler), and every read wrapped in `withTimeout()` falls back to an empty result after 4s instead of hanging the UI forever. If data ever looks stuck or stale, close other tabs of the app and reload.

**Native `<select>` styling.** Every dropdown in the app (topic filter, algorithm picker, playback speed, quiz filters, exam template picker) shares the `.input` class, but a plain `<select>` ignores most of that styling by default — the browser draws its own OS chrome (gradient background, arrow spinner) unless `appearance` is explicitly stripped. `select.input` in `src/index.css` handles this: `appearance: none` plus a hand-drawn SVG chevron positioned to clear the pill radius. If a new `<select>` looks like unstyled browser chrome, it's missing the `.input` class (or something is overriding `appearance`).

## Adding an interactive algorithm visualizer

New algorithms plug into the framework in `src/features/visualizer/`, grouped into three families (`Sorting`, `Trees`, `Graphs` — see `AlgorithmFamily` in `core/types.ts`) that the picker page and the exam-style dropdown both group by automatically:

1. Write a `generateSteps(input) -> AlgorithmStep[]` function. See `algorithms/sorting/insertionSort.ts` for a simple array-based example, `algorithms/trees/bstInsert.ts` / `bstDelete.ts` / `rbtInsert.ts` / `rbtDelete.ts` for tree-shaped ones (the RBT variants track node color and use a `TreeRenderer` that colors red/black nodes automatically), or `algorithms/graphs/dijkstra.ts` / `kruskal.ts` for graph algorithms sharing one fixed example graph (`algorithms/graphs/graphData.ts`) and a common `GraphRenderer`.
2. Reuse an existing `Renderer` if your state shape matches — this is the common case and needs zero new UI code.
3. Add a `family` and register it in `src/features/visualizer/registry.ts`.

## Deploying (more options / more detail)

The "Get your own hosted copy" buttons above are the easiest path. This section is the deeper reference — for tweaking the Vercel/Netlify setup, using a different host, or building manually.

The app is a static build — `npm run build` outputs a self-contained `dist/` folder that any static host can serve.

- **Vercel** (what the buttons above use): imports the GitHub repo directly, framework auto-detected as Vite, `vercel.json` adds the SPA rewrite so deep links (e.g. `/topics/bst`) don't 404 on refresh.
- **Render**: point the build command at `npm run build`, publish directory `dist`, no server-side config needed.
- **GitHub Pages** (project site, e.g. `username.github.io/AuD_Exam_Prepp_App`) — more manual than the buttons above, needs the terminal: build with the repo name as the base path, then publish `dist/` to the `gh-pages` branch:
  ```bash
  VITE_BASE_PATH=/AuD_Exam_Prepp_App/ npm run build
  ```

## Current content coverage

18 topics across Grundlagen, Sorting, Basic Data Structures, Trees, Graphs, Advanced Design, and Complexity Theory — sourced from the course's typed summaries, the shared Anki deck, exercise sheets, and a past exam + exam memory protocol (including real "choose exactly 2 of 4" multiple-choice questions in their original format). 17 algorithms have interactive step-through visualizers:

- **Sorting**: Insertion, Bubble, Selection, Merge Sort, Quicksort
- **Trees**: BST Insert & Delete, Red-Black Tree Insert & Delete (full fixup with rotations/recoloring), AVL Tree Insert & Delete (height/balance-factor tracking, single & double rotations)
- **Graphs**: BFS, DFS, Dijkstra's Algorithm, Bellman-Ford, Kruskal's Algorithm (MST), Prim's Algorithm (MST)

Not yet covered by a visualizer (they need a directed-graph example and, for the last one, a flow-network data model — bigger separate additions): Topological Sort, Strongly Connected Components, DAG Shortest Paths, A* Search, Ford-Fulkerson Max Flow. Binary heaps / heap sort (under AVL Trees & Heaps) are also unvisualized.

See `content/README.md` for how to extend content as more raw material comes in.

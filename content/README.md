# Content authoring contract

This folder is the **only** thing the app reads at runtime (via `import.meta.glob` in `src/lib/contentLoader.ts`).
Raw, unprocessed course material (PDFs, slides, scans) lives in `../raw-materials/` and is never read by the app directly —
it's the source a Claude session works from when authoring files here.

Adding content never requires touching app code. Drop a new file, or append to an existing one.

## Topics — `content/topics/<id>.md`

One file per topic. Filename (minus `.md`) **must** equal the `id` in the frontmatter.

```markdown
---
id: sorting-basics
title: "Sorting Algorithms"
category: "Sorting"
order: 1
relatedAlgorithmIds: ["bubble-sort"]   # ids from src/features/visualizer/registry.ts, optional
sourceFiles: ["Sortierverfahren_Folien.pdf"]  # optional, for traceability back to raw-materials/
---

Markdown body here. This is what renders on the topic page.
```

`category` groups topics in the left nav. `order` controls sort order within a category.

## Flashcards — `content/flashcards/<topicId>.json`

One file per topic, an array. Append to the array for more cards on an existing topic; create a new file for a new topic.

```json
[
  { "id": "sort-fc-1", "topicId": "sorting-basics", "front": "Question/prompt", "back": "Answer", "tags": ["complexity"] }
]
```

ID convention: `<topicId short>-fc-<n>`, unique across the whole app.

## Questions — `content/questions/<topicId>.json`

One file per topic, an array of a discriminated union on `type`. Two types live here;
**multiple-choice questions live in `content/mc/` instead** (see below).

**short-answer** (case-insensitive, whitespace-normalized match against any of `acceptedAnswers`)
```json
{ "id": "sort-q-2", "topicId": "sorting-basics", "type": "short-answer", "difficulty": "medium",
  "prompt": "...", "acceptedAnswers": ["O(n)", "n"], "explanation": "..." }
```

**trace** (student predicts final state after running an algorithm on `initialInput`; graded by re-running the
visualizer's own `generateSteps`/`extractResult` for `algorithmId`, so grading can never drift from the visualizer —
`expectedFinalOutput` is documentation only, not used for grading)
```json
{ "id": "bst-q-1", "topicId": "bst", "type": "trace", "difficulty": "hard",
  "prompt": "Insert 5,3,8,1,4 into an empty BST. Give the in-order traversal.",
  "algorithmId": "bst-insert", "initialInput": [5,3,8,1,4], "expectedFinalOutput": [1,3,4,5,8],
  "explanation": "..." }
```

`difficulty` is one of `easy | medium | hard`. ID convention: `<topicId short>-q-<n>`.

## Multiple choice — `content/mc/<topicId>.json`

The MC compendium powering the **Multiple Choice** tab. It gets its own folder because the MC
section is 42 of the real exam's 100 points — the single largest block on the paper — and because
every entry here follows the exam's own format, which the general question bank does not.

`loadMcQuestions()` reads this folder; `loadQuestions()` merges it into the general pool, so
Practice and Mock Exam draw from these questions too. Adding a file here needs no code changes.

```json
[
  { "id": "sort-q-1", "topicId": "sorting-basics", "type": "multiple-choice", "difficulty": "easy",
    "prompt": "Statements about Merge Sort — which two are correct?",
    "options": ["A", "B", "C", "D"], "correctIndexes": [0, 2],
    "explanation": "Why each of the four options is true or false.",
    "source": "Gedächtnisprotokoll SoSe 2025 · MC II.5" }
]
```

**Authoring contract** (all of it enforced by the app's assumptions, so keep to it):

- **Exactly 4 options**, written as *declarative statements* about the topic — the exam's style,
  not "which of these is the answer to…" with sentence-fragment options.
- **`correctIndexes` has length 1 or 2**, and nothing else:
  - **1 → the exam's Part I**, "genau *eine* der vier Aussagen ist richtig", worth **1 point**.
  - **2 → the exam's Part II**, "genau *zwei* der vier Aussagen sind richtig", worth **2 points**,
    awarded **only if exactly both** are marked. One right and one wrong scores **0, not 1**.
- **Prefer 2-of-4.** Part II is 36 of the section's 42 points, so the bank is weighted heavily
  toward it (currently 129 of 186 questions).
- **`explanation` accounts for all four options**, not just the correct ones — the convention is
  ✓ for each true statement and ✗ for each false one.
- **`source`** attributes the question, e.g. `"Gedächtnisprotokoll SoSe 2025 · MC II.5"`,
  `"Altklausur WS23/24 · Aufgabe 3.3.2"`, `"AuD-Zusammenfassung §6.2"`. It is shown in the
  compendium and is searchable.
- **No trace-shaped questions.** Anything whose answer is a produced data structure — a sorted
  array, a tree after an insertion, a traversal output — belongs in `content/questions/` as a
  `trace` question, not here.
- Filename (minus `.json`) must equal every entry's `topicId`. IDs must be unique app-wide;
  the convention is `<topic short>-mc-<n>` for new questions (`real-*` marks verbatim
  reconstructions of real exam questions).

## Exam templates — `content/examTemplates.json`

A single array (this is the one file that isn't per-topic). Each template assembles a mock exam at runtime by
randomly sampling from the question bank per section — no exam content is pre-baked, so templates stay valid as
more questions get added.

```json
[
  { "id": "mock-1", "title": "Mock Exam 1", "durationMinutes": 60,
    "sections": [
      { "topicIds": ["sorting-basics"], "count": 3 },
      { "topicIds": ["bst"], "count": 2, "difficulty": "hard" }
    ] }
]
```

## Localization — `de/` subfolders

The app is bilingual (DE/EN, switched in the header). UI text lives in `src/lib/i18n/`; **content**
is localized here, by dropping a German file alongside the English one:

| English | German |
|---|---|
| `content/topics/<id>.md` | `content/topics/de/<id>.md` |
| `content/mc/<topicId>.json` | `content/mc/de/<topicId>.json` |
| `content/flashcards/<topicId>.json` | `content/flashcards/de/<topicId>.json` |
| `content/questions/<topicId>.json` | `content/questions/de/<topicId>.json` |
| `content/examTemplates.json` | `content/examTemplates.de.json` |

`contentLoader.ts` **overlays the German file onto the English one field by field**, matching items
by `id`. Three consequences worth knowing:

1. **Same `id` = same item.** SRS schedules, quiz attempts and mastery scores are keyed by id, so
   switching language swaps the prose while every bit of saved progress keeps pointing at the same
   questions. Never renumber ids when translating.
2. **Omitted or empty fields fall back to English.** A German file may carry only the fields that
   have actually been translated — which is what makes partial translation safe. The German topic
   files, for instance, carry only frontmatter; their bodies fall back to the English prose.
3. **Never translate the answer key.** A German MC file must contain `id`, `prompt`, `options`,
   `explanation` and `source` — and must *not* contain `correctIndexes`, `type`, `topicId` or
   `difficulty`. Those are inherited, which means **the four options must stay in the same order as
   the English file**, or the inherited `correctIndexes` would point at the wrong statements.

Current coverage: UI 100%, visualizer step descriptions 100%, MC compendium 100% (186/186), topic
titles and exam-template titles 100%. Topic bodies, flashcards and short-answer/trace questions
still fall back to English.

## Registering a new visualizable algorithm

Adding an algorithm (not just content) does require code: a `generateSteps` function under
`src/features/visualizer/algorithms/<family>/`, reusing an existing `Renderer` (`ArrayRenderer`, `TreeRenderer`, ...)
where the state shape matches, and one line added to `src/features/visualizer/registry.ts`. See `bubbleSort.ts` and
`bstInsert.ts` for the pattern.

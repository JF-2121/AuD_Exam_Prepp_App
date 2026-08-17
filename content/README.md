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

One file per topic, an array of a discriminated union on `type`. Three types:

**multiple-choice**
```json
{ "id": "sort-q-1", "topicId": "sorting-basics", "type": "multiple-choice", "difficulty": "easy",
  "prompt": "...", "options": ["A", "B", "C"], "correctIndex": 1, "explanation": "..." }
```

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

## Registering a new visualizable algorithm

Adding an algorithm (not just content) does require code: a `generateSteps` function under
`src/features/visualizer/algorithms/<family>/`, reusing an existing `Renderer` (`ArrayRenderer`, `TreeRenderer`, ...)
where the state shape matches, and one line added to `src/features/visualizer/registry.ts`. See `bubbleSort.ts` and
`bstInsert.ts` for the pattern.

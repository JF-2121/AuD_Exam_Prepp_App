/**
 * The English catalogue is the source of truth: `MessageKey` is derived from it, so `de` below is
 * type-checked to contain exactly the same keys — a missing or stray German string is a build
 * error, not a silently untranslated label at runtime.
 *
 * Placeholders are `{name}` and are filled by `t(key, vars)`.
 */
import { vizDe, vizEn } from './vizMessages';

const uiEn = {
  // --- app chrome ---------------------------------------------------------
  'app.name': 'AuD Grind',
  'app.loading': 'Loading…',
  'error.title': 'Something went wrong on this page.',
  'error.body':
    'The rest of the app is unaffected — your progress is safe. This usually means the input for this view was an unexpected shape.',
  'error.retry': 'Try again',
  'error.details': 'Technical details',
  'nav.topics': 'Topics',
  'nav.visualize': 'Visualize',
  'nav.flashcards': 'Flashcards',
  'nav.mc': 'Multiple Choice',
  'nav.practice': 'Practice',
  'nav.exam': 'Mock Exam',
  'nav.dashboard': 'Dashboard',
  'lang.label': 'Language',
  'lang.switchToDe': 'Switch to German',
  'lang.switchToEn': 'Switch to English',

  // --- shared vocabulary --------------------------------------------------
  'common.allTopics': 'All topics',
  'common.anyDifficulty': 'Any difficulty',
  'common.easy': 'easy',
  'common.medium': 'medium',
  'common.hard': 'hard',
  'common.submit': 'Submit',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.points': 'points',
  'common.point': 'point',
  'common.pointsShort': 'P',
  'common.correct': 'Correct',
  'common.incorrect': 'Incorrect',
  'common.of': 'of',

  // --- topic categories (authored in content frontmatter, shown in the tree) ---
  'category.Grundlagen': 'Fundamentals',
  'category.Sorting': 'Sorting',
  'category.Basic Data Structures': 'Basic Data Structures',
  'category.Trees': 'Trees',
  'category.Graphs': 'Graphs',
  'category.Advanced Design': 'Advanced Design',
  'category.Complexity Theory': 'Complexity Theory',
  'category.String Algorithms': 'String Algorithms',

  // --- topics -------------------------------------------------------------
  'topics.pickPrompt': 'Pick a topic from the left to get started.',
  'topics.notFound': 'Topic not found.',
  'topics.practiceThis': 'Practice this topic',
  'topics.reviewFlashcards': 'Review flashcards',

  // --- visualizer ---------------------------------------------------------
  'viz.title': 'Visualize',
  'viz.subtitle': 'Pick an algorithm to step through interactively.',
  'viz.inputLabel': 'Input (JSON):',
  'viz.resetDefault': 'Reset to default',
  'viz.format': 'Format',
  'viz.formatHint': 'Spread the JSON over indented lines, so the nesting is visible while you edit.',
  'viz.invalidJson': 'Invalid JSON input.',
  'viz.inputProblem': 'This input does not fit this algorithm',
  'viz.inputUnusable':
    'This algorithm cannot run on that input. Reset to the default and change it one field at a time.',

  // --- visualizer: what each algorithm's input box expects ------------------
  'viz.hint.numberList': 'A list of numbers, inserted left to right — e.g. [8, 3, 10, 1, 6].',
  'viz.hint.initialDeletions':
    '{"initial": [\u2026], "deletions": [\u2026]} — the tree is built from "initial", then those keys are removed in order.',
  'viz.hint.heapExtract':
    '{"initial": [\u2026], "extractCount": n} — heapify "initial", then extract the max n times.',
  'viz.hint.splayInsert': '{"seed": [\u2026], "insertions": [\u2026]} — "seed" builds the starting tree, then each insertion splays.',
  'viz.hint.splayDelete':
    '{"seed": [\u2026], "insertions": [\u2026], "searches": [\u2026], "deletions": [\u2026]} — run in that order.',
  'viz.hint.radixSort': '{"values": ["54", "24"], "radix": 8} — the numerals are written in that base, so base 8 allows digits 0\u20137.',
  'viz.hint.stringMatch': '{"text": ["a", "b"], "pattern": ["a"]} — one array entry per symbol.',
  'viz.hint.rabinKarp': '{"text": [\u2026], "pattern": [\u2026], "q": 13} — digits 0\u20139 only; "q" is the modulus.',
  'viz.hint.graphSource': 'The start node, as a quoted label — the example graph has A\u2013F, e.g. "A".',
  'viz.hint.btreeInsert':
    '{"t": 2, "initial": [5, 20, 25], "insertions": [\u2026]} \u2014 "initial" may be a flat key list (built by inserting in order) or a spelled-out node structure like {"keys": [9, 40], "children": [\u2026]}.',
  'viz.hint.btreeDelete':
    '{"t": 2, "initial": [5, 20, 25], "deletions": [\u2026]} \u2014 "initial" may be a flat key list or a spelled-out {"keys": \u2026, "children": \u2026} structure.',

  // --- visualizer: what is wrong with a hand-edited input -------------------
  'viz.input.expectedObject': 'Expected an object with the fields {fields}.',
  'viz.input.jsonAt': 'The input is not valid JSON — the problem starts at line {line}, column {column}.',
  'viz.input.jsonTrailingComma':
    'There is a comma here with nothing after it — JSON does not allow one before a closing \u201c{close}\u201d. Delete it, or add the missing value.',
  'viz.input.jsonEmptySlot': 'There is a comma here with no value before it.',
  'viz.input.jsonStrayClose':
    'There is a closing \u201c{char}\u201d here with no bracket left to close. One bracket too many, or one opening bracket missing earlier.',
  'viz.input.jsonMismatch':
    'This \u201c{close}\u201d closes a \u201c{open}\u201d that was opened at character {openPosition} — those two do not pair up. A \u201c{\u201d must be closed by \u201c}\u201d and a \u201c[\u201d by \u201c]\u201d.',
  'viz.input.jsonUnclosed':
    'The \u201c{open}\u201d opened at character {position} is never closed. Add {missing} to finish it.',
  'viz.input.jsonUnterminatedString': 'This quoted string is never closed — a \u201d is missing.',
  'viz.input.missingField': 'The field "{field}" is missing. This algorithm needs: {fields}.',
  'viz.input.numberList': '"{field}" must be a list of numbers, e.g. [5, 3, 8].',
  'viz.input.stringList': '"{field}" must be a list of non-empty strings, e.g. ["a", "b"].',
  'viz.input.integerList': '"{field}" must be a list of whole numbers between {min} and {max}.',
  'viz.input.integerRange': '"{field}" must be a whole number between {min} and {max}.',
  'viz.input.oneOf': '"{field}" must be one of: {allowed}.',
  'viz.input.nonEmpty': '"{field}" cannot be empty.',
  'viz.input.tooLong': '"{field}" holds more than {max} values — shorten it so the animation stays readable.',
  'viz.input.radixNumeral': '"{value}" is not a numeral in base {radix}. Base {radix} allows only the digits that base has.',
  'viz.input.btree.node': 'Every B-Tree node must be an object like {"keys": [1, 2]}, optionally with "children".',
  'viz.input.btree.degree': 'The minimum degree "t" must be a whole number between {min} and {max}.',
  'viz.input.btree.keyOrder': 'A node\u2019s keys must be strictly ascending, but [{keys}] is not.',
  'viz.input.btree.tooManyKeys':
    'The node [{keys}] holds {count} keys, but with t = {t} a node may hold at most 2t\u22121 = {max}.',
  'viz.input.btree.tooFewKeys':
    'The node [{keys}] holds {count} keys, but with t = {t} every non-root node needs at least t\u22121 = {min}.',
  'viz.input.btree.childCount':
    'The node [{keys}] has {keyCount} keys, so it needs either {expected} children or none at all (a leaf) \u2014 it has {actual}.',
  'viz.input.btree.keyRange': 'The key {key} sits under a parent that only covers keys between {low} and {high}.',
  'viz.input.btree.leafDepth': 'All leaves of a B-Tree must sit at the same depth, but these are at depths {depths}.',
  'viz.input.btree.emptyRoot': 'A root with no keys cannot have children.',
  'viz.pseudocode': 'Pseudocode',
  'viz.noSteps': 'This input produces no steps to show — reset it to the default to continue.',
  'viz.back': 'Back',
  'viz.play': 'Play',
  'viz.pause': 'Pause',
  'viz.reset': 'Reset',
  'viz.step': 'Step {current} / {total}',
  'family.Sorting': 'Sorting',
  'family.Non-Comparison Sorting': 'Non-Comparison Sorting',
  'family.Trees': 'Trees',
  'family.Graphs': 'Graphs',
  'family.Strings': 'Strings',

  // --- flashcards ---------------------------------------------------------
  'flash.title': 'Flashcards',
  'flash.allDone': 'Nothing due right now — nice work. Check back later or pick another topic.',
  'flash.answer': 'Answer',
  'flash.questionFlip': 'Question — click to flip',
  'flash.due': '{count} due',
  'flash.again': 'Again',
  'flash.good': 'Good',
  'flash.easy': 'Easy',

  // --- practice (quiz) ----------------------------------------------------
  'quiz.title': 'Practice',
  'quiz.sessionScore': 'Score this session:',
  'quiz.noMatch': "No questions match this filter (or you've been through them all).",
  'quiz.correct': 'Correct!',
  'quiz.notQuite': 'Not quite.',
  'quiz.nextQuestion': 'Next question',
  'quiz.typeAnswer': 'Type your answer…',
  'quiz.tracePlaceholder': 'Predicted result, as JSON e.g. [1,3,4,5,8]',
  'quiz.traceInput': 'Input:',
  'quiz.traceFor': ' — for {algorithm}',
  'quiz.selectExactly': 'Select exactly {count} options ({chosen}/{count} chosen).',

  // --- mock exam ----------------------------------------------------------
  'exam.title': 'Mock Exam',
  'exam.results': 'Results',
  'exam.noTemplates': 'No exam templates authored yet.',
  'exam.chooseTemplate': 'Choose a template',
  'exam.start': 'Start exam',
  'exam.submit': 'Submit exam',
  'exam.backToMenu': 'Back to exam menu',
  'exam.correctCount': 'correct',
  'exam.minutesShort': 'min',

  // --- multiple choice ----------------------------------------------------
  'mc.title': 'Multiple Choice',
  'mc.heroLead':
    'The biggest single block on the paper: {points} of 100 points, and <b>36 of those 42 are 2-of-4 questions</b>.',
  'mc.barDouble': '18 × 2-of-4 = 36 points',
  'mc.barSingle': '6 × 1-of-4 = 6 points',
  'mc.barRest': 'The other 58 points of the exam',
  'mc.statQuestions': 'questions in the bank',
  'mc.statDouble': '× 2 of 4 · 2 P each',
  'mc.statSingle': '× 1 of 4 · 1 P each',
  'mc.statPoints': 'points if you cleared it all',
  'mc.allOrNothingLabel': 'All or nothing.',
  'mc.allOrNothingBody':
    'On a 2-of-4, points are awarded only if exactly both correct statements are marked — one right and one wrong scores 0, not 1.',
  'mc.modeDrill': 'Drill',
  'mc.modeDrillBlurb': 'One at a time, instant feedback',
  'mc.modeExam': 'Exam simulation',
  'mc.modeExamBlurb': '{points} P in {minutes} min',
  'mc.modeCompendium': 'Compendium',
  'mc.modeCompendiumBlurb': 'Every question, by topic',
  'mc.badgeDouble': '2 of 4',
  'mc.badgeSingle': '1 of 4',
  'mc.badgeDoubleTitle': 'Exactly 2 of 4 correct · 2 points · all or nothing',
  'mc.badgeSingleTitle': 'Exactly 1 of 4 correct · 1 point',
  'mc.instructionsSingle': 'Exactly one of the four statements is correct. Mark it.',
  'mc.instructionsDouble':
    'Exactly two of the four statements are correct. Points are awarded only if exactly both correct statements are marked — one right and one wrong scores 0, not 1.',
  'mc.selectHint':
    'Select exactly {count} — {chosen}/{count} chosen. Both must be right, or the question scores 0.',
  'mc.verdictCorrect': 'Correct · +{points} {unit}',
  'mc.verdictHalf':
    'One of two — 0 of {possible} points. The exam gives no partial credit: both correct statements must be marked, and nothing else.',
  'mc.verdictWrong': 'Incorrect · 0 of {possible} {unit}',
  'mc.bothFormats': 'Both',
  'mc.filterBothFormats': 'Both formats',
  'mc.filterDoubleOnly': '2 of 4 only',
  'mc.filterSingleOnly': '1 of 4 only',
  'mc.session': 'Session:',
  'mc.sessionPoints': '{points}/{max} points',
  'mc.sessionQuestions': '{correct}/{answered} questions',
  'mc.inFilter': '{current} of {total} in this filter',
  'mc.noneMatchFilter': 'No questions match this filter.',
  'mc.filterExhausted': "That's every question in this filter — reshuffle to go again.",
  'mc.restartFilter': 'Restart this filter',
  'mc.submitAnswer': 'Submit answer',
  'mc.nextQuestion': 'Next question',
  'mc.examSimTitle': 'Exam simulation',
  'mc.examSimLead':
    'The MC section exactly as it appears on the paper — {points} points in {minutes} minutes, drawn fresh from all {available} questions each run.',
  'mc.partOneTitle': 'Part I · 6 × 1 of 4',
  'mc.partOnePoints': '6 points',
  'mc.partTwoTitle': 'Part II · 18 × 2 of 4',
  'mc.partTwoPoints': '36 points',
  'mc.passNote':
    "Pass mark on this section: {pass} of {max} points, matching the paper's own 50/100 threshold.",
  'mc.startSection': 'Start the {minutes}-minute section',
  'mc.sectionHeading': 'MC Section · {points} points',
  'mc.answeredCount': '{answered} of {total} answered',
  'mc.submitSection': 'Submit section',
  'mc.submitEarly': 'Submit section early',
  'mc.sectionResult': 'Section result',
  'mc.abovePass': 'Above pass mark',
  'mc.belowPass': 'Below {pass} P pass mark',
  'mc.fullyCorrect': '{correct} of {total} questions fully correct',
  'mc.halfRightSummary': '{count} × half-right on a 2-of-4 — {lost} points lost to all-or-nothing',
  'mc.newSection': 'New section',
  'mc.searchPlaceholder': 'Search prompts, options, explanations, sources…',
  'mc.showAnswers': 'Show answers',
  'mc.hideAnswers': 'Hide answers',
  'mc.compendiumCount': '{questions} across {topics}',
  'mc.compendiumCountSearch': '{questions} across {topics} matching your search',
  'mc.questionCount_one': '{count} question',
  'mc.questionCount_other': '{count} questions',
  'mc.topicCount_one': '{count} topic',
  'mc.topicCount_other': '{count} topics',
  'mc.noSearchMatch': 'Nothing matches that search.',
  'mc.topicSummary': '{double} × 2/4 · {single} × 1/4 · {points} P',
  'mc.revealBoth': 'Reveal both answers',
  'mc.revealOne': 'Reveal the answer',

  // --- dashboard ----------------------------------------------------------
  'dash.title': 'Dashboard',
  'dash.subtitle':
    'Weakest topics first — combines flashcard maturity, quiz accuracy, and mock exam performance.',
  'dash.readiness': 'Overall exam readiness',
  'dash.cardsReviewed': 'Cards reviewed',
  'dash.quizAttempts': 'Quiz attempts',
  'dash.examsTaken': 'Mock exams taken',
  'dash.avgExamScore': 'Avg exam score',
  'dash.activity': 'Study activity',
  'dash.activeDays': '{count} active days',
  'dash.streak': '{count}-day streak',
  'dash.less': 'Less',
  'dash.more': 'More',
  'dash.activityTitle': '{date}: {count} activities',
  'dash.activityTitleOne': '{date}: {count} activity',
  'dash.masteryTitle': 'Mastery by topic — weakest first',
  'dash.noTopics': 'No topics yet.',
  'dash.syncTitle': 'Sync across your devices',
  'dash.syncBody':
    "No accounts — export a file on one device, then import it on another to bring your flashcard progress, quiz history, and exam scores with you. Importing merges with what's already there; it never deletes anything.",
  'dash.exportProgress': 'Export progress',
  'dash.importProgress': 'Import progress',
  'dash.imported': 'Imported: {summary}',
  'dash.importFailed': 'Import failed.',
  'backup.flashcardsUpdated_one': '{count} flashcard updated',
  'backup.flashcardsUpdated_other': '{count} flashcards updated',
  'backup.quizAdded_one': '{count} quiz attempt added',
  'backup.quizAdded_other': '{count} quiz attempts added',
  'backup.examsAdded_one': '{count} mock exam added',
  'backup.examsAdded_other': '{count} mock exams added',
  'backup.reviewsAdded_one': '{count} review added to your streak',
  'backup.reviewsAdded_other': '{count} reviews added to your streak',
  'backup.nothingNew': 'Nothing new in that file — already up to date.',
  'backup.notJson': 'That file is not valid JSON.',
  'backup.notExport': 'That file does not look like an AuD Grind progress export.',
  'backup.newerVersion':
    'That export was made by a newer version of the app — update the app before importing it.',

  // --- months (activity heatmap) -----------------------------------------
  'month.0': 'Jan',
  'month.1': 'Feb',
  'month.2': 'Mar',
  'month.3': 'Apr',
  'month.4': 'May',
  'month.5': 'Jun',
  'month.6': 'Jul',
  'month.7': 'Aug',
  'month.8': 'Sep',
  'month.9': 'Oct',
  'month.10': 'Nov',
  'month.11': 'Dec',
} as const;

/** UI chrome plus the visualizer's step descriptions form one catalogue. */
export const en = { ...uiEn, ...vizEn } as const;

export type MessageKey = keyof typeof en;

const uiDe: Record<keyof typeof uiEn, string> = {
  // --- app chrome ---------------------------------------------------------
  'app.name': 'AuD Grind',
  'app.loading': 'Lädt…',
  'error.title': 'Auf dieser Seite ist ein Fehler aufgetreten.',
  'error.body':
    'Der Rest der App ist davon nicht betroffen — dein Fortschritt ist sicher. Meist liegt es daran, dass die Eingabe für diese Ansicht eine unerwartete Form hatte.',
  'error.retry': 'Erneut versuchen',
  'error.details': 'Technische Details',
  'nav.topics': 'Themen',
  'nav.visualize': 'Visualisieren',
  'nav.flashcards': 'Karteikarten',
  'nav.mc': 'Multiple Choice',
  'nav.practice': 'Üben',
  'nav.exam': 'Probeklausur',
  'nav.dashboard': 'Übersicht',
  'lang.label': 'Sprache',
  'lang.switchToDe': 'Auf Deutsch umschalten',
  'lang.switchToEn': 'Auf Englisch umschalten',

  // --- shared vocabulary --------------------------------------------------
  'common.allTopics': 'Alle Themen',
  'common.anyDifficulty': 'Beliebige Schwierigkeit',
  'common.easy': 'leicht',
  'common.medium': 'mittel',
  'common.hard': 'schwer',
  'common.submit': 'Abgeben',
  'common.next': 'Weiter',
  'common.previous': 'Zurück',
  'common.points': 'Punkte',
  'common.point': 'Punkt',
  'common.pointsShort': 'P',
  'common.correct': 'Richtig',
  'common.incorrect': 'Falsch',
  'common.of': 'von',

  // --- topic categories ---------------------------------------------------
  'category.Grundlagen': 'Grundlagen',
  'category.Sorting': 'Sortieren',
  'category.Basic Data Structures': 'Grundlegende Datenstrukturen',
  'category.Trees': 'Bäume',
  'category.Graphs': 'Graphen',
  'category.Advanced Design': 'Fortgeschrittener Entwurf',
  'category.Complexity Theory': 'Komplexitätstheorie',
  'category.String Algorithms': 'String-Algorithmen',

  // --- topics -------------------------------------------------------------
  'topics.pickPrompt': 'Wähle links ein Thema aus, um loszulegen.',
  'topics.notFound': 'Thema nicht gefunden.',
  'topics.practiceThis': 'Dieses Thema üben',
  'topics.reviewFlashcards': 'Karteikarten wiederholen',

  // --- visualizer ---------------------------------------------------------
  'viz.title': 'Visualisieren',
  'viz.subtitle': 'Wähle einen Algorithmus, um ihn Schritt für Schritt durchzugehen.',
  'viz.inputLabel': 'Eingabe (JSON):',
  'viz.resetDefault': 'Auf Standard zurücksetzen',
  'viz.format': 'Formatieren',
  'viz.formatHint': 'Verteilt das JSON auf einger\u00fcckte Zeilen, damit die Verschachtelung beim Bearbeiten sichtbar ist.',
  'viz.invalidJson': 'Ung\u00fcltige JSON-Eingabe.',
  'viz.inputProblem': 'Diese Eingabe passt nicht zu diesem Algorithmus',
  'viz.inputUnusable':
    'Dieser Algorithmus kann mit dieser Eingabe nicht laufen. Setze sie auf den Standard zur\u00fcck und \u00e4ndere sie Feld f\u00fcr Feld.',

  // --- visualizer: was die Eingabe je Algorithmus erwartet ------------------
  'viz.hint.numberList': 'Eine Liste von Zahlen, von links nach rechts eingef\u00fcgt \u2014 z.\u202fB. [8, 3, 10, 1, 6].',
  'viz.hint.initialDeletions':
    '{"initial": [\u2026], "deletions": [\u2026]} \u2014 der Baum entsteht aus "initial", danach werden diese Schl\u00fcssel der Reihe nach gel\u00f6scht.',
  'viz.hint.heapExtract':
    '{"initial": [\u2026], "extractCount": n} \u2014 "initial" wird zum Heap aufgebaut, danach wird n-mal das Maximum entnommen.',
  'viz.hint.splayInsert':
    '{"seed": [\u2026], "insertions": [\u2026]} \u2014 "seed" baut den Startbaum, danach spreizt jede Einf\u00fcgung.',
  'viz.hint.splayDelete':
    '{"seed": [\u2026], "insertions": [\u2026], "searches": [\u2026], "deletions": [\u2026]} \u2014 wird in dieser Reihenfolge ausgef\u00fchrt.',
  'viz.hint.radixSort':
    '{"values": ["54", "24"], "radix": 8} \u2014 die Ziffernfolgen stehen in dieser Basis, Basis 8 erlaubt also die Ziffern 0\u20137.',
  'viz.hint.stringMatch': '{"text": ["a", "b"], "pattern": ["a"]} \u2014 ein Array-Eintrag pro Zeichen.',
  'viz.hint.rabinKarp': '{"text": [\u2026], "pattern": [\u2026], "q": 13} \u2014 nur Ziffern 0\u20139; "q" ist der Modulus.',
  'viz.hint.graphSource': 'Der Startknoten als Zeichenkette \u2014 der Beispielgraph hat A\u2013F, z.\u202fB. "A".',
  'viz.hint.btreeInsert':
    '{"t": 2, "initial": [5, 20, 25], "insertions": [\u2026]} \u2014 "initial" darf eine flache Schl\u00fcsselliste sein (wird der Reihe nach eingef\u00fcgt) oder eine ausgeschriebene Knotenstruktur wie {"keys": [9, 40], "children": [\u2026]}.',
  'viz.hint.btreeDelete':
    '{"t": 2, "initial": [5, 20, 25], "deletions": [\u2026]} \u2014 "initial" darf eine flache Schl\u00fcsselliste oder eine ausgeschriebene {"keys": \u2026, "children": \u2026}-Struktur sein.',

  // --- visualizer: was an einer bearbeiteten Eingabe nicht stimmt -----------
  'viz.input.expectedObject': 'Erwartet wird ein Objekt mit den Feldern {fields}.',
  'viz.input.jsonAt': 'Die Eingabe ist kein g\u00fcltiges JSON \u2014 das Problem beginnt in Zeile {line}, Spalte {column}.',
  'viz.input.jsonTrailingComma':
    'Hier steht ein Komma, auf das nichts folgt \u2014 vor einer schlie\u00dfenden \u201e{close}\u201c ist das in JSON nicht erlaubt. L\u00f6sche es oder erg\u00e4nze den fehlenden Wert.',
  'viz.input.jsonEmptySlot': 'Hier steht ein Komma, vor dem kein Wert steht.',
  'viz.input.jsonStrayClose':
    'Hier steht eine schlie\u00dfende \u201e{char}\u201c, aber es ist keine Klammer mehr offen. Eine Klammer zu viel \u2014 oder weiter vorn fehlt eine \u00f6ffnende.',
  'viz.input.jsonMismatch':
    'Diese \u201e{close}\u201c schlie\u00dft eine \u201e{open}\u201c, die an Zeichen {openPosition} ge\u00f6ffnet wurde \u2014 die beiden passen nicht zusammen. Eine \u201e{\u201c wird mit \u201e}\u201c geschlossen, eine \u201e[\u201c mit \u201e]\u201c.',
  'viz.input.jsonUnclosed':
    'Die \u201e{open}\u201c, die an Zeichen {position} ge\u00f6ffnet wurde, wird nie geschlossen. Erg\u00e4nze {missing}, um sie abzuschlie\u00dfen.',
  'viz.input.jsonUnterminatedString': 'Diese Zeichenkette in Anf\u00fchrungszeichen wird nie geschlossen \u2014 es fehlt ein \u201d.',
  'viz.input.missingField': 'Das Feld \u201e{field}\u201c fehlt. Dieser Algorithmus braucht: {fields}.',
  'viz.input.numberList': '\u201e{field}\u201c muss eine Liste von Zahlen sein, z.\u202fB. [5, 3, 8].',
  'viz.input.stringList': '\u201e{field}\u201c muss eine Liste nicht-leerer Zeichenketten sein, z.\u202fB. ["a", "b"].',
  'viz.input.integerList': '\u201e{field}\u201c muss eine Liste ganzer Zahlen zwischen {min} und {max} sein.',
  'viz.input.integerRange': '\u201e{field}\u201c muss eine ganze Zahl zwischen {min} und {max} sein.',
  'viz.input.oneOf': '\u201e{field}\u201c muss einer dieser Werte sein: {allowed}.',
  'viz.input.nonEmpty': '\u201e{field}\u201c darf nicht leer sein.',
  'viz.input.tooLong': '\u201e{field}\u201c enth\u00e4lt mehr als {max} Werte \u2014 k\u00fcrze es, damit die Animation lesbar bleibt.',
  'viz.input.radixNumeral':
    '\u201e{value}\u201c ist keine Zahl zur Basis {radix}. Zur Basis {radix} sind nur die Ziffern dieser Basis erlaubt.',
  'viz.input.btree.node': 'Jeder B-Baum-Knoten muss ein Objekt wie {"keys": [1, 2]} sein, optional mit \u201echildren\u201c.',
  'viz.input.btree.degree': 'Der Minimalgrad \u201et\u201c muss eine ganze Zahl zwischen {min} und {max} sein.',
  'viz.input.btree.keyOrder': 'Die Schl\u00fcssel eines Knotens m\u00fcssen streng aufsteigend sein, [{keys}] ist es nicht.',
  'viz.input.btree.tooManyKeys':
    'Der Knoten [{keys}] h\u00e4lt {count} Schl\u00fcssel, aber bei t = {t} sind h\u00f6chstens 2t\u22121 = {max} erlaubt.',
  'viz.input.btree.tooFewKeys':
    'Der Knoten [{keys}] h\u00e4lt {count} Schl\u00fcssel, aber bei t = {t} braucht jeder Nicht-Wurzelknoten mindestens t\u22121 = {min}.',
  'viz.input.btree.childCount':
    'Der Knoten [{keys}] hat {keyCount} Schl\u00fcssel und braucht deshalb entweder {expected} Kinder oder gar keine (ein Blatt) \u2014 er hat {actual}.',
  'viz.input.btree.keyRange': 'Der Schl\u00fcssel {key} h\u00e4ngt unter einem Elternknoten, der nur Schl\u00fcssel zwischen {low} und {high} abdeckt.',
  'viz.input.btree.leafDepth': 'Alle Bl\u00e4tter eines B-Baums m\u00fcssen auf derselben Tiefe liegen, diese liegen aber auf den Tiefen {depths}.',
  'viz.input.btree.emptyRoot': 'Eine Wurzel ohne Schl\u00fcssel kann keine Kinder haben.',
  'viz.pseudocode': 'Pseudocode',
  'viz.noSteps':
    'Diese Eingabe erzeugt keine darstellbaren Schritte — setze sie auf den Standard zurück, um fortzufahren.',
  'viz.back': 'Zurück',
  'viz.play': 'Abspielen',
  'viz.pause': 'Pause',
  'viz.reset': 'Zurücksetzen',
  'viz.step': 'Schritt {current} / {total}',
  'family.Sorting': 'Sortieren',
  'family.Non-Comparison Sorting': 'Nicht-vergleichsbasiertes Sortieren',
  'family.Trees': 'Bäume',
  'family.Graphs': 'Graphen',
  'family.Strings': 'Strings',

  // --- flashcards ---------------------------------------------------------
  'flash.title': 'Karteikarten',
  'flash.allDone': 'Gerade ist nichts fällig — gut gemacht. Schau später wieder rein oder wähle ein anderes Thema.',
  'flash.answer': 'Antwort',
  'flash.questionFlip': 'Frage — zum Umdrehen klicken',
  'flash.due': '{count} fällig',
  'flash.again': 'Nochmal',
  'flash.good': 'Gut',
  'flash.easy': 'Leicht',

  // --- practice (quiz) ----------------------------------------------------
  'quiz.title': 'Üben',
  'quiz.sessionScore': 'Punktzahl in dieser Sitzung:',
  'quiz.noMatch': 'Keine Fragen passen zu diesem Filter (oder du hast bereits alle bearbeitet).',
  'quiz.correct': 'Richtig!',
  'quiz.notQuite': 'Leider nicht.',
  'quiz.nextQuestion': 'Nächste Frage',
  'quiz.typeAnswer': 'Antwort eingeben…',
  'quiz.tracePlaceholder': 'Erwartetes Ergebnis als JSON, z. B. [1,3,4,5,8]',
  'quiz.traceInput': 'Eingabe:',
  'quiz.traceFor': ' — für {algorithm}',
  'quiz.selectExactly': 'Wähle genau {count} Aussagen aus ({chosen}/{count} ausgewählt).',

  // --- mock exam ----------------------------------------------------------
  'exam.title': 'Probeklausur',
  'exam.results': 'Ergebnis',
  'exam.noTemplates': 'Es wurden noch keine Klausurvorlagen angelegt.',
  'exam.chooseTemplate': 'Vorlage wählen',
  'exam.start': 'Klausur starten',
  'exam.submit': 'Klausur abgeben',
  'exam.backToMenu': 'Zurück zur Klausurauswahl',
  'exam.correctCount': 'richtig',
  'exam.minutesShort': 'Min.',

  // --- multiple choice ----------------------------------------------------
  'mc.title': 'Multiple Choice',
  'mc.heroLead':
    'Der größte einzelne Block der Klausur: {points} von 100 Punkten — und <b>36 dieser 42 Punkte sind 2-aus-4-Aufgaben</b>.',
  'mc.barDouble': '18 × 2 aus 4 = 36 Punkte',
  'mc.barSingle': '6 × 1 aus 4 = 6 Punkte',
  'mc.barRest': 'Die übrigen 58 Punkte der Klausur',
  'mc.statQuestions': 'Fragen im Fragenpool',
  'mc.statDouble': '× 2 aus 4 · je 2 P',
  'mc.statSingle': '× 1 aus 4 · je 1 P',
  'mc.statPoints': 'Punkte, wenn du alles richtig hast',
  'mc.allOrNothingLabel': 'Alles oder nichts.',
  'mc.allOrNothingBody':
    'Bei 2 aus 4 gibt es nur dann Punkte, wenn genau die beiden richtigen Aussagen markiert sind — eine richtige und eine falsche ergibt 0 Punkte, nicht 1.',
  'mc.modeDrill': 'Training',
  'mc.modeDrillBlurb': 'Eine Frage nach der anderen, sofortiges Feedback',
  'mc.modeExam': 'Klausursimulation',
  'mc.modeExamBlurb': '{points} P in {minutes} Min.',
  'mc.modeCompendium': 'Kompendium',
  'mc.modeCompendiumBlurb': 'Alle Fragen, nach Thema',
  'mc.badgeDouble': '2 aus 4',
  'mc.badgeSingle': '1 aus 4',
  'mc.badgeDoubleTitle': 'Genau 2 von 4 richtig · 2 Punkte · alles oder nichts',
  'mc.badgeSingleTitle': 'Genau 1 von 4 richtig · 1 Punkt',
  'mc.instructionsSingle':
    'In diesem Abschnitt ist genau eine der vier Aussagen richtig. Markiere sie.',
  'mc.instructionsDouble':
    'In diesem Abschnitt sind genau zwei der vier Aussagen richtig. Es werden nur dann Punkte vergeben, wenn genau die beiden richtigen Aussagen markiert wurden — eine richtige und eine falsche ergibt 0 Punkte, nicht 1.',
  'mc.selectHint':
    'Wähle genau {count} aus — {chosen}/{count} ausgewählt. Beide müssen stimmen, sonst gibt die Aufgabe 0 Punkte.',
  'mc.verdictCorrect': 'Richtig · +{points} {unit}',
  'mc.verdictHalf':
    'Eine von zwei — 0 von {possible} Punkten. Die Klausur vergibt keine Teilpunkte: Es müssen genau die beiden richtigen Aussagen markiert sein und sonst nichts.',
  'mc.verdictWrong': 'Falsch · 0 von {possible} {unit}',
  'mc.bothFormats': 'Beide',
  'mc.filterBothFormats': 'Beide Formate',
  'mc.filterDoubleOnly': 'Nur 2 aus 4',
  'mc.filterSingleOnly': 'Nur 1 aus 4',
  'mc.session': 'Sitzung:',
  'mc.sessionPoints': '{points}/{max} Punkte',
  'mc.sessionQuestions': '{correct}/{answered} Fragen',
  'mc.inFilter': '{current} von {total} in diesem Filter',
  'mc.noneMatchFilter': 'Keine Fragen passen zu diesem Filter.',
  'mc.filterExhausted': 'Das waren alle Fragen in diesem Filter — neu mischen, um weiterzumachen.',
  'mc.restartFilter': 'Filter neu starten',
  'mc.submitAnswer': 'Antwort abgeben',
  'mc.nextQuestion': 'Nächste Frage',
  'mc.examSimTitle': 'Klausursimulation',
  'mc.examSimLead':
    'Der MC-Abschnitt genau wie in der Klausur — {points} Punkte in {minutes} Minuten, bei jedem Durchlauf neu aus allen {available} Fragen zusammengestellt.',
  'mc.partOneTitle': 'Teil I · 6 × 1 aus 4',
  'mc.partOnePoints': '6 Punkte',
  'mc.partTwoTitle': 'Teil II · 18 × 2 aus 4',
  'mc.partTwoPoints': '36 Punkte',
  'mc.passNote':
    'Bestehensgrenze für diesen Abschnitt: {pass} von {max} Punkten — dieselbe Quote wie die 50 von 100 der Klausur.',
  'mc.startSection': 'Abschnitt starten ({minutes} Minuten)',
  'mc.sectionHeading': 'MC-Abschnitt · {points} Punkte',
  'mc.answeredCount': '{answered} von {total} beantwortet',
  'mc.submitSection': 'Abschnitt abgeben',
  'mc.submitEarly': 'Abschnitt vorzeitig abgeben',
  'mc.sectionResult': 'Ergebnis des Abschnitts',
  'mc.abovePass': 'Über der Bestehensgrenze',
  'mc.belowPass': 'Unter der Bestehensgrenze von {pass} P',
  'mc.fullyCorrect': '{correct} von {total} Fragen vollständig richtig',
  'mc.halfRightSummary':
    '{count} × halb richtig bei 2 aus 4 — {lost} Punkte durch Alles-oder-nichts verloren',
  'mc.newSection': 'Neuer Abschnitt',
  'mc.searchPlaceholder': 'Fragen, Antworten, Erklärungen und Quellen durchsuchen…',
  'mc.showAnswers': 'Lösungen anzeigen',
  'mc.hideAnswers': 'Lösungen ausblenden',
  'mc.compendiumCount': '{questions} in {topics}',
  'mc.compendiumCountSearch': '{questions} in {topics} passen zu deiner Suche',
  'mc.questionCount_one': '{count} Frage',
  'mc.questionCount_other': '{count} Fragen',
  'mc.topicCount_one': '{count} Thema',
  'mc.topicCount_other': '{count} Themen',
  'mc.noSearchMatch': 'Nichts passt zu dieser Suche.',
  'mc.topicSummary': '{double} × 2/4 · {single} × 1/4 · {points} P',
  'mc.revealBoth': 'Beide Lösungen anzeigen',
  'mc.revealOne': 'Lösung anzeigen',

  // --- dashboard ----------------------------------------------------------
  'dash.title': 'Übersicht',
  'dash.subtitle':
    'Schwächste Themen zuerst — kombiniert Karteikarten-Reife, Quiz-Trefferquote und Ergebnisse der Probeklausuren.',
  'dash.readiness': 'Gesamte Klausurreife',
  'dash.cardsReviewed': 'Wiederholte Karten',
  'dash.quizAttempts': 'Quiz-Versuche',
  'dash.examsTaken': 'Absolvierte Probeklausuren',
  'dash.avgExamScore': 'Ø Klausurergebnis',
  'dash.activity': 'Lernaktivität',
  'dash.activeDays': '{count} aktive Tage',
  'dash.streak': '{count} Tage in Folge',
  'dash.less': 'Weniger',
  'dash.more': 'Mehr',
  'dash.activityTitle': '{date}: {count} Aktivitäten',
  'dash.activityTitleOne': '{date}: {count} Aktivität',
  'dash.masteryTitle': 'Beherrschung nach Thema — schwächste zuerst',
  'dash.noTopics': 'Noch keine Themen vorhanden.',
  'dash.syncTitle': 'Zwischen deinen Geräten synchronisieren',
  'dash.syncBody':
    'Ohne Konto — exportiere auf einem Gerät eine Datei und importiere sie auf einem anderen, um Karteikarten-Fortschritt, Quiz-Verlauf und Klausurergebnisse mitzunehmen. Der Import wird mit den vorhandenen Daten zusammengeführt und löscht nie etwas.',
  'dash.exportProgress': 'Fortschritt exportieren',
  'dash.importProgress': 'Fortschritt importieren',
  'dash.imported': 'Importiert: {summary}',
  'dash.importFailed': 'Import fehlgeschlagen.',
  'backup.flashcardsUpdated_one': '{count} Karteikarte aktualisiert',
  'backup.flashcardsUpdated_other': '{count} Karteikarten aktualisiert',
  'backup.quizAdded_one': '{count} Quiz-Versuch hinzugefügt',
  'backup.quizAdded_other': '{count} Quiz-Versuche hinzugefügt',
  'backup.examsAdded_one': '{count} Probeklausur hinzugefügt',
  'backup.examsAdded_other': '{count} Probeklausuren hinzugefügt',
  'backup.reviewsAdded_one': '{count} Wiederholung zu deiner Serie hinzugefügt',
  'backup.reviewsAdded_other': '{count} Wiederholungen zu deiner Serie hinzugefügt',
  'backup.nothingNew': 'Nichts Neues in dieser Datei — bereits auf dem aktuellen Stand.',
  'backup.notJson': 'Diese Datei ist kein gültiges JSON.',
  'backup.notExport': 'Diese Datei sieht nicht nach einem AuD-Grind-Fortschrittsexport aus.',
  'backup.newerVersion':
    'Dieser Export stammt aus einer neueren Version der App — aktualisiere die App, bevor du ihn importierst.',

  // --- months -------------------------------------------------------------
  'month.0': 'Jan',
  'month.1': 'Feb',
  'month.2': 'Mär',
  'month.3': 'Apr',
  'month.4': 'Mai',
  'month.5': 'Jun',
  'month.6': 'Jul',
  'month.7': 'Aug',
  'month.8': 'Sep',
  'month.9': 'Okt',
  'month.10': 'Nov',
  'month.11': 'Dez',
};

export const de: Record<MessageKey, string> = { ...uiDe, ...vizDe };

export const catalogues = { en, de } satisfies Record<string, Record<MessageKey, string>>;

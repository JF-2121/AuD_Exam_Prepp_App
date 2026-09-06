---
id: np-completeness
title: "Komplexitätsklassen & NP-Vollständigkeit"
category: "Complexity Theory"
order: 1
---

## Entscheidungsprobleme und P gegen NP

Ein **Entscheidungsproblem** erwartet stets eine **0/1-Antwort** („ja“/„nein“); jedes Berechnungsproblem lässt sich als solches umformulieren. Ein Entscheidungsproblem `L` gehört zu:

- **P**: Es existiert ein Algorithmus, der `L` **deterministisch in polynomieller (Worst-Case-)Zeit** löst.
- **NP**: Es ist *unklar*, ob `L` effizient gelöst werden kann — aber eine vorgeschlagene **Lösung lässt sich in polynomieller Zeit verifizieren**, gegeben ein „Zertifikat“ (eine Kandidatenantwort bzw. ein Zeuge).
- **P ⊆ NP** gilt immer: Jedes in polynomieller Zeit lösbare Problem lässt sich trivialerweise auch in polynomieller Zeit *verifizieren* (man löst es einfach selbst und ignoriert das gegebene Zertifikat). Ob **NP ⊆ P** gilt — also ob **P = NP** — ist eines der offenen **Millennium-Probleme**.

## NP-hart und NP-vollständig

Um die relative Schwierigkeit von Problemen formal zu vergleichen, verwendet diese Vorlesung die **polynomielle Reduktion**: `L1 ≤P L2` bedeutet, dass es eine in polynomieller Zeit berechenbare Funktion `f` gibt mit `x ∈ L1 ⟺ f(x) ∈ L2` — das Lösen von `L2` (selbst als Blackbox) liefert über `f` „gratis“ einen Löser für `L1`. Das ist genau die Notation `L1 ≤ L2` der Vorlesung.

- Ein Problem `L_C` ist **NP-hart**, wenn sich jedes Problem in NP in polynomieller Zeit darauf reduzieren lässt (`∀ L ∈ NP: L ≤P L_C`). NP-harte Probleme müssen nicht selbst in NP liegen.
- Ein Problem ist **NP-vollständig**, wenn es sowohl **NP-hart** *als auch* **in NP** liegt — die „schwersten Probleme in NP“. Würde ein einziges NP-vollständiges Problem in polynomieller Zeit gelöst, so wäre **jedes** Problem in NP polynomiell lösbar (P = NP) — das ist die Kraft der Reduktion.
- **SAT** (Boolesche Erfüllbarkeit) ist das kanonische NP-vollständige Problem, direkt bewiesen (Satz von Cook-Levin, indem die gesamte Berechnung eines Verifizierers als Boolesche Formel kodiert wird) — jeder weitere NP-Vollständigkeitsbeweis knüpft per Reduktion an SAT (oder an ein anderes bereits als NP-vollständig bewiesenes Problem) an. Seine eingeschränkte Variante **3SAT** (Klauseln mit genau 3 Literalen) ist ebenfalls NP-vollständig; das weiter eingeschränkte **2SAT** liegt — vielleicht überraschend — **in P** (lösbar über Implikationsgraphen + starke Zusammenhangskomponenten).

## Vier Standard-Beweistechniken (durchgerechnet)

**(a) Reduktionen erhalten Komplemente**: Gilt `L1 ≤P L2`, so auch `L1̄ ≤P L2̄`. *Beweis*: `L1 ≤P L2` liefert eine polynomiell berechenbare Funktion `f` mit `x ∈ L1 ⟺ f(x) ∈ L2`. Das Negieren beider Seiten einer logischen Äquivalenz erhält diese: `x ∉ L1 ⟺ f(x) ∉ L2`, also `x ∈ L1̄ ⟺ f(x) ∈ L2̄`. Da `f` selbst unverändert bleibt (weiterhin polynomiell berechenbar), *ist* das eine gültige Reduktion `L1̄ ≤P L2̄` — keine neue Konstruktion nötig, nur eine Umbenennung.

**(b) Ein effizient lösbares NP-vollständiges Problem lässt P und NP zusammenfallen**: Ist `L` NP-vollständig und `L ∈ P`, so gilt **P = NP**. *Beweis*: Nimm ein beliebiges `L' ∈ NP`. Wegen der NP-Vollständigkeit von `L` gilt `L' ≤P L`. Da `L ∈ P`, verkette die polynomielle Reduktion mit dem polynomiellen Löser von `L`: Das liefert auch für `L'` einen polynomiellen Löser. Also liegt jedes `L' ∈ NP` auch in P — d. h. NP ⊆ P, und zusammen mit dem stets gültigen P ⊆ NP bedeutet das P = NP.

**(c) Die Kontraposition**: Ist irgendein Problem in NP *nicht* in polynomieller Zeit lösbar, so ist *kein* NP-vollständiges Problem in polynomieller Zeit lösbar. Das ist genau die logische Kontraposition von (b) — wenn schon ein einziges NP-vollständiges Problem in P zu liegen P = NP erzwingen würde (und damit jedes NP-Problem polynomiell lösbar machte), so schließt die Existenz auch nur eines NP-Problems, das *nicht* polynomiell lösbar ist, aus, dass ein NP-vollständiges Problem in P liegt.

**(d) `≤P` ist transitiv**: Gilt `L1 ≤P L2` (über die Reduktionsfunktion `f1`) und `L2 ≤P L3` (über `f2`), so gilt `L1 ≤P L3`. *Beweis*: Definiere `f3 = f2 ∘ f1` (die Komposition der beiden Reduktionen). `f3` ist weiterhin polynomiell berechenbar (die Komposition zweier polynomieller Funktionen ist polynomiell), und `x ∈ L1 ⟺ f1(x) ∈ L2 ⟺ f2(f1(x)) ∈ L3 ⟺ f3(x) ∈ L3`. Diese Transitivität ist der *Grund*, warum „einer für alle, alle für einen“ funktioniert: Sobald sich **irgendein** bekanntes NP-vollständiges Problem auf ein neues Problem `X` reduziert, ist `X` automatisch ebenfalls NP-hart — man muss die Härte nicht jedes Mal direkt aus SAT neu herleiten.

## Klassische Problempaare: oberflächlich ähnlich, drastisch unterschiedlich schwer

Ein wiederkehrendes Klausurmuster: zwei Probleme, die strukturell *ähnlich aussehen*, von denen eines polynomiell und das andere NP-vollständig ist.

| Paar | Polynomielles Mitglied | NP-vollständiges Mitglied | Warum der Unterschied |
|---|---|---|---|
| Pfadlänge | **Kürzester** einfacher Pfad — Dijkstra/Bellman-Ford, O(VE) | **Längster** einfacher Pfad | Kürzeste Pfade haben eine optimale Teilstruktur, die DP/Greedy ausnutzen können; der längste Pfad muss Wiederbesuche vermeiden (ein *einfacher* Pfad), was ein Argumentieren über exponentiell viele Knotenteilmengen erzwingt — davon überlebt keine solche Teilstruktur |
| Boolesche Erfüllbarkeit | **2-SAT** — in P über Implikationsgraphen + SCCs | **3-SAT** | Klauseln mit 2 Literalen kodieren nur paarweise Implikationen, entscheidbar per Zusammenhangsprüfung im Graphen; Klauseln mit 3 Literalen verzahnen die Variablen so, dass sich jede solche lokale/graphbasierte Abkürzung entzieht |
| Graphfärbung | **2-Färbbarkeit** (≡ Bipartitheit) — in P über BFS/DFS, O(V+E) | **3-Färbbarkeit** | Färbt man einen Knoten bei 2 verfügbaren Farben, so sind die Farben seiner Nachbarn deterministisch erzwungen (keine echte Wahl); bei 3 Farben behält jeder Nachbar nach dem Färben eines Knotens 2 offene Möglichkeiten, was einen echten, im Worst Case exponentiellen Verzweigungsbaum erzeugt |

`3-Coloring` ist eines der 21 ursprünglichen NP-vollständigen Probleme von Karp (1972); `Hamiltonkreis`, `Vertex Cover`, `Independent Set` und die Entscheidungsvariante von `Knapsack` runden die in dieser Vorlesung am häufigsten genannten Beispiele ab, neben dem **TSP** (Traveling Salesperson — Rundreise minimalen Gewichts, die jeden Knoten genau einmal besucht).

## Durchgerechnetes Beispiel: das Hamiltonpfad-Problem

**HAM-PATH := {G : in G existiert ein Pfad, der jeden Knoten genau einmal besucht}.**

**Nachweis HAM-PATH ∈ NP**: Einen polynomiellen *Verifizierer* angeben, der bei gegebenem `G` und einer Kandidaten-Knotenfolge `p = (v_1, …, v_n)` als Zertifikat all das prüft:
1. `p` hat die korrekte Knotenanzahl (`n = |G.V|`) — O(V).
2. Jedes `v_i` ist tatsächlich ein Knoten von `G` — O(V).
3. Jedes aufeinanderfolgende Paar `(v_i, v_{i+1})` ist eine Kante von `G` — O(V).
4. Alle Knoten in `p` sind verschieden (keine Wiederholungen) — O(V²) im Worst Case, alle Paare prüfen.

Diese vier Bedingungen *sind* genau die Definition eines Hamiltonpfades, der Verifizierer akzeptiert also genau dann, wenn `p` wirklich einer ist. Gesamtverifikationszeit O(V²) — polynomiell — also **HAM-PATH ∈ NP**. (Das ist die Standardschablone für den Nachweis der Zugehörigkeit zu NP: das Zertifikat benennen, dann die Laufzeit des Verifizierers beschränken.)

**In polynomieller Zeit lösbarer Spezialfall**: Für einen **gerichteten kreisfreien Graphen** *kann* der Hamiltonpfad effizient entschieden werden — `G` in O(V+E) topologisch sortieren; ein Hamiltonpfad existiert genau dann, wenn **jedes aufeinanderfolgende Paar in der topologischen Ordnung eine Kante ist** (alle `n-1` Paare prüfen, weitere O(V)). Warum das funktioniert: In einem DAG *muss* jeder Hamiltonpfad die topologische Ordnung respektieren (ein Pfad kann nicht gegen die Kantenrichtung zurücksprungen, ohne einen Knoten erneut zu besuchen), die topologische Ordnung ist also der *einzige* Kandidat — und sie ist eindeutig, wann immer ein Hamiltonpfad existiert. Das widerspricht der allgemeinen NP-Vollständigkeit des Hamiltonpfad-Problems nicht — DAGs sind ein strukturell eingeschränkter Spezialfall, in dem der exponentielle Suchraum auf genau einen Kandidaten zusammenfällt.

Eine naheliegende Variante, **BOUND-HAM-PATH := {⟨G, v, w⟩ : es existiert ein Hamiltonpfad von v nach w}**, behandelt man identisch: eine 5. Verifizierer-Bedingung ergänzen, die prüft, dass der erste/letzte Knoten des Pfades `v`/`w` entspricht (weiterhin in NP), und den DAG-Algorithmus anpassen, indem geprüft wird, dass der konstruierte Pfad in topologischer Ordnung tatsächlich bei `v` beginnt und bei `w` endet.

## Praktisches Fazit

Ist ein Problem als NP-vollständig nachgewiesen, so sollte man keine Zeit mit der Suche nach einem exakten polynomiellen Algorithmus verschwenden (keiner ist bekannt, und einen zu finden wäre ein epochales Resultat — es würde P = NP implizieren) — stattdessen greift man zu:
- **Approximationsalgorithmen** — z. B. erfüllt bei 3SAT eine zufällige, unabhängige Belegung jeder Variablen mit wahr/falsch in einem Durchgang *erwartet* ≥ ½ aller Klauseln, eine billige und nützliche Garantie.
- **Heuristiken/Metaheuristiken** (z. B. Simulated Annealing) für schnell verfügbare, gut-genug-Lösungen.
- Exakte **exponentielle** Algorithmen mit aggressivem Beschneiden (Backtracking) — für kleine Eingaben durchaus praktikabel.
- Prüfen, ob die konkrete Instanz in einen **polynomiellen Spezialfall** fällt (wie der Hamiltonpfad eingeschränkt auf DAGs), auch wenn das allgemeine Problem NP-vollständig ist.

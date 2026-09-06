---
id: minimum-spanning-trees
title: "Minimale Spannbäume: Kruskal & Prim"
category: "Graphs"
order: 3
---

## Problemstellung

Gegeben ein zusammenhängender, ungerichteter, gewichteter Graph: Finde einen **minimalen Spannbaum (MST)** — eine Teilmenge der Kanten, die alle Knoten verbindet, keinen Kreis enthält und das Gesamtgewicht der Kanten minimiert. Beide klassischen Algorithmen sind **gierig (greedy)** und liefern beide beweisbar einen optimalen MST.

## Der Algorithmus von Kruskal

Alle Kanten aufsteigend nach Gewicht sortieren. Wiederholt die günstigste verbleibende Kante nehmen und sie hinzufügen, **es sei denn, sie würde einen Kreis erzeugen** (geprüft über eine Union-Find-/Disjoint-Set-Struktur). **Konvention dieser Vorlesung: Kanten mit gleichem Gewicht werden in alphabetischer Reihenfolge** ihrer Endpunkte verarbeitet — ein klausurrelevanter Stichentscheid, denn er bestimmt die genaue Reihenfolge der Annahme-/Ablehnungsentscheidungen (nicht aber das Endgewicht des MST, wenn dieser eindeutig ist).

```
Kruskal(G)
  Kanten aufsteigend nach Gewicht sortieren      // Gleichstände alphabetisch nach Endpunkt
  MST = {}
  for each vertex v: makeSet(v)
  for each edge (u,v) in sortierter Reihenfolge:
    IF findSet(u) != findSet(v) THEN
      MST.add((u,v))
      union(u,v)
  return MST
```

**Komplexität**: O(E log E), dominiert vom Sortieren (die Union-Find-Operationen sind mit Pfadkompression amortisiert nahezu O(1)).

**Durchgerechnetes Beispiel** (8 Knoten a–h, sortierte Kanten): `{f,g}=1` annehmen, `{b,c}=2` annehmen, `{f,h}=2` annehmen, `{b,h}=3` annehmen, `{g,h}=3` **ablehnen** (Kreis: f-g-h verbindet sie bereits), `{c,h}=4` **ablehnen** (Kreis), `{d,e}=4` annehmen, `{a,b}=5` annehmen, `{a,g}=6` **ablehnen** (Kreis), `{d,h}=7` annehmen — 7 angenommene Kanten für 8 Knoten, fertig. Endgewicht des MST = 1+2+2+3+4+5+7 = **24**.

## Der Algorithmus von Prim

Lässt einen einzelnen Baum von einem beliebigen Startknoten aus wachsen und fügt stets die günstigste Kante hinzu, die den aktuellen Baum mit einem neuen Knoten verbindet — strukturell ähnlich zu Dijkstra, aber auf das Kantengewicht statt auf die kumulierte Distanz geschlüsselt.

```
Prim(G, s)
  for each vertex v: key[v] = ∞
  key[s] = -∞                         // Sentinel: garantiert, dass s zuerst entnommen wird
  PQ = Min-Prioritätswarteschlange aller Knoten, geschlüsselt nach key
  WHILE PQ nicht leer DO
    u = extract-min(PQ)               // Gleichstände alphabetisch
    for each neighbor v of u with edge weight w(u,v):
      IF v in PQ AND w(u,v) < key[v] THEN
        key[v] = w(u,v); parent[v] = u
        decrease-key(PQ, v, key[v])
```

**Notationsanmerkung**: Diese Vorlesung initialisiert den Schlüssel des **Startknotens mit −∞**, nicht mit 0 — ein reiner Sentinel, der garantiert, dass er unabhängig von allen anderen Schlüsselwerten stets zuerst entnommen wird (0 würde hier ebenfalls funktionieren, da alle Gewichte positiv sind, aber −∞ ist die allgemeingültige Wahl und entspricht dem Namen der Konstante in der Referenzimplementierung der Vorlesung: `MINUS_INFINITE`). Gleichstände zwischen Knoten mit gleichem Schlüssel werden **alphabetisch** aufgelöst.

**Durchgerechnetes Beispiel** (derselbe 8-Knoten-Graph, Start = a): Entnahmereihenfolge **a → d → f → b → c → e → g → h**. MST-Kanten am Ende: `{a,d}, {d,f}, {d,b}, {b,c}, {c,e}, {e,g}, {g,h}`. Gesamtgewicht = 2+2+3+4+1+3+2 = **17**.

**Komplexität**: O(E log V) mit einer Prioritätswarteschlange auf Binärheap-Basis.

## Kruskal gegen Prim

- Kruskal ist kantenzentriert (gut für dünne Graphen, das Sortieren lässt sich leicht parallelisieren).
- Prim ist knotenzentriert (gut für dichte Graphen, fühlt sich strukturell wie Dijkstra an).
- Beide liefern einen korrekten MST; die Wahl richtet sich vor allem nach der Graphdichte und der Bequemlichkeit der Implementierung.
- **Klausurrelevante Unterscheidungstatsache**: Das Zwischenergebnis von Prim ist **stets ein einzelner zusammenhängender Baum** (er lässt nur einen Baum vom Startknoten aus wachsen) — es kann **niemals** ein unzusammenhängender Wald als Zwischenzustand sein. Kruskal hält dagegen regelmäßig mehrere getrennte Baumfragmente während des Ablaufs (die erst am Ende zu einem Baum verschmelzen). Wird also eine teilweise hervorgehobene Kantenmenge gezeigt und gefragt „könnte das eine Momentaufnahme von Prim, Kruskal, beiden oder keinem sein?“ — eine unzusammenhängende Menge von Baumfragmenten **schließt Prim sofort aus**.

## Warum der MST (manchmal) eindeutig ist

Zwei klassische Tatsachen über Austauschargumente, beide per Widerspruch beweisbar (nimm einen Gegenbeispiel-MST an und finde einen echt günstigeren Tausch):

- **Eindeutig günstigste Kante ⟹ sie liegt in jedem MST.** Hat der Graph G eine Kante `e` mit echt minimalem Gewicht, so gehört `e` zu *jedem* MST von G. (Beweisskizze: Fügt man `e` zu einem MST hinzu, der sie ausschließt, entsteht genau ein Kreis; jede andere Kante auf diesem Kreis muss echt schwerer als `e` sein, sodass das Ersetzen einer von ihnen durch `e` das Gesamtgewicht echt verringert — im Widerspruch dazu, dass das Original bereits minimal war.)
- **Alle Kantengewichte verschieden ⟹ der MST ist eindeutig.** Eine direkte Folge der wiederholten Anwendung der obigen Tatsache. Gibt es Gleichstände bei den Gewichten, so können mehrere verschiedene MSTs existieren (z. B. durch Tauschen zwischen zwei gleich schweren Kanten, die beide funktionieren).

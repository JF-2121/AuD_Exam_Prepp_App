---
id: shortest-paths
title: "Kürzeste Pfade & Maximaler Fluss"
category: "Graphs"
order: 2
---

## Kürzeste Pfade von einer Quelle (SSSP)

Gegeben ein gewichteter Graph und ein Quellknoten: Finde den kürzesten Pfad (mit minimalem Gesamtgewicht) von der Quelle zu jedem anderen Knoten. Jeder der folgenden Algorithmen baut auf demselben Primitiv auf:

```
relax(G, u, v, w):
  if v.dist > u.dist + w(u,v) then
    v.dist = u.dist + w(u,v); v.pred = u
```

Regel: Kreise mit positivem Gewicht helfen nie (sie fügen nur Kosten hinzu), und Kreise mit negativem Gewicht machen „kürzester Pfad“ undefiniert (man könnte ewig im Kreis laufen und die Kosten jedes Mal senken) — ein kürzester Pfad ist also stets einfach. Jeder Teilpfad eines kürzesten Pfades ist selbst ein kürzester Pfad zwischen seinen Endpunkten.

## Der Algorithmus von Dijkstra

Lässt eine Menge „finalisierter“ Knoten gierig in aufsteigender Reihenfolge der kürzesten bekannten Distanz wachsen und verwendet dazu eine **Min-Prioritätswarteschlange**. In jedem Schritt wird der nächstgelegene noch nicht finalisierte Knoten entnommen und seine ausgehenden Kanten werden **relaxiert** (die Distanz eines Nachbarn aktualisieren, falls der Weg über diesen Knoten kürzer ist).

```
Dijkstra(G, s)
  for each vertex v: dist[v] = ∞
  dist[s] = 0
  PQ = Min-Prioritätswarteschlange aller Knoten, geschlüsselt nach dist
  WHILE PQ nicht leer DO
    u = extract-min(PQ)               // Gleichstände alphabetisch
    for each neighbor v of u with edge weight w(u,v):
      IF dist[u] + w(u,v) < dist[v] THEN
        dist[v] = dist[u] + w(u,v); parent[v] = u
        decrease-key(PQ, v, dist[v])
```

**Komplexität**: O((V+E) log V) mit einer Prioritätswarteschlange auf Binärheap-Basis.

**Zentrale Einschränkung**: Dijkstra **erfordert nicht-negative Kantengewichte**. Eine negative Kante kann die Annahme „gierig, einen finalisierten Knoten nie wieder betrachten“ entkräften und ein falsches Ergebnis liefern.

**Notationsanmerkung**: Bei einem Gleichstand von `dist` zwischen zwei unbesuchten Knoten ist die Konvention dieser Vorlesung, sie in **alphabetischer Reihenfolge** zu entnehmen. **Von den Tutoren ausdrücklich benannte Klausurfalle**: Beim Ausfüllen einer Dijkstra-Tabelle Schritt für Schritt muss eine unveränderte Zelle dennoch mit einem explizit gesetzten **„=“** markiert werden (den Wert aus der Zeile darüber übernehmen) — sie leer zu lassen kostet Punkte, auch wenn der Wert „offensichtlich“ unverändert ist.

**Durchgerechnetes Beispiel** (6 Knoten u,v,w,x,y,z, gerichtet, Start = u): Entnahmereihenfolge **u → w → y → v → z → x**, was `u.d=0`, `w.d=3`, `y.d=4`, `v.d=5`, `z.d=6`, `x.d=7` ergibt. Der kürzeste Pfad u→x wird durch Rückwärtsverfolgen von `.pred` ab x rekonstruiert: **(u, w, y, v, x)**.

## Der Algorithmus von Bellman-Ford

Verarbeitet **negative Kantengewichte** (aber keine von der Quelle aus erreichbaren negativen Kreise — existiert einer, so gibt es keinen kürzesten Pfad, und Bellman-Ford kann das erkennen). Relaxiert *jede* Kante V−1 mal.

```
BellmanFord(G, s)
  for each vertex v: dist[v] = ∞
  dist[s] = 0
  V-1 mal WIEDERHOLEN:
    for each edge (u,v) with weight w:    // pro Durchlauf in lexikografischer (u,v)-Reihenfolge
      IF dist[u] + w < dist[v] THEN dist[v] = dist[u] + w
  for each edge (u,v) with weight w:      // negativen Kreis erkennen
    IF dist[u] + w < dist[v] THEN "negativer Kreis" melden
```

**Komplexität**: O(V·E) — deutlich langsamer als Dijkstra, aber echt allgemeiner.

**Notationsanmerkung**: Diese Vorlesung relaxiert die Kanten **innerhalb jedes Durchlaufs in lexikografischer (u,v)-Reihenfolge** (nicht in beliebiger oder Eingabereihenfolge) — das beeinflusst, welche Zwischenwerte nach jedem einzelnen Durchlauf erscheinen (ein Wert kann in Durchlauf 1 direkt auf sein Endergebnis „springen“, wenn sein Vorgänger zufällig früh verarbeitet wird), auch wenn die *konvergierten* Enddistanzen nach allen V−1 Durchläufen reihenfolgeunabhängig sind.

**Durchgerechnetes Beispiel** (6 Knoten a–f, gerichtet, Start = e): Durchlauf 1 liefert `c=16(e)`, `d=5(e)`, `f=3(e)`; Durchlauf 2 liefert `a=20(c)`, `b=6(d)`, `c=5(d)` (erneut verbessert); Durchlauf 3 liefert `a=5(c)`, `c=1(b)`; die Durchläufe 4–5 ändern nichts mehr (konvergiert). Endstand: `e=0`, `d=5(e)`, `b=6(d)`, `c=1(b)`, `a=5(c)`, `f=3(e)`. Kürzester Pfad e→a = **(e, d, b, c, a)**.

## Kürzeste Pfade in DAGs

Ist der Graph garantiert kreisfrei, so gibt es eine schnellere Option als Bellman-Ford: einmal topologisch sortieren, dann in dieser Reihenfolge die ausgehenden Kanten jedes Knotens relaxieren. Da eine topologische Ordnung garantiert, dass jeder Vorgänger von u vor u verarbeitet wird, genügt ein einziger Durchlauf — kein wiederholtes Relaxieren nötig.

```
DAGShortestPaths(G, s, w)
  initSSSP(G, s, w)
  V topologisch sortieren
  for each u in V, in topologischer Reihenfolge:
    for each v in adj(u):
      relax(G, u, v, w)
```

**Komplexität**: Θ(V+E) — schneller als Dijkstra und Bellman-Ford, aber nur auf DAGs anwendbar.

## A*-Suche

Eine zielgerichtete Variante von Dijkstra: Sie ergänzt eine **heuristische** Schätzung `u.heur` (z. B. die Luftliniendistanz zum Ziel), sodass die Prioritätswarteschlange die Knoten nach `dist + heur` statt allein nach `dist` ordnet und die Erkundung damit zum Ziel hin verzerrt, anstatt gleichmäßig in alle Richtungen zu expandieren. Bricht ab, sobald das Ziel aus der Warteschlange entnommen wird.

**Kompromisse gegenüber Dijkstra**: in der Praxis meist deutlich schneller (weniger vergeudete Expansionen weg vom Ziel), braucht aber zusätzlichen Speicher für die Heuristikwerte und verarbeitet — wie Dijkstra — weiterhin keine negativen Gewichte.

| Algorithmus | Verarbeitet negative Gewichte? | Zeit | Anmerkungen |
|---|---|---|---|
| BFS | entfällt (nur ungewichtet) | O(V+E) | kürzester Pfad nach Kantenzahl |
| Kürzeste Pfade in DAGs | Ja (es gibt von vornherein keine Kreise) | Θ(V+E) | am schnellsten, aber nur für DAGs |
| Dijkstra | Nein | O((V+E) log V) | klassisches gieriges SSSP |
| A* | Nein | O((V+E) log V) | Dijkstra + zielgerichtete Heuristik |
| Bellman-Ford | Ja (erkennt negative Kreise) | O(V·E) | am allgemeinsten, am langsamsten |

## Maximaler Fluss (Ford-Fulkerson)

Ein anderes Problem auf gewichteten gerichteten Graphen: Gegeben eine Quelle s, eine Senke t und **Kapazitäten** auf den Kanten, finde den maximalen Gesamtfluss, der von s nach t geschoben werden kann, ohne die Kapazität einer Kante zu überschreiten.

**Methode von Ford-Fulkerson**: Wiederholt einen **flusserhöhenden Pfad** (einen Pfad von s nach t mit freier Restkapazität) im **Restgraphen** finden — einem Graphen, der die verbleibende Vorwärtskapazität *und* für schon gesendeten Fluss eine Rückwärtskante führt (damit Fluss „zurückgenommen“ werden kann, falls eine bessere Route gefunden wird) — und entlang dieses Pfades Fluss in Höhe seiner Engpasskapazität schieben. **Endet, wenn kein flusserhöhender Pfad mehr existiert**; der gefundene Fluss ist dann beweisbar maximal (Max-Flow-Min-Cut-Theorem).

**Die konkrete Suchkonvention dieser Vorlesung**: Flusserhöhende Pfade werden über eine **DFS von s aus** gefunden, die stets zuerst in den erreichbaren Knoten mit der kleinsten Nummer/Buchstabenreihenfolge abzweigt (`t` wird also unmittelbar genommen, sobald es direkt erreichbar ist). Die Kantenkapazitäten werden **bei der Pfadsuche selbst ignoriert** — sie kommen erst danach ins Spiel, um den **Engpass** dieses Pfades zu berechnen (die minimale Restkapazität entlang seiner Kanten), also die Menge, die tatsächlich geschoben wird.

```
FordFulkerson(G, s, t):
  for each edge: flow = 0
  while ein flusserhöhender Pfad p im Restgraphen Gf existiert (per DFS(s), kleinster Knoten zuerst):
    bottleneck = minimale Restkapazität entlang p
    `bottleneck` Einheiten Fluss entlang p schieben (Vorwärtskanten erhöhen, Rückwärtskanten senken/erzeugen)
  return Gesamtfluss aus s heraus
```

**Durchgerechnetes Beispiel**: In einem Flussnetzwerk mit Quelle s und Senke t wurden die flusserhöhenden Pfade in dieser Reihenfolge gefunden: `(s,2,3,t)` Engpass 3, `(s,2,6,t)` Engpass 1, `(s,2,8,t)` Engpass 3, `(s,5,2,8,t)` Engpass 3, `(s,5,6,t)` Engpass 4, `(s,7,8,3,t)` Engpass 1 — **maximaler Fluss = 3+1+3+3+4+1 = 15**, und danach existiert im Restgraphen kein weiterer flusserhöhender Pfad.

Kernaussagen:
- Der Restgraph hat typischerweise **mehr** Kanten als der ursprüngliche (jede Originalkante kann sowohl eine Vorwärts- als auch eine Rückwärtskante im Restgraphen beisteuern).
- **Flusserhaltung**: An jedem Zwischenknoten (nicht s oder t) ist der gesamte eingehende Fluss stets exakt gleich dem gesamten ausgehenden Fluss.
- Der maximale Fluss ist *nicht* einfach „die Summe der Kapazitäten in die Senke“ — diese Summe ist nur eine obere Schranke (die Kapazität eines bestimmten Schnitts); der tatsächliche maximale Fluss ist durch die **minimale** Schnittkapazität über alle s-t-Schnitte beschränkt.

## Suchprobleme als Kürzeste-Wege-Graphen modellieren

Nicht jedes Kürzeste-Wege-Problem sieht von Anfang an wie ein Graph aus. Ein klassisches Beispiel: das **Wolf/Ziege/Kohlkopf-Flussüberquerungsrätsel** (ein Bauer muss Wolf, Ziege und Kohlkopf einzeln über einen Fluss bringen und darf nie ein unsicheres Paar — Wolf+Ziege oder Ziege+Kohlkopf — allein an einem Ufer zurücklassen). Als Graph modelliert: Jeder **Zustand** (welche Gegenstände am Ausgangsufer sind, einschließlich des Bauern) ist ein Knoten; jede **Kante** ist eine legale Überfahrt. Dijkstra (oder BFS, da jede Kante 1 kostet) vom Startzustand zum Zielzustand mit leerem Ufer findet die minimale Anzahl von Überfahrten.

Zwei Dinge, die dieses Beispiel konkret macht:
- **Der Stichentscheid ändert, *welche* optimale Lösung man erhält, nicht ob sie optimal ist.** Existieren zwei verschiedene kürzeste Pfade gleicher Länge, so bestimmt die Reihenfolge, in der Dijkstra Gleichstände auflöst (z. B. alphabetisch gegen eine andere Regel), welcher zurückgegeben wird — beide sind weiterhin korrekte Antworten minimaler Kosten.
- **Eine Umgewichtung kann ändern, welcher Pfad „am kürzesten“ ist.** Erhalten Überfahrten mit einem Tier die Kosten 1, Überfahrten mit nur dem Kohlkopf (oder dem Bauern allein) aber die Kosten 0, so kann sich der optimale Pfad vollständig verschieben — und kostenfreie Hin-und-Rück-Fahrten können das Optimum sogar auf neue Weise uneindeutig machen.

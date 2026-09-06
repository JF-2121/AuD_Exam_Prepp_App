---
id: graphs-traversal
title: "Graphen: Darstellung, BFS & DFS"
category: "Graphs"
order: 1
---

## Darstellung

- **Adjazenzliste**: Für jeden Knoten eine Liste seiner Nachbarn. Speicher Θ(V+E). Die Prüfung „ist (u,v) eine Kante?“ kostet O(grad(u)) — im Worst Case O(V), da die Liste eines einzelnen Knotens bis zu V−1 lang sein kann.
- **Adjazenzmatrix**: Ein V×V-Raster aus Booleans/Gewichten. Speicher Θ(V²), Kantenabfrage O(1), verschwenderisch bei dünnen Graphen.
- **Die Umwandlung zwischen beiden** ist Θ(V²): `MatrixToList(M)` durchläuft jede Zeile und hängt `j` an `L[i]` an, wann immer `M[i][j] = 1`; `ListToMatrix(L)` initialisiert eine V×V-Matrix mit Nullen und setzt dann für jedes `i` beim Durchlaufen von `L[i]` für jeden gefundenen Nachbarn `j` den Eintrag `M[i][j] = 1`.
- Für einen aus einem gerichteten Graphen erzeugten **ungerichteten** Graphen (jede gerichtete Kante `(u,v)` durch eine ungerichtete `{u,v}` ersetzt) ist die entstehende Adjazenzmatrix `A'` stets **symmetrisch** (`A'[u][v] = A'[v][u] = 1`) — es gilt also `A' = (A')ᵀ`, das Transponieren ändert nichts.

## Breitensuche (BFS)

Erkundet den Graphen in Schichten von einer Quelle nach außen und verwendet dazu eine **Queue**. Findet den **kürzesten Pfad nach Kantenzahl** (ungewichteten kürzesten Pfad) von der Quelle zu jedem erreichbaren Knoten.

```
BFS(G, s)
  for each vertex u: color[u] = WHITE, dist[u] = ∞
  color[s] = GRAY; dist[s] = 0; enqueue(Q, s)
  WHILE Q nicht leer DO
    u = dequeue(Q)
    for each neighbor v of u:
      IF color[v] == WHITE THEN
        color[v] = GRAY; dist[v] = dist[u] + 1; parent[v] = u
        enqueue(Q, v)
    color[u] = BLACK
```

**Komplexität**: Θ(V + E) — jeder Knoten wird einmal eingereiht, jede Kante einmal betrachtet (zweimal bei ungerichteten Graphen).

**Notationsanmerkung**: Hat ein Knoten mehrere unentdeckte Nachbarn, so ist die Konvention dieser Vorlesung, sie in **aufsteigender (lexikografisch kleinster zuerst) Reihenfolge** zu entdecken. Klausur-Traces werden in eine **Iterationstabelle** eingetragen: Für jeden Durchlauf der while-Schleife wird notiert, welcher Knoten `u` gerade entnommen wurde, welche Nachbarn `v` in diesem Schritt neu entdeckt wurden und welchen Inhalt die Queue `Q` am Ende des Schritts hat.

**Durchgerechnetes Beispiel** (gerichteter Graph mit 7 Knoten, BFS von C aus, Gleichstände aufsteigend):

| Iteration | u | v entdeckt | Q danach |
|---|---|---|---|
| 0 | – | – | [C] |
| 1 | C | B, E, F | [B, E, F] |
| 2 | B | D, G | [E, F, D, G] |
| 3 | E | – | [F, D, G] |
| 4 | F | A | [D, G, A] |
| 5 | D | – | [G, A] |
| 6 | G | – | [A] |
| 7 | A | – | [] |

Endgültige Distanzen von C: B=1, E=1, F=1, D=2, G=2, A=2.

## Tiefensuche (DFS)

Erkundet jeden Zweig so weit wie möglich, bevor sie zurückverfolgt, und verwendet dazu einen **Stack** (explizit oder über den Aufrufstack per Rekursion). Dient als Baustein für topologische Sortierung, Kreiserkennung und Algorithmen für starke Zusammenhangskomponenten.

```
DFS(G)
  for each vertex u: color[u] = WHITE
  time = 0
  for each vertex u: if color[u] == WHITE then DFS-VISIT(u)

DFS-VISIT(u)
  color[u] = GRAY; time += 1; disc[u] = time
  for each neighbor v of u:
    IF color[v] == WHITE THEN parent[v] = u; DFS-VISIT(v)
  color[u] = BLACK; time += 1; finish[u] = time
```

**Komplexität**: Θ(V + E), genau wie BFS — der Unterschied liegt in der Erkundungsreihenfolge (Stack/LIFO gegen Queue/FIFO), nicht in den asymptotischen Kosten.

**BFS gegen DFS**: BFS verwenden, wenn kürzeste Pfade in einem ungewichteten Graphen oder eine schichtweise Erkundung gebraucht werden; DFS verwenden, wenn vollständige Pfade erkundet, Kreise erkannt oder auf Finish-Zeiten beruhende Eigenschaften berechnet werden sollen (topologische Ordnung, SCCs).

## Kantenklassifikation (per DFS)

Jede während einer DFS betrachtete Kante fällt in einen von vier Typen, bestimmt durch Farbe/Entdeckungszeit des Knotens, auf den sie zeigt:

| Typ | Wann (u,v) betrachtet wird | Bedeutung |
|---|---|---|
| Baumkante | v.color == WHITE | v wird über diese Kante erstmals entdeckt |
| Rückwärtskante | v.color == GRAY | v ist ein Vorfahre von u (diese Kante schließt einen Kreis) |
| Vorwärtskante | v.color == BLACK und u.disc < v.disc | v ist ein Nachfahre von u, bereits fertig |
| Kreuzkante | v.color == BLACK und u.disc > v.disc | v liegt in einem bereits erkundeten, unverwandten Teil des Baums |

**Ungerichtete Graphen erzeugen ausschließlich Baum- und Rückwärtskanten** — Vorwärts- und Kreuzkanten sind unmöglich, da jede Kante von beiden Endpunkten aus betrachtet wird.

**Notationsanmerkung**: Hat ein Knoten mehrere unentdeckte Möglichkeiten, so geben DFS-Traces in dieser Vorlesung manchmal **absteigende** Reihenfolge vor (größter Schlüssel zuerst) statt aufsteigender — immer prüfen, welche Konvention eine Aufgabe angibt, da sie die resultierende disc-/finish-Numerierung ändert (nicht aber die Korrektheit der zugrunde liegenden Baumstruktur).

**Kantentypen aus disc-/finish-Intervallen ablesen** — sobald jeder Knoten ein Paar `(disc, finish)` hat, lässt sich jede Nicht-Baumkante `(u,v)` rein aus der Intervall-Verschachtelung klassifizieren, ohne die DFS erneut auszuführen: Liegt das Intervall von `v` **verschachtelt innerhalb** dessen von `u` und ist `v` ein echter Nachfahre → **Vorwärtskante**; liegt das Intervall von `u` verschachtelt innerhalb dessen von `v` → **Rückwärtskante**; sind die beiden Intervalle **disjunkt** → **Kreuzkante** (und nach dem Klammerungssatz ist keine andere Beziehung zwischen zwei Intervallen möglich). Dieser Intervalltrick ist in der Klausur der schnelle Weg, jede Kante zu klassifizieren, sobald die disc-/finish-Tabelle ausgefüllt ist.

## Topologische Sortierung

Nur für einen **DAG** (gerichteten kreisfreien Graphen) definiert. Ordnet alle Knoten so, dass für jede Kante (u,v) der Knoten u vor v erscheint.

```
TOPOLOGICAL-SORT(G)
  DFS(G) ausführen; jedes Mal, wenn ein Knoten fertig wird, ihn VORNE in eine verkettete Liste L einfügen
  return L
```

**Komplexität**: Θ(V+E) (wie DFS; das Einfügen am Anfang einer verketteten Liste ist Θ(1)).

## Starke Zusammenhangskomponenten (SCC)

Eine maximale Knotenmenge C, in der es für jedes Paar u,v ∈ C sowohl einen Pfad u→v **als auch** v→u gibt. Zwei verschiedene SCCs überlappen sich nie.

```
SCC(G)
  DFS(G) ausführen                              // Finish-Zeiten bestimmen
  Gᵀ berechnen                                   // Transponierte: jede Kante umdrehen
  DFS(Gᵀ) ausführen, Knoten in der Hauptschleife in ABSTEIGENDER Finish-Zeit aus Schritt 1 besuchen
  jeden DFS-Baum aus Schritt 3 als eine SCC ausgeben
```

**Komplexität**: Θ(V+E) — zwei DFS-Durchläufe plus der Aufbau der Transponierten.

**Durchgerechnetes Beispiel** (gerichteter Graph mit 10 Knoten, jeweils das kleinste Element zuerst erkundet): Der erste DFS(G)-Durchlauf erzeugt die Baumkanten `1→3→6→2→4→7→10` (Rückverfolgung), dann `2→5→9→8` (vollständige Rückverfolgung heraus), mit den Finish-Zeiten `10:8, 7:9, 4:10, 9:15, 8:14, 5:16, 2:17, 6:18, 3:19, 1:20`. Die zweite DFS läuft auf `Gᵀ` und besucht die Knoten in der Hauptschleife in **absteigender Finish-Zeit** aus dem ersten Durchlauf (beginnt also bei 1, dann 3, dann 6, …). Das erzeugt fünf DFS-Bäume in `Gᵀ`, jeder genau eine SCC: **{1}, {3}, {2,4,6}, {5,8,9}, {7,10}** — insgesamt 5 starke Zusammenhangskomponenten.

**Randfälle, aus demselben Beispiel**:
- **Das Hinzufügen einer Kante kann mehrere SCCs zu einer verschmelzen**, aber nie mehr als das (es kann eine SCC nicht *aufspalten*). Das Hinzufügen der Kante `5→1` zum obigen Graphen fädelt einen Kreis durch vier der fünf Komponenten (`{1}, {3}, {2,4,6}, {5,8,9}` — alles außer `{7,10}`, das von dieser neuen Kante unberührt bleibt) und verschmilzt alle vier zu einer einzigen SCC: Die Gesamtzahl sinkt von 5 auf **2**.
- **Das Entfernen einer Kante kann eine SCC in mehrere aufspalten**, verschmilzt aber nie etwas. Das Entfernen der Kante `8→5` aus der (bereits verschmolzenen oder ursprünglichen) Komponente `{5,8,9}` bricht ihren inneren Kreis und spaltet sie in **drei** separate Einzelkomponenten `{5}, {8}, {9}`: Die Gesamtzahl steigt um **2**.
- Allgemein: Das Hinzufügen einer Kante kann die Anzahl der SCCs nur **verringern oder gleich lassen**; das Entfernen einer Kante kann sie nur **erhöhen oder gleich lassen** — niemals umgekehrt.

## Eulerkreis (Bonus)

Ein **Eulerkreis** ist ein Kreis auf einem (stark) zusammenhängenden gerichteten Graphen, der **jede Kante genau einmal** besucht (Knoten dürfen sich wiederholen).

- **Notwendige Bedingung**: Ein Eulerkreis existiert nur, wenn bei jedem Knoten der **Eingangsgrad gleich dem Ausgangsgrad** ist. *Beweisskizze*: Besucht der Kreis den Knoten `v` genau `k` mal, so muss er bei `v` genau `k` eingehende und `k` ausgehende Kanten benutzen (ein Paar pro Besuch) — und da der Kreis keine Kante wiederverwendet, kann `v` im ganzen Graphen **höchstens** `k` eingehende und `k` ausgehende Kanten haben, sonst würde eine Kante an `v` nie besucht. Also gilt exakt Eingangsgrad = Ausgangsgrad = k.
- **Ein gieriger Lauf schließt sich stets zu *irgendeinem* Kreis**: Beginnt man an einem beliebigen Knoten und folgt wiederholt einer beliebigen unbenutzten ausgehenden Kante (und notiert jede besuchte Kante), so endet man garantiert wieder am Start — man bleibt nie an einem anderen Knoten hängen. Warum: Hat der Teillauf `k'` ausgehende Kanten eines Knotens `v` (außer dem Startknoten) verbraucht, so garantiert die Bedingung Eingangsgrad = Ausgangsgrad, dass auch `k'` (bzw. `k'−1` beim Startknoten) eingehende Kanten verbraucht sind — es gibt also stets eine weitere ausgehende Kante zum Verlassen, **es sei denn**, `v` ist der Startknoten, an dem der Lauf dann enden muss.
- **Ein einzelner gieriger Lauf muss aber nicht jede Kante abdecken.** Endet er vorzeitig (zurück am Start, während anderswo im Graphen noch Kanten unbenutzt sind), so sucht man einen Knoten auf dem aktuellen Kreis, der noch eine unbenutzte ausgehende Kante hat, und wiederholt dort dieselbe gierige Konstruktion, um einen zweiten, kantendisjunkten Kreis zu erhalten, der genau diesen einen Knoten mit dem ersten teilt — dann **spleißt** man die beiden Kreise an ihrem gemeinsamen Knoten zu einem größeren zusammen. Wiederholt man dieses Spleißen, bis nirgends unbenutzte Kanten übrig sind, erhält man einen echten Eulerkreis.

---
id: red-black-trees
title: "Rot-Schwarz-Bäume"
category: "Trees"
order: 2
---

## Warum

Ein reiner BST kann zur Höhe n entarten (z. B. beim Einfügen sortierter Eingaben). Ein Rot-Schwarz-Baum ist ein BST mit zusätzlichen Regeln, die eine **Höhe ≤ 2·log(n+1)** garantieren und Suchen/Einfügen/Löschen damit selbst im Worst Case bei Θ(log n) halten.

## Die vier Regeln

1. Jeder Knoten ist **rot** oder **schwarz**.
2. Die **Wurzel ist schwarz**.
3. Ein **roter Knoten hat nie ein rotes Kind** (auf keinem Pfad stehen zwei Rote hintereinander).
4. Jeder Pfad von einem Knoten zu irgendeinem seiner Nachfahren-`nil`-Blätter enthält **dieselbe Anzahl schwarzer Knoten** (seine „Schwarzhöhe“).

⟹ Folgerung aus Regel 4: Hat ein Knoten nur ein echtes Kind, so *muss* dieses Kind rot sein (sonst hätte die fehlende Seite weniger schwarze Knoten).

Implementierungen verwenden typischerweise einen einzigen gemeinsamen **Wächterknoten** (`T.nil`, schwarz gefärbt) anstelle echter `nil`-Zeiger, sodass jeder Knoten stets nicht-null `left`/`right`/`parent`-Referenzen hat — das beseitigt nahezu alle Nullprüfungs-Sonderfälle aus den Algorithmen.

## Einfügen

Genau wie in einem normalen BST einfügen, den neuen Knoten **rot** färben, dann eine **Fixup**-Routine aufrufen, die eine mögliche Verletzung von Regel 3 (roter Knoten mit rotem Vater) reparariert, indem sie den Baum hinauf **Umfärbungen** und **Rotationen** anwendet — es sind nie mehr als 2 Rotationen nötig, um ein Einfügen vollständig zu reparieren. Insgesamt: **Θ(log n)**.

Die **Rotation** ist das zentrale Rebalancierungs-Primitiv: eine lokale O(1)-Umstrukturierung, die ändert, welcher von zwei Knoten „oben“ steht, und dabei die BST-Ordnungseigenschaft erhält.

## Löschen

Wie in einem normalen BST löschen (mit transplant + Nachfolger, genau wie beim reinen BST), aber war der entfernte oder verschobene Knoten schwarz, so kann ein „doppelt schwarzes“ Defizit entstehen, das Regel 4 verletzt. Eine **Delete-Fixup**-Routine löst das auf, indem sie den Baum hinaufläuft, die Farbe des Bruders und die Farben seiner Kinder betrachtet und einen von vier Standardfällen anwendet (Umfärben, oder eine Rotation gefolgt von Umfärben), bis das Defizit absorbiert ist oder die Wurzel erreicht. Ebenfalls **Θ(log n)**.

## Komplexitätsübersicht

| Operation | Zeit |
|---|---|
| Suchen | Θ(log n) |
| Einfügen | Θ(log n) |
| Löschen | Θ(log n) |

**Einsatz in der Praxis**: Der Completely Fair Scheduler (CFS) von Linux verwendet einen Rot-Schwarz-Baum, um lauffähige Prozesse nach virtueller Laufzeit geordnet zu halten.

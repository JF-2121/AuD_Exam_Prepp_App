---
id: stacks-queues
title: "Stacks & Queues"
category: "Basic Data Structures"
order: 1
---

## Stack — LIFO (Last In, First Out)

Wie ein Kartenstapel: Die zuletzt oben abgelegte Karte wird als erste wieder entnommen.

- `push(k)` — k oben hinzufügen
- `pop()` — das oberste Element entfernen und zurückgeben
- `isEmpty()` — prüfen, ob der Stack leer ist

Array-Implementierung: einen `top`-Index führen. `push` erhöht `top` und schreibt dann; `pop` liest und verringert dann. Beides ist **Θ(1)**, aber ein Array fester Größe kann überlaufen — die üblichen Abhilfe ist, die Arraygröße bei Vollbelegung zu verdoppeln (und zu halbieren, wenn sie auf ¼ Füllung fällt), was selbst mit Größenanpassung **amortisiert Θ(1)** für push/pop ergibt.

**Anwendungen**: Funktions-Aufrufstack, Undo-Historie, Ausdrucks- und Syntaxanalyse.

**Ein häufiger Trace-Fehler**: zu vergessen, dass `pop` ein Element tatsächlich *entfernt* (und nicht bloß „liest“) — z. B. hinterlässt die Folge `push(2), push(5), pop(), push(7), push(1), pop()` auf einem initial leeren Stack mit Arraygröße 6 **nicht** `[2,5,7,1,_,_]` im Array (dieser Trace ignoriert, was die Pops wirklich entfernt haben). Korrekt Schritt für Schritt: `push(2)`→`[2,_,_,_,_,_]` top=0; `push(5)`→`[2,5,_,_,_,_]` top=1; `pop()` liefert 5 →`[2,_,_,_,_,_]` top=0; `push(7)`→`[2,7,_,_,_,_]` top=1; `push(1)`→`[2,7,1,_,_,_]` top=2; `pop()` liefert 1 →`[2,7,_,_,_,_]` top=1. **Korrekter Endzustand: `[2, 7, _, _, _, _]` mit der 7 obenauf** — jedes `pop` muss den logischen Stack tatsächlich verkleinern, nicht bloß notiert und übersprungen werden.

## Queue — FIFO (First In, First Out)

Wie eine Warteschlange an der Kasse: Wer zuerst kam, wird zuerst bedient.

- `enqueue(k)` — k hinten hinzufügen
- `dequeue()` — das vorderste Element entfernen und zurückgeben

**Falle bei der Array-Implementierung**: Eine naive Array-Queue „läuft aus dem Array hinaus“, während front und rear vorwärts wandern. Die Abhilfe ist ein **zyklisches Array (Ringpuffer)**: Indizes per Modulo umbrechen, `rear = (rear + 1) mod size`. Sowohl `enqueue` als auch `dequeue` sind **Θ(1)**.

**Implementierung mit verketteter Liste**: `front`/`rear`-Zeiger in eine einfach verkettete Liste führen — `enqueue` hängt bei `rear` an, `dequeue` entfernt bei `front`. Ebenfalls Θ(1).

**Anwendungen**: Task-Scheduling, Puffern, Breitensuche.

**Deque** (doppelendige Queue) verallgemeinert beides: Einfügen und Entfernen an *beiden* Enden.

**Durchgerechnetes Beispiel — Trace einer Queue auf einem zyklischen Array** (Größe 6, Konvention der Vorlesung: `front=0, rear=-1` im leeren Zustand). Ziel-Endzustand: Array `[2, _, _, 5, 6, 7]` (Index 0 = 2, Indizes 1–2 veraltet/unbenutzt, Index 3 = 5, Index 4 = 6, Index 5 = 7) — logisch ist 5 das älteste und 2 das neueste Element. Eine minimale Operationsfolge, die diesen Zustand erreicht: 3 Dummy-Werte einfügen (füllt Indizes 0–2, `rear=2`) → alle 3 entnehmen (leert die Queue, hinterlässt aber `front=3`) → 5 einfügen (Index 3), 6 einfügen (Index 4), 7 einfügen (Index 5), 2 einfügen (bricht per Modulo zurück auf Index 0 um, `rear=0`). Genau der Umbruch (`rear = (rear+1) mod size`) erlaubt es, dass Index 0 das *neueste* Element hält, während Index 3 das älteste hält — die logische Reihenfolge einer Queue von vorne nach hinten muss nach einem Umbruch nicht mehr der aufsteigenden Array-Indexreihenfolge entsprechen.

## Einen ADT aus einem anderen bauen

Zwei Richtungen, beide klassische Klausuraufgaben — das FIFO-Verhalten einer Queue mit LIFO-Stacks zu implementieren und umgekehrt.

**Queue aus zwei Stacks** (`S1`, `S2`): `enqueue(x)` legt immer auf `S1`. `dequeue()` entnimmt immer von `S2`; ist `S2` zuvor leer, wird ganz `S1` nach `S2` umgeschüttet (jeweils von `S1` entnehmen und auf `S2` legen, was die Reihenfolge **umkehrt** — das älteste Element landet oben auf `S2`, bereit zur Entnahme), und dann von `S2` entnommen.

```
enqueue(Q, x):  push(S1, x)                          // O(1)
dequeue(Q):
  if isEmpty(S2):
    while not isEmpty(S1): push(S2, pop(S1))          // S1 umgekehrt nach S2
  return pop(S2)
```

`new`, `isEmpty` und `enqueue` sind alle **O(1)**. `dequeue` ist pro Aufruf **O(n) im Worst Case** (das vollständige Umschütten mit Umkehrung), aber über eine lange Operationsfolge **amortisiert O(1)** (jedes Element wandert in seinem Leben höchstens einmal von S1 nach S2) — ein einzelner Aufruf kann im Worst Case dennoch O(n) kosten.

**Stack aus zwei Queues** (`Q1`, `Q2`, Invariante: eine ist stets leer): `push(x)` fügt in die gerade nichtleere Queue ein (oder per Konvention in `Q2`, wenn beide leer sind). `pop()` entnimmt aus der nichtleeren Queue alle Elemente **außer dem letzten** und legt sie in der Reihenfolge in die andere Queue, entnimmt dann dieses letzte (zuletzt eingefügte) Element und gibt es zurück — da eine Queue nur vorne entnehmen kann, ist das der einzige Weg, an das *zuletzt* eingefügte Element zu kommen, das `pop` gerade braucht.

Laufzeit: `new`, `isEmpty` und `push` sind **O(1)**; `pop` ist **O(n)** (alle bis auf ein Element müssen umgeschichtet werden).

**Entwurfsanmerkung — warum nicht direkt Hilfs-Queues für einen Stack (oder Stacks für eine Queue) ohne dieses Umschichten?** Es liegt an FIFO gegen LIFO: Ein Stack braucht schnellen Zugriff auf das *zuletzt* hinzugefügte Element — genau das liefert ein Stack gratis (top), während eine Queue es aktiv verbirgt (front); es aus einer Queue zu gewinnen erfordert, alles davor abzutragen. Symmetrisch braucht eine Queue das *zuerst* hinzugefügte Element, das ein Stack unter allem seither Aufgelegten begräbt — es zu gewinnen erfordert, den ganzen Stack umzukehren. Aus welchem ADT man auch baut: Man kämpft gegen dessen natürliche Zugriffsreihenfolge, um die des anderen offenzulegen.

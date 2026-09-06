---
id: string-matching
title: "String Matching"
category: "String Algorithms"
order: 1
---

## Problemstellung

Gegeben ein **Text** `T` (Array der Länge `n`) und ein **Muster** `P` (Array der Länge `m ≤ n`) über einem endlichen Alphabet `Σ`: Finde alle gültigen **Verschiebungen** `sft` (0 ≤ sft ≤ n − m), sodass `T[sft, …, sft + m − 1] = P` gilt, also `T[sft + j] = P[j]` für alle `0 ≤ j < m`.

## Naives String Matching

Jede mögliche Verschiebung ausprobieren; für jede das Muster zeichenweise gegen dieses Textfenster vergleichen.

```
NaiveStringMatching(T, P):
  n = length(T); m = length(P)
  L = []
  for sft = 0 to n - m:
    isValid = true
    for j = 0 to m - 1:
      if P[j] != T[sft + j]:
        isValid = false
    if isValid:
      L = append(L, sft)
  return L
```

- Die **Korrektheit** folgt direkt aus der Schleifeninvariante „vor der `sft`-ten Iteration enthält `L` genau die gültigen Verschiebungen `t < sft`“ (Initialisierung/Erhaltung/Terminierung gelten trivial, da die innere Schleife exakt die Definition einer gültigen Verschiebung prüft).
- **Komplexität: O((n − m + 1)·m)** — die äußere Schleife läuft `n − m + 1` mal, die innere Vergleichsschleife bis zu `m` mal pro äußerer Iteration. Keine bei einer Verschiebung gewonnene Information wird zur nächsten mitgenommen.

## Der Algorithmus von Rabin–Karp

**Idee**: Statt Strings zeichenweise zu vergleichen, einen **numerischen Fingerabdruck** jedes Fensters mit dem des Musters vergleichen — zwei Zahlen zu vergleichen ist O(1) statt O(m).

Muster und jedes Fenster der Länge `m` im Text als Zahlen zur Basis `d` behandeln (`d = |Σ|`, z. B. `d = 10` für Ziffernstrings). Sei `p` der Zahlenwert von `P` und `t_sft` der Zahlenwert von `T[sft, …, sft+m−1]`. Dann ist `sft` **genau dann** eine gültige Verschiebung, **wenn `t_sft = p`** gilt.

**Vorverarbeitung — `p` und `t_0` in Θ(m) per Horner-Schema:**

```
Compute(P):
  m = length(P); p = 0
  for i = 0 to m - 1:
    p = 10 * p + P[i]
  return p
```

**Rollendes Update — `t_{sft+1}` aus `t_sft` in O(1):**
`t_{sft+1} = 10 · (t_sft − 10^{m−1} · T[sft]) + T[sft + m]` — den Beitrag der führenden Ziffer abziehen, den Rest um eine Ziffer hochschieben und die neue letzte Ziffer hereinholen. Die Konstante `10^{m−1}` wird **einmal** vorberechnet.

```
RabinKarpMatchBasic(T, P):
  n = T.length; m = P.length; h = 10^(m-1)
  p, t0, L = 0, 0, []
  for i = 0 to m - 1:
    p  = 10*p  + P[i]
    t0 = 10*t0 + T[i]
  for sft = 0 to n - m:
    if p == t_sft:
      L = append(L, sft)
    if sft < n - m:
      t_{sft+1} = 10*(t_sft - T[sft]*h) + T[sft + m]
  return L
```

**Der Haken — die Zahlen werden riesig.** Bei langen Mustern können `p` und `t_sft` ein Maschinenwort überschreiten und damit die Annahme „O(1) pro Rechenoperation“ brechen. **Abhilfe**: eine Primzahl `q` so wählen, dass `10q` noch in ein Computerwort passt, und `p` sowie jedes `t_sft` **modulo `q`** berechnen — das hält die Zahlen klein, macht den Vergleich aber nicht mehr exakt:
- `t_sft ≢ p (mod q)` **garantiert**, dass `sft` *nicht* gültig ist (kann sicher übersprungen werden — keine False Negatives).
- `t_sft ≡ p (mod q)` **garantiert nicht** `t_sft = p` — ein **unechter Treffer** ist möglich. Sobald der modulare Test besteht, ist eine explizite zeichenweise Prüfung (wie die innere Schleife des naiven Algorithmus) gegen `T[sft, …, sft+m−1]` erforderlich, um einen *echten* Treffer zu bestätigen.

```
RabinKarpMatch(T, P, q):
  n = T.length; m = P.length
  h = 10^(m-1) mod q
  p, t0, L = 0, 0, []
  for i = 0 to m - 1:
    p  = (10*p  + P[i]) mod q
    t0 = (10*t0 + T[i]) mod q
  for sft = 0 to n - m:
    if p == t_sft:
      b = true
      for j = 0 to m - 1:
        if P[j] != T[sft + j]: b = false; break
      if b: L = append(L, sft)
    if sft < n - m:
      t_{sft+1} = (10*(t_sft - T[sft]*h) + T[sft + m]) mod q
  return L
```

**Komplexität**: Vorverarbeitung Θ(m); im Worst Case weiterhin O((n−m+1)·m), falls unechte Treffer häufig sind, aber bei gut gewähltem `q` ist die *erwartete* Anzahl unechter Treffer O(1), was eine **erwartete** Laufzeit von **O(n + m)** ergibt.

## Matching mit endlichem Automaten (FSM)

**Idee**: Einmal (allein aus `P`) einen deterministischen endlichen Automaten mit `m + 1` Zuständen vorberechnen, einen pro möglicher „Überlappungslänge“ zwischen dem bisher gelesenen Text und einem Präfix von `P`. Dann genügt ein **einziger Durchlauf von links nach rechts über `T`** (kein Zurücksetzen, kein erneutes Vergleichen) — O(n) nach der Vorverarbeitung.

- Der Automat befindet sich stets in einem Zustand `0 ≤ st ≤ m` mit der Bedeutung: Die letzten `st` bisher gelesenen Zeichen von `T` sind gleich `P[0, …, st−1]`, und keine größere Überlappung `i > st` gilt.
- **Übergangsfunktion `δ(st, w)`**: Von Zustand `st` aus beim Lesen des Zeichens `w` in den Zustand wechseln, der der Länge des **längsten Suffixes** von `P[0..st−1] + w` entspricht, das gleichzeitig ein **Präfix** von `P` ist (diese Länge ist stets wohldefiniert und ≤ `st + 1`).
- Das Erreichen von `st = m` bedeutet, dass das gerade gelesene Suffix von `T` dem gesamten Muster entspricht — ein Treffer, der an der aktuellen Position endet, also ist die Verschiebung `sft = aktuellerIndex − m + 1` gültig.

```
FSMMatching(T, δ, m):
  n = length(T); L = []; st = 0
  for sft = 0 to n - 1:
    st = δ(st, T[sft])
    if st == m:
      L = append(L, sft - m + 1)
  return L
```

**Komplexität**: Der Aufbau von `δ` kostet O(m·|Σ|) (eine Zeile pro Zustand, eine Spalte pro Alphabetzeichen); der Matching-Durchlauf selbst ist **O(n)** — eine echte Verbesserung gegenüber der *erwarteten* Schranke von Rabin–Karp, um den Preis einer aufwendigeren, alphabetabhängigen Vorverarbeitung.

**Der FSM funktioniert über jedem Alphabet, nicht nur über Buchstaben/Ziffern** — ein zweites durchgerechnetes Beispiel nutzt `Σ = {β, δ, λ, σ}` (griechische Buchstaben) und das Muster `P = [λ, δ, λ, σ]` (also `m = 4`, der Automat hat die Zustände `0..4`). Lässt man den resultierenden Automaten über `T = [β,λ,δ,λ,β,σ,λ,λ,δ,λ,δ,λ,σ,λ,σ,β]` laufen (n=16), so ist die Zustandsfolge `0,1,2,3,0,0,1,1,2,3,2,3,4,1,0,0` — der Zustand `st=4=m` wird am Textindex `sft=12` erreicht (beim Lesen von `T[12]=σ`), was die einzige gültige Verschiebung `12 − 4 + 1 = 9` ergibt. Gegenprobe: `T[9..12] = [λ,δ,λ,σ] = P` ✓.

## Die drei Ansätze im Vergleich

| Algorithmus | Vorverarbeitung | Matching | Worst Case |
|---|---|---|---|
| Naiv | — | O((n−m+1)·m) | O((n−m+1)·m) |
| Rabin–Karp | Θ(m) | erwartet O(n+m) | O((n−m+1)·m) (viele unechte Treffer) |
| Endlicher Automat | O(m·\|Σ\|) | O(n) | O(m·\|Σ\| + n) |

## Randfälle & Invarianten

- Eine gültige Verschiebung erfordert, dass das **gesamte** Muster übereinstimmt — ein einziges abweichendes Zeichen irgendwo entwertet diese Verschiebung in der inneren Schleife des naiven Algorithmus.
- Der modulare Test von Rabin–Karp kann **False Positives** (unechte Treffer) erzeugen, aber **nie False Negatives** — `t_sft ≠ p (mod q)` ist ein korrekter (wenn auch unscharfer) Weg, eine Verschiebung sofort zu verwerfen.
- Der Zustand `st` des FSM nach dem Lesen eines Präfixes von `T` ist *nicht* einfach „wie viele Zeichen beim letzten Mal übereinstimmten“ — er wird in jedem Schritt neu als die **längste** gültige Überlappung bestimmt, die bei einem Mismatch auch **sinken** kann (anders als ein naiver Zähler, der einfach auf 0 zurückfiele).
- Alle drei Algorithmen lösen genau dasselbe Problem (dieselbe Menge gültiger Verschiebungen) — sie unterscheiden sich rein im Kompromiss zwischen Vorverarbeitungskosten und Matching-Kosten pro Zeichen, und genau das ist die Achse, die Klausurfragen abklopfen.

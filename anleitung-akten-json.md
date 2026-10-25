# Anleitung: So muss die Datei `akten.json` aufgebaut sein

Diese Anleitung ist für eine KI oder eine Person gedacht, die Akten für das Medic-Handbuch schreibt oder ändert. Sie beschreibt, wie `akten.json` aufgebaut sein muss, damit die Seite die Datei einliest und jede Akte korrekt anzeigt.

## 1. Was die Datei ist

- `akten.json` enthält **alle Akten** des Medic-Handbuchs als **ein JSON-Array**, also eine Liste in eckigen Klammern `[ … ]`.
- Die Seite `index.html` lädt diese Datei beim Start. Sie prüft jede Akte und überspringt fehlerhafte Einträge. Die übrigen Akten werden trotzdem angezeigt.
- Die Seite **schreibt nie in `akten.json`**. Änderungen, die Nutzer im Browser machen, werden im Browser gespeichert (siehe Abschnitt 10).

## 2. Grundregeln (verbindlich)

1. Die Ausgabe ist **die vollständige Datei**, also das gesamte Array mit allen Akten, nicht nur die geänderten Einträge.
2. Die Ausgabe enthält **nur das JSON**, ohne Erklärtext davor oder danach. Keine Kommentare, keine nachgestellten Kommas, keine Platzhalter wie `…` oder `...`.
3. Es werden nur gerade Anführungszeichen `"` verwendet, keine typografischen Zeichen wie „ “.
4. Keine HTML-Tags wie `<b>` oder `<br>`. Formatierung gibt es nur über `**fett**` und Verweise `[[Titel]]` (siehe Abschnitt 6).
5. **Kennung und Titel sind identisch.** Bei jeder Akte ist `id` genau derselbe Text wie `title`, mit gleicher Groß- und Kleinschreibung und gleichen Sonderzeichen. Die Kennung ist der Schlüssel, unter dem Nutzeränderungen gespeichert werden.
6. **Bestehende Akten:** `id` und `title` werden nie geändert, auch nicht die Schreibweise.
7. **Titel sind eindeutig**, auch wenn man Groß- und Kleinschreibung nicht beachtet.
8. **Keine erfundenen Angaben.** Dosierungen, Mengen, Zeiten und Befunde werden nicht erfunden. Fehlt eine Angabe oder ist sie unsicher, wird sie nicht eingetragen, sondern in der Antwort als offene Frage genannt.

## 3. Aufbau einer Akte

| Feld | Pflicht | Inhalt |
|---|---|---|
| `id` | ja | Text, identisch mit `title`. |
| `title` | ja | Text, der Name der Akte, so wie er angezeigt wird. |
| `cat` | ja | Kategorie. Erlaubt sind nur diese Werte: `"v"` Vitalwerte & Amnestika (schreibgeschützt), `"b"` Behandlungen, `"n"` Narkose, `"o"` Operationen, `"m"` Medikamente. |
| `desc` | nein | Kurze Beschreibung unter dem Titel. Weglassen, wenn es keine gibt. |
| `kw` | nein | Suchbegriffe, durch Leerzeichen getrennt, z. B. `"blutung wunde naht"`. |
| `sections` | nein | Liste der Abschnitte in der Anzeigereihenfolge. Eine leere Liste `[]` ist erlaubt. |
| `me` | nein | Liste der Zeilen für die untere Box (Abschnitt 4). Weglassen oder `[]`. |
| `table` | nein | Optionale Tabelle, z. B. für Normwerte, meist bei Kategorie `"v"`: `{"h": [...], "r": [[...], ...]}`. |
| `widget` | nein | Nur `true` bei der Akte „Blutgruppen und Spender“. Sonst weglassen. |
| `boxes` | nein | Zusätzliche /me-Boxen. Jede Box ist ein Objekt mit `t` (Titel) und `me` (Liste der Zeilen). Meist weglassen, die Nutzer legen weitere Boxen selbst an. |

Felder, die nicht in dieser Tabelle stehen, werden ignoriert. Das Feld `k` darf nicht verwendet werden.

**Abschnitte (`sections`).** Jeder Abschnitt ist ein Objekt mit diesen Feldern:

- `h`: die Überschrift. Pflicht, nicht leer, z. B. `"Erkennung"`, `"Behandlung"`, `"Ablauf"` oder `"Geräte"`.
- `items`: die Zeilen des Abschnitts. Pflicht. Eine Liste von Texten, jede Zeile ist ein Eintrag, keine leeren Zeilen.
- `mode` (optional): die Darstellung.
  - `"bullet"`: Stichpunkte
  - `"number"`: Zahlenfolge 1., 2., 3.
  - `"text"`: Fließtext. Jede Zeile wird als eigener Absatz angezeigt.
  - Standard: `"number"` bei der Überschrift „Ablauf“, sonst `"bullet"`. Andere Werte werden ignoriert.

## 4. Die untere Box (`me`): Handlungen und Notizen

- **Material-Zeile:** Die erste Zeile von `me` ist in jeder bearbeitbaren Akte die Material-Zeile. Sie beginnt mit `/me nimmt` und nennt die Gegenstände, die die Behandlung braucht, z. B. `/me nimmt Kühlakku, elastische Binde und Kissen aus dem Verbandskasten`. Übersichtsakten ohne eigene Behandlung haben nur diese Zeile. Die Box `me` heißt in der Anzeige immer „Durchführung“.
- **Zeile mit `/me`** ist eine Handlung, die man im Rollenspiel per Klick kopieren kann. Sie beginnt mit `/me ` (Schrägstrich, `me`, Leerzeichen). Danach folgt die Handlung im Präsens in der dritten Person, z. B. `/me desinfiziert die Wunde und die umliegende Haut`.
- **Zeile ohne `/me`** ist eine Notiz und nicht kopierbar. Notizen beginnen mit `Notiz: `, z. B. `Notiz: Tetanusschutz prüfen, bei Bedarf auffrischen`.
- **Eine Notiz darf das Wort `/me` nirgends enthalten.** Sonst würde sie als kopierbare Zeile behandelt.

## 5. Stil für Erkennung, Behandlung und Ablauf

- **Erkennung** (`mode` `"bullet"`): 2 bis 4 kurze Stichpunkte mit typischen Anzeichen und Befunden.
- **Behandlung** (`mode` `"bullet"`): 2 bis 4 kurze Stichpunkte mit Maßnahmen. Medikamente werden nur als Wirkstoffgruppe genannt, nie mit Dosis, z. B. „Lokalanästhetikum (Lidocain)“.
- **Ablauf** (`mode` `"number"`): 4 bis 6 Schritte in praktischer Reihenfolge. Jeder Schritt ist ein kurzer Satz ohne Punkt am Ende, z. B. „Wunde spülen und desinfizieren“.
- **Weitere Abschnitte** (z. B. Geräte, Richtwerte, Nachsorge): nur übernehmen, wenn sie in der Vorlage stehen. Sachlich und knapp formulieren.
- **/me-Zeilen:** 4 bis 6 Stück (ohne die Material-Zeile), jede Zeile eine einzelne Handlung im chirurgischen Standardvokabular, z. B. Desinfektion, sterile Abdeckung, Lokalanästhesie, Einzelknopfnähte, Redon-Drainage, Verband.
- **Notizen:** 1 bis 3 Stück mit Hinweisen zu Nachsorge, Kontrollen oder Abwägungen, z. B. „Notiz: Nachsorge nach ärztlicher Anordnung“. Keine Mengenangaben.
- **Kategorie „m“ (Medikamente):** Der Abschnitt `Dosis` ist fachlich geprüft. Er wird nie geändert oder ergänzt. Erlaubt sind ein Abschnitt `Ablauf` (Gabe, ohne Mengen) und Zeilen in `me`.
- **Sprache:** Deutsch mit ä, ö, ü und ß. Keine Umgangssprache im Fließtext.

## 6. Verweise und Formatierung

- `**Text**` wird fett dargestellt.
- `[[Titel]]` verlinkt auf eine andere Akte. Der Titel muss zu einer vorhandenen Akte passen, am besten exakt so geschrieben wie in `title`. Nur auf vorhandene Akten verweisen.

## 7. Was die Seite überspringt oder ablehnt

| Problem | Folge |
|---|---|
| Kategorie unbekannt, z. B. `"B"` oder `"Behandlungen"` | Akte wird übersprungen |
| `id` oder `title` fehlt oder ist leer | Akte wird übersprungen |
| `id` oder `title` kommt doppelt vor | die zweite Akte wird übersprungen |
| Zeile in `items` oder `me` ist kein Text, z. B. eine Zahl oder ein Objekt | Akte wird übersprungen |
| Abschnitt ohne `h` oder ohne `items` | Akte wird übersprungen |
| `table` mit falschem Format, z. B. Zeilen, die keine Listen sind | Akte wird übersprungen |
| `boxes` mit falschem Format, z. B. eine Box ohne Liste `me` | Akte wird übersprungen |
| `desc`, `kw` oder `widget` mit falschem Typ | Akte wird übersprungen |
| Ungültiger `mode` | wird ignoriert, es gilt der Standard |
| Syntaxfehler im JSON, z. B. eine fehlende Klammer oder ein Komma zu viel | es werden **keine** Akten geladen, die Seite zeigt eine Fehlermeldung |

Übersprungene Einträge werden in der Navigation gezählt. Wer mit der Maus darüber fährt, sieht die Gründe.

## 8. Beispiele

**8.1 Kleinste gültige Akte**

```json
[
  {
    "id": "Beispielwunde",
    "title": "Beispielwunde",
    "cat": "b",
    "sections": [
      {
        "h": "Erkennung",
        "items": ["Offene Wunde mit klaffenden Wundrändern"]
      }
    ],
    "me": ["/me nimmt Verbandmaterial aus dem Verbandskasten"]
  }
]
```

**8.2 Akte mit Tabelle**

```json
[
  {
    "id": "Beispieltabelle",
    "title": "Beispieltabelle",
    "cat": "v",
    "table": {
      "h": ["Wert", "Normbereich"],
      "r": [
        ["Puls (Ruhe)", "60–80 Schläge/min"],
        ["Atmung (Ruhe)", "14–16 Atemzüge/min"]
      ]
    }
  }
]
```

**8.3 Vollständige Akte (echter Eintrag aus der Datei)**

```json
[
  {
    "id": "Platzwunde",
    "cat": "b",
    "title": "Platzwunde",
    "kw": "wunde nähen blutung",
    "sections": [
      {
        "h": "Erkennung",
        "items": [
          "Offene Wunde mit klaffenden Wundrändern",
          "Blutung je nach Gefäßbeteiligung, meist gut kontrollierbar",
          "Verschmutzung und Fremdkörper prüfen"
        ],
        "mode": "bullet"
      },
      {
        "h": "Behandlung",
        "items": [
          "Blutung mit Druckverband stillen",
          "Wunde gründlich spülen, Fremdkörper und abgestorbenes Gewebe entfernen",
          "Lokale Betäubung mit Lidocain, anschließend Naht mit Einzelknopfnähten"
        ],
        "mode": "bullet"
      },
      {
        "h": "Ablauf",
        "items": [
          "Vitalwerte prüfen und Blutung kontrollieren",
          "Wunde spülen und großzügig desinfizieren",
          "Wundrand mit Lidocain betäuben",
          "Wunde mit Einzelknopfnähten verschließen",
          "Steriler Verband, Nachsorge erklären"
        ],
        "mode": "number"
      }
    ],
    "me": [
      "/me nimmt Lidocain, Wundspülung, sterile Tücher, Nahtmaterial und Verbandmaterial aus dem Sterilset",
      "/me spült die Wunde gründlich mit steriler Lösung",
      "/me desinfiziert die Wunde und die umliegende Haut",
      "/me betäubt den Wundrand mit Lidocain",
      "/me verschließt die Wunde mit Einzelknopfnähten",
      "/me legt einen sterilen Wundverband an",
      "Notiz: Lidocain nach Körpergewicht dosieren, Höchstmenge beachten",
      "Notiz: Tetanusschutz prüfen, bei Bedarf auffrischen"
    ]
  }
]
```

Die Beispiele zeigen nur das Format. In der Ausgabe werden bestehende Akten unverändert übernommen. Neue Akten bekommen eigene Angaben aus der Vorlage.

## 9. Prüfliste vor der Ausgabe

- [ ] Die Ausgabe ist ein einziges JSON-Array. Es beginnt mit `[` und endet mit `]`.
- [ ] Jede Akte hat `id`, `title` (identisch) und `cat` (`v`, `b`, `n`, `o` oder `m`).
- [ ] `sections` ist eine Liste. Jeder Abschnitt hat `h` (Text) und `items` (Liste von Texten).
- [ ] `me` ist eine Liste von Texten. Handlungen beginnen mit `/me `, Notizen mit `Notiz: `.
- [ ] Die erste Zeile von `me` ist in jeder bearbeitbaren Akte die Material-Zeile (`/me nimmt …`).
- [ ] Keine Notiz enthält das Wort `/me`.
- [ ] `table` hat `h` (Liste von Texten) und `r` (Liste von Zeilen, jede Zeile ist eine Liste von Texten).
- [ ] Es gibt keine doppelten Kennungen und keine doppelten Titel.
- [ ] Keine Dosierungen, Mengen oder erfundenen Angaben.
- [ ] Keine HTML-Tags. Verweise nur als `[[Titel]]` auf vorhandene Akten.
- [ ] Keine Kommentare, keine nachgestellten Kommas, nur gerade Anführungszeichen.
- [ ] Bestehende Akten sind unverändert, außer den ausdrücklich genannten Änderungen.

## 10. Veröffentlichen, testen und Änderungen im Browser

1. Die Ausgabe als `akten.json` speichern (UTF-8) und in denselben Ordner wie `index.html` legen.
2. Beide Dateien auf GitHub Pages hochladen (Commit und Push). Danach die Seite neu laden.
3. Lokal nicht per Doppelklick öffnen, denn dann lädt der Browser `akten.json` nicht. Entweder den Ordner mit `python3 -m http.server` starten und `http://localhost:8000` öffnen, oder auf der Seite die Datei über das angebotene Auswahlfeld laden.
4. Die Seite schreibt nicht in `akten.json`. Nutzeränderungen werden im Browser gespeichert und haben Vorrang vor der Datei. Eine Akte, die jemand selbst bearbeitet hat, zeigt seine Fassung. Mit „Original wiederherstellen“ (Schaltfläche beim Überfahren der Überschrift) kehrt er zur Fassung aus `akten.json` zurück. Neue Zeilen wie die Material-Zeile erscheinen bei einer Akte, die schon im Browser bearbeitet wurde, erst nach „Original wiederherstellen“.

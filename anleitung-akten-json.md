# Anleitung: So muss die Datei `akten.json` aufgebaut sein

Diese Anleitung ist für eine KI oder eine Person gedacht, die Akten für das Medic-Handbuch schreibt oder ändert. Sie beschreibt, wie `akten.json` aufgebaut sein muss, damit die Seite die Datei einliest und jede Akte korrekt anzeigt.

## 1. Was die Datei ist

- `akten.json` enthält **alle Akten** des Medic-Handbuchs als **ein JSON-Array**, also eine Liste in eckigen Klammern `[ … ]`. Darin stehen auch die Unterkategorien von Behandlungen, Operationen und Medikamenten, als eigene Einträge in derselben Liste (Abschnitt 3a).
- Die Seite `index.html` lädt diese Datei beim Start. Sie prüft jede Akte und überspringt fehlerhafte Einträge. Die übrigen Akten werden trotzdem angezeigt.
- Die Seite **schreibt nie in `akten.json`**. Änderungen, die Nutzer im Browser machen, werden im Browser gespeichert (siehe Abschnitt 10).

## 2. Grundregeln (verbindlich)

1. Die Ausgabe ist **die vollständige Datei**, also das gesamte Array mit allen Akten, nicht nur die geänderten Einträge.
2. Die Ausgabe enthält **nur das JSON**, ohne Erklärtext davor oder danach. Keine Kommentare, keine nachgestellten Kommas, keine Platzhalter wie `…` oder `...`.
3. Es werden nur gerade Anführungszeichen `"` verwendet, keine typografischen Zeichen wie „ “.
4. Keine HTML-Tags außer `<u>…</u>` zum Unterstreichen, also z. B. kein `<b>` oder `<br>`. Formatierung gibt es nur über `**fett**`, `<u>unterstrichen</u>` und Verweise `[[Titel]]` (siehe Abschnitt 6).
5. **Kennung und Titel sind identisch.** Bei jeder Akte ist `id` genau derselbe Text wie `title`, mit gleicher Groß- und Kleinschreibung und gleichen Sonderzeichen. Die Kennung ist der Schlüssel, unter dem Nutzeränderungen gespeichert werden.
6. **Bestehende Akten:** `id` und `title` werden nie geändert, auch nicht die Schreibweise.
7. **Titel sind eindeutig**, auch wenn man Groß- und Kleinschreibung nicht beachtet.
8. **Keine erfundenen Angaben.** Dosierungen, Mengen, Zeiten und Befunde werden nicht erfunden. Fehlt eine Angabe oder ist sie unsicher, wird sie nicht eingetragen, sondern in der Antwort als offene Frage genannt.

## 3. Aufbau einer Akte

| Feld | Pflicht | Inhalt |
|---|---|---|
| `id` | ja | Text, identisch mit `title`. |
| `title` | ja | Text, der Name der Akte, so wie er angezeigt wird. |
| `cat` | ja | Kategorie. Erlaubt sind nur diese Werte: `"t"` ganz oben (Akten ohne Überschrift, direkt unter den Favoriten), `"v"` Vitalwerte & Amnestika (schreibgeschützt), `"b"` Behandlungen, `"o"` Operationen, `"m"` Medikamente. Die alte Kennung `"n"` (früher Kategorie Narkose) wird wie `"t"` behandelt. |
| `desc` | nein | Kurze Beschreibung unter dem Titel. Weglassen, wenn es keine gibt. |
| `kw` | nein | Suchbegriffe, durch Leerzeichen getrennt, z. B. `"blutung wunde naht"`. |
| `sections` | nein | Liste der Abschnitte in der Anzeigereihenfolge. Eine leere Liste `[]` ist erlaubt. |
| `me` | nein | Liste der Zeilen für die untere Box (Abschnitt 4). Weglassen oder `[]`. |
| `table` | nein | Optionale Tabelle, z. B. für Normwerte, meist bei Kategorie `"v"`: `{"h": [...], "r": [[...], ...]}`. |
| `widget` | nein | Nur `true` bei der Akte „Blutgruppen und Spender“. Sonst weglassen. |
| `boxes` | nein | Zusätzliche /me-Boxen. Jede Box ist ein Objekt mit `t` (Titel) und `me` (Liste der Zeilen). Meist weglassen, die Nutzer legen weitere Boxen selbst an. |
| `meTitle` | nein | Titel der Hauptbox statt „Durchführung“, z. B. `"Narkose Starten"`. Weglassen, wenn der Standardtitel gelten soll. |
| `meOff` | nein | Nur in Exportdateien aus dem Browser: `true`, wenn die Hauptbox dort entfernt wurde. In `akten.json` weglassen, die Seite liest das Feld dort nicht. |

Felder, die nicht in dieser Tabelle stehen, werden ignoriert. Das Feld `k` darf nicht verwendet werden.

**Unterkategorien.** Für `"b"`, `"o"` und `"m"` gibt es Unterkategorien. Sie stehen als eigene Einträge in `akten.json`, direkt vor den Akten, die zu ihnen gehören (Abschnitt 3a).

**Abschnitte (`sections`).** Jeder Abschnitt ist ein Objekt mit diesen Feldern:

- `h`: die Überschrift. Pflicht, nicht leer, z. B. `"Erkennung"`, `"Ablauf"` oder für Sonderfälle `"Geräte"`. Den Abschnitt „Behandlung“ schreibst du nicht in neue Akten. Nur die Originalakten „Streifschuss, Stichwunde, Bisswunde“ und „Prellung“ haben ihn, weil ihre Originaldateien ihn enthalten. Beim Import bleibt er erhalten, wenn die Datei ihn enthält.
- `items`: die Zeilen des Abschnitts. Pflicht. Eine Liste von Texten, jede Zeile ist ein Eintrag, keine leeren Zeilen.
- `mode` (optional): die Darstellung.
  - `"bullet"`: Stichpunkte
  - `"number"`: Zahlenfolge 1., 2., 3.
  - `"text"`: Fließtext. Jede Zeile wird als eigener Absatz angezeigt.
  - Standard: `"number"` bei der Überschrift „Ablauf“, sonst `"bullet"`. Andere Werte werden ignoriert.

## 3a. Unterkategorien (Behandlungen, Operationen, Medikamente)

Unterkategorien gliedern die Akten der Kategorien `"b"`, `"o"` und `"m"` in der Seitenleiste. Sie stehen als eigene Einträge in derselben Liste, direkt vor den Akten, die zu ihnen gehören. Ein solcher Eintrag ist **keine Akte**. Für ihn gilt die Regel „Kennung und Titel sind identisch“ nicht.

| Feld | Pflicht | Inhalt |
|---|---|---|
| `typ` | ja | Genau `"unterkategorie"`. So erkennt die Seite, dass es keine Akte ist. |
| `id` | ja | Eindeutige Kennung, z. B. `"b1"`. Sie wird nie geändert, sonst gehen Nutzeränderungen an dieser Unterkategorie verloren. |
| `cat` | ja | `"b"`, `"o"` oder `"m"`. |
| `title` | ja | Name in der Seitenleiste, z. B. `"Wunden & Trauma"`. Höchstens 60 Zeichen, innerhalb der Kategorie eindeutig. |

Regeln:

- Eine Unterkategorie gilt für alle folgenden Akten derselben Kategorie, bis die nächste Unterkategorie oder eine Akte einer anderen Kategorie kommt.
- Die Reihenfolge in der Datei ist die Reihenfolge in der Seitenleiste.
- Eine Unterkategorie ohne Akten ist erlaubt, etwa wenn Akten noch fehlen. Sie erscheint nur im Bearbeitungsmodus.
- Akten, vor denen in ihrer Kategorie keine Unterkategorie steht, erscheinen ohne Unterkategorie ganz oben.
- Der Titel einer Unterkategorie steht auf der Seite direkt über ihren Akten. Er ist nicht fixiert und wandert beim Scrollen mit seinen Akten mit. Bei der Suche sind die Titel ausgeblendet. Dafür muss die Datei nicht geändert werden.

Beispiel (Unterkategorie mit einer Akte):

```json
[
  {"typ": "unterkategorie", "id": "b1", "cat": "b", "title": "Leichte / Allgemeine Verletzungen"},
  {"id": "Beispielwunde", "title": "Beispielwunde", "cat": "b", "sections": [{"h": "Erkennung", "items": ["Offene Wunde mit klaffenden Wundrändern"]}], "me": ["/me nimmt Verbandmaterial aus dem Verbandskasten"]}
]
```

## 4. Die untere Box (`me`): Handlungen und Notizen

- **Material-Zeile:** Die erste Zeile von `me` ist in jeder bearbeitbaren Akte die Material-Zeile. Ausgenommen sind die Narkose-Akte „Narkose richtig einleiten“ und die Originalakten „Streifschuss, Stichwunde, Bisswunde“ und „Steckschuss“, deren Originaldateien keine Material-Zeile haben. Sie beginnt mit `/me nimmt` und nennt die Gegenstände, die die Behandlung braucht, z. B. `/me nimmt Kühlakku, elastische Binde und Kissen aus dem Verbandskasten`. Übersichtsakten ohne eigene Behandlung haben nur diese Zeile. Die Box `me` heißt standardmäßig „Durchführung“. Mit dem Feld `meTitle` in `akten.json` (Feldtabelle oben) gilt ein anderer Titel als Standard. Im Browser lässt sich der Titel mit dem Stift ändern; ein leerer Titel stellt den Titel aus der Datei wieder her, sonst „Durchführung“ (Abschnitt 10). Die Box selbst lässt sich im Browser entfernen und wieder hinzufügen (Abschnitt 10, Punkt 13).
- **Zeile mit `/me`** ist eine Handlung, die man im Rollenspiel per Klick kopieren kann. Sie beginnt mit `/me ` (Schrägstrich, `me`, Leerzeichen). Danach folgt die Handlung im Präsens in der dritten Person, z. B. `/me desinfiziert die Wunde und die umliegende Haut`. Beim Klick auf die Zeile wird nur die Handlung kopiert. Eine Bedingung davor, etwa „Wenn Puls zu niedrig:“, sowie die Zeichen für Fett und Unterstreichung werden beim Kopieren weggelassen.
- **Zeile ohne `/me`** ist eine Notiz und nicht kopierbar. Notizen beginnen mit `Notiz: `, z. B. `Notiz: Tetanusschutz prüfen, bei Bedarf auffrischen`.
- **Eine Notiz darf das Wort `/me` nirgends enthalten.** Sonst würde sie als kopierbare Zeile behandelt.
- **Trennlinie** ist eine Zeile, die genau aus `---` besteht. Sie wird als waagerechte Linie angezeigt, ist keine Textstelle und lässt sich nicht kopieren. Sie zählt weder zu den /me-Zeilen noch zur Material-Zeile. Trennlinien gliedern die Handlungen in Phasen, z. B. vor und nach einem Eingriff. Wer im Browser `---` als Text in eine Zeile schreibt, erhält ebenfalls eine Trennlinie.
- **Standard-EKG-Überwachung:** Die zusätzliche Box „Überwachung des EKGs“ in der Akte „Narkose richtig einleiten“ ist die Quelle des EKG-Symbols neben jedem Akten-Titel (Abschnitt 10). Ihr Titel muss genau so lauten. Sonst zeigt das Symbol nur einen Hinweis.

## 5. Stil für Erkennung, Ablauf und Durchführung

- **Erkennung** (`mode` `"bullet"`): 2 bis 4 kurze Stichpunkte mit typischen Anzeichen und Befunden.
- **Medikamente:** Sie werden nur als Wirkstoff oder Wirkstoffgruppe genannt, nie mit Dosis, z. B. „Lidocain“.
- **Ablauf** (`mode` `"number"`): 4 bis 6 Schritte in praktischer Reihenfolge. Jeder Schritt ist ein kurzer Satz ohne Punkt am Ende, z. B. „Wunde spülen und desinfizieren“.
- **Weitere Abschnitte** (z. B. Geräte, Richtwerte, Nachsorge): nur übernehmen, wenn sie in der Vorlage stehen. Sachlich und knapp formulieren.
- **/me-Zeilen:** 4 bis 6 Stück (ohne die Material-Zeile), jede Zeile eine einzelne Handlung im chirurgischen Standardvokabular, z. B. Desinfektion, sterile Abdeckung, Lokalanästhesie, Einzelknopfnähte, Redon-Drainage, Verband.
- **Notizen:** 1 bis 3 Stück mit Hinweisen zu Nachsorge, Kontrollen oder Abwägungen, z. B. „Notiz: Nachsorge nach ärztlicher Anordnung“. Keine Mengenangaben.
- **Kategorie „m“ (Medikamente):** Der Abschnitt `Dosis` ist fachlich geprüft. Er wird nie geändert oder ergänzt. Erlaubt sind ein Abschnitt `Ablauf` (Gabe, ohne Mengen) und Zeilen in `me`.
- **Sprache:** Deutsch mit ä, ö, ü und ß. Keine Umgangssprache im Fließtext.

## 6. Verweise und Formatierung

- `**Text**` wird fett dargestellt.
- `<u>Text</u>` wird unterstrichen dargestellt. Beides lässt sich verbinden, z. B. `**<u>wichtig</u>**`. Im Browser setzt man es mit Strg+B und Strg+U (Abschnitt 10, Punkt 14).
- Die Auszeichnung wirkt in der Beschreibung, in Tabellenzellen, in Abschnittszeilen und in den Zeilen der /me-Boxen. In Titeln, Abschnittsüberschriften, Box-Titeln, Unterkategorie-Titeln und `meTitle` erscheinen die Zeichen als Text.
- `[[Titel]]` verlinkt auf eine andere Akte. Der Titel muss zu einer vorhandenen Akte passen, am besten exakt so geschrieben wie in `title`. Nur auf vorhandene Akten verweisen.

## 7. Was die Seite überspringt oder ablehnt

| Problem | Folge |
|---|---|
| Kategorie unbekannt, z. B. `"B"` oder `"Behandlungen"` | Akte wird übersprungen |
| Kategorie `"n"` (alte Kennung der Narkose) | wird als `"t"` übernommen |
| `id` oder `title` fehlt oder ist leer | Akte wird übersprungen |
| `id` oder `title` kommt doppelt vor | die zweite Akte wird übersprungen |
| Unterkategorie (`typ` `"unterkategorie"`) mit anderer Kategorie als `b`, `o`, `m`, ohne `id` oder ohne `title` | die Unterkategorie wird übersprungen, die folgenden Akten stehen ohne Unterkategorie |
| Unterkategorie mit doppelter `id` oder doppeltem `title` in derselben Kategorie | die zweite Unterkategorie wird übersprungen, die folgenden Akten stehen ohne Unterkategorie |
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
- [ ] Jede Akte hat `id`, `title` (identisch) und `cat` (`t`, `v`, `b`, `o` oder `m`).
- [ ] Jede Unterkategorie hat `typ` (`"unterkategorie"`), `id`, `cat` (`b`, `o` oder `m`) und `title`. Sie steht vor ihren Akten. Kennungen und Titel der Unterkategorien sind innerhalb ihrer Kategorie eindeutig.
- [ ] `sections` ist eine Liste. Jeder Abschnitt hat `h` (Text) und `items` (Liste von Texten).
- [ ] `me` ist eine Liste von Texten. Handlungen beginnen mit `/me `, Notizen mit `Notiz: `.
- [ ] Die erste Zeile von `me` ist in jeder bearbeitbaren Akte die Material-Zeile (`/me nimmt …`), außer bei den Ausnahmen aus Abschnitt 4.
- [ ] Keine Notiz enthält das Wort `/me`.
- [ ] Eine Trennlinie ist genau `---` in einer eigenen Zeile. Sie zählt nicht zu den /me-Zeilen.
- [ ] `table` hat `h` (Liste von Texten) und `r` (Liste von Zeilen, jede Zeile ist eine Liste von Texten).
- [ ] Es gibt keine doppelten Kennungen und keine doppelten Titel.
- [ ] Den Abschnitt „Behandlung“ gibt es nur in den Originalakten „Streifschuss, Stichwunde, Bisswunde“ und „Prellung“ (siehe Abschnitt 3). Standardabschnitte sind Erkennung und Ablauf, dazu die Durchführung (`me`).
- [ ] Keine Dosierungen, Mengen oder erfundenen Angaben.
- [ ] Keine HTML-Tags außer `<u>…</u>`. Verweise nur als `[[Titel]]` auf vorhandene Akten.
- [ ] Fett (`**`) und Unterstreichung (`<u>`) nur in Beschreibung, Tabellenzellen, Abschnittszeilen und /me-Zeilen, nicht in Titeln oder Überschriften.
- [ ] Keine Kommentare, keine nachgestellten Kommas, nur gerade Anführungszeichen.
- [ ] Bestehende Akten sind unverändert, außer den ausdrücklich genannten Änderungen.

## 10. Veröffentlichen, testen und Änderungen im Browser

1. Die Ausgabe als `akten.json` speichern (UTF-8) und in denselben Ordner wie `index.html` legen.
2. Beide Dateien auf GitHub Pages hochladen (Commit und Push). Danach die Seite neu laden.
3. Lokal nicht per Doppelklick öffnen, denn dann lädt der Browser `akten.json` nicht. Entweder den Ordner mit `python3 -m http.server` starten und `http://localhost:8000` öffnen, oder auf der Seite die Datei über das angebotene Auswahlfeld laden.
4. Die Seite schreibt nicht in `akten.json`. Nutzeränderungen werden im Browser gespeichert und haben Vorrang vor der Datei. Eine Akte, die jemand selbst bearbeitet hat, zeigt seine Fassung. Mit „Original wiederherstellen“ (Schaltfläche beim Überfahren der Überschrift) kehrt er zur Fassung aus `akten.json` zurück. Neue Zeilen wie die Material-Zeile erscheinen bei einer Akte, die schon im Browser bearbeitet wurde, erst nach „Original wiederherstellen“. Das gilt auch für Änderungen an `akten.json`, etwa an der EKG-Box: Eine im Browser gespeicherte Liste, z. B. die /me-Boxen einer Akte, ersetzt die Fassung aus der Datei ganz.
5. Unterkategorien: Reihenfolge und Zuordnung kommen aus `akten.json` (Abschnitt 3a). Im Bearbeitungsmodus können Nutzer Unterkategorien umbenennen und löschen, neue anlegen und Akten in eine andere Unterkategorie legen. Die Reihenfolge der Unterkategorien lässt sich im Browser nicht ändern. Das bleibt im Browser und wird beim Exportieren mitgespeichert. Eine umbenannte Unterkategorie behält ihren Namen, auch wenn sich der Titel in der Datei ändert. Eine gelöschte Unterkategorie kommt nach dem Neuladen nicht zurück, ihre Akten stehen danach ohne Unterkategorie. „Ohne Unterkategorie“ bleibt auch dann, wenn die Datei eine andere Unterkategorie nennt. Neue Unterkategorien aus der Datei erscheinen an der Stelle, an der sie in der Datei stehen, auch in Browserständen, die es schon gibt.
6. Einmalige Umstellungen: Ein Browserstand von vor Stand 6 übernimmt beim ersten Öffnen einmal die Reihenfolge und die Unterkategorien aus `akten.json`. Dabei werden eigene Verschiebungen von Akten zurückgesetzt. Eigene Akten und eigene Unterkategorien bleiben erhalten. Ein Browserstand von Stand 6 setzt beim ersten Öffnen nur Lokalanästhesie sowie Regional-, Plexus- und Spinalanästhesie hinter „Narkose richtig einleiten“; alle übrigen Verschiebungen bleiben.
7. Titel und Trennlinien im Browser: Im Bearbeitungsmodus lässt sich der Titel jeder /me-Box mit dem Stift ändern, auch der Titel der Hauptbox. Mit „+ Trennlinie“ wird eine Trennlinie ans Ende einer Box gesetzt, ▲ und ▼ verschieben sie, ✕ entfernt sie. Die zusätzlichen /me-Boxen einer Akte lassen sich in ihrer Kopfzeile ebenfalls mit ▲ und ▼ in der Reihenfolge verschieben. Diese Änderungen werden im Browser gespeichert, beim Exportieren mitgegeben und mit „Original wiederherstellen“ zurückgesetzt.
8. Zeilenumbrüche in Abschnitten: Im Bearbeitungsmodus lässt sich eine Zeile eines Abschnitts mit Shift + Enter über mehrere Zeilen schreiben. Enter beendet die Bearbeitung. Der Zeilenumbruch wird im Browser gespeichert, nicht in `akten.json`. Titel, Überschriften und die Zeilen der /me-Box bleiben einzeilig.
9. /me-Boxen ein- und ausklappen: Jede /me-Box, auch die Hauptbox, hat in ihrer Kopfzeile einen Pfeil (▾ offen, ▸ zugeklappt). Er funktioniert auch im Zuschauermodus und ändert nichts an der Akte. Die Grundeinstellung „/me-Boxen beim Öffnen“ in den Einstellungen (Standard: ausgeklappt) gilt, sobald eine Akte geöffnet wird, und bleibt im Browser gespeichert. Ändert man sie, gilt sie für alle Boxen. Einzelne Boxen lassen sich danach mit dem Pfeil umschalten. Diese Umschaltung gilt nur für die laufende Ansicht und wird weder gespeichert noch exportiert. Eine neu angelegte Box ist immer offen.
10. EKG-Symbol: Rechts neben dem Titel jeder Akte steht ein EKG-Symbol. Ein Klick öffnet die Standard-EKG-Überwachung mit Puls, Blutdruck und Sauerstoffsättigung samt ihren /me-Zeilen. Die Zeilen stammen aus der Box „Überwachung des EKGs“ der Akte „Narkose richtig einleiten“ und lassen sich im Fenster wie in den Akten durch Klick kopieren. Das Fenster schließt mit ✕, mit Escape oder mit einem Klick daneben. Das Symbol funktioniert auch im Zuschauermodus und ändert nichts an der Akte. Ist die Box umbenannt oder entfernt, zeigt das Fenster einen Hinweis. Zeilen mit „→ Normalwert:“ erscheinen im Fenster als Überschriften in der Akzentfarbe der Seite, im dunklen wie im hellen Design, und lassen sich nicht kopieren.
11. Kennzeichnung der Akten: Neben dem Titel jeder Akte steht eine kleine Marke. „Original“ heißt: unverändert aus `akten.json`. „bearbeitet“ heißt: eine mitgelieferte Akte mit Änderungen im Browser. „selbst erstellt“ kennzeichnet eigene Akten. Die Marke dient nur der Anzeige. Auch im Papierkorb trägt jede Akte ihre Marke.
12. Alle mitgelieferten Akten zurücksetzen: In den Einstellungen gibt es die Schaltfläche „Alle Akten zurücksetzen“. Sie funktioniert in beiden Modi und fragt vorher nach. Zurückgesetzt werden Texte, Abschnitte, /me-Boxen, Reihenfolge, Unterkategorien und der Papierkorb der mitgelieferten Akten. Eigene Akten, eigene Unterkategorien und Favoriten bleiben erhalten, und eigene Akten behalten ihren Platz in der Liste. Rückgängig machen lässt sich das mit Strg+Z im Bearbeitungsmodus.
13. Hauptbox entfernen: Im Bearbeitungsmodus hat die Hauptbox in ihrer Kopfzeile den Knopf „Box entfernen“, wie die zusätzlichen Boxen. Die Zeilen bleiben gespeichert. Mit „+ … wieder hinzufügen“ kommt die Box zurück. Die Entfernung wird im Browser gespeichert und in Exporten als `meOff` mitgegeben. Im Zuschauermodus ist eine entfernte Hauptbox nicht zu sehen. Bei einer mitgelieferten Akte holt auch „Original wiederherstellen“ die Box zurück, ebenso das Zurücksetzen aller Akten (Punkt 12).
14. Auszeichnung im Browser: Im Bearbeitungsmodus setzt Strg+B (auf dem Mac Cmd+B) Fettschrift, Strg+U (Cmd+U) Unterstreichung. Ist Text markiert, wird er eingerahmt. Ohne Markierung stehen die Zeichen da, und der Cursor steht dazwischen. Die Tasten wirken in Beschreibung, Abschnittszeilen, /me-Zeilen und im Feld für neue Abschnitte.
15. Abstand und Ecken der Akten: In den Einstellungen gibt es unter „Spalten pro Reihe“ den Regler „Abstand in den Akten-Karten“ (Eng, Mittel, Weit; Standard ist Mittel) und die Auswahl „Ecken der Akten“ (Rund oder Eckig). Beides gilt für alle Akten und wird im Browser gespeichert. Die frühere Einstellung „Kompakte Karten“ wird übernommen: An wird Eng, Aus wird Weit.
16. Titel der Unterkategorien: In einer Kategorie mit Unterkategorien steht der Titel direkt über den Akten seiner Gruppe. Er ist nicht fixiert, weder am Suchfeld noch an der Kopfleiste, und wandert beim Scrollen mit seinen Akten mit. Bei der Suche gibt es keine Titel.
17. Fehler melden: Neben dem Einstellungsknopf (⚙) steht der Knopf mit dem Käfer-Symbol. Er öffnet ein Fenster, in dem du beschreibst, was nicht funktioniert. Mit „Text kopieren“ landet deine Beschreibung in der Zwischenablage. Bei Fehlern schreibst du ganz einfach „zockerjojo“ auf Discord an und fügst den Text dort ein. Der Knopf funktioniert in beiden Modi.

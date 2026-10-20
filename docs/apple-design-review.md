# Apple-Design-Skill: Versuch im Prozess-Arbeitsbereich

Stand: 20.10.2026. Ausgangspunkt: `cff4e02987da4735ee658f3c9a2a495da8bae3e1` (gemergter PR #1).

## Quelle und Geltungsbereich

Der in Recall gefundene Hinweis stammt aus dem Video [Apple Design Skill für Claude installieren](https://www.youtube.com/watch?v=-rJziV4tPC0), Recall-Karte `dddbb596-56ef-4321-ac22-c8f2d1997e9c`.

Angewendet wurde Emil Kowalskis [apple-design/SKILL.md](https://github.com/emilkowalski/skills/blob/2d228630ba1446365f614a108cb8252f1feda202/skills/apple-design/SKILL.md), Upstream-Commit `2d228630ba1446365f614a108cb8252f1feda202`, Datei-Blob `adf68c517f2d7d2781587d619de07f4de286da57`. Die Datei wurde vollständig gelesen und anschließend am festgehaltenen Commit auf identischen Inhalt geprüft. Der [Autor verlinkt diesen Skill selbst](https://emilkowal.ski/skill).

Die 17 Punkte sind die Kapitel dieses Community-Skills. Seine Quellen umfassen insbesondere Apples [Designing Fluid Interfaces (WWDC18)](https://developer.apple.com/videos/play/wwdc2018/803/), [The details of UI typography (WWDC20)](https://developer.apple.com/videos/play/wwdc2020/10175/) und [Principles of great design (WWDC26)](https://developer.apple.com/videos/play/wwdc2026/250/). Der letzte Vortrag enthält acht grundlegende Designprinzipien; der Skill ordnet sie seinem Kapitel 16 zu. Die Formulierung des Videos vom vollständigen Apple-Designsystem geht über den belegten Inhalt dieser Datei hinaus.

Dieser Versuch betrifft den vorhandenen Prozess-Arbeitsbereich: Kundentext, Graph, Inspektor und ihre Steuerung. Die Frosted-Glass-Richtung des Projekts bleibt die gestalterische Grundlage. Der Skill wurde als Review- und Umsetzungsanleitung verwendet; es wurde kein globaler Agent-Skill installiert.

## Ergebnis im Beispieldatensatz

Die vorherige Anzeige „84 % Prozess-Verständnis“ war eine Gewichtung aus Statuswerten und keine gemessene Verständnisleistung. Jetzt steht dort „7 von 10 Schritten bestätigt“. Der Balken zählt ausschließlich bestätigte Schritte. „Offenen Schritt prüfen“ öffnet zuerst eine Frage, danach einen unklaren und schließlich einen abgeleiteten Schritt. Eine Statusänderung aktualisiert Zähler und Graph gemeinsam.

Die Hauptaktion, Statusauswahl und Quellenbeschriftung sind kürzer und einheitlich deutsch. Zurückgenommene Konturen und weniger gleichzeitige Akzentfarben geben dem Graph mehr Gewicht. Presszustand, Tastaturfokus, größere Touch-Ziele und die am Auslöser verankerte Legende machen die Bedienung konkreter.

Für die Bedienelemente gilt die visuelle Abstimmung vom 20.10.: Die vier Status-Chips erscheinen ausschließlich als klickbare Filter mit Zählern über dem Graphen (Grün, Cyan, Gelb und Rosa). Pan/Lasso und die Statusauswahl im Inspektor verwenden runde Glaskapseln. Die Schrift und Farbgebung der Inspektor-Auswahl stammen aus der neuen Gestaltung; auch die beiden großen Aktionen rechts unten behalten die neue Gestaltung. Der aktive Filter bleibt zusätzlich durch Kontur und Füllung erkennbar, bei erhöhtem Systemkontrast wird die Palette durch gut abgegrenzte helle Beschriftungen ersetzt.

## Prüfung der 17 Themen

Die Kurzbezeichnungen unten sind eigene Zusammenfassungen. „Beibehalten“ bezeichnet vorhandenes Verhalten, das im Test überprüft wurde. Nicht benötigte Gesten werden durch den Skill nicht zu neuen Produktfunktionen.

| Nr. | Thema | Anwendung und Grenze |
| --- | --- | --- |
| 1 | Unmittelbare Reaktion | Sichtbarer Presszustand vor dem Loslassen. Die lokale Prozessableitung wartet nicht mehr künstlich 300 ms. |
| 2 | Direktes Greifen | React Flows vorhandenes Dragging beibehalten; Position und Greifpunkt werden nicht durch eigene Animationen ersetzt. Drag-/Filter-Persistenz getestet. |
| 3 | Unterbrechen können | Native Canvas-Übergänge bleiben durch manuelles Verschieben unterbrechbar. Kein späteres Zurückspringen im Browsertest. |
| 4 | Passende Bewegungsphysik | Die kleine Legende öffnet mit einer gedämpften Spring-Bewegung ohne Bounce. Canvas-Positionen erhalten keine eigene Physik. |
| 5 | Geschwindigkeit übernehmen | Keine neue Wurf-/Snap-Geste. Prozesskarten sollen nach dem Loslassen an der bewusst gesetzten Position bleiben. |
| 6 | Schwung sinnvoll nutzen | Keine neue Flick- oder Carousel-Funktion; daher keine zusätzliche Projektion implementiert. |
| 7 | Räumlich nachvollziehbar bleiben | Legende unter ihrem Auslöser; Öffnen und Schließen nutzen denselben räumlichen Ursprung. Escape gibt den Fokus zurück. |
| 8 | Gesten verständlich zeigen | Die bestehende Lasso-Fläche und der Modushinweis bleiben als direktes Feedback erhalten. |
| 9 | Grenzen weich vermitteln | Die Zeichenfläche hat keine fachlich definierten Außenkanten. Kein künstliches Rubber-Banding eingeführt. |
| 10 | Verlässliche Gesten | Native Button-Aktivierung lässt sich durch Wegziehen abbrechen. Werkzeug- und Statusziele auf Touch-Geräten mindestens 44 × 44 CSS-Pixel. |
| 11 | Saubere Zwischenbilder | Popover nutzt Transform/Opacity; kein animierter Vollflächenhintergrund. Keine Behauptung zu gemessenen FPS. Bundlewirkung unten dokumentiert. |
| 12 | Material zeigt Hierarchie | Dunkle Strukturflächen, zurückhaltende Quellhervorhebung und hellere Hauptaktion. Die Legende erhält eine eigene, lesbare Materialschicht. |
| 13 | Rückmeldung mit Zweck | Visuelle Bestätigung für Ableitung und Ansichtsaktionen. Sound und Vibration haben für diesen Arbeitsablauf keinen belegten Zusatznutzen. |
| 14 | Nutzerpräferenzen beachten | Reduzierte Bewegung gilt auch für JavaScript-Zooms und reagiert auf Änderungen ohne Reload. Separate Varianten für weniger Transparenz und mehr Kontrast. |
| 15 | Lesbare Typohierarchie | Gewicht, Größe und Zeilenhöhe unterscheiden Titel, Bedienung und technische IDs. Neue Texte nutzen rem. Bestehende Schriftfamilien bleiben erhalten. Vollständige Textvergrößerung und RTL sind noch kein Ergebnis dieses Versuchs. |
| 16 | Verständliche, verantwortliche Oberfläche | Nachprüfbare Bestätigungszahlen statt eines vermeintlichen Verständniswerts. Ein direkter Weg zum unbestätigten Schritt und eine eindeutig benannte Vorschau-Aktion. |
| 17 | Am laufenden Produkt prüfen | Vorher-/Nachher-Bilder und Browserprüfung des Produktionsbuilds. Bewertung mit realen Kunden steht noch aus. |

## Validierung und Vergleich

- [Vorher](process-workspace-preview.webp) / [Nachher](apple-design-after.webp) / [Legende](apple-design-legend.webp).
- Ausführungsprotokoll: [apple-design-verification.json](apple-design-verification.json).
- Typprüfung: `npm run lint`; Produktionsbuild: `npm run build`; Patchprüfung: `git diff --check`.
- Browserprüfung mit Chromium 153 bei 1920 × 1080, 1440 × 900 und 390 × 844; zusätzlich Touch-Kontext, Tastaturbedienung und emulierte Systemeinstellungen.

Die 22 Prüfungen sind in [scripts/verify-process-workspace.cjs](../scripts/verify-process-workspace.cjs) wiederholbar. Der Runner benötigt Playwright 1.62.1 und einen Chromium-Browser außerhalb der Produkt-Abhängigkeiten. Beispiel unter Linux/macOS:

```sh
npm install --prefix /tmp/dt-ui-qa playwright@1.62.1
/tmp/dt-ui-qa/node_modules/.bin/playwright install chromium
npm run build
PLAYWRIGHT_MODULE=/tmp/dt-ui-qa/node_modules/playwright node scripts/verify-process-workspace.cjs
```

Mit `CHROMIUM_EXECUTABLE` und `CHROMIUM_ARGS` kann ein vorhandener Chromium verwendet werden. Berichte und Screenshots landen unter `artifacts/process-workspace/` (ignoriert); `UI_QA_OUTPUT_DIR` erlaubt einen anderen Ausgabeort. Bei der Prüfung dieses PRs wurde der Chromium-153-Runtime-Browser verwendet.

Die Browserprüfung deckt die im Protokoll benannten Abläufe ab. Sie ist keine vollständige Barrierefreiheitsprüfung, kein Test auf einem echten iPhone und keine Messung, ob Kunden die Oberfläche bevorzugen. Ein sinnvoller nächster Nutzertest ist: Ein Außenstehender findet im Beispieldatensatz einen unbestätigten Schritt, prüft dessen Quelle und öffnet die Vorschau. Beobachten: benötigte Hilfe, Fehlklicks und Zeit bis zum Abschluss.

Das bestehende `motion`-Paket wird für die Legende genutzt, ohne neue Abhängigkeiten oder Lockfile-Änderungen. `LazyMotion` begrenzt die geladenen Animationsfunktionen. Der JavaScript-Einstiegs-Chunk wächst im lokalen Build von etwa 763 kB / 209 kB gzip auf 839 kB / 236 kB gzip. Die Vite-Warnung für Chunks über 500 kB bleibt bestehen. Dieser Preis der zusätzlichen Bewegung ist bei der Beurteilung des Versuchs mitzuberücksichtigen.

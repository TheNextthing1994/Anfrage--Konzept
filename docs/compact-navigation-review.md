# Kompakte Workstation-Navigation

Ausgangspunkt: `75534097c967560031079f051011f64fb9f71c21` auf `main`.

## Entscheidung

Die globale „Foundry Flow“-Leiste bot fest verdrahtete Zugriffe auf Referenzansichten, darunter das Hoffmann-Bau-Beispiel. Seitenleiste und sechsstufige Prozessnavigation erschließen diese Arbeitsbereiche bereits. Die zusätzliche Leiste und ihre Demo-Routingzustände wurden entfernt; der Wechsel zur Homepage ist über das Globus-Symbol in der Seitenleiste erreichbar. Von dort führen die vorhandenen Einstiege zurück in die Workstation.

Ergänzung auf Basis von `cce678b27993034efad62efd629ba9f602b28c4a`: Auch die zweite Prozess-Tab-Leiste ist vollständig entfernt, in Prozesslandkarte, UX-Vorschau, Detailanalyse und Anfragenliste. Die sechs Schritte oben öffnen weiterhin dieselben Ansichten. „Tabellen-Übersicht“ entspricht dabei Schritt 1 „Kundenanfrage“. Der globale Button „Neue Anfrage“ übernimmt den bisherigen zusätzlichen Einstieg in das Kundenformular. Die frei gewordene Höhe wird der Prozessfläche zugeschlagen.

## Verhalten

- Auf Desktop-Bildschirmen ab 1024 Pixel startet die Seitenleiste als 64 Pixel breite Symbolleiste; ausgeklappt ist sie 240 Pixel breit. Gegenüber der bisherigen 250-Pixel-Leiste gewinnt die kompakte Ansicht 186 Pixel Arbeitsbreite. Das Entfernen der oberen Leiste gibt zusätzlich 40 Pixel Höhe frei; die Prozessfläche nutzt diese Höhe mit.
- Alle neun Arbeitsbereiche bleiben erreichbar. Symbole haben zugängliche Namen und Titel mit Beschriftung und Anzahl. Der aktuelle Bereich ist zusätzlich durch Fläche und Kontur markiert.
- Der Schalter am unteren Rand klappt die Leiste per Maus oder Tastatur um. Die Auswahl wird in `dt_sidebar_collapsed` gespeichert und überlebt Neuladen und den Wechsel zur Homepage. Gesperrter Browserspeicher verhindert die Bedienung nicht.
- Die Breite wechselt direkt: Eine Animation würde den komplexen Graph während des Umschaltens laufend neu anordnen und vorübergehend Beschriftungen überlagern. Die Canvas-Kamera wird beim Umschalten nicht neu zentriert.
- Auf kleineren Bildschirmen benötigt die Navigation geschlossen nur eine Kopfzeile. Das Menü öffnet auf Wunsch, schließt nach einer Bereichsauswahl oder mit Escape und gibt den Tastaturfokus an seinen Auslöser zurück. Es ist eine aufklappbare Navigation innerhalb der Seite, kein modaler Dialog.
- Die ehemaligen, nicht ausgewerteten Analyse-Flags sind entfernt. Anfragenliste, Beispiele und Formularabschluss setzen jetzt den tatsächlich angezeigten Analysemodus.

## Prüfung

Die reproduzierbare Browserprüfung liegt in `scripts/verify-process-workspace.cjs`. Sie prüft die neue Navigation zusätzlich zu den bestehenden Graph-, Status-, Touch- und Präferenzabläufen. Der aktuelle Ergebnisbericht liegt in `compact-navigation-verification.json`; die Screenshots stammen aus dem Produktionsbuild.

![Kompakte Navigation](compact-navigation-after.webp)

![Ausgeklappte Navigation](compact-navigation-expanded.webp)

Der Ausschnitt zeigt die ausgeklappte Seitenleiste. Auf kleinen Bildschirmen öffnet sie sich innerhalb der Seite:

![Mobile Navigation](compact-navigation-mobile.webp)

Die bestehende Vite-Warnung zu großen JavaScript-Chunks bleibt bestehen. Die lokale Suche ist ein eigenständiger, zuvor festgestellter offener Punkt und wurde in dieser Änderung nicht überarbeitet.

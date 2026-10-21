# Kompakte Workstation-Navigation

## Kundenorientierte Navigation – 21.10.2026

Basis dieses UX-Schritts: `bd3f6961e7cfb54e50d38d6042955a6a83116818`.

Die entfernte Aktion „Neue Anfrage“ ist eine bewusste Produktentscheidung des Owners. Neue Interessenten sollen künftig über externe Kanäle, beispielsweise Instagram, TikTok und YouTube, eintreffen. Dieser Schritt baut keine Kanalintegration und bestätigt keine API-Verfügbarkeit. Die vorhandene Herkunft einer Kundenanfrage wird in der Liste angezeigt.

Die Hauptnavigation richtet sich jetzt nach vier Aufgaben:

| Bereich | Aufgabe |
| --- | --- |
| Anfragen | Eingegangene Kundenanliegen sichten und zur Bearbeitung öffnen. Dies ist der Einstieg in die Workstation. |
| Projekte | Freigegebene Kundenarbeit und den zugehörigen Build öffnen. |
| Bibliothek | Wiederverwendbare Bausteine in den getrennten Ansichten „Zu prüfen“, „Standards“ und „Fähigkeiten“ erschließen. |
| Chancen | Geparkte oder reaktivierbare Ideen und Möglichkeiten wiederfinden. |

„Control Plane“ entfällt als separate Übersichtsseite: Sie kombinierte eine unqualifizierte Auswahl der ersten fünf Objekte mit laufenden Initiativen. Die bisherige Material-Inbox wird durch die Prüfungsansicht der Bibliothek abgedeckt; diese umfasst auch `Raw Input`. Review, Registry und Foundry behalten ihre fachlich unterschiedlichen Aufgaben innerhalb der Bibliothek. Datenobjekte und Fähigkeiten werden dabei nicht zu einem Datentyp zusammengelegt.

Die Settings-Seite mit ihrem statischen Text entfällt. Der Text war kein Nachweis eines SQLite-Backends oder einer aktiven Compliance-Funktion. Sprachwahl und das platzsparende Ein- und Ausklappen bleiben an ihrem bisherigen Platz. Ältere Homepage-Einstiege für `overview`, `inbox` und `settings` werden in die aktuellen Bereiche weitergeleitet.

Die fünf Prozessschritte erscheinen ausschließlich innerhalb eines geöffneten Kundenvorgangs. Kunde und Anfrage-ID stehen bei der Navigation. Der ehemalige sechste Schritt „Portfolio“ entfällt, weil er Chancen statt ausgelieferter Kundenprojekte öffnete. „Build“ öffnet ausschließlich ein Projekt mit passender `clientRequestId`; ohne solches Projekt ist dieser Navigationsschritt deaktiviert. Die bestehende Freigabeaktion in der Analyse bleibt der Einstieg zur Projektanlage. Der Rückweg aus einem Projekt übernimmt dieselbe Kundenanfrage.

Anfragen- und Projektlisten belegen die volle Arbeitsbreite. Der Objekt-Inspector erscheint nur in der Bibliothek und wählt seine Quelle innerhalb der jeweiligen Bibliotheksansicht. Standards enthalten ausschließlich Objekte mit dem tatsächlichen Status `Approved`: Ein `Approved candidate` wie n8n wird nicht mehr als freigegebener Standard dargestellt. Der Chancen-Inspector wird ebenfalls auf Chancen beschränkt.

Die Anfragenliste zeigt Kunde, Quelle, Status und einen Textauszug. Kosten, Preis und Marge gehören weiterhin zur Detailanalyse statt in den Eingang. „Anfrage öffnen“ ist auch für Einträge ohne vorhandene Analyse sichtbar; der vollständige Text bleibt im Kundenvorgang verfügbar. In Chancen entfallen die bisherigen vier Reiter: Ihr Zustand änderte nur die Hervorhebung, nicht den angezeigten Inhalt. Die vorhandenen Objektfilter und Signale bleiben erreichbar.

Die Sprachschalter hatten in der mobilen Navigation nur 26 Pixel Höhe. Für die Sidebar gilt jetzt durchgehend eine Mindesthöhe von 44 Pixeln für Buttons. Der geschlossene mobile Navigationskopf bleibt 57 Pixel hoch.

Bei der übernommenen Bewegungsprüfung konnte vor einem reduzierten Kamerawechsel noch eine ältere Kamerabewegung sichtbar werden. Der Fit-View-Aufruf liest die OS-Präferenz jetzt zum Zeitpunkt der Aktion und stoppt bei reduzierter Bewegung eine eventuell laufende Transition, bevor React Flow den neuen Ausschnitt im nächsten Frame übernimmt.

Die aktualisierte Browserprüfung liegt weiterhin in `scripts/verify-process-workspace.cjs`: 33 Prüfungen bestanden, keine Laufzeitfehler, mit Desktop-, Tablet- und Mobilansichten sowie Deutsch/Russisch. Auch Typprüfung (`npm run lint`) und Produktionsbuild (`npm run build`) sind erfolgreich. Die bestehende Vite-Warnung zum großen JavaScript-Bundle bleibt bestehen.

Ergebnisbericht: [customer-navigation-verification.json](customer-navigation-verification.json). Geprüfte Ansichten:

![Anfragen mit vereinfachter Navigation](customer-navigation-requests.webp)

![Bibliothek mit getrennten fachlichen Ansichten](customer-navigation-library.webp)

![Anfragen auf dem Smartphone](customer-navigation-mobile.webp)

Die folgenden Abschnitte dokumentieren frühere Implementierungsstände; insbesondere die Aussagen über neun Hauptbereiche und den globalen Formularbutton gelten nicht mehr für den aktuellen Stand.

Offener nächster UX-Schritt: Eingehende Nachricht, qualifizierte Kundenanfrage und freigegebener Auftrag müssen klar unterscheidbar sein. Mehrere Nachrichten desselben Interessenten sollten gemeinsam bearbeitet werden können. Die technische Anbindung externer Kanäle und die Bereinigung der bisherigen Demo-Statusabläufe sind eigene Arbeitsschritte.

## Historischer Stand: kompakte Navigation

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

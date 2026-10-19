# UI-Upgrade: Living Process Canvas & Steuerungsleisten im Stil der Vorlage

Visuelle Neugestaltung des zentralen Living Process Canvas und der zugehörigen Steuerungsleisten nach dem Vorbild der übermittelten Design-Referenz (cineastischer Graphit-Hintergrund, eisblaue und cyan-leuchtende Frosted-Glass-Kapseln, hochauflösende Typografie und samtige Glanzeffekte).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Alle Bestätigungen aus der Klärungsphase sind in diesem Plan verankert. Die Arbeitsabläufe, Lasso-Zoom, Knotenlogik und der Kundenkontext bleiben vollständig intakt – optimiert wird die visuelle Ästhetik, Wertigkeit und Eleganz.

- **Bestätigter Fokus**: Anpassung konzentriert sich auf den **Prozess-Canvas, die Werkzeugleisten, Knoten-Visuals und Canvas-Panels**, damit die bewährte dreigeteilte Foundry-OS-Struktur der Workstation harmonisch und stabil bleibt.
- **Bestätigte Farb- & Lichtwelt**: Tiefer Graphit/Obsidian-Hintergrund (`#06090F`, `#0B0F17`), eisblaue (`#38BDF8`, `#7DD3FC`) und neon-cyan Akzente (`#00F2FE`, `#22D3EE`), kombiniert mit dezenten Transluzenz- und Blur-Effekten (`backdrop-blur-md`, `bg-white/[0.03]`).
- **Bestätigte Design-Elemente**: 
  - Kapsel- und Pill-Bedienelemente mit weichem Randleuchten (Glow-Border wie bei der Suchkapsel der Vorlage)
  - Feine, moderne Schrifthierarchie mit dezentem Buchstabenabstand (`tracking-wide`, `tracking-wider`)
  - Subtile Lichtkegel und Gitterlinien auf der Zeichenfläche für echte räumliche Tiefe

---

## 1. Overview & Core Concept

- **Was erreicht wird**: Die funktionale Event-Storming-Arbeitsfläche wird optisch von einem Standard-Dark-Theme in ein hochmodernes, cineastisches Workspace-Design verwandelt, das dem Look & Feel der Referenz ("Your world. In clear focus.") entspricht.
- **Nutzererlebnis**: Bediener erleben die Prozesslandkarte nicht mehr als nüchterne Schachteln, sondern als hochwertige "Digital Twin"-Zentrale mit leuchtenden Verknüpfungen, gläsernen Schwebepanels und glasklarer Lesbarkeit.
- **Funktionsgarantie**: Alle bereits erarbeiteten Funktionen (Lasso-Zoom, Pan-Modus, Inspektor-Verbindung, Knoten-Erstellung, Status-Filter, 100%-Fokus) bleiben 1:1 einsatzbereit.

---

## 2. User Experience & Visual Design

```
┌────────────────────────────────────────────────────────────────────────┐
│ TOP BAR / TOOLBAR: Frosted Capsule Pill (Cyan Outer Glow & Blur)       │
│  [ ⬚ Lasso-Zoom ] [ ✋ Verschieben ]  │  [ 🎯 Mitte ] [ 100% ] [ ⛶ ]   │
├────────────────────────────────────────────────────────────────────────┤
│ CANVAS VIEWPORT (Graphit-Nebel + feines Cyan-Raster):                  │
│                                                                        │
│   ┌────────────────────┐         ┌────────────────────┐                │
│   │  ACTOR / ROLLE     │ ──────> │  COMMAND / AKTION  │ ──────> ...    │
│   │  Monteur           │  Glow   │  Dokument senden   │                │
│   │  [Frosted Pill]    │  Edge   │  [Cyan Edge Glow]  │                │
│   └────────────────────┘         └────────────────────┘                │
│                                                                        │
│ FLOATING CONTROLS: Glassmorphic Capsule Panels (Zoom, MiniMap, Legende)│
└────────────────────────────────────────────────────────────────────────┘
```

### A. Farbpalette & Lichtatmosphäre
- **Basis-Canvas**: `#05080E` mit radialem Tiefengradienten (`radial-gradient(ellipse at center, rgba(14, 165, 233, 0.08) 0%, rgba(5, 8, 14, 0.95) 75%)`).
- **Gitter & Hintergrundlinien**: Feines, unaufdringliches Punkt-/Linienraster in eisblauem Muted Cyan (`rgba(56, 189, 248, 0.07)`).
- **Frosted Glass Oberflächen**: 
  - Flächen: `rgba(15, 23, 42, 0.65)` mit `backdrop-blur-xl`
  - Konturen: 1px Haarlinien in `rgba(56, 189, 248, 0.22)` mit sanftem Verlauf
  - Lichtreflexion: `box-shadow: 0 0 25px -5px rgba(0, 242, 254, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)`

### B. Steuerungsleisten & Floating Panels (wie die Kapsel in der Vorlage)
- **Haupt-Werkzeugleiste (Toolbar)**:
  - Form: Elegante, schwebende Glas-Kapsel (`rounded-full` / Pill-Design).
  - Umrandung: Zartes Cyan-Neon-Leuchten bei aktiven Zuständen (`shadow-[0_0_18px_rgba(34,211,238,0.25)]`).
  - Schalter: Weiche, abgerundete Segment-Buttons mit eisblauem Text und samtigem Hover-Glow.
- **Zoom- und MiniMap-Panels**:
  - Kanten abgerundet mit transluzentem Rauchglas-Effekt.
  - Minimap mit abgedunkeltem Viewport und Cyan-Nodes für ein high-tech Sensor-Look.

### C. Event-Storming-Knoten (Node Redesign)
- **Karten-Stil**: Hochwertige abgerundete Kapselkarten mit subtiler oberer Lichtkante (`inset 0 1px 0 rgba(255,255,255,0.15)`).
- **Semantische Node-Typen im edlen Vorlagen-Look**:
  - `ACTOR`: Bernstein-Gold mit eisblauem Kontrastakzent.
  - `COMMAND`: Reines Eisblau / Cyan (`#38BDF8` bis `#22D3EE`) mit leuchtendem Puls.
  - `EVENT`: Intensives Tangerine-Orange mit weichem Glanz.
  - `POLICY`: Mystisches Tiefviolett / Indigo mit Cyan-Kante.
  - `READ_MODEL`: Smaragdgrün-Glow.
  - `HUMAN_GATE / EXCEPTION`: Signal-Rose mit dezentem Warn-Glow.
  - `QUESTION`: Zartes Cyan-Azurblau mit Fragezeichen-Kapsel.
- **Kanten & Pfeile**:
  - Schimmernde Pfeillinien mit sanftem Cyan-Glow (`stroke: #38bdf8`, `filter: drop-shadow(0 0 4px rgba(56,189,248,0.4))`).

---

## 3. Key Product Decisions & Trade-Offs

- **Entscheidung 1: Glasmorphismus & Glow ohne Performance-Verlust**
  - *Gewählter Ansatz*: Einsatz von hardwarebeschleunigten CSS-Glows (`box-shadow`, `backdrop-filter: blur()`) und optimierten SVG-Filtern auf den ReactFlow-Knoten und Kapseln.
  - *Begründung*: Gewährleistet flüssiges Panning und Zoomen selbst bei schnellem Ziehen mit der Maus.
- **Entscheidung 2: Erhalt der bestehenden dreigeteilten Foundry OS-Architektur**
  - *Gewählter Ansatz*: Der linke Bereich (Originalkundenanfrage) und der rechte Bereich (Knoten-Inspektor) behalten ihre solide Struktur, während ihre Trennlinien und Kanten nahtlos an den eisblauen Graphit-Look des Canvas angepasst werden.
  - *Begründung*: Entspricht exakt der Nutzerpräferenz ("Nur den Prozess-Canvas und Steuerungsleisten anpassen").

---

## 4. Technical Architecture & Implementation Steps

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ARCHITEKTUR & DATEIEN                           │
├────────────────────────────────────────────────────────────────────────┤
│ 1. src/index.css                                                       │
│    └─ Definiert Neon-Glow-Utilities, Frosted-Glass-Klassen und         │
│       animierte Cyan-Lichtakzente (.dt-glass-capsule, .dt-glow-cyan).  │
│                                                                        │
│ 2. src/components/EventStormingCanvas.tsx                              │
│    └─ Ersetzt kastenförmige Toolbars durch die cineastische Schwebekapsel;│
│       Veredelt Background-Raster, Floating Controls und MiniMap.       │
│                                                                        │
│ 3. src/components/EventStormingNode.tsx                                │
│    └─ Modernisiert die Node-Karten mit Frosted-Glass-Körpern,          │
│       oberen Lichtkanten, Kapsel-Badges und Cyan-Hover-Effekten.       │
│                                                                        │
│ 4. src/components/LivingProcessMapView.tsx                             │
│    └─ Veredelt die Canvas-Einbettung und Kantenübergänge im Center-Bereich│
│       für ein homogenes Gesamterlebnis.                                │
└────────────────────────────────────────────────────────────────────────┘
```

### Konkrete Umsetzungsschritte nach Genehmigung:
1. **Design-Tokens & CSS-Veredelung**: Einpflegen von Glassmorphism-Klassen (`dt-glass-capsule`, `dt-neon-border`, `dt-glow-cyan`) in `src/index.css`.
2. **Knoten-Design im Vorlagen-Look (`EventStormingNode.tsx`)**:
   - Kartenform mit sanft abgerundeten Ecken und transluzenter Tiefe.
   - Hochwertige Typografie mit klaren Kontrasten und dezenten Kapsel-Badges.
   - Sanftes Aufleuchten bei Selektion und Hover.
3. **Canvas & Werkzeugleisten (`EventStormingCanvas.tsx`)**:
   - Umgestaltung der oberen Toolbar in eine freischwebende Glas-Kapsel (wie die Suchkapsel im Foto).
   - Eisblaue Statusanzeigen und Icons mit klarem Kontrast.
   - Veredelung der Kantenlinien (Edges) mit subtilem Neon-Glanz.
4. **Validierung**:
   - TypeScript-Prüfung (`lint_applet`) und fehlerfreie Kompilierung (`compile_applet`).
   - Prüfung aller Interaktionen (Lasso-Zoom, Node-Auswahl, 100%-Fokus).

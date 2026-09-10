# eBuxi Fahrtenjournal — App

Web-App zum Erfassen der Fahrten und Abo-Verkäufe des eBuxi Herzogenbuchsee.
Läuft auf PC, iPad und Android-Handy, ohne Installation, direkt im Browser.

Ersetzt die Excel-Mappe `FahrtenJournal_Version_13_01.xlsm`.

## Was hier drin liegt

| Datei | Zweck |
|---|---|
| `index.html` | die ganze App — HTML, CSS und JavaScript in einer Datei, keine Abhängigkeiten |
| `manifest.webmanifest` | erlaubt «Zum Home-Bildschirm hinzufügen» mit eigenem Symbol |
| `sw.js` | Service Worker: hält die App-Hülle offline bereit |
| `icon.svg`, `icon-180.png` | App-Symbol |
| `.nojekyll` | schaltet die Jekyll-Verarbeitung von GitHub Pages ab |

**Dieses Repo darf öffentlich sein** — es enthält nur Programmcode, keine Fahrdaten.

## Einrichten

1. Repo auf GitHub anlegen und diesen Ordner hineinschieben.
2. **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
   Nach ein bis zwei Minuten läuft die App unter
   `https://<benutzername>.github.io/<repo-name>/`.
3. App öffnen. Beim ersten Start erscheint die Seite **Zugang zum Daten-Repo**.
   Dort GitHub-Benutzername, Name des Daten-Repos und ein Zugriffstoken eintragen
   (Anleitung steht auf der Seite selbst).
4. Auf jedem weiteren Gerät dieselbe Adresse öffnen, Token eintragen, fertig.

## Wo die Daten liegen

Nicht hier, sondern im **privaten** Repo `ebuxi-daten`. Die App liest und schreibt
es über die GitHub-Contents-API; jede Änderung wird ein Commit, die Historie ist
damit vollständig wiederherstellbar.

```
fahrten/<JJJJ-MM>.json   { rows: { id: {d,z,s,v,n,b,t,a,m,k,del} } }
abos/<JJJJ>.json         { rows: { id: {d,z,s,typ,nr,zahl,del} } }
stamm/verweise.json      { strassen[], schichten[], zeitraeume[], top[], tarife{} }
bestand/abonr.json       { zehner[], monats[] }
```

Feldkürzel: `d` Datum, `z` Zeitraum, `s` Schicht, `v` Abholung, `n` Ziel,
`b` bar, `t` Twint, `a` 10er-Abo, `m` Jahres-/Monatsabo, `k` Kind/gratis,
`del` gelöscht. Einträge stehen unter einer eigenen Id, damit zwei Geräte
denselben Monat gefahrlos ergänzen können.

## Fachregeln aus der Excel-Mappe

* **Zeitraum**: ab dem 16. eines Monats gilt `Monat/Folgemonat`, davor
  `Vormonat/Monat`. Gegen alle 4531 Altzeilen geprüft, keine Abweichung.
* **Tarife**: Einzelfahrt 4.–, 10er-Abo 35.–, Monatsabo 60.–.
* **Schichten**: 1.1 – 1.4, 2.1, 2.2 und `Spez.`

## Offline

Fahrten lassen sich ohne Empfang erfassen. Sie liegen dann lokal im Browser und
gehen automatisch raus, sobald wieder Netz da ist — die Anzeige oben rechts sagt,
wie viele noch warten.

## Token wechseln oder entfernen

Oben rechts auf die Statusanzeige tippen. Dort lässt sich der Zugang ändern oder
von diesem Gerät löschen; die Fahrten selbst bleiben im Daten-Repo.

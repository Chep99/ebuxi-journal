# eBuxi Fahrtenjournal — App

Web-App für den eBuxi Herzogenbuchsee: Fahrten und Abo-Verkäufe erfassen, die Kasse
zählen und pro Zeitraum abrechnen – jeweils mit PDF. Läuft auf PC, iPad und Android-Handy,
ohne Installation, direkt im Browser.

| Reiter | Wozu |
|---|---|
| **Fahrt** | Fahrten erfassen: Abholung, Ziel, Passagiere nach Zahlart |
| **Abo** | 10er- und Monatsabos verkaufen, Abo-Nummern aus dem Bestand |
| **Kasse** | Kassenzählung nach Stückelung, «Mein Stock», Verkäufe automatisch, Ergebnis, PDF |
| **Abrechnung** | Zeitraum wählen, Einsätze, Abos, Barbeträge und Kassenzählungen sehen, PDF; darin auch die Fahrtenliste zum Nachschlagen und Korrigieren |

Ersetzt die Excel-Mappe `FahrtenJournal_Version_13_01.xlsm`.

## Was hier drin liegt

| Datei | Zweck |
|---|---|
| `index.html` | die ganze App — HTML, CSS und JavaScript in einer Datei; nur für die PDFs wird jsPDF nachgeladen |
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
kasse/<JJJJ>.json        { rows: { id: {d,z,ts,kasse{},stock{},verkaeufe,verkaeufeAuto,
                                        manuell,summeKasse,summeStock,ergebnis,del} } }
```

Beträge der Kassenzählung stehen in **Rappen** (52700 = 527.–), damit keine
Rundungsfehler entstehen. Die Stückelung ist nach Nennwert verschlüsselt
(`"50": 4` heisst vier 50er-Noten, `"0.5": 3` drei 50-Rappen-Stücke).

Feldkürzel: `d` Datum, `z` Zeitraum, `s` Schicht, `v` Abholung, `n` Ziel,
`b` bar, `t` Twint, `a` 10er-Abo, `m` Jahres-/Monatsabo, `k` Kind/gratis,
`del` gelöscht. Einträge stehen unter einer eigenen Id, damit zwei Geräte
denselben Monat gefahrlos ergänzen können.

## Fachregeln aus der Excel-Mappe

* **Zeitraum**: ab dem 16. eines Monats gilt `Monat/Folgemonat`, davor
  `Vormonat/Monat`. Gegen alle 4531 Altzeilen geprüft, keine Abweichung.
* **Tarife**: Einzelfahrt 4.–, 10er-Abo 35.–, Monatsabo 60.–.
* **Schichten**: 1.1 – 1.4, 2.1, 2.2 und `Spez.`
* **Kassenzählung** wie im Blatt KasseZählung: Summe Stückelung − aktuelle Verkäufe −
  Mein Stock = Ergebnis. «Aktuelle Verkäufe» rechnet die App selbst: Bar-Fahrten × 4.–
  plus bar verkaufte Abos, vom Beginn des Zeitraums bis und mit dem Zähltag. Der Betrag
  lässt sich von Hand überschreiben. «Mein Stock» wird wie in der Mappe nur mit 100er
  bis 1er gezählt.
* **Abrechnung** wie im Blatt Fahrtabrechnung: Fahrten je Einsatz (Datum und Schicht),
  Abo-Verkäufe, Barbetrag Einzelfahrten (bar × 4.–), Barbetrag Abos (10er bar × 35.– +
  Monat bar × 60.–). Geprüft gegen die Mappe: Juli/Aug 2026 stimmt in allen Werten mit
  den Rohdaten überein, Aug/Sept 2026 mit der Pivot-Tabelle.

## PDF

Die PDFs erzeugt die App selbst mit jsPDF und jspdf-autotable (von cdnjs). Die
Bibliotheken werden beim Öffnen von Kasse oder Abrechnung geladen; für ein PDF braucht
es deshalb eine Internetverbindung. Auf Handy und iPad öffnet sich das Teilen-Menü
(Sichern in Dateien, Mail, WhatsApp …), am PC wird die Datei heruntergeladen.

## Offline

Fahrten lassen sich ohne Empfang erfassen. Sie liegen dann lokal im Browser und
gehen automatisch raus, sobald wieder Netz da ist — die Anzeige oben rechts sagt,
wie viele noch warten.

## Token wechseln oder entfernen

Oben rechts auf die Statusanzeige tippen. Dort lässt sich der Zugang ändern oder
von diesem Gerät löschen; die Fahrten selbst bleiben im Daten-Repo.

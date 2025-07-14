# Yourical Enchanced, Jetzt Projekt "KAFKA"

![]

Dieses Projekt soll ein Superset/Erweiterung des existierenden "yourical.de"-Projektes und wird mehr zu einer zentralen Platform fürs Studium

# Für Entwickler

## Projektstruktur

`app` enthält die Seiten selber und arbeitet nach dem Next-JS app-router.
`components` enthält alle React-Komponenten die benutzt werden.
`data` nur zum testen, wird später replaced
`hooks` React-Hooks um die UI up to date zu halten (aktuell nur Authentifizierung)
`lib` Backend code oder andere Funktionen die keine Komponenten sind
`locales` für später, die Übersetzungen
`public` Dateien die einfach auf dem Server liegen (Bilder)
`types` Typescript types

Den Rest nicht anfassen wenn keine Ahnung, danke!

# Features

- Kalender individuell abhängig des eigenen Semesters planen und einsehen
- Fächer verwalten, Notizen und Dateien speichern
- Mit anderen Kalendern synchronisieren
- (Maybe später mit anderen austauschen im gleichen Studiengang/Fach, z.B. Dateien)
- Wenn möglich hook an ilias für Abgaben/Gewählte Fächer (ggf. mit IT klären, wenn nicht scrapen?)

# TODO

- Webuntis API Calls generalisieren, Fächer mit Uhrzeiten speichern pro Fach (Mit Raum, Prof)
- Auf Supabase umziehen
- Notes Funktion
- Notes Teilen Funktion
- Kalender Ical live sync (alle 30-60min)
- Als Ical File exportieren

# SV Danninger – Vereinswebsite

Nuxt 4 Website für den Sportverein Danninger mit Tailwind CSS und Directus als Headless CMS.

## Tech Stack

- **Nuxt 4** (JavaScript)
- **Tailwind CSS v4**
- **Directus REST API** via `@directus/sdk`
- **Directus + PostgreSQL** via Docker Compose

## Schnellstart

### 1. Nuxt

```bash
npm install
cp .env.example .env
npm run dev
```

Die App läuft unter [http://localhost:3000](http://localhost:3000).

### 2. Directus (Docker)

Voraussetzung: [Docker Desktop](https://www.docker.com/products/docker-desktop/) läuft.

```bash
cp directus.env.example directus.env
npm run directus:up
```

Directus Admin: [http://localhost:8055](http://localhost:8055)

- **E-Mail:** `admin@sv-danninger.local`
- **Passwort:** `directus` (in `directus.env` änderbar)

Logs anzeigen: `npm run directus:logs`  
Stoppen: `npm run directus:down`

### 3. Collections & Berechtigungen

Im Directus Admin einmalig einrichten (siehe unten), dann Testeinträge anlegen.

## Umgebungsvariablen (Nuxt)

| Variable | Beschreibung |
|----------|--------------|
| `NUXT_PUBLIC_DIRECTUS_URL` | Directus API URL (Standard: `http://localhost:8055`) |
| `NUXT_PUBLIC_DIRECTUS_TOKEN` | Optional: Static Token für Read-only Zugriff |

Nach Änderungen an `.env` den Nuxt Dev-Server neu starten.

## Ordnerstruktur

```
app/
├── assets/css/       # Globale Styles (Tailwind)
├── components/       # Navbar, Footer, NewsCard, GameCard
├── composables/      # useNews, useGames
├── layouts/          # Default Layout
└── pages/            # Home, News, Spiele, Kontakt
services/
└── directus.js       # Directus REST Client & Fetch-Funktionen
docker-compose.yml    # Directus + PostgreSQL
directus.env.example  # Directus Docker-Konfiguration (Vorlage)
```

## Directus Collections

Lege zwei Collections an (**Settings → Data Model → Create Collection**).

### Collection `news`

| Feld | Typ | Hinweis |
|------|-----|---------|
| `title` | Input (String) | Pflicht |
| `slug` | Input (String) | Optional |
| `summary` | Textarea | Teaser |
| `content` | WYSIWYG | Volltext |
| `published_at` | DateTime | Sortierung |
| `status` | Dropdown | Werte: `published`, `draft` |

### Collection `games`

| Feld | Typ | Hinweis |
|------|-----|---------|
| `opponent` | Input (String) | Gegner |
| `date` | DateTime | Spieltermin (nur Zukunft wird angezeigt) |
| `location` | Input (String) | Ort/Platz |
| `is_home` | Boolean (Toggle) | Heim/Auswärts |
| `status` | Input (String) | z. B. `scheduled` |

### Public Read aktivieren

**Settings → Access Control → Public** → für `news` und `games` **Read** erlauben.

Alternativ: Static Token unter **Settings → Access Tokens** erstellen und in `.env` als `NUXT_PUBLIC_DIRECTUS_TOKEN` eintragen.

## Scripts

```bash
npm run dev           # Nuxt Entwicklungsserver
npm run build         # Production Build
npm run preview       # Build lokal testen
npm run directus:up   # Directus + DB starten
npm run directus:down # Directus stoppen
npm run directus:logs # Directus Logs
```

## Hinweise

- Ohne laufendes Directus zeigen die Seiten leere Zustände statt Fehler.
- `directus.env` ist lokal und nicht im Git (Vorlage: `directus.env.example`).
- Das Kontaktformular ist aktuell nur UI – Backend-Anbindung folgt später.

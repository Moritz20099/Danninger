# SV Danninger

Vereinswebsite. Nuxt + Directus.

## Brauchst du

- [Node.js](https://nodejs.org) (LTS reicht)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — muss laufen

## Alles starten

```bash
npm install
```

Config anlegen:

```bash
cp .env.example .env
cp directus.env.example directus.env
```

Windows (CMD/PowerShell): `copy` statt `cp`.

```bash
npm run directus:up
```

~30 Sekunden warten, bis Docker hochgefahren ist. Dann:

```bash
npm run directus:setup
```

Login = was in `directus.env` steht (Standard: `admin@example.com` / `directus`).

Website starten:

```bash
npm run dev
```

| Was | URL |
|-----|-----|
| Website | http://localhost:3000 |
| CMS (News/Spiele pflegen) | http://localhost:8055 |

## Stoppen

```bash
# Ctrl+C im Terminal wo npm run dev läuft
npm run directus:down
```

## Nur Website, ohne CMS

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

Seite läuft, News und Spiele sind leer — kein Fehler.

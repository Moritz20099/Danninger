/**
 * Legt Testdaten in Directus an (idempotent per slug/opponent+date).
 * Ausführen: npm run directus:seed
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'moritzguenther20099@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'directus'

async function api(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${DIRECTUS_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  let data = null

  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    const message = data?.errors?.[0]?.message || data?.message || response.statusText
    throw new Error(`${method} ${path} failed (${response.status}): ${message}`)
  }

  return data
}

async function login() {
  const data = await api('/auth/login', {
    method: 'POST',
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  })

  return data.data.access_token
}

function daysFromNow(days, hour = 15, minute = 0) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

function daysAgo(days, hour = 10, minute = 0) {
  return daysFromNow(-days, hour, minute)
}

const NEWS_ITEMS = [
  {
    title: 'Saisonstart 2026',
    slug: 'saisonstart-2026',
    summary: 'Die neue Saison beginnt – alle Infos zum Auftakt.',
    content: '<p>Der SV Danninger startet motiviert in die Saison 2026. Training jeden Dienstag und Donnerstag ab 18:00 Uhr.</p>',
    published_at: daysAgo(0),
    status: 'published',
  },
  {
    title: 'Neuer Trikotsponsor',
    slug: 'neuer-trikotsponsor',
    summary: 'Wir freuen uns über einen neuen Partner an unserer Seite.',
    content: '<p>Ab sofort unterstützt uns ein regionaler Sponsor mit neuen Trikots für alle Mannschaften.</p>',
    published_at: daysAgo(2),
    status: 'published',
  },
  {
    title: 'Sommerfest am Sportgelände',
    slug: 'sommerfest-2026',
    summary: 'Save the date: Unser jährliches Sommerfest findet am 12. Juli statt.',
    content: '<p>Es gibt Essen, Getränke und Spiele für Groß und Klein. Alle Mitglieder und Freunde sind herzlich eingeladen.</p>',
    published_at: daysAgo(5),
    status: 'published',
  },
  {
    title: 'Jugendmannschaft gewinnt Turnier',
    slug: 'jugend-turniersieg',
    summary: 'Unsere U15 holt den 1. Platz beim Frühjahrsturnier.',
    content: '<p>Nach einem spannenden Finale setzte sich unsere Jugend 3:2 durch und feierte den Turniersieg.</p>',
    published_at: daysAgo(10),
    status: 'published',
  },
  {
    title: 'Neue Trainingszeiten ab April',
    slug: 'neue-trainingszeiten',
    summary: 'Anpassung der Trainingszeiten für die Seniorenmannschaft.',
    content: '<p>Ab April trainieren wir dienstags und donnerstags von 18:30 bis 20:30 Uhr auf Platz 1.</p>',
    published_at: daysAgo(14),
    status: 'published',
  },
  {
    title: 'Entwurf: Interne Planung',
    slug: 'interne-planung-entwurf',
    summary: 'Dieser Beitrag ist noch nicht veröffentlicht.',
    content: '<p>Interner Entwurf – sollte nicht auf der Website erscheinen.</p>',
    published_at: daysAgo(1),
    status: 'draft',
  },
]

const GAME_ITEMS = [
  {
    opponent: 'FC Musterstadt',
    date: daysFromNow(7, 15, 0),
    location: 'Sportplatz Danninger',
    is_home: true,
    status: 'scheduled',
  },
  {
    opponent: 'SV Nachbarort',
    date: daysFromNow(14, 17, 30),
    location: 'Arena Nachbarort',
    is_home: false,
    status: 'scheduled',
  },
  {
    opponent: 'TSV Waldheim',
    date: daysFromNow(21, 14, 0),
    location: 'Sportplatz Danninger',
    is_home: true,
    status: 'scheduled',
  },
  {
    opponent: 'FC Bergtal',
    date: daysFromNow(28, 16, 0),
    location: 'Bergtal Stadion',
    is_home: false,
    status: 'scheduled',
  },
  {
    opponent: 'Union Riverside',
    date: daysFromNow(35, 15, 30),
    location: 'Sportplatz Danninger',
    is_home: true,
    status: 'scheduled',
  },
  {
    opponent: 'SC Altstadt',
    date: daysFromNow(42, 18, 0),
    location: 'Altstadt Sportpark',
    is_home: false,
    status: 'scheduled',
  },
]

async function seedNews(token) {
  let created = 0
  let skipped = 0

  for (const item of NEWS_ITEMS) {
    const existing = await api(`/items/news?filter[slug][_eq]=${item.slug}&limit=1`, { token })

    if (existing.data?.length) {
      skipped++
      continue
    }

    await api('/items/news', { method: 'POST', token, body: item })
    created++
  }

  console.log(`News: ${created} neu angelegt, ${skipped} bereits vorhanden.`)
}

async function seedGames(token) {
  let created = 0
  let skipped = 0

  for (const item of GAME_ITEMS) {
    const existing = await api(
      `/items/games?filter[opponent][_eq]=${encodeURIComponent(item.opponent)}&filter[date][_eq]=${item.date}&limit=1`,
      { token },
    )

    if (existing.data?.length) {
      skipped++
      continue
    }

    await api('/items/games', { method: 'POST', token, body: item })
    created++
  }

  console.log(`Spiele: ${created} neu angelegt, ${skipped} bereits vorhanden.`)
}

async function main() {
  console.log(`Directus Seed: ${DIRECTUS_URL}`)

  const token = await login()
  await seedNews(token)
  await seedGames(token)

  console.log('\nTestdaten fertig. Website neu laden: http://localhost:3000')
}

main().catch((error) => {
  console.error('\nSeed fehlgeschlagen:', error.message)
  process.exit(1)
})

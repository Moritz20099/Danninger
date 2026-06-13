/**
 * Legt Directus Collections, Public-Read und Beispieldaten an.
 * Ausführen: npm run directus:setup
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

async function collectionExists(token, name) {
  try {
    await api(`/collections/${name}`, { token })
    return true
  } catch {
    return false
  }
}

async function createNewsCollection(token) {
  if (await collectionExists(token, 'news')) {
    console.log('Collection "news" existiert bereits – übersprungen.')
    return
  }

  await api('/collections', {
    method: 'POST',
    token,
    body: {
      collection: 'news',
      meta: {
        icon: 'newspaper',
        note: 'Vereinsnews',
        display_template: '{{title}}',
      },
      schema: {},
      fields: [
        {
          field: 'title',
          type: 'string',
          meta: { interface: 'input', required: true, width: 'full' },
          schema: { is_nullable: false },
        },
        {
          field: 'slug',
          type: 'string',
          meta: { interface: 'input', width: 'half' },
        },
        {
          field: 'summary',
          type: 'text',
          meta: { interface: 'input-multiline', width: 'full' },
        },
        {
          field: 'content',
          type: 'text',
          meta: { interface: 'input-rich-text-html', width: 'full' },
        },
        {
          field: 'published_at',
          type: 'timestamp',
          meta: { interface: 'datetime', width: 'half' },
        },
        {
          field: 'status',
          type: 'string',
          meta: {
            interface: 'select-dropdown',
            width: 'half',
            options: {
              choices: [
                { text: 'Published', value: 'published' },
                { text: 'Draft', value: 'draft' },
              ],
            },
          },
          schema: { default_value: 'draft' },
        },
        {
          field: 'image',
          type: 'uuid',
          meta: {
            interface: 'file-image',
            special: ['file'],
            width: 'full',
          },
          schema: {
            foreign_key_table: 'directus_files',
            foreign_key_column: 'id',
          },
        },
      ],
    },
  })

  console.log('Collection "news" angelegt.')
}

async function createGamesCollection(token) {
  if (await collectionExists(token, 'games')) {
    console.log('Collection "games" existiert bereits – übersprungen.')
    return
  }

  await api('/collections', {
    method: 'POST',
    token,
    body: {
      collection: 'games',
      meta: {
        icon: 'sports_soccer',
        note: 'Spieltermine',
        display_template: '{{opponent}}',
      },
      schema: {},
      fields: [
        {
          field: 'opponent',
          type: 'string',
          meta: { interface: 'input', required: true, width: 'half' },
          schema: { is_nullable: false },
        },
        {
          field: 'date',
          type: 'timestamp',
          meta: { interface: 'datetime', required: true, width: 'half' },
          schema: { is_nullable: false },
        },
        {
          field: 'location',
          type: 'string',
          meta: { interface: 'input', width: 'full' },
        },
        {
          field: 'is_home',
          type: 'boolean',
          meta: { interface: 'boolean', width: 'half' },
          schema: { default_value: true },
        },
        {
          field: 'status',
          type: 'string',
          meta: { interface: 'input', width: 'half' },
          schema: { default_value: 'scheduled' },
        },
      ],
    },
  })

  console.log('Collection "games" angelegt.')
}

const NEWS_IMAGE_FIELD = {
  field: 'image',
  type: 'uuid',
  meta: {
    interface: 'file-image',
    special: ['file'],
    width: 'full',
  },
  schema: {
    foreign_key_table: 'directus_files',
    foreign_key_column: 'id',
  },
}

async function fieldExists(token, collection, fieldName) {
  try {
    await api(`/fields/${collection}/${fieldName}`, { token })
    return true
  } catch {
    return false
  }
}

async function ensureNewsImageField(token) {
  if (!(await collectionExists(token, 'news'))) {
    return
  }

  if (await fieldExists(token, 'news', 'image')) {
    console.log('Feld "image" existiert bereits.')
    return
  }

  await api('/fields/news', {
    method: 'POST',
    token,
    body: NEWS_IMAGE_FIELD,
  })

  console.log('Feld "image" in "news" angelegt.')
}

async function getPublicPolicyId(token) {
  const data = await api('/policies?filter[name][_eq]=$t:public_label&limit=1', { token })
  const policy = data.data?.[0]

  if (!policy) {
    throw new Error('Public-Policy nicht gefunden.')
  }

  return policy.id
}

async function ensurePublicRead(token, collection) {
  const policyId = await getPublicPolicyId(token)
  const existing = await api(
    `/permissions?filter[policy][_eq]=${policyId}&filter[collection][_eq]=${collection}&filter[action][_eq]=read&limit=1`,
    { token },
  )

  if (existing.data?.length) {
    console.log(`Public Read für "${collection}" existiert bereits.`)
    return
  }

  await api('/permissions', {
    method: 'POST',
    token,
    body: {
      policy: policyId,
      collection,
      action: 'read',
      fields: ['*'],
    },
  })

  console.log(`Public Read für "${collection}" gesetzt.`)
}

async function seedSampleData(token) {
  const newsItems = await api('/items/news?limit=1', { token })
  if (!newsItems.data?.length) {
    await api('/items/news', {
      method: 'POST',
      token,
      body: {
        title: 'Saisonstart 2026',
        slug: 'saisonstart-2026',
        summary: 'Die neue Saison beginnt – alle Infos zum Auftakt.',
        content: '<p>Der SV Danninger startet motiviert in die Saison 2026. Training jeden Dienstag und Donnerstag.</p>',
        published_at: new Date().toISOString(),
        status: 'published',
      },
    })

    await api('/items/news', {
      method: 'POST',
      token,
      body: {
        title: 'Neuer Trikotsponsor',
        slug: 'neuer-trikotsponsor',
        summary: 'Wir freuen uns über einen neuen Partner an unserer Seite.',
        content: '<p>Ab sofort unterstützt uns ein regionaler Sponsor mit neuen Trikots.</p>',
        published_at: new Date(Date.now() - 86400000).toISOString(),
        status: 'published',
      },
    })

    console.log('Beispiel-News angelegt.')
  } else {
    console.log('News-Einträge existieren bereits – übersprungen.')
  }

  const gameItems = await api('/items/games?limit=1', { token })
  if (!gameItems.data?.length) {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    nextWeek.setHours(15, 0, 0, 0)

    const inTwoWeeks = new Date()
    inTwoWeeks.setDate(inTwoWeeks.getDate() + 14)
    inTwoWeeks.setHours(17, 30, 0, 0)

    await api('/items/games', {
      method: 'POST',
      token,
      body: {
        opponent: 'FC Musterstadt',
        date: nextWeek.toISOString(),
        location: 'Sportplatz Danninger',
        is_home: true,
        status: 'scheduled',
      },
    })

    await api('/items/games', {
      method: 'POST',
      token,
      body: {
        opponent: 'SV Nachbarort',
        date: inTwoWeeks.toISOString(),
        location: 'Auswärts – Nachbarort Arena',
        is_home: false,
        status: 'scheduled',
      },
    })

    console.log('Beispiel-Spiele angelegt.')
  } else {
    console.log('Spiel-Einträge existieren bereits – übersprungen.')
  }
}

async function main() {
  console.log(`Directus Setup: ${DIRECTUS_URL}`)

  const token = await login()
  console.log('Admin-Login erfolgreich.')

  await createNewsCollection(token)
  await createGamesCollection(token)
  await ensureNewsImageField(token)
  await ensurePublicRead(token, 'news')
  await ensurePublicRead(token, 'games')
  await ensurePublicRead(token, 'directus_files')
  await seedSampleData(token)

  console.log('\nFertig! Website neu laden: http://localhost:3000')
}

main().catch((error) => {
  console.error('\nSetup fehlgeschlagen:', error.message)
  process.exit(1)
})

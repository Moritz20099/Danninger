import { createDirectus, readItems, rest, staticToken } from '@directus/sdk'

const NEWS_FIELDS = [
  'id',
  'title',
  'slug',
  'summary',
  'content',
  'published_at',
  'status',
  'image.id',
]
const GAME_FIELDS = ['id', 'opponent', 'date', 'location', 'is_home', 'status']
const REQUEST_TIMEOUT_MS = 2000

async function withTimeout(promise, ms = REQUEST_TIMEOUT_MS) {
  let timeoutId

  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Directus request timeout')), ms)
  })

  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timeoutId)
  }
}

export function createDirectusClient(url, token) {
  let client = createDirectus(url).with(rest())

  if (token) {
    client = client.with(staticToken(token))
  }

  return client
}

export function getDirectusAssetUrl(baseUrl, file, options = {}) {
  const id = typeof file === 'string' ? file : file?.id

  if (!id) {
    return null
  }

  const params = new URLSearchParams()

  if (options.width) {
    params.set('width', String(options.width))
  }

  if (options.height) {
    params.set('height', String(options.height))
  }

  if (options.fit) {
    params.set('fit', options.fit)
  }

  if (options.quality) {
    params.set('quality', String(options.quality))
  }

  const query = params.toString()
  const normalizedBase = baseUrl.replace(/\/$/, '')

  return `${normalizedBase}/assets/${id}${query ? `?${query}` : ''}`
}

export async function fetchNews(client, { limit } = {}) {
  try {
    return await withTimeout(
      client.request(
        readItems('news', {
          sort: ['-published_at'],
          filter: { status: { _eq: 'published' } },
          fields: NEWS_FIELDS,
          ...(limit ? { limit } : {}),
        }),
      ),
    )
  } catch (error) {
    console.warn('[Directus] fetchNews failed:', error?.message || error)
    return []
  }
}

export async function fetchNewsBySlug(client, slugOrId) {
  const isNumericId = String(Number(slugOrId)) === String(slugOrId)

  try {
    const items = await withTimeout(
      client.request(
        readItems('news', {
          filter: {
            status: { _eq: 'published' },
            ...(isNumericId
              ? { id: { _eq: Number(slugOrId) } }
              : { slug: { _eq: slugOrId } }),
          },
          fields: NEWS_FIELDS,
          limit: 1,
        }),
      ),
    )

    return items[0] || null
  } catch (error) {
    console.warn('[Directus] fetchNewsBySlug failed:', error?.message || error)
    return null
  }
}

export async function fetchUpcomingGames(client, { limit } = {}) {
  try {
    return await withTimeout(
      client.request(
        readItems('games', {
          sort: ['date'],
          filter: {
            date: { _gte: '$NOW' },
          },
          fields: GAME_FIELDS,
          ...(limit ? { limit } : {}),
        }),
      ),
    )
  } catch (error) {
    console.warn('[Directus] fetchUpcomingGames failed:', error?.message || error)
    return []
  }
}

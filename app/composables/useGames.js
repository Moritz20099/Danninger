import { createDirectusClient, fetchUpcomingGames } from '~~/services/directus'

function getClient() {
  const config = useRuntimeConfig()
  return createDirectusClient(config.public.directusUrl, config.public.directusToken)
}

const asyncDataOptions = {
  lazy: true,
  default: () => [],
}

export function useUpcomingGames(limit) {
  const key = limit ? `upcoming-games-${limit}` : 'upcoming-games'

  return useAsyncData(
    key,
    () => fetchUpcomingGames(getClient(), { limit }),
    asyncDataOptions,
  )
}

export function useNextGame() {
  return useAsyncData(
    'next-game',
    () => fetchUpcomingGames(getClient(), { limit: 1 }),
    asyncDataOptions,
  )
}

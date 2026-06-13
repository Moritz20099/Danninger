import { createDirectusClient, fetchNews, fetchNewsBySlug } from '~~/services/directus'

function getClient() {
  const config = useRuntimeConfig()
  return createDirectusClient(config.public.directusUrl, config.public.directusToken)
}

const asyncDataOptions = {
  lazy: true,
  default: () => [],
}

export function useLatestNews(limit = 3) {
  return useAsyncData(
    `latest-news-${limit}`,
    () => fetchNews(getClient(), { limit }),
    asyncDataOptions,
  )
}

export function useAllNews() {
  return useAsyncData('all-news', () => fetchNews(getClient()), asyncDataOptions)
}

export function useNewsPost(slug) {
  const slugRef = computed(() => unref(slug))

  return useAsyncData(
    () => `news-post-${slugRef.value}`,
    () => fetchNewsBySlug(getClient(), slugRef.value),
    {
      watch: [slugRef],
      default: () => null,
    },
  )
}

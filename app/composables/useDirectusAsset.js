import { getDirectusAssetUrl } from '~~/services/directus'

export function useDirectusAsset(file, options = {}) {
  const config = useRuntimeConfig()

  return computed(() => {
    const fileValue = unref(file)
    const optionValue = unref(options)

    return getDirectusAssetUrl(config.public.directusUrl, fileValue, optionValue)
  })
}

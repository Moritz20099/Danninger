<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'featured', 'compact'].includes(value),
  },
})

const formattedDate = computed(() => {
  if (!props.post.published_at) {
    return ''
  }

  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(props.post.published_at))
})

const postLink = computed(() => `/news/${props.post.slug || props.post.id}`)

const imageUrl = useDirectusAsset(
  () => props.post.image,
  { width: 800, height: 450, fit: 'cover', quality: 80 },
)

const excerpt = computed(() => {
  if (props.post.summary) {
    return props.post.summary
  }

  if (props.post.content) {
    return props.post.content.replace(/<[^>]+>/g, '').slice(0, 160)
  }

  return ''
})
</script>

<template>
  <!-- Featured bento card -->
  <NuxtLink
    v-if="variant === 'featured'"
    :to="postLink"
    class="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-md no-underline"
  >
    <span class="absolute top-0 left-0 h-full w-1 bg-primary" aria-hidden="true" />

    <div>
      <span class="text-xs font-semibold tracking-wider text-primary uppercase">News</span>
      <h3 class="mt-2 font-display text-xl font-bold text-secondary transition-colors group-hover:text-primary">
        {{ post.title }}
      </h3>
      <p v-if="excerpt" class="mt-4 line-clamp-3 text-on-surface-variant">
        {{ excerpt }}
      </p>
    </div>

    <div v-if="imageUrl" class="mt-6 h-48 overflow-hidden rounded-lg">
      <img
        :src="imageUrl"
        :alt="post.title"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      >
    </div>
  </NuxtLink>

  <!-- Compact horizontal card -->
  <NuxtLink
    v-else-if="variant === 'compact'"
    :to="postLink"
    class="group flex cursor-pointer items-center gap-4 rounded-xl border border-outline-variant bg-surface-container-low p-4 no-underline transition-colors hover:border-primary"
  >
    <div v-if="imageUrl" class="h-24 w-24 shrink-0 overflow-hidden rounded-lg">
      <img
        :src="imageUrl"
        :alt="post.title"
        class="h-full w-full object-cover"
        loading="lazy"
      >
    </div>
    <div v-else class="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-surface-container">
      <span class="material-symbols-outlined text-3xl text-on-primary-container">newspaper</span>
    </div>

    <div class="min-w-0">
      <span class="text-xs font-semibold tracking-wider text-on-tertiary-fixed-variant uppercase">
        {{ formattedDate || 'News' }}
      </span>
      <h4 class="font-display text-lg font-bold text-secondary transition-colors group-hover:text-primary">
        {{ post.title }}
      </h4>
    </div>
  </NuxtLink>

  <!-- Default grid card -->
  <NuxtLink
    v-else
    :to="postLink"
    class="group flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm no-underline transition-[border-color,box-shadow] hover:border-primary hover:shadow-md"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="post.title"
      class="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      loading="lazy"
    >

    <div class="flex flex-1 flex-col p-6">
      <time v-if="formattedDate" class="text-xs font-semibold tracking-wide text-primary uppercase">
        {{ formattedDate }}
      </time>
      <h3 class="mt-2 font-display text-lg font-bold text-secondary transition-colors group-hover:text-primary">
        {{ post.title }}
      </h3>
      <p v-if="excerpt" class="mt-3 flex-1 text-sm leading-relaxed text-on-surface-variant line-clamp-3">
        {{ excerpt }}
      </p>
      <span class="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
        Weiterlesen
        <span class="material-symbols-outlined text-base">arrow_forward</span>
      </span>
    </div>
  </NuxtLink>
</template>

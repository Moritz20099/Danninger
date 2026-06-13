<script setup>
const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: post, pending, error } = useNewsPost(slug)

const isCurrentPost = computed(() => {
  if (!post.value) {
    return false
  }

  return post.value.slug === slug.value || String(post.value.id) === slug.value
})

const isLoading = computed(() => pending.value || !isCurrentPost.value)

watchEffect(() => {
  if (isLoading.value || error.value) {
    return
  }

  if (!post.value) {
    throw createError({ statusCode: 404, statusMessage: 'Beitrag nicht gefunden' })
  }
})

const formattedDate = computed(() => {
  if (!post.value?.published_at) {
    return ''
  }

  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(post.value.published_at))
})

useHead(() => ({
  title: isCurrentPost.value && post.value
    ? `${post.value.title} – SV Danninger`
    : 'News – SV Danninger',
}))

const imageUrl = useDirectusAsset(
  () => (isCurrentPost.value ? post.value?.image : null),
  { width: 1200, height: 630, fit: 'cover', quality: 85 },
)
</script>

<template>
  <div>
    <section class="bg-surface-container-low py-8">
      <div class="container-site">
        <NuxtLink
          to="/news"
          class="inline-flex items-center gap-1 text-sm font-semibold text-secondary no-underline hover:underline"
        >
          <span class="material-symbols-outlined text-base">arrow_back</span>
          Zurück zu allen News
        </NuxtLink>
      </div>
    </section>

    <div class="container-site max-w-3xl py-12">
      <div v-if="isLoading" class="space-y-4">
        <div class="h-8 w-2/3 animate-pulse rounded bg-surface-container" />
        <div class="h-4 w-1/3 animate-pulse rounded bg-surface-container" />
        <div class="mt-8 space-y-3">
          <div v-for="n in 6" :key="n" class="h-4 animate-pulse rounded bg-surface-container" />
        </div>
      </div>

      <div v-else-if="error" class="rounded-xl border border-error-container bg-error-container/30 p-6 text-on-error-container">
        Beitrag konnte nicht geladen werden.
      </div>

      <article v-else-if="post && isCurrentPost" :key="slug">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="post.title"
          class="mb-8 aspect-[21/9] w-full rounded-xl object-cover shadow-md"
        >

        <header>
          <time v-if="formattedDate" class="text-xs font-semibold tracking-wide text-secondary uppercase">
            {{ formattedDate }}
          </time>
          <h1 class="mt-3 font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {{ post.title }}
          </h1>
          <p v-if="post.summary" class="mt-4 text-lg leading-relaxed text-on-surface-variant">
            {{ post.summary }}
          </p>
        </header>

        <div
          v-if="post.content"
          class="news-content mt-10 border-t border-outline-variant pt-10"
          v-html="post.content"
        />
      </article>
    </div>
  </div>
</template>

<style scoped>
.news-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
  color: var(--color-on-surface-variant);
}

.news-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.news-content :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}

.news-content :deep(ul),
.news-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  color: var(--color-on-surface-variant);
}

.news-content :deep(li) {
  margin-bottom: 0.25rem;
}

.news-content :deep(a) {
  color: var(--color-secondary);
  text-decoration: underline;
}
</style>

<script setup>
useHead({
  title: 'News – SV Danninger',
})

const { data: news, pending, error } = useAllNews()
</script>

<template>
  <div>
    <section class="diagonal-clip bg-primary-container py-16 md:py-20">
      <div class="container-site">
        <h1 class="font-display text-4xl font-extrabold text-on-primary md:text-5xl">
          News
        </h1>
        <p class="mt-3 max-w-2xl text-lg text-on-primary-container">
          Alle Meldungen und Updates aus dem Vereinsleben.
        </p>
      </div>
    </section>

    <div class="container-site py-12">
      <div v-if="pending" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 6" :key="n" class="h-64 animate-pulse rounded-xl bg-surface-container" />
      </div>

      <div v-else-if="error" class="rounded-xl border border-error-container bg-error-container/30 p-6 text-on-error-container">
        News konnten nicht geladen werden. Bitte Directus-URL und Berechtigungen prüfen.
      </div>

      <div v-else-if="news?.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NewsCard v-for="post in news" :key="post.id" :post="post" />
      </div>

      <div v-else class="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center text-on-surface-variant">
        Noch keine News vorhanden. Lege Einträge in der Directus-Collection <code class="text-sm">news</code> an.
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Spiele – SV Danninger',
})

const { data: games, pending, error } = useUpcomingGames()
</script>

<template>
  <div>
    <section class="diagonal-clip bg-primary-container py-16 md:py-20">
      <div class="container-site">
        <h1 class="font-display text-4xl font-extrabold text-on-primary md:text-5xl">
          Spiele
        </h1>
        <p class="mt-3 max-w-2xl text-lg text-on-primary-container">
          Alle anstehenden Spiele und Termine auf einen Blick.
        </p>
      </div>
    </section>

    <div class="container-site py-12">
      <div v-if="pending" class="space-y-4">
        <div v-for="n in 4" :key="n" class="h-28 animate-pulse rounded-lg bg-surface-container" />
      </div>

      <div v-else-if="error" class="rounded-xl border border-error-container bg-error-container/30 p-6 text-on-error-container">
        Spieltermine konnten nicht geladen werden. Bitte Directus-URL und Berechtigungen prüfen.
      </div>

      <div v-else-if="games?.length" class="flex flex-col gap-4">
        <GameCard
          v-for="game in games"
          :key="game.id"
          :game="game"
          featured
        />
      </div>

      <div v-else class="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center text-on-surface-variant">
        Keine anstehenden Spiele vorhanden. Lege Einträge in der Directus-Collection <code class="text-sm">games</code> an.
      </div>
    </div>
  </div>
</template>

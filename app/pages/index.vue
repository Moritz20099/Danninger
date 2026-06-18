<script setup>
useHead({
  title: 'SV Danninger – Home',
})

const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnckSJpo1cIxo6uEydXxYHJEt6Bt_a1BqK9v4Fn5WvxtbtKU_o8hx2gcupKv7NdDoshD8o8E3LelrbXH0ndBqpri5n5osFaBr5hoa46wFxCFrnYtsYQ02tFkKkZ2j4SD0F9r2QB_dZCnT0Ubqi9x8b2Bpj86l2MZxfTwavZQtGDWRjnhtgnIJNBarH5QBJVmbympWnVqM_bHh-2TLWgF4fF-DHYKHddTXQaR8E199k3EJEBxXLhKFH'
const aboutImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfGPfIVo1xcx60JwuHQxQGgI7dQjYG5tI0cuYFKJtkdtZ9tQimzXx3c5UKSvd21fun42xswpJgP5uPgroi-IU1Pgq9BlaytaHhFLR0-6UwRFz1VcMPJWvhnxvAi2HBacZ-SiDN1XeLKucYiNRyb2kk8ViitKZ2iF32ylGZCiLeeDsFwlY9rTrJ3QCpIODc818HPscOPB8IM1YumHZRWceoYDMUD5Gjg8jk4RZzTPa-8xUVB4CxazQO'

const { data: news, pending: newsPending, error: newsError } = useLatestNews(3)
const { data: games, pending: gamesPending, error: gamesError } = useUpcomingGames(3)

const featuredNews = computed(() => news.value?.[0] || null)
const otherNews = computed(() => news.value?.slice(1) || [])

watch([newsPending, gamesPending], ([newsLoading, gamesLoading]) => {
  if (!newsLoading && !gamesLoading) {
    refreshPageAnimations()
  }
})
</script>

<template>
  <div>
    <!-- Hero -->
    <header data-gsap="home-hero" class="hero-clip relative h-[min(870px,90vh)] w-full overflow-hidden bg-black">
      <div data-gsap="hero-bg" class="absolute inset-0 z-0 overflow-hidden">
        <img
          :src="heroImage"
          alt="Volleyball-Aktion"
          class="h-full w-full object-cover opacity-60"
        >
      </div>
      <div class="absolute inset-0 z-10 bg-gradient-to-r from-black/80 to-transparent" />

      <div class="container-site relative z-20 flex h-full flex-col items-start justify-center pb-24">
        <div data-gsap="hero-item" class="mb-4 inline-block rounded-sm bg-primary px-3 py-1 text-xs font-semibold tracking-wider text-on-primary uppercase">
          Seit 1985
        </div>

        <h1 data-gsap="hero-item" class="max-w-3xl font-display text-4xl leading-tight font-extrabold tracking-tight text-on-primary md:text-5xl">
          Präzision, Power &amp; Teamgeist auf dem Court
        </h1>

        <p data-gsap="hero-item" class="mt-4 max-w-xl text-lg text-surface-container-highest">
          Willkommen beim SV Danninger – aktuelle News, Spieltermine und alles Wichtige rund um unseren Volleyballverein.
        </p>

        <div data-gsap="hero-item" class="mt-8 flex flex-wrap gap-6">
          <NuxtLink to="/contact" class="btn-accent px-8 py-4 text-base">
            Mitglied werden
          </NuxtLink>
          <NuxtLink to="/games" class="btn-outline px-8 py-4 text-base">
            Spielplan
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- News Bento -->
    <section data-gsap="fade-up" class="container-site relative z-30 -mt-24 py-8">
      <div class="mb-8 flex items-end justify-between gap-4">
        <h2 class="section-heading">
          <span class="section-heading-bar" />
          Aktuelle News
        </h2>
        <NuxtLink to="/news" class="flex items-center gap-1 text-sm font-semibold tracking-wide text-primary no-underline uppercase hover:underline">
          Alle News
          <span class="material-symbols-outlined text-base">arrow_forward</span>
        </NuxtLink>
      </div>

      <div v-if="newsPending" class="grid gap-6 md:grid-cols-12">
        <div class="h-80 animate-pulse rounded-xl bg-surface-container md:col-span-7" />
        <div class="flex flex-col gap-6 md:col-span-5">
          <div v-for="n in 2" :key="n" class="h-28 animate-pulse rounded-xl bg-surface-container" />
        </div>
      </div>

      <div v-else-if="newsError" class="rounded-xl border border-error-container bg-error-container/30 p-6 text-on-error-container">
        News konnten nicht geladen werden.
      </div>

      <div v-else-if="news?.length" data-gsap="stagger" class="grid gap-6 md:grid-cols-12">
        <div v-if="featuredNews" class="md:col-span-7">
          <NewsCard :post="featuredNews" variant="featured" />
        </div>

        <div class="flex flex-col gap-6 md:col-span-5">
          <NewsCard
            v-for="post in otherNews"
            :key="post.id"
            :post="post"
            variant="compact"
          />

          <div class="flex flex-col items-center justify-center rounded-xl bg-secondary p-6 text-center shadow-lg">
            <span class="material-symbols-outlined mb-2 text-4xl text-primary">groups</span>
            <h4 class="font-display text-lg font-bold text-on-secondary">
              Werde Teil des Teams
            </h4>
            <p class="mt-1 text-sm text-surface-container-highest">
              Training für alle Altersklassen
            </p>
            <NuxtLink
              to="/contact"
              class="mt-4 border-b border-white/30 pb-1 text-sm font-semibold text-on-secondary no-underline hover:border-white"
            >
              Jetzt anfragen
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center text-on-surface-variant">
        Noch keine News vorhanden. Directus-Collection <code class="text-sm">news</code> einrichten.
      </div>
    </section>

    <!-- Upcoming Games -->
    <section class="overflow-hidden bg-surface-container-low py-12">
      <div class="container-site">
        <h2 data-gsap="fade-up" class="section-heading mb-8 text-center md:text-left">
          <span class="section-heading-bar" />
          Nächste Spiele
        </h2>

        <div v-if="gamesPending" class="space-y-4">
          <div v-for="n in 2" :key="n" class="h-28 animate-pulse rounded-lg bg-surface-container" />
        </div>

        <div v-else-if="gamesError" class="rounded-xl border border-error-container bg-error-container/30 p-6 text-on-error-container">
          Spieltermine konnten nicht geladen werden.
        </div>

        <div v-else-if="games?.length" data-gsap="stagger" class="flex flex-col gap-4">
          <GameCard
            v-for="game in games"
            :key="game.id"
            :game="game"
            featured
          />
        </div>

        <div v-else class="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center text-on-surface-variant">
          Kein anstehendes Spiel vorhanden.
        </div>

        <div v-if="games?.length" data-gsap="fade-up" class="mt-8 text-center md:text-left">
          <NuxtLink to="/games" class="inline-flex items-center gap-1 text-sm font-semibold text-primary no-underline uppercase hover:underline">
            Alle Spiele
            <span class="material-symbols-outlined text-base">arrow_forward</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- About -->
    <section class="relative overflow-hidden bg-surface-container-lowest py-24">
      <div class="absolute top-0 right-0 hidden h-full w-1/3 translate-x-20 skew-x-[-2deg] bg-surface-container-high lg:block" aria-hidden="true" />

      <div class="container-site relative z-10">
        <div class="grid items-center gap-16 lg:grid-cols-2">
          <div data-gsap="fade-up">
            <h2 class="mb-4 font-display text-3xl font-bold text-primary md:text-4xl">
              Präzision, Leistung &amp; Vereinsstolz
            </h2>
            <p class="mb-8 text-lg leading-relaxed text-on-surface-variant">
              Der SV Danninger ist mehr als ein Volleyballverein – wir sind eine Gemeinschaft, die Technik, Taktik und Teamgeist verbindet. Seit unserer Gründung fördern wir Athletinnen und Athleten jeden Alters auf und neben dem Court.
            </p>

            <div data-gsap="stagger" class="grid grid-cols-2 gap-8">
              <div class="asymmetric-border pl-4">
                <span data-gsap="counter" data-count="3" class="block font-display text-4xl font-extrabold text-primary">3</span>
                <span class="text-xs font-semibold tracking-widest text-on-tertiary-fixed-variant uppercase">Mannschaften</span>
              </div>
              <div class="asymmetric-border pl-4">
                <span data-gsap="counter" data-count="80" data-suffix="+" class="block font-display text-4xl font-extrabold text-primary">80+</span>
                <span class="text-xs font-semibold tracking-widest text-on-tertiary-fixed-variant uppercase">Mitglieder</span>
              </div>
              <div class="asymmetric-border pl-4">
                <span data-gsap="counter" data-count="2" data-suffix="×" class="block font-display text-4xl font-extrabold text-primary">2×</span>
                <span class="text-xs font-semibold tracking-widest text-on-tertiary-fixed-variant uppercase">Training / Woche</span>
              </div>
              <div class="asymmetric-border pl-4">
                <span data-gsap="counter" data-count="40" class="block font-display text-4xl font-extrabold text-primary">40</span>
                <span class="text-xs font-semibold tracking-widest text-on-tertiary-fixed-variant uppercase">Jahre Tradition</span>
              </div>
            </div>
          </div>

          <div data-gsap="fade-up" class="relative">
            <div data-gsap="parallax" class="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                :src="aboutImage"
                alt="Training beim SV Danninger"
                class="h-auto w-full"
              >
              <div class="absolute inset-0 bg-black/10 mix-blend-multiply" />
            </div>

            <div class="absolute -bottom-6 -left-6 rounded-xl bg-primary p-6 text-on-primary shadow-xl">
              <p class="font-display text-3xl leading-none font-extrabold">
                40
              </p>
              <p class="text-xs font-semibold tracking-tighter uppercase">
                Jahre Vereinsgeschichte
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section data-gsap="fade-up" class="relative overflow-hidden bg-secondary py-16">
      <div class="pointer-events-none absolute inset-0 opacity-10" aria-hidden="true">
        <div class="grid h-full grid-cols-6 gap-4">
          <div v-for="n in 6" :key="n" class="rotate-12 border-r border-white" />
        </div>
      </div>

      <div class="container-site relative z-10 text-center">
        <h2 class="mb-4 font-display text-2xl font-bold text-on-secondary md:text-3xl">
          Bereit für dein nächstes Level?
        </h2>
        <p class="mx-auto mb-8 max-w-2xl text-lg text-surface-container-highest/90">
          Probiertraining und neue Mitglieder sind jederzeit willkommen. Melde dich bei uns – wir freuen uns auf dich!
        </p>
        <NuxtLink to="/contact" class="btn-accent inline-flex px-10 py-4 text-base shadow-lg hover:scale-105">
          Jetzt anfragen
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

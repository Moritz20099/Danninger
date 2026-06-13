<script setup>
const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
})

const formattedDate = computed(() => {
  if (!props.game.date) {
    return null
  }

  const date = new Date(props.game.date)

  return {
    day: new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'short' }).format(date).toUpperCase(),
    time: new Intl.DateTimeFormat('de-DE', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date),
  }
})
</script>

<template>
  <article
    class="relative overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest p-4 shadow-sm transition-colors hover:border-primary md:p-5"
    :class="featured ? 'md:flex md:items-center md:justify-between' : ''"
  >
    <span class="match-stripe" aria-hidden="true" />

    <div class="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-6">
      <div v-if="formattedDate" class="min-w-[80px] text-center">
        <p class="text-xl leading-none font-bold text-primary">
          {{ formattedDate.day }}
        </p>
        <p class="mt-1 text-xs font-semibold tracking-wide text-on-surface-variant uppercase">
          {{ formattedDate.time }}
        </p>
      </div>

      <div class="flex items-center gap-4">
        <div class="text-right">
          <p class="font-display text-sm font-bold text-primary md:text-lg">
            SV Danninger
          </p>
          <p class="text-xs text-on-surface-variant">
            {{ game.is_home ? 'Heimteam' : 'Gastgeber' }}
          </p>
        </div>

        <div class="text-xl font-extrabold text-primary">
          VS
        </div>

        <div>
          <p class="font-display text-sm font-bold text-primary md:text-lg">
            {{ game.opponent }}
          </p>
          <p class="text-xs text-on-surface-variant">
            {{ game.is_home ? 'Gast' : 'Heimteam' }}
          </p>
        </div>
      </div>
    </div>

    <div
      class="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-end md:mt-0 md:gap-6"
      :class="featured ? 'md:ml-auto' : ''"
    >
      <div v-if="game.location" class="flex items-center gap-1 text-on-surface-variant">
        <span class="material-symbols-outlined text-sm">location_on</span>
        <span class="text-sm">{{ game.location }}</span>
      </div>

      <span
        class="rounded-lg px-3 py-1 text-xs font-semibold tracking-wide uppercase"
        :class="game.is_home ? 'bg-surface-container text-primary' : 'bg-surface-container-low text-on-surface-variant'"
      >
        {{ game.is_home ? 'Heimspiel' : 'Auswärts' }}
      </span>
    </div>
  </article>
</template>

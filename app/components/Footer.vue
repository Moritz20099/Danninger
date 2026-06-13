<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-auto bg-tertiary-container text-on-tertiary">
    <div class="container-site flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
      <div class="text-center md:text-left">
        <p class="font-display text-xl font-bold text-on-tertiary">
          SV DANNINGER
        </p>
        <p class="mt-1 text-sm text-on-tertiary-container">
          Volleyball mit Leidenschaft &amp; Teamgeist
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-6 text-sm">
        <NuxtLink to="/news" class="text-on-tertiary-container no-underline hover:text-secondary-fixed-dim">
          News
        </NuxtLink>
        <NuxtLink to="/games" class="text-on-tertiary-container no-underline hover:text-secondary-fixed-dim">
          Spiele
        </NuxtLink>
        <NuxtLink to="/contact" class="text-on-tertiary-container no-underline hover:text-secondary-fixed-dim">
          Kontakt
        </NuxtLink>
      </div>

      <p class="text-center text-sm text-on-tertiary-container md:text-right">
        © {{ year }} SV Danninger. Alle Rechte vorbehalten.
      </p>
    </div>
  </footer>
</template>

<script setup>
const route = useRoute()
const headerRef = ref(null)
const mobileMenuOpen = ref(false)

useNavbarAnimation(headerRef, mobileMenuOpen)

const links = [
  { label: 'Home', to: '/' },
  { label: 'News', to: '/news' },
  { label: 'Spiele', to: '/games' },
  { label: 'Kontakt', to: '/contact' },
]

function isActive(path) {
  if (path === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(path)
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
    if (import.meta.client) {
      document.body.style.overflow = ''
    }
  },
)

watch(mobileMenuOpen, (open) => {
  if (!import.meta.client) {
    return
  }

  document.body.style.overflow = open ? 'hidden' : ''
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <header ref="headerRef" class="site-header sticky top-0 z-50 border-b border-outline-variant bg-surface shadow-sm">
    <nav class="container-site flex items-center justify-between py-4">
      <NuxtLink
        to="/"
        class="font-display text-xl font-extrabold tracking-tighter text-primary no-underline hover:text-primary"
      >
        SV DANNINGER
      </NuxtLink>

      <ul class="hidden items-center gap-8 md:flex">
        <li v-for="link in links" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="text-base no-underline transition-colors duration-200"
            :class="isActive(link.to)
              ? 'border-b-2 border-primary pb-1 font-semibold text-primary'
              : 'text-on-surface-variant hover:text-primary'"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>

      <div class="flex items-center gap-3">
        <NuxtLink to="/contact" class="btn-accent hidden sm:inline-flex">
          Mitglied werden
        </NuxtLink>

        <button
          type="button"
          class="rounded-lg p-2 text-primary hover:bg-surface-container-low md:hidden"
          aria-label="Menü öffnen"
          @click="mobileMenuOpen = true"
        >
          <span class="material-symbols-outlined">menu</span>
        </button>
      </div>
    </nav>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="mobileMenuOpen"
          class="fixed inset-0 z-[100] flex flex-col bg-secondary md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div class="container-site flex items-center justify-between border-b border-tertiary py-4">
            <NuxtLink
              to="/"
              class="font-display text-xl font-extrabold tracking-tighter text-on-secondary no-underline"
              @click="closeMobileMenu"
            >
              SV DANNINGER
            </NuxtLink>

            <button
              type="button"
              class="rounded-lg p-2 text-surface-container-highest hover:bg-tertiary hover:text-on-secondary"
              aria-label="Menü schließen"
              @click="closeMobileMenu"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav class="flex flex-1 flex-col items-center justify-center gap-3 px-6 pb-16">
            <NuxtLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="mobile-nav-link w-full max-w-sm rounded-xl px-6 py-4 text-center text-2xl font-semibold no-underline transition-colors"
              :class="isActive(link.to)
                ? 'bg-primary text-on-primary'
                : 'text-on-secondary hover:bg-tertiary'"
              @click="closeMobileMenu"
            >
              {{ link.label }}
            </NuxtLink>

            <NuxtLink
              to="/contact"
              class="btn-accent mt-4 w-full max-w-sm justify-center text-center"
              @click="closeMobileMenu"
            >
              Mitglied werden
            </NuxtLink>
          </nav>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

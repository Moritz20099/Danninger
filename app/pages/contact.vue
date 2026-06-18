<script setup>
useHead({
  title: 'Kontakt – SV Danninger',
})

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const submitted = ref(false)

function handleSubmit() {
  submitted.value = true
}
</script>

<template>
  <div>
    <section data-gsap="page-head" class="diagonal-clip bg-primary-container py-16 md:py-20">
      <div class="container-site">
        <h1 data-gsap="page-head-item" class="font-display text-4xl font-extrabold text-on-primary md:text-5xl">
          Kontakt
        </h1>
        <p data-gsap="page-head-item" class="mt-3 max-w-2xl text-lg text-on-primary-container">
          Schreib uns eine Nachricht – wir melden uns so schnell wie möglich zurück.
        </p>
      </div>
    </section>

    <div class="container-site py-12">
      <div data-gsap="stagger" class="grid gap-10 lg:grid-cols-2">
        <form class="card-surface p-6 sm:p-8" @submit.prevent="handleSubmit">
          <div class="space-y-5">
            <div>
              <label for="name" class="mb-1.5 block text-sm font-semibold text-primary">Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Max Mustermann"
              >
            </div>

            <div>
              <label for="email" class="mb-1.5 block text-sm font-semibold text-primary">E-Mail</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="name@beispiel.de"
              >
            </div>

            <div>
              <label for="subject" class="mb-1.5 block text-sm font-semibold text-primary">Betreff</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                required
                class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Mitgliedschaft / Training / Allgemeine Anfrage"
              >
            </div>

            <div>
              <label for="message" class="mb-1.5 block text-sm font-semibold text-primary">Nachricht</label>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="5"
                class="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Deine Nachricht an den Verein…"
              />
            </div>
          </div>

          <button type="submit" class="btn-accent mt-6 w-full sm:w-auto">
            Nachricht senden
          </button>

          <p v-if="submitted" class="mt-4 rounded-lg bg-surface-container px-4 py-3 text-sm text-primary">
            Nachricht vorbereitet – Backend-Anbindung folgt. (Nur UI-Demo)
          </p>
        </form>

        <div class="space-y-6">
          <div class="card-surface p-6">
            <div class="mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">location_on</span>
              <h2 class="font-display text-lg font-bold text-primary">Verein</h2>
            </div>
            <p class="text-sm leading-relaxed text-on-surface-variant">
              SV Danninger<br>
              Musterstraße 1<br>
              1234 Danninger
            </p>
          </div>

          <div class="card-surface p-6">
            <div class="mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">mail</span>
              <h2 class="font-display text-lg font-bold text-primary">Erreichbarkeit</h2>
            </div>
            <dl class="space-y-3 text-sm text-on-surface-variant">
              <div>
                <dt class="font-semibold text-primary">E-Mail</dt>
                <dd>kontakt@sv-danninger.example</dd>
              </div>
              <div>
                <dt class="font-semibold text-primary">Training</dt>
                <dd>Dienstag &amp; Donnerstag, 18:00–20:00 Uhr</dd>
              </div>
            </dl>
          </div>

          <div class="rounded-xl bg-secondary p-6 text-on-secondary">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">sports_volleyball</span>
              <h2 class="font-display text-lg font-bold">Probetraining</h2>
            </div>
            <p class="mt-2 text-sm text-surface-container-highest/90">
              Du möchtest Volleyball ausprobieren? Komm einfach zum Training vorbei oder schreib uns vorab eine Nachricht.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

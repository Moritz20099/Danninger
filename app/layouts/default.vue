<script setup>
const mainRef = ref(null)

usePageAnimations(mainRef)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Navbar />
    <main ref="mainRef" class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>

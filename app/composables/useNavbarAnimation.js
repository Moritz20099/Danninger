import { useGsap, prefersReducedMotion } from './useGsap'

export function useNavbarAnimation(headerRef, mobileMenuOpen) {
  onMounted(async () => {
    if (prefersReducedMotion() || !headerRef.value) {
      return
    }

    const { gsap } = await useGsap()
    if (!gsap) {
      return
    }

    gsap.from(headerRef.value, {
      y: -24,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
  })

  watch(mobileMenuOpen, async (open) => {
    if (!open || prefersReducedMotion() || !import.meta.client) {
      return
    }

    await nextTick()

    const { gsap } = await useGsap()
    if (!gsap) {
      return
    }

    gsap.from('.mobile-nav-link', {
      x: -28,
      opacity: 0,
      duration: 0.45,
      stagger: 0.07,
      ease: 'power3.out',
    })
  })
}

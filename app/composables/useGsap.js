let gsapInstance = null
let scrollTriggerInstance = null

export async function useGsap() {
  if (!import.meta.client) {
    return { gsap: null, ScrollTrigger: null }
  }

  if (!gsapInstance) {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])

    gsap.registerPlugin(ScrollTrigger)
    gsapInstance = gsap
    scrollTriggerInstance = ScrollTrigger
  }

  return { gsap: gsapInstance, ScrollTrigger: scrollTriggerInstance }
}

export function prefersReducedMotion() {
  return import.meta.client
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

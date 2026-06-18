import { useGsap, prefersReducedMotion } from './useGsap'

const refreshTrigger = ref(0)
let runSeq = 0
let initTimer = null

const STAGGER = {
  inViewDelay: 0.55,
  scrollDelay: 0.15,
  itemGap: 0.16,
  duration: 0.65,
}

const STAGGER_OPTS = {
  each: STAGGER.itemGap,
  onComplete() {
    this.targets()[0]?.setAttribute('data-gsap-ready', '')
  },
}

export function refreshPageAnimations() {
  if (!import.meta.client) {
    return
  }

  nextTick(() => {
    refreshTrigger.value++
  })
}

function resetBodyScroll() {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
}

function markReady(el) {
  el?.setAttribute('data-gsap-ready', '')
}

function resetGsapState(root) {
  root?.querySelectorAll('[data-gsap-ready]').forEach((el) => {
    el.removeAttribute('data-gsap-ready')
  })
}

function fadeInTargets(gsap, targets, { delay = 0, duration = 0.75, stagger = 0.12, y = 36, onAllComplete } = {}) {
  if (!targets.length) {
    return
  }

  targets.forEach((el) => el.removeAttribute('data-gsap-ready'))
  gsap.set(targets, { opacity: 0, y, overwrite: 'auto' })

  gsap.to(targets, {
    opacity: 1,
    y: 0,
    duration,
    stagger: { ...STAGGER_OPTS, each: stagger },
    ease: 'power2.out',
    delay,
    clearProps: 'transform',
    onComplete: onAllComplete,
  })
}

function revealStaggerChildren(gsap, container, children, { startDelay, scrollTrigger } = {}) {
  container.removeAttribute('data-gsap-ready')
  children.forEach((child) => child.removeAttribute('data-gsap-ready'))

  gsap.set(children, { opacity: 0, y: 36, overwrite: 'auto' })

  const tl = gsap.timeline({
    scrollTrigger: scrollTrigger ?? undefined,
    onComplete: () => markReady(container),
  })

  tl.to(
    children,
    {
      opacity: 1,
      y: 0,
      duration: STAGGER.duration,
      stagger: STAGGER_OPTS,
      ease: 'power2.out',
      clearProps: 'transform',
    },
    startDelay ?? 0,
  )
}

export function usePageAnimations(rootRef) {
  const route = useRoute()
  let ctx = null

  async function run() {
    const seq = ++runSeq
    resetBodyScroll()

    if (!import.meta.client || !rootRef.value || prefersReducedMotion()) {
      if (seq === runSeq) {
        ctx?.revert()
        ctx = null
        rootRef.value?.querySelectorAll(
          '[data-gsap="stagger"], [data-gsap="page-head"], [data-gsap="home-hero"], [data-gsap="fade-up"], [data-gsap="stagger"] > *',
        ).forEach(markReady)
      }
      return
    }

    const { gsap, ScrollTrigger } = await useGsap()
    if (seq !== runSeq || !gsap) {
      return
    }

    ctx?.revert()

    ctx = gsap.context(() => {
      const root = rootRef.value

      root.querySelectorAll('[data-gsap="page-head"]').forEach((section) => {
        if (section.hasAttribute('data-gsap-ready')) {
          return
        }

        const items = section.querySelectorAll('[data-gsap="page-head-item"]')
        fadeInTargets(gsap, items, {
          delay: 0.2,
          onAllComplete: () => markReady(section),
        })
      })

      const homeHero = root.querySelector('[data-gsap="home-hero"]')
      if (homeHero && !homeHero.hasAttribute('data-gsap-ready')) {
        const bg = homeHero.querySelector('[data-gsap="hero-bg"] img')
        if (bg) {
          gsap.fromTo(bg, { scale: 1.14 }, { scale: 1, duration: 2.4, ease: 'power2.out' })
        }

        const heroItems = homeHero.querySelectorAll('[data-gsap="hero-item"]')
        fadeInTargets(gsap, heroItems, {
          delay: 0.35,
          duration: 0.9,
          stagger: 0.13,
          y: 52,
          onAllComplete: () => markReady(homeHero),
        })
      }

      root.querySelectorAll('[data-gsap="fade-up"]').forEach((el) => {
        if (el.hasAttribute('data-gsap-ready')) {
          return
        }

        el.removeAttribute('data-gsap-ready')
        gsap.set(el, { opacity: 0, y: 44 })
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          clearProps: 'transform',
          onComplete: () => markReady(el),
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true,
          },
        })
      })

      root.querySelectorAll('[data-gsap="stagger"]').forEach((container) => {
        const children = [...container.children]
        if (!children.length) {
          return
        }

        const pending = children.filter((child) => !child.hasAttribute('data-gsap-ready'))
        if (!pending.length) {
          markReady(container)
          return
        }

        const alreadyVisible = container.getBoundingClientRect().top < window.innerHeight * 0.88

        if (alreadyVisible) {
          revealStaggerChildren(gsap, container, pending, { startDelay: STAGGER.inViewDelay })
        } else {
          revealStaggerChildren(gsap, container, pending, {
            startDelay: STAGGER.scrollDelay,
            scrollTrigger: {
              trigger: container,
              start: 'top 88%',
              toggleActions: 'play none none none',
              once: true,
            },
          })
        }
      })

      root.querySelectorAll('[data-gsap="counter"]').forEach((el) => {
        const target = Number(el.dataset.count ?? 0)
        const suffix = el.dataset.suffix ?? ''
        const prefix = el.dataset.prefix ?? ''
        const counter = { value: 0 }

        gsap.to(counter, {
          value: target,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(counter.value)}${suffix}`
          },
        })
      })

      root.querySelectorAll('[data-gsap="parallax"]').forEach((el) => {
        gsap.to(el, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        })
      })
    }, rootRef.value)

    ScrollTrigger.refresh()
  }

  function scheduleInit(reset = false) {
    if (reset && rootRef.value) {
      resetGsapState(rootRef.value)
    }

    if (initTimer) {
      clearTimeout(initTimer)
    }

    initTimer = setTimeout(async () => {
      initTimer = null
      await nextTick()
      await run()
    }, 80)
  }

  watch(() => route.fullPath, () => scheduleInit(true))
  watch(refreshTrigger, () => scheduleInit(false))

  onMounted(() => scheduleInit(false))

  onUnmounted(() => {
    runSeq++
    if (initTimer) {
      clearTimeout(initTimer)
      initTimer = null
    }
    ctx?.revert()
    ctx = null
    resetBodyScroll()
  })
}

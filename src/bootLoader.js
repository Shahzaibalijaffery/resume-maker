const bootStartedAt = performance.now()
const MIN_APP_BOOT_MS = 900
let bootCompleted = false

export const isBuilderRoute = window.location.pathname.startsWith('/app')

const revealApp = () => {
  document.documentElement.classList.add('app-ready')

  if (isBuilderRoute) {
    const loader = document.getElementById('app-loader')
    if (!loader) {
      document.documentElement.classList.remove('js-pending')
      return
    }

    loader.classList.add('is-hiding')
    loader.setAttribute('aria-busy', 'false')

    let cleaned = false
    const cleanup = () => {
      if (cleaned) return
      cleaned = true
      loader.remove()
      document.documentElement.classList.remove('js-pending')
    }

    loader.addEventListener('transitionend', cleanup, { once: true })
    window.setTimeout(cleanup, 600)
    return
  }

  const seoFallback = document.getElementById('seo-static-fallback')
  if (!seoFallback) return

  let cleaned = false
  const cleanup = () => {
    if (cleaned) return
    cleaned = true
    seoFallback.remove()
  }

  seoFallback.classList.add('is-hiding')
  seoFallback.addEventListener('transitionend', cleanup, { once: true })
  window.setTimeout(cleanup, 600)
}

export const completeAppBoot = async () => {
  if (bootCompleted) return
  bootCompleted = true

  if (isBuilderRoute) {
    const elapsed = performance.now() - bootStartedAt
    if (elapsed < MIN_APP_BOOT_MS) {
      await new Promise((resolve) => {
        window.setTimeout(resolve, MIN_APP_BOOT_MS - elapsed)
      })
    }
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(revealApp)
  })
}

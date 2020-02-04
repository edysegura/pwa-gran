'use strict'

if ('serviceWorker' in navigator) {
  navigator
    .serviceWorker
    .register('/sw.js')
    .then(() => console.log('Service Worker registered!'))
}

/**
 * It works only on mobile
 */
window.addEventListener('beforeinstallprompt', (event) => {
  console.log('before install prompt fired', event)
  event.preventDefault()
  return false
})
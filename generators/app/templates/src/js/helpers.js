// import { debounce } from 'throttle-debounce'
import { DELAYS } from './constants'

export const {
  isAndroid,
  isCordova,
  isEdge,
  isFirefox,
  isChrome,
  isChromeIOS,
  isChromiumBased,
  isIE,
  isIOS,
  isOpera,
  isSafari,
} = {
  isAndroid: /Android/.test(navigator.userAgent),
  isCordova: !!window.cordova,
  isEdge: /Edge/.test(navigator.userAgent),
  isFirefox: /Firefox/.test(navigator.userAgent),
  isChrome: /Google Inc/.test(navigator.vendor),
  isChromeIOS: /CriOS/.test(navigator.userAgent),
  isChromiumBased: !!window.chrome && !/Edge/.test(navigator.userAgent),
  isIE: /Trident/.test(navigator.userAgent),
  isIOS: /(iPhone|iPad|iPod)/.test(navigator.platform),
  isOpera: /OPR/.test(navigator.userAgent),
  isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
}

export const isWebkit = isChrome || isChromiumBased || isChromeIOS || isSafari || isAndroid || isIOS

export const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints

export const isModernBrowser =
  'scrollBehavior' in document.documentElement.style &&
  'Symbol' in window &&
  'Promise' in window &&
  'assign' in Object &&
  'values' in Object &&
  'from' in Array

export const appScript = document.getElementById('app-script')

export function preventScroll() {
  const getScrollbarWidth = (() => window.innerWidth - document.documentElement.clientWidth)()
  document.body.style.overflow = 'hidden'
  if (getScrollbarWidth > 0) document.body.style.marginRight = `${getScrollbarWidth}px`
}

export function allowScroll() {
  document.body.style.overflow = ''
  document.body.style.marginRight = ''
}

export function toggleScroll(condition) {
  condition ? preventScroll() : allowScroll()
}

export const initAppComponent = ({ app, component, method }) => {
  let iterations = 0
  const interval = setInterval(() => {
    iterations += 1
    if (app[component] && app[component][method]) {
      app[component][method].call(app[component])
      clearInterval(interval)
    } else if (iterations > 10) {
      clearInterval(interval)
      // eslint-disable-next-line
      console.warn(
        `Method app.${component}.${method} was not called in 'initAppComponent()' function.`
      )
    }
  }, DELAYS.min)
}

// export function setVhProperty() {
//   function setProperty() {
//     const vh = window.innerHeight * 0.01
//     document.documentElement.style.setProperty('--vh', `${vh}px`)
//   }

//   const setPropertyDebounced = debounce(66, setProperty)

//   setProperty()
//   window.addEventListener('resize', setPropertyDebounced)
// }

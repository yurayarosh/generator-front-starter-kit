// import { debounce } from 'throttle-debounce'
import { DELAYS } from './constants'

const { userAgent } = window.navigator

export const {
  isAndroid,
  isEdge,
  isFirefox,
  isChrome,
  isIE,
  isIOS,
  isOpera,
  isSafari,
  isWebkit,
  isModernBrowser,

  isTouch,
  pixelRatio,
} = {
  isAndroid: /Android/.test(userAgent),
  isIOS: /iPad|iPod|iPhone/.test(userAgent),
  isIE: /Trident/.test(userAgent),
  isEdge: /Edge/.test(userAgent),
  isFirefox: /Firefox/.test(userAgent),
  isChrome: /Google Inc/.test(navigator.vendor),
  isOpera: /OPR/.test(userAgent),
  isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
  isWebkit: /webkit/i.test(userAgent),
  isModernBrowser:
    'scrollBehavior' in document.documentElement.style &&
    'Symbol' in window &&
    'Promise' in window &&
    'assign' in Object &&
    'values' in Object &&
    'from' in Array,

  isTouch: 'ontouchstart' in window || navigator.maxTouchPoints,
  pixelRatio: window.devicePixelRatio || 1,
}

export const appScript = document.getElementById('app-script')

export const breakpoints = {
  xxxl: window.matchMedia('(min-width: 1921px)'),
  xxl: window.matchMedia('(min-width: 1500px)'),
  xl: window.matchMedia('(min-width: 1400px)'),
  lg: window.matchMedia('(min-width: 1200px)'),
  md: window.matchMedia('(min-width: 992px)'),
  sm: window.matchMedia('(min-width: 768px)'),
  xs: window.matchMedia('(min-width: 576px)'),
  xxs: window.matchMedia('(min-width: 480px)'),
  xxxs: window.matchMedia('(min-width: 375px)'),
}

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

const settingInterval = ({ app = {}, component = '', method = '', variable = '' } = {}) => {
  const ITERATIONS_LIMIT = 10
  let iterations = 0
  let errorMessage = ''
  if (method) {
    errorMessage = `Method app.${component}.${method} was not called in 'initAppComponent()' function.`
  }
  if (variable) {
    errorMessage = `Global variable window.${variable} was not setted.`
  }

  const interval = setInterval(() => {
    iterations += 1

    if (method && app[component] && app[component][method]) {
      app[component][method].call(app[component])
      clearInterval(interval)
    } else if (variable && {}.hasOwnProperty.call(app, component)) {
      window[variable] = app[component]
      clearInterval(interval)
    } else if (iterations > ITERATIONS_LIMIT) {
      clearInterval(interval)
      console.error(errorMessage)
    }
  }, DELAYS.min)
}

export const initAppComponent = ({ app = {}, component = '', method = '' } = {}) => {
  settingInterval({ app, component, method })
}

export const addGlobalVariable = ({ app = {}, component = '', name = '' } = {}) => {
  settingInterval({ app, component, variable: name })
}

// Test for the WOFF2 font format from https://github.com/filamentgroup/woff2-feature-test
export const supportsWoff2 = (() => {
  if (!('FontFace' in window)) {
    return false
  }

  const f = new FontFace(
    't',
    'url( "data:font/woff2;base64,d09GMgABAAAAAADwAAoAAAAAAiQAAACoAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmAALAogOAE2AiQDBgsGAAQgBSAHIBuDAciO1EZ3I/mL5/+5/rfPnTt9/9Qa8H4cUUZxaRbh36LiKJoVh61XGzw6ufkpoeZBW4KphwFYIJGHB4LAY4hby++gW+6N1EN94I49v86yCpUdYgqeZrOWN34CMQg2tAmthdli0eePIwAKNIIRS4AGZFzdX9lbBUAQlm//f262/61o8PlYO/D1/X4FrWFFgdCQD9DpGJSxmFyjOAGUU4P0qigcNb82GAAA" ) format( "woff2" )',
    {}
  )
  f.load().catch(() => {})

  return f.status === 'loading' || f.status === 'loaded'
})()

export const supportsWebp = (() => {
  const elem = document.createElement('canvas')

  if (elem.getContext && elem.getContext('2d')) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }
  return false
})()

// export function setVhProperty() {
//   function setProperty() {
//     const vh = window.innerHeight * 0.01
//     document.documentElement.style.setProperty('--vh', `${vh}px`)
//   }

//   const setPropertyDebounced = debounce(66, setProperty)

//   setProperty()
//   const event = isTouch ? 'orientationchange' : 'resize'
//   window.addEventListener(event, setPropertyDebounced)
// }

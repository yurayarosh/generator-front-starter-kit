import { appScript } from '../helpers'

const loadPolyfills = callback => () => {
  if (appScript) {
    const src = appScript.src.replace('app.js', 'polyfills.js')

    const js = document.createElement('script')
    js.src = src
    js.onload = () => {
      callback()
    }
    js.onerror = () => {
      console.error(`Failed to load script ${src}`)
    }
    document.head.appendChild(js)
  } else {
    console.error('No script element with id `app-script`')
  }
}

export default loadPolyfills

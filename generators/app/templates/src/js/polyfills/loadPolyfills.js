import { appScript } from '../helpers'

export default function loadPolyfills(callback) {
  if (appScript) {
    const src = appScript.src.replace('app.js', 'polyfills.js')

    const js = document.createElement('script')
    js.src = src
    js.onload = () => {
      callback()
    }
    js.onerror = () => {
      // eslint-disable-next-line
      console.error(`Failed to load script ${src}`)
    }
    document.head.appendChild(js)
  } else {
    // eslint-disable-next-line
    console.error('No script element with id `app-script`')
  }
}

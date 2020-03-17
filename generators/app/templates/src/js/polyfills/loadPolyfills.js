export default function loadPolyfills(callback) {
  const appScript = document.getElementById('app-script')

  if (appScript) {
    const baseSrc = appScript.src
      .split('/')
      .slice(0, -1)
      .join('/')

    const src = `${baseSrc}/polyfills.js`
    const js = document.createElement('script')
    js.src = src
    js.onload = () => {
      callback()
    }
    js.onerror = () => {
      console.error(`Failed to load script ${src}`)
    }
    document.head.appendChild(js)
  }
}

import { loadCSS } from 'fg-loadcss'
import lazyLoad from './lazyLoad'
import { IS_LOADED, HAS_ERROR } from '../../constants'
import { supportsWebp, supportsWoff2 } from '../../helpers'

const defaultConfig = {
  className: 'lazy',
  replaceByWebp: false,
  onLoad() {},
  onError() {},
}
export default class LazyLoader {
  constructor(selector = '', options = {}) {
    this.options = {
      ...defaultConfig,
      ...options,
      selector,
    }<% if (sprites.indexOf('inline-svg-lazy') !== -1) { %>
    
    this.loadedIcons = []<% } %>
  }

  isPicture({ parentNode }) {
    return parentNode && parentNode.tagName.toLowerCase() === 'picture'
  }

  getSources(el) {
    return [...el.querySelectorAll('source')]
  }

  setAttributes(el) {
    const {
      dataset: { src, poster, srcset, backgroundImage: bgImage, icon, replaceByWebp },
    } = el

    const shouldAddWebp = this.options.replaceByWebp && replaceByWebp !== 'false' && supportsWebp

    const getSourcePath = path => {
      if (!shouldAddWebp) return path

      const extensions = ['.jpg', '.jpeg', '.png']
      extensions.forEach(ext => {
        if (path.toLowerCase().includes(ext)) path = path.replace(ext, '.webp')
      })
      return path
    }

    if (src && !icon) el.src = getSourcePath(src)
    if (srcset) el.srcset = getSourcePath(srcset)
    if (poster) el.setAttribute('poster', getSourcePath(poster))
    if (bgImage) el.style.backgroundImage = `url('${getSourcePath(bgImage)}')`

    if (this.isPicture(el)) {
      const picture = el.parentNode
      const sources = this.getSources(picture)
      const img = picture.querySelector('img')
      const {
        dataset: { src: imgSrc, srcset: imgSrcset },
      } = img

      if (imgSrc) img.src = getSourcePath(imgSrc)
      if (imgSrcset) img.srcset = getSourcePath(imgSrcset)
      sources.forEach(source => {
        const {
          dataset: { srcset: sourceSrcset },
        } = source
        if (sourceSrcset) source.srcset = getSourcePath(sourceSrcset)
      })
    }
  }<% if (sprites.indexOf('inline-svg-lazy') !== -1) { %>
  
  async loadIcon(image, resolve) {
    const { src } = image.dataset
    const duplicate = this.loadedIcons.find(({ src: s }) => s === src)

    try {
      const res = duplicate ? null : await fetch(src)
      const data = duplicate ? duplicate.data : await res.text()

      // If icon was loaded already, or fetch is successful.
      if (duplicate || res.ok) {
        const parser = new DOMParser()
        const svg = parser.parseFromString(data, 'image/svg+xml').querySelector('svg')

        svg.onload = e => {
          svg.classList.add(`${this.options.className}--${IS_LOADED}`)
          this.options.onLoad?.(e)
        }

        if (image.id) svg.id = image.id
        if (image.className) svg.classList = image.classList
        svg.setAttribute('data-processed', true)

        image.parentNode?.replaceChild(svg, image)

        if (!duplicate) {
          this.loadedIcons.push({
            src,
            data,
          })
        }
      } else if (res && !res.ok) {
        image.classList.add(`${this.options.className}--${HAS_ERROR}`)
        image.setAttribute('data-processed', true)
        this.options.onError?.(image, res)
      }
    } catch (error) {
      console.error(`Error loading "${src}" icon.`, error)
    }

    // Clear from duplications.
    this.loadedIcons = this.loadedIcons.reduce((arr, item) => {
      const dupl = arr.find(({ src: s }) => s === item.src)
      return dupl ? arr : [...arr, item]
    }, [])

    resolve()
  }
  <% } %>
  handleLoad(el) {
    return new Promise(resolve => {
      const onLoad = e => {
        e.currentTarget.classList.add(`${this.options.className}--${IS_LOADED}`)
        this.options.onLoad?.(e)
        resolve()
      }

      const onError = e => {
        e.currentTarget.classList.add(`${this.options.className}--${HAS_ERROR}`)
        this.options.onError?.(e)
        resolve()
      }
      <% if (sprites.indexOf('inline-svg-lazy') !== -1) { %>
      if (el.dataset.icon) this.loadIcon(el, resolve)<% } %>
      if (el.tagName.toLowerCase() === 'video') el.onloadeddata = onLoad
      if (el.tagName.toLowerCase() === 'img' && !el.dataset.icon) el.onload = onLoad

      el.onerror = onError
    })
  }

  removeAttributes(el) {
    if (el.hasAttribute('data-src')) el.removeAttribute('data-src')
    if (el.hasAttribute('data-srcset')) el.removeAttribute('data-srcset')
    if (el.hasAttribute('data-poster')) el.removeAttribute('data-poster')
    if (el.hasAttribute('data-background-image')) el.removeAttribute('data-background-image')

    if (this.isPicture(el)) {
      this.getSources(el.parentNode).forEach(source => source.removeAttribute('data-srcset'))
    }
  }

  processElement = async el => {
    this.setAttributes(el)
    await this.handleLoad(el)
    this.removeAttributes(el)
  }

  loadFonts() {
    const PATH_TO_FONTS_CSS = '/css'
    const FILE_NAME = 'data-woff.css'

    if (!supportsWoff2) loadCSS(`${PATH_TO_FONTS_CSS}/${FILE_NAME}`)
  }

  update() {
    this.loader.update()
  }

  observe() {
    this.loader = lazyLoad({
      process: this.processElement,
      ...this.options,
    })
    this.loader.observe()
  }

  init() {
    this.loadFonts()
    this.observe()
  }
}

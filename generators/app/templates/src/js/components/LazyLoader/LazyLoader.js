import { loadCSS } from 'fg-loadcss'
import lazyLoad from './lazyLoad'
import classNames from '../../classNames'
import { IS_LOADED, HAS_ERROR } from '../../constants'
import { supportsWoff2 } from '../../helpers'

const defaultConfig = {
  className: 'lazy',
}
export default class LazyLoader {
  constructor(selector = `.${classNames.lazy}`, options = {}) {
    this.options = {
      ...defaultConfig,
      ...options,
      selector,
    }
  }

  isPicture({ parentNode }) {
    return parentNode && parentNode.tagName.toLowerCase() === 'picture'
  }

  getSources(el) {
    return [...el.querySelectorAll('source')]
  }

  setAttributes(el) {
    const {
      dataset: { src, poster, srcset, backgroundImage: bgImage },
    } = el

    if (src) el.src = src
    if (srcset) el.srcset = srcset
    if (poster) el.setAttribute('poster', poster)
    if (bgImage) el.style.backgroundImage = `url('${bgImage}')`

    if (this.isPicture(el)) {
      const picture = el.parentNode
      const sources = this.getSources(picture)
      const img = picture.querySelector('img')
      const {
        dataset: { src: imgSrc, srcset: imgSrcset },
      } = img

      if (imgSrc) img.src = imgSrc
      if (imgSrcset) img.srcset = imgSrcset
      sources.forEach(source => {
        const {
          dataset: { srcset: sourceSrcset },
        } = source
        if (sourceSrcset) source.srcset = sourceSrcset
      })
    }
  }

  handleLoad(el) {
    const onLoad = ({ currentTarget }) => {
      currentTarget.classList.add(`${this.options.className}--${IS_LOADED}`)
    }

    const onError = e => {
      e.currentTarget.classList.add(`${this.options.className}--${HAS_ERROR}`)
      if (this.options.onError) this.options.onError(e)
    }

    if (el.tagName.toLowerCase() === 'video') {
      el.onloadeddata = onLoad.bind(this)
    }
    if (el.tagName.toLowerCase() === 'img') {
      el.onload = onLoad.bind(this)
    }

    el.onerror = onError.bind(this)
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

  processElement(el) {
    this.setAttributes(el)
    this.handleLoad(el)
    this.removeAttributes(el)
  }

  setObserving() {
    this.loader = lazyLoad({
      process: this.processElement.bind(this),
      ...this.options,
    })
    this.loader.observe()
  }

  loadFonts() {
    const PATH_TO_FONTS_CSS = '/css'

    if (supportsWoff2) {
      loadCSS(`${PATH_TO_FONTS_CSS}/data-woff2.css`)
    } else {
      loadCSS(`${PATH_TO_FONTS_CSS}/data-woff.css`)
    }
  }

  update() {
    this.loader.update()
  }

  observe() {
    this.setObserving()
  }

  init() {
    this.loadFonts()
    this.observe()
  }
}

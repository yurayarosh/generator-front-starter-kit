import lozad from 'lozad'
import classNames from '../classNames'
import { IS_LOADED } from '../constants'

const { lazy: JS_LAZY } = classNames

export default function setLazy() {
  const imgs = [...document.querySelectorAll(`.${JS_LAZY}`)]

  if (!imgs.length) return
  imgs.forEach(img => {
    img.classList.add('lazy')
  })

  const observer = lozad(`.${JS_LAZY}`, {
    loaded: el => {
      if (el.hasAttribute('data-src')) {
        el.removeAttribute('data-src')
      } else if (el.hasAttribute('data-background-image')) {
        el.removeAttribute('data-background-image')
      }
      el.classList.add(`lazy--${IS_LOADED}`)
    },
  })
  observer.observe()
}

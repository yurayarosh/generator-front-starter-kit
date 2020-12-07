import { IS_ACTIVE, IS_OPEN, STATE } from '../../constants'
import classes from '../../classNames'
import { toggleScroll, allowScroll, isTouch } from '../../helpers'
import preventTouchScroll from '../../lib/preventTouchScroll'

const classNames = classes.menu

export default class Menu {
  constructor(app, options = {}) {
    this.app = app
    this.options = options
    this.names = []
    this.menus = []
    this.btns = []
  }

  init() {
    this.btns = [...document.querySelectorAll(`.${classNames.burger}`)]
    this.menus = [...document.querySelectorAll(`.${classNames.menu}`)]

    this.setTouchScrollPreventing('init')
  }

  destroy() {
    this.onClick = null
    this.onKeyUp = null

    this.setTouchScrollPreventing('destroy')
  }

  setTouchScrollPreventing(state) {
    if (isTouch && this.menus.length > 0) {
      this.menus.forEach(menu => {
        const pts = preventTouchScroll(menu)
        if (state === 'init') pts.init()
        if (state === 'destroy') pts.destroy()
      })
    }
  }

  onClick = e => {
    this.toggle(e)
  }

  onKeyUp = ({ code }) => {
    if (code === 'Escape') this.close()
  }

  toggle(e) {
    this.btn = e.target.closest(`.${classNames.burger}`)
    if (!this.btn) return

    e.preventDefault()
    e.stopPropagation()

    this.name = this.btn.getAttribute('data-menu-target') || 'default'
    this.menu =
      this.name && this.name !== 'default'
        ? document.querySelector(`.${classNames.menu}[data-menu="${this.name}"]`)
        : document.querySelector(`.${classNames.menu}`)
    if (!this.menu) return

    if (!this.menus.length || !this.btns.length || this.btns.length !== this.menus.length) return

    if (this.btn.getAttribute(STATE) === IS_ACTIVE) {
      this.btn.removeAttribute(STATE)
      this.menu.removeAttribute(STATE)
    } else {
      this.btn.setAttribute(STATE, IS_ACTIVE)
      this.menu.setAttribute(STATE, IS_OPEN)
    }

    if (this.onToggle) this.onToggle()

    if (this.menu.getAttribute(STATE) !== IS_OPEN && this.onClose) {
      this.onClose()
    }
  }

  close() {
    if (!this.btns.length || !this.menus.length) return

    this.btns.forEach(btn => {
      btn.removeAttribute(STATE)
    })

    this.menus.forEach(menu => {
      menu.removeAttribute(STATE)
    })

    if (this.onClose) this.onClose()
  }

  onToggle() {
    const { hasMenuOpen } = { ...this.app.state }
    this.app.updateState({ hasMenuOpen: !hasMenuOpen })

    toggleScroll(this.app.state.hasMenuOpen)

    if (!hasMenuOpen) this.app.dom.root.classList.add('has-menu-open')
    else this.app.dom.root.classList.remove('has-menu-open')
  }

  onClose() {
    this.app.updateState({ hasMenuOpen: false })
    allowScroll()
    this.app.dom.root.classList.remove('has-menu-open')
  }
}

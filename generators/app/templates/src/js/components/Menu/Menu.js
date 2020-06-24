import { IS_ACTIVE, IS_OPEN } from '../../constants'
import BEMblock from '../../lib/BEMBlock'
import classes from '../../classNames'
import { toggleScroll, allowScroll } from '../../helpers'

const classNames = classes.menu

export default class Menu {
  constructor(app, options = { classNames: {} }) {
    this.app = app
    this.options = options
    this.classes = {}
    this.names = []
    this.menus = []
    this.btns = []
  }

  init() {
    this._addListeners()
  }

  destroy() {
    this._removeListeners()
  }

  get BEMbtn() {
    return BEMblock(this.btn, this.classes[this.name].btn)
  }

  get BEMtarget() {
    return BEMblock(this.menu, this.classes[this.name].menu)
  }

  _addListeners() {
    this.onClick = this.handleClick.bind(this)
    this.onKeyDown = this.handleKeyDown.bind(this)

    document.addEventListener('click', this.onClick)
    document.addEventListener('keydown', this.onKeyDown)
  }

  _removeListeners() {
    document.removeEventListener('click', this.onClick)
    document.removeEventListener('keydown', this.onKeyDown)
  }

  handleClick(e) {
    this.toggle(e)
  }

  handleKeyDown({ code }) {
    if (code === 'Escape') this.close()
  }

  toggle(e) {
    this.btn = e.target.closest(`.${classNames.burger}`)
    if (!this.btn) return

    e.preventDefault()
    e.stopPropagation()

    this.btns = [...document.querySelectorAll(`.${classNames.burger}`)]
    this.menus = [...document.querySelectorAll(`.${classNames.menu}`)]

    this.name = this.btn.getAttribute('data-menu-target') || 'default'
    this.menu =
      this.name && this.name !== 'default'
        ? document.querySelector(`.${classNames.menu}[data-menu="${this.name}"]`)
        : document.querySelector(`.${classNames.menu}`)
    if (!this.menu) return

    if (!this.menus.length || !this.btns.length || this.btns.length !== this.menus.length) return

    this.btns.forEach((btn, i) => {
      const name = btn.getAttribute('data-menu-target') || 'default'
      const btnClass = btn.getAttribute('data-block') || this.options.classNames.btn || ''
      const menuClass =
        this.menus[i].getAttribute('data-block') || this.options.classNames.menu || ''
      this.classes = {
        ...this.classes,
        [name]: {
          btn: btnClass,
          menu: menuClass,
        },
      }
    })

    if (!this.classes) return

    this.BEMbtn.toggleMod(IS_ACTIVE)
    this.BEMtarget.toggleMod(IS_OPEN)

    if (this.onToggle) this.onToggle()

    if (!this.BEMtarget.containsMod(IS_OPEN) && this.onClose) {
      this.onClose()
    }
  }

  close() {
    if (!this.btns.length || !this.menus.length || !this.classes) return

    this.names = Object.keys(this.classes)

    this.btns.forEach(btn => {
      this.names.forEach(name => {
        if (btn.getAttribute('data-menu-target') === name || name === 'default') {
          BEMblock(btn, this.classes[name].btn).removeMod(IS_ACTIVE)
        }
      })
    })

    this.menus.forEach(menu => {
      this.names.forEach(name => {
        if (menu.getAttribute('data-menu') === name || name === 'default') {
          BEMblock(menu, this.classes[name].menu).removeMod(IS_OPEN)
        }
      })
    })

    if (this.onClose) this.onClose()
  }

  onToggle() {
    const { hasMenuOpen } = { ...this.app.state }
    this.app.updateState({ hasMenuOpen: !hasMenuOpen })

    toggleScroll(this.app.state.hasMenuOpen)
  }

  onClose() {
    this.app.updateState({ hasMenuOpen: false })
    allowScroll()
  }
}

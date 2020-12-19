import './public-path'
import { isModernBrowser } from './helpers'

import loadPolyfills from './polyfills/loadPolyfills'
import setHTMLClassNames from './methods/setHTMLClassNames'

import setLazy from './components/LazyLoader/setLazy'
import Menu from './components/Menu/Menu'

class App {
  constructor() {
    this.dom = {
      root: document.documentElement,
      body: document.body,
    }
    this.state = {
      hasMenuOpen: false,
    }

    this.menu = new Menu(this)
  }

  updateState(state) {
    this.state = {
      ...this.state,
      ...state,
    }
  }

  initMethods() {
    setHTMLClassNames(this)
    setLazy(this)
  }

  onClickHandler = e => {
    this.menu.onClick?.(e)
  }

  onKeyupHandler = e => {
    this.menu.onKeyUp?.(e)
  }

  addListeners() {
    document.addEventListener('click', this.onClickHandler)
    document.addEventListener('keyup', this.onKeyupHandler)
  }

  init() {
    this.initMethods()
    this.addListeners()

    this.menu.init()
  }
}

const init = () => {
  const app = new App()
  app.init()
}

if (isModernBrowser) {
  document.addEventListener('DOMContentLoaded', init)
} else {
  document.addEventListener('DOMContentLoaded', loadPolyfills.bind(null, init))
}

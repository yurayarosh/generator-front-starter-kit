// import regeneratorRuntime from 'regenerator-runtime'

import loadPolyfills from './polyfills/loadPolyfills'
import classNames from './classNames'
import setHTMLClassNames from './methods/setHTMLClassNames'
import setLazy from './methods/setLazy'

import Menu from './components/Menu/Menu'

import { NO_SCROLL } from './constants'
import { isModernBrowser } from './helpers'

class App {
  constructor() {
    this.methods = {}
    this.classNames = classNames
    this.dom = {
      body: document.body,
    }
    this.state = {
      hasMenuOpen: false,
    }

    this.menu = new Menu(this, {
      classNames: {
        btn: 'burger',
        menu: 'header__nav',
      },
    })
  }

  updateState(state) {
    this.state = {
      ...this.state,
      ...state,
    }
  }

  initMethods() {
    this.methods = {
      setHTMLClassNames,
      setLazy,
    }

    Object.values(this.methods).forEach(fn => fn(this))
  }

  init() {
    this.initMethods()

    this.menu.init()
  }

  preventScroll() {
    this.dom.body.classList.add(NO_SCROLL)
  }

  allowScroll() {
    this.dom.body.classList.remove(NO_SCROLL)
  }

  toggleScroll(condition) {
    // eslint-disable-next-line
    condition ? this.preventScroll() : this.allowScroll()
  }
}

const init = () => {
  const app = new App()
  app.init()
  window.app = app
}

if (isModernBrowser) {
  document.addEventListener('DOMContentLoaded', init)
} else {
  document.addEventListener('DOMContentLoaded', loadPolyfills.bind(null, init))
}

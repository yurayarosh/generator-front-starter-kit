import './public-path'
import { isModernBrowser } from './helpers'

import loadPolyfills from './polyfills/loadPolyfills'
import setHTMLClassNames from './methods/setHTMLClassNames'

import setLazy from './components/LazyLoader/setLazy'
import Menu from './components/Menu/Menu'
import Offline from './components/Offline/Offline'

class App {
  constructor() {
    this.dom = {
      root: document.documentElement,
      body: document.body,
    }
    this.LANGUAGE = this.dom.root.getAttribute('lang')?.split('-')[0].toLowerCase() || 'en'
    this.state = {
      hasMenuOpen: false,
    }

    this.menu = new Menu(this)
    this.offline = new Offline(this)
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

  onOfflineHandler = () => {
    this.offline.onOffline()
  }

  onOnlineHandler = () => {
    this.offline.onOnline()
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
    window.addEventListener('offline', this.onOfflineHandler)
    window.addEventListener('online', this.onOnlineHandler)
  }

  init() {
    this.initMethods()
    this.addListeners()

    this.menu.init()
    this.offline.init()
  }
}

const init = () => {
  const app = new App()
  app.init()
}

if (isModernBrowser) {
  document.addEventListener('DOMContentLoaded', init)
} else {
  document.addEventListener('DOMContentLoaded', loadPolyfills(init))
}

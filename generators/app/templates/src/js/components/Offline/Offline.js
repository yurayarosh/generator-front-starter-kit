import { OFFLINE } from '../../constants'
import InfoPanel from './InfoPanel'
import messages from './messages'

export default class Offline {
  constructor({ dom, LANGUAGE }) {
    this.dom = dom
    this.LANGUAGE = LANGUAGE
  }

  renderInfoPanel() {
    const tpl = document.createElement('template')
    tpl.innerHTML = InfoPanel({ text: messages[this.LANGUAGE] })
    this.infoPanel = tpl.content.cloneNode(true).firstElementChild
  }

  insertInfoPanel() {
    if (!this.infoPanel) return
    const { body: BODY, root: DOC } = this.dom

    BODY.insertBefore(this.infoPanel, BODY.firstElementChild)
    DOC.classList.add(`is-${OFFLINE.toLowerCase()}`)
  }

  removeInfoPanel() {
    const { body: BODY, root: DOC } = this.dom

    BODY.removeChild(this.infoPanel)
    DOC.classList.remove(`is-${OFFLINE.toLowerCase()}`)
  }

  onOffline = () => {
    this.insertInfoPanel()
  }

  onOnline = () => {
    this.removeInfoPanel()
  }

  init() {
    this.renderInfoPanel()
    if (!navigator.onLine) this.insertInfoPanel()
  }
}

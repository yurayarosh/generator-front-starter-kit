import { isTouch } from '../helpers'
import { NO_TOUCH, IS_READY } from '../constants'

const setHTMLClassNames = ({ dom: { root: DOC } }) => {
  if (!isTouch) {
    DOC.classList.add(NO_TOUCH)
  }
  DOC.classList.add(IS_READY)
}

export default setHTMLClassNames

const preventTouchScroll = el => {
  let _clientY = null // remember Y position on touch start

  const isOverlayTotallyScrolled = () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
    return el.scrollHeight - el.scrollTop <= el.clientHeight
  }

  const disableRubberBand = event => {
    const clientY = event.targetTouches[0].clientY - _clientY

    if (event.cancelable && el.scrollTop === 0 && clientY > 0) {
      // element is at the top of its scroll
      event.preventDefault()
    }

    if (event.cancelable && isOverlayTotallyScrolled() && clientY < 0) {
      // element is at the top of its scroll
      event.preventDefault()
    }
  }

  const onTouchStart = event => {
    if (event.targetTouches.length === 1) {
      // detect single touch
      _clientY = event.targetTouches[0].clientY
    }
  }

  const onTouchMove = event => {
    if (event.targetTouches.length === 1) {
      // detect single touch
      disableRubberBand(event)
    }
  }

  return {
    init() {
      el.addEventListener('touchstart', onTouchStart)
      el.addEventListener('touchmove', onTouchMove)
    },
    destroy() {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
    },
  }
}

export default preventTouchScroll

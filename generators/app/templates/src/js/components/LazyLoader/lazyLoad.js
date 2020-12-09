const defaultConfig = {
  observer: {
    rootMargin: '0px',
    threshold: 0,
  },
  process() {},
}

function markAsProcessed(element) {
  element.setAttribute('data-processed', true)
}

const hasBeenProcessed = element => element.getAttribute('data-processed') === 'true'

const onIntersection = process => (entries, observer) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (isIntersecting) {
      observer.unobserve(target)

      if (!hasBeenProcessed(target)) {
        process(target)
        markAsProcessed(target)
      }
    }
  })
}

const getElements = selector => [...document.querySelectorAll(selector)]

const markImages = (selector, className) => {
  const elements = getElements(selector).filter(el => !el.classList.contains(className))
  if (elements.length > 0) elements.forEach(img => img.classList.add(className))
}

export default options => {
  const {
    observer: { root, rootMargin, threshold },
    className,
    selector,
    process,
  } = { ...defaultConfig, ...options }

  markImages(selector, className)

  const observer = new IntersectionObserver(onIntersection(process), {
    root,
    rootMargin,
    threshold,
  })

  const observe = () => {
    const elements = getElements(selector).filter(el => !hasBeenProcessed(el))
    if (elements.length > 0) elements.forEach(el => observer.observe(el))
  }

  const update = () => {
    markImages(selector, className)
    observe()
  }

  return {
    observe,
    update,
    observer,
    elements: getElements(selector),
  }
}

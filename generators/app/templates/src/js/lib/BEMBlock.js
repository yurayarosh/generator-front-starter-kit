const BEMBlock = (node, block = '') => {
  if (!block) {
    let classes = node.className.split(' ')

    if (classes.length > 0) {
      classes = classes.filter(cl => cl !== '')

      if (classes.length === 1) {
        ;[block] = classes
      } else if (classes.length > 0) {
        classes = classes.filter(name => !(name.indexOf('js-') !== -1 || name.indexOf('--') !== -1))

        classes.length !== 1 ? (block = '') : ([block] = classes)
      }
    }
  }

  const showError = () => {
    console.warn(
      'Could not identify block name of element.\n',
      node,
      '\nYou should provide it as argument in `BEMBlock()` method.'
    )
  }

  const getClassName = mod => `${block}--${mod}`

  const addMod = mod => {
    if (!block) showError()
    else node.classList.add(getClassName(mod))
  }
  const removeMod = mod => {
    if (!block) showError()
    else node.classList.remove(getClassName(mod))
  }
  const toggleMod = mod => {
    if (!block) showError()
    else node.classList.toggle(getClassName(mod))
  }
  const containsMod = mod => {
    if (!block) {
      showError()
      return false
    }
    return node.classList.contains(getClassName(mod))
  }

  return {
    block,
    node,
    addMod,
    toggleMod,
    removeMod,
    containsMod,
  }
}

export default BEMBlock

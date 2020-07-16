import classNames from '../../classNames'

export default app => {
  const element = document.querySelector(`.${classNames.lazy}`)
  if (!element) return

  import(/* webpackChunkName: "LazyLoader" */ './LazyLoader').then(({ default: LazyLoader }) => {
    app.lazyLoader = new LazyLoader()
    app.lazyLoader.observe()
  })
}

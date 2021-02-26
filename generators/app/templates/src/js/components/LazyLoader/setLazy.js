import classNames from '../../classNames'

export default async app => {
  const element = document.querySelector(`.${classNames.lazy}`)
  if (!element) return

  const { default: LazyLoader } = import(/* webpackChunkName: "LazyLoader" */ './LazyLoader')
  app.lazyLoader = new LazyLoader()
  app.lazyLoader.init()
}

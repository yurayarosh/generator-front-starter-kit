import classNames from '../../classNames'

export default async app => {
  const element = document.querySelector(`.${classNames.lazy}`)
  if (!element) return

  const { default: LazyLoader } = await import(/* webpackChunkName: "LazyLoader" */ './LazyLoader')
  app.lazyLoader = new LazyLoader(`.${classNames.lazy}`)
  app.lazyLoader.init()
}

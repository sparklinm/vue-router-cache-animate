import component, { instances } from './component/vue-router-cache-animate'

import { findRouter } from './util'

export default {
  install (vue, { router, options }) {
    let cacheAfter = null
    const NO_CACHE_FLAG = '_none_'
    let STATUS = 'forward'
    const SESSION_KEY = '_history_pageKeys_'
    let visitHistory = false
    const pageKeys = sessionStorage.getItem(SESSION_KEY) ? JSON.parse(sessionStorage.getItem(SESSION_KEY)) : []
    let pageIndex = -1


    // 判断指定路由是否被缓存
    const routerCached = function (router, include) {
      return include.some((name) => {
        return findRouter(name, router)
      })
    }

    const findInstance = function (router) {
      for (const ins of instances) {
        const root =
          router.matched.length > 1
            ? router.matched[0].instances.default
            : ins.$root.$children[0]

        const matched = root === ins.$parent

        if (matched) {
          return ins
        }
      }
    }


    const resolveCaches = function (caches, fromRouter, toRouter) {
      const include = []

      if (caches === '*') {
        return undefined
      }

      caches.forEach((cache) => {
        const canCache =
          cache.cachedOn === '*' ||

          // toRouter.matched 包含 cachedOn 中任意一个
          // 或者 fromRouter.matched 包含 cachedOn 中任意一个 且 toRouter.name 等于 被缓存路由组件名字
          cache.cachedOn.some((name) => {
            return findRouter(name, toRouter)
          }) ||
          (cache.cachedOn.some((name) => {
            return findRouter(name, fromRouter)
          }) &&
            cache.name === toRouter.name)

        if (canCache) {
          include.push(cache.name)
        }
      })

      if (!include.length) {
        return [NO_CACHE_FLAG]
      }

      return include
    }

    // 路由对应组件的name
    const findRouterCompoentName = function (router) {
      return router && router.matched[router.matched.length - 1].components.default.name
    }


    router.afterEach(() => {
      if (!visitHistory) {
        const key = history.state && history.state.key

        pageKeys.length = pageIndex + 1
        pageKeys.push(key)
        pageIndex = pageKeys.length - 1
      }

      if (cacheAfter) {
        cacheAfter.ins.include = cacheAfter.include
        cacheAfter = null
      }
    })


    window.addEventListener('popstate', (e) => {
      // 无法判断是前进还是后退
      const key = e.state && e.state.key
      const index = pageKeys.lastIndexOf(key)

      if (index > -1) {
        if (pageIndex === -1) {
          STATUS = 'refresh'
        } else {
          if (index > pageIndex) {
            STATUS = 'forward'
          } else if (index < pageIndex) {
            STATUS = 'back'
          } else {
            STATUS = 'refresh'
          }
        }
        pageIndex = index
        visitHistory = true
      }
    })


    window.addEventListener('unload', () => {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(pageKeys))
    })


    router.beforeEach(function (to, from, next) {
      const ins = findInstance(to)

      // 后退前进时，一定会得到index
      if (!visitHistory) {
        if (pageIndex === -1) {
          pageIndex = 0
          STATUS = 'refresh'
        } else {
          STATUS = 'forward'
        }
      }

      visitHistory = false

      if (!ins) {
        next()
        return
      }

      if (ins.noCacheOnBack && STATUS === 'back') {
        const name = findRouterCompoentName(from)

        if (name) {
          ins.exclude.push(name)
        }
        next()
        setTimeout(() => {
          ins.exclude = []
          STATUS = 'forward'
        })

        return
      }

      const include = resolveCaches(ins.caches, from, to)


      // 如果已经被缓存，要销毁必须在 next() 之后
      // 如果没有被缓存，要缓存必须在 next() 之前
      if (include && routerCached(from, include)) {
        ins.include = include
        next()
        return
      }

      cacheAfter = {
        ins,
        include
      }

      next()
    })

    vue.component('vue-router-cache-animate', component)
  }
}
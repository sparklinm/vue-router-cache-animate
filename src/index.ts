import component from './component/vue-router-cache-animate'
import {
  Cache,
  Transition,
  Caches,
  Instance,
  Route,
  RouteRecord,
  ChangedRouteRecords,
  RouteOptions,
  RouteNamesObject,
  RouteNamesTree,
  Pattern
} from './types'

function getRoutes (tree: Array<RouteOptions>): RouteNamesTree {
  function resolve (tree: Array<RouteOptions>): RouteNamesTree {
    const obj: RouteNamesTree = {}

    for (let i = 0; i < tree.length; i++) {
      if (tree[i].name) {
        obj[tree[i].name] = 1
      }
      if (tree[i].children && tree[i].children.length) {
        obj[tree[i].name] = resolve(tree[i].children)
      }
    }
    return obj
  }

  return resolve(tree)
}

// find vue-router-cache-animate component instance from router
function findInstance (from: RouteRecord): Instance {
  return from.instances.default.$parent
}

// find changed routers
function findChangedRouters (from: Route, to: Route): ChangedRouteRecords {
  let router: ChangedRouteRecords = {
    from: undefined,
    to: undefined
  }

  to.matched.some((match, index) => {
    if (match !== from.matched[index]) {
      router = {
        from: from.matched[index],
        to: match
      }
      return true
    }
  })

  return router
}

function isRegExp (reg: RegExp): boolean {
  return Object.prototype.toString.call(reg) === '[object RegExp]'
}

function matches (pattern: Pattern, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.includes(name)
  }
  if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  }
  if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function canMatch (include: Pattern, exclude: Pattern, value: string): boolean {
  if (!include && !exclude) {
    return true
  }

  return (
    (include && matches(include, value)) ||
    (exclude && !matches(exclude, value))
  )
}

// router component name
function findRouterCompoentName (router: Route): string {
  return (
    router && router.matched[router.matched.length - 1].components.default.name
  )
}

function getComponentName (instance: Instance): string {
  return instance && instance.$vnode.componentOptions.tag
}

function animate (ins: Instance, from: RouteRecord, to: RouteRecord): void {
  ins.transitions.some((transition: Transition) => {
    let animation = ''

    // no 'to' and no 'from
    if (!transition.to && !transition.from) {
      animation = 'forward'
    } else if (
      !transition.to &&
      (transition.from.include || transition.from.exclude)
    ) {
      // no 'to' but has 'from'
      if (
        canMatch(transition.from.include, transition.from.exclude, from.name) &&
        !canMatch(transition.from.include, transition.from.exclude, to.name)
      ) {
        animation = 'forward'
      } else if (
        !canMatch(
          transition.from.include,
          transition.from.exclude,
          from.name
        ) &&
        canMatch(transition.from.include, transition.from.exclude, to.name)
      ) {
        animation = 'back'
      }
    } else {
      if (
        canMatch(transition.from.include, transition.from.exclude, from.name) &&
        canMatch(transition.to.include, transition.to.exclude, to.name)
      ) {
        animation = 'forward'
      } else if (
        canMatch(transition.from.include, transition.from.exclude, to.name) &&
        canMatch(transition.to.include, transition.to.exclude, from.name)
      ) {
        animation = 'back'
      }
    }

    if (animation === 'forward' && transition.name) {
      ins.transitionName = transition.name
      ins.css = true
      return true
    }
    if (animation === 'back' && transition.reverseName) {
      ins.transitionName = transition.reverseName
      ins.css = true
      return true
    }
    ins.transitionName = ''
    ins.css = false
  })
}

export default {
  install (vue, { router }):void {
    const NO_CACHE_FLAG = '_none_'
    let STATUS = 'forward'
    const SESSION_KEY = '_history_pageKeys_'
    const routes = getRoutes(router.options.routes)
    let cacheAfterEnter: null | { ins: Instance; include: Array<string> } = null
    let visitHistory = false
    const pageKeys: Array<string> = sessionStorage.getItem(SESSION_KEY)
      ? JSON.parse(sessionStorage.getItem(SESSION_KEY))
      : []
    let pageIndex = -1

    // resolve caches prop
    function resolveCaches (caches: Caches, from: RouteRecord, to: RouteRecord) {
      let include: Array<string> = []
      let exclude: Array<string> = []

      caches.some((cache: Cache) => {
        // to.name matches 'cache.cachedOn' list
        let canCache = canMatch(
          cache.cachedOn.include,
          cache.cachedOn.exclude,
          to.name
        )

        if (canCache) {
          if (!cache.names.include && !cache.names.exclude) {
            include = ['all']
            return true
          }
          cache.names.include && (include = include.concat(cache.names.include))
          cache.names.exclude && (exclude = exclude.concat(cache.names.exclude))
          return false
        }

        // from.name matches 'cache.cachedOn' list and to.name matches 'cache.names' list
        canCache =
          canMatch(cache.cachedOn.include, cache.cachedOn.exclude, from.name) &&
          canMatch(cache.names.include, cache.names.exclude, to.name)

        if (canCache) {
          include.push(to.name)
        }
      })

      // find all names at the same level as the current router
      let router = from
      const keys = []
      const allRoutesObj = routes
      let curRoutesObj: RouteNamesObject = {}

      while (router) {
        keys.push(router.name)
        router = router.parent
      }
      for (let i = keys.length - 1; i > 0; i--) {
        if (typeof allRoutesObj[keys[i]] === 'object') {
          curRoutesObj = <RouteNamesObject>allRoutesObj[keys[i]]
        }
      }

      if (include && include[0] === 'all') {
        return Object.keys(curRoutesObj)
      }

      if (exclude.length) {
        const set = new Set(exclude)

        include.forEach((item) => {
          set.has(item) && set.delete(item)
        })
        for (const key in curRoutesObj) {
          if (set.has(key)) {
            delete curRoutesObj[key]
          }
        }
        return Object.keys(curRoutesObj)
      }

      if (!include.length) {
        return [NO_CACHE_FLAG]
      }

      return include
    }

    window.addEventListener('popstate', (e) => {
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
      const changedRouters = findChangedRouters(from, to)

      if (!visitHistory) {
        if (pageIndex === -1) {
          pageIndex = 0
          STATUS = 'refresh'
        } else {
          STATUS = 'forward'
        }
      }

      if (!changedRouters.from) {
        next()
        return
      }

      const ins = findInstance(changedRouters.from)

      if (!ins || getComponentName(ins) !== 'vue-router-cache-animate') {
        next()
        return
      }

      animate(ins, changedRouters.from, changedRouters.to)

      if (ins.noCacheOnBack && STATUS === 'back') {
        const name = findRouterCompoentName(from)

        if (name) {
          const include = ins.include.concat()
          const index = include.indexOf(name)

          if (index > -1) {
            include.splice(index, 1)
            cacheAfterEnter = {
              ins,
              include
            }
          }
        }
        visitHistory = false
        next()
        return
      }

      const include = resolveCaches(
        ins.caches,
        changedRouters.from,
        changedRouters.to
      )

      // if the current router will be cached, component must be cached and then destroyed
      // otherwise, component must be destroyed and then remove from keep-alive caches
      if (include.length && include.includes(changedRouters.from.name)) {
        ins.include = include
        next()
      } else {
        cacheAfterEnter = {
          ins,
          include
        }
        next()
      }
    })

    router.afterEach(() => {
      if (!visitHistory) {
        const key = history.state && history.state.key

        pageKeys.length = pageIndex + 1
        pageKeys.push(key)
        pageIndex = pageKeys.length - 1
      }

      if (cacheAfterEnter) {
        cacheAfterEnter.ins.include = cacheAfterEnter.include
        cacheAfterEnter = null
      }
    })

    vue.component('vue-router-cache-animate', component)
  }
}

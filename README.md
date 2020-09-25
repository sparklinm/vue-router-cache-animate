# vue-router-cache-animate

使用 vue 的 keep-alive 和 transition 组件对路由进行快捷的动画和缓存设置。

## demo

[demo](https://sparklinm.github.io/vue-router-cache-animate/examples/)

## 安装

```bash
npm i vue-router-cache-animate
yarn add vue-router-cache-animate
```

## 使用

main.js

```js
import Vue from 'vue'
import router from './router'
import vueRouterCacheAnimate from 'vue-router-cache-animate'
Vue.use(vueRouterCacheAnimate, { router })
```

App.vue

```vue
<template>
  <div id="app">
    <vue-router-cache-animate :caches="caches" :transitions="transitions">
      <router-view />
    </vue-router-cache-animate>
  </div>
</template>
<script>
export default {
  data() {
    return {
      caches: [
        {
          // 路由 name 和路由组件的 name（需保证相同）
          names: {
            include: ['A'],
            exclude: undefined
          },
          // 在哪些路由上被缓存
          cachedOn: {
            include: ['B', 'C'],
            exclude: undefined
          }
        }
      ],
      transitions: [
        {
          name: 'slide-left',
          reverseName: 'slide-right',
          from: {
            // 路由 name
            include: ['A'],
            exclude: undefined
          },
          to: {
            // 路由 name
            include: ['B', 'C'],
            exclude: undefined
          }
        }
      ]
    }
  }
}
</script>
```

## Props

### caches

缓存设置。

- 类型：`Array`
- 默认值：

  ```js
  {
    names: {},
    cachedOn: {}
  }
  ```

  默认缓存所有路由。

- 示例：

  ```js
  export default {
    data() {
      return {
        caches: [
          {
            // 路由 name 和路由组件的 name（需保证相同）
            names: {
              include: ['A']
              // exclude: []
            },
            // 在'B', 'C'路由上缓存路由组件 A
            cachedOn: {
              include: ['B', 'C']
              // exclude: []
            }
          },
          {
            names: {
              include: ['B']
            },
            // 在 'C' 路由上缓存路由组件 B
            cachedOn: {
              include: ['C']
            }
          }
        ]
      }
    }
  }
  ```

  除了使用 `include` 包含，还可以使用 `exclude` 排除。

### transitions

动画设置。

- 类型：`Array`
- 默认值：`[]`
- 示例：

  ```js
  export default {
    data() {
      return {
        transitions: [
          {
            // transition 组件的 name 选项
            // 从 'A' 路由到 'B', 'C' 路由使用 'slide-left' 动画
            name: 'slide-left',
            // 'B', 'C' 路由到 'A', 使用 'slide-right' 动画
            reverseName: 'slide-right',
            from: {
              // 路由 name
              include: ['A']
              // exclude: []
            },
            to: {
              // 路由 name
              include: ['B', 'C']
              // exclude: []
            }
          }
        ]
      }
    }
  }
  ```

### noCacheOnBack

后退时，是否缓存路由。

- 类型：`Boolean`
- 默认值：`false`

**后退的情况：**

1. 浏览器后退按钮。
2. `history.go(-n)` 或者 `history.back()`。
3. `router.go(-n)` 或者 `router.back()`。
4. 其他操作浏览器历史记录倒退的方法。

实现像手机端 app 一样前进刷新，后退缓存的效果。

路由切换时，会自动缓存前一个路由。当 **后退** 时，不缓存当前路由，这样当再次前往该路由时，会重新生成。

```js
export default {
  data() {
    return {
      noCacheOnBack: true
    }
  }
}
```

> 当使用 `history.pushState(state, title, path)` 和 `history.replaceState` 时，需要设置 `state` 为一个对象，并提供一个唯一 `key` 属性。例如：
>
> ```js
> history.pushState(
>   {
>     key: new Date() + Math.random()
>   },
>   title,
>   path
> )
> ```
>
> 这个 `key` 会被用来判断浏览器是前进还是后退。

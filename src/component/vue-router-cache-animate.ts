import {
  Caches, Transitions, VNode, PropType
} from '../types/'

export default {
  name: 'vue-router-cache-animate',
  props: {
    caches: {
      type: Array as PropType<Caches>,
      default: () => [
        {
          // router name and router component name
          names: {
            include: undefined,
            exclude: undefined
          },
          // be cached on which routes
          cachedOn: {
            include: undefined,
            exclude: undefined
          }
        }
      ]
    },
    // not cache on back
    noCacheOnBack: {
      type: Boolean,
      default: false
    },
    transitions: {
      type: Array as PropType<Transitions>,
      default: () => [
        {
          name: '',
          reverseName: '',
          from: undefined,
          to: undefined
        }
      ]
    }
  },
  data () {
    return {
      include: undefined,
      exclude: [],
      transitionName: '',
      css: false
    }
  },
  render (h): VNode {
    const vNode = this.$slots.default && this.$slots.default[0]

    return h(
      'transition',
      {
        props: {
          ...this.$attrs,
          name: this.transitionName,
          css: this.css
        },
        on: this.$listeners
      },
      [
        h(
          'keep-alive',
          {
            props: {
              include: this.include,
              exclude: this.exclude
            }
          },
          [vNode]
        )
      ]
    )
  }
}

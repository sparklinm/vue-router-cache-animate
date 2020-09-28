<template>
  <div id="app">
    <vue-router-cache-animate
      :transitions="transitions"
      :no-cache-on-back="true"
    >
      <router-view />
    </vue-router-cache-animate>
  </div>
</template>

<script>
export default {
  data () {
    return {
      transitions: [
        {
          name: 'slide-left',
          reverseName: 'slide-right',
          from: {
            include: ['Parent']
          }
        }
      ]
    }
  }
}
</script>

<style lang="stylus">
@import '../../src/css/animate.css';

html,body
  height 100%

#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  height: 100%;
  max-width 500px
  overflow hidden
  margin 60px auto 0
  position relative
</style>
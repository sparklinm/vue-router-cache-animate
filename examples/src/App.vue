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

<style>
.slide-right-enter {
  transform: translate(-100%, 0);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
}

.slide-right-leave-to {
  transform: translate(100%, 0);
}

.slide-left-enter {
  transform: translate(100%, 0);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
}

.slide-left-leave-to {
  transform: translate(-100%, 0);
}
</style>

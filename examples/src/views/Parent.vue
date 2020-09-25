<template>
  <div>
    <div id="nav">
      <router-link to="/">
        Tab A
      </router-link>
      |
      <router-link to="/tab-b">
        Tab B
      </router-link>
    </div>
    <vue-router-cache-animate>
      <router-view />
    </vue-router-cache-animate>
  </div>
</template>

<script>
export default {
  name: 'Parent',
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang='stylus'>
#nav
  margin-bottom 20px

</style>

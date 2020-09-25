<template>
  <div class="detail">
    这是一个详情页{{ id }}
    <br>
    随机数：{{ Math.floor(Math.random()*10000) }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: 0
    }
  },
  created () {
    this.id = this.$route.params.id
  },
  methods: {}
}
</script>

<style lang='stylus'>
.detail
  padding 250px 0
  background pink
  text-align center

</style>

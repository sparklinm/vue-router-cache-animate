<template>
  <div class="list">
    <div class="title">
      随机数： {{ Math.floor(Math.random()*1000) }}
    </div>
    <div
      v-for="item in data"
      :key="item"
      class="list-item"
      @click="toDetail(item)"
    >
      <div>
        列表项: {{ item }}
      </div>

      <div>
        点击进入详情页
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: []
    }
  },
  created () {
    const data = []

    for (let i = 0; i < 10; i++) {
      data[i] = i
    }

    this.data = data
  },
  methods: {
    toDetail (index) {
      this.$router.push(`/detail/${index}`)
    }
  }

}
</script>

<style scoped lang="stylus">
.list
  .title
    font-weight 600
    margin-bottom 10px
  .list-item
    padding 10px 0
    margin 15px 0
    background #33CCFF
    cursor pointer
    font-size 14px
</style>

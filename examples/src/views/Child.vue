<template>
  <div class="child">
    <button
      href=""
      class="btn-return"
      @click="back"
    >
      return
    </button>
    <Detail />
  </div>
</template>

<script>
// @ is an alias to /src
import Detail from '@/components/Detail.vue'

export default {
  name: 'Child',
  components: {
    Detail
  },
  methods: {
    back () {
      history.back()
    }
  }
}
</script>

<style lang="stylus">
.child
  text-align left
  .btn-return
    display inline-block
    margin-bottom 10px
    font-size 16px
</style>

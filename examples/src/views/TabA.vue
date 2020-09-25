<template>
  <div class="tab-a">
    <List />
  </div>
</template>

<script>
// @ is an alias to /src
import List from '@/components/List.vue'

export default {
  name: 'TabA',
  components: {
    List
  }
}
</script>

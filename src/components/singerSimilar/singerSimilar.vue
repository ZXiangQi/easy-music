<template>
  <div class="singer-similar">
    <singer-list :list="similar" @select="selectSinger"></singer-list>
  </div>
</template>

<script>
import SingerList from 'components/singerList/singerList'
export default {
  name: 'SingerSimilar',
  props: {
    similar: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    selectSinger(singer) {
      this.$emit('select', singer)
    }
  },
  components: {
    SingerList
  }
}
</script>

<style lang='stylus' scoped>
.singer-similar
  width: 1100px
  margin: 0 auto
</style>

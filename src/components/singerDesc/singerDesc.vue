<template>
  <div class="singer-desc">
    <div class="desc-content" v-for="(item, index) in desc" :key="index">
      <h6 class="desc-title">{{item.ti}}</h6>
      <p class="desc-text">{{item.txt}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingerDesc',
  props: {
    desc: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'

.singer-desc
  .desc-content
    margin-bottom: 48px
    .desc-title
      margin-bottom: 16px
      font-size: $font-size-m
      font-weight: 700
      color: $text-color-ll
    .desc-text
      line-height: 30px
      text-indent: 2em
      font-size: $font-size-m
      color: #878787
</style>

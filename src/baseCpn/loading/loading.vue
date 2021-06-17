<template>
  <div class="loading">
    <img src="./loading.gif">
    <div class="desc">{{title}}</div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    title: {
      type: String,
      default: '正在加载...'
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'

.loading
  position: fixed
  top: 50%
  left: 50%
  width: 100px
  height: 100px
  margin-top: -50px
  margin-left: -50px
  img
    display: block
    width: 30px
    height: 30px
    margin: 0 auto
  .desc
    margin-top: 20px
    text-align: center
    font-size: $font-size-l
    color: $text-color-l
</style>

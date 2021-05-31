<template>
  <ul class="singer-list">
    <li class="singer-item" v-for="item in list" :key="item.id" @click="selectSinger(item)">
      <img class="item-img" v-lazy="item.picUrl">
      <p class="item-name">{{item.name}}</p>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SingerList',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    selectSinger(singer) {
      this.$emit('select', singer)
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.singer-list
  margin-right: -18px
  clearfix()
  .singer-item
    width: 168px
    float: left
    margin: 18px 0 0 18px
    .item-img
      width: 168px
      height: 168px
      border-radius: 8px
      cursor: pointer
    .item-name
      padding-top: 12px
      font-size: $font-size-m
      no-wrap()
      color: $text-color-ll
      cursor: pointer
      &:hover
        color: #fff
</style>

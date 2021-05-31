<template>
  <ul class="search-detail-list">
    <li class="list-item" v-for="(item, index) in list" :key="item.id" @click="selectItem(index)">
      <img class="list-img" v-lazy="item.picUrl">
      <span class="list-name">{{item.name}}</span>
      <span v-if="item.trackCount" class="list-count">{{item.trackCount}}首</span>
      <span v-if="item.creator" class="list-creator"><span class="desc">by</span>{{item.creator}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SearchDetailList',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    selectItem(index) {
      this.$emit('select', index)
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.search-detail-list
  .list-item
    width: 100%
    height: 80px
    line-height: 80px
    font-size: $font-size-m
    cursor: pointer
    &:nth-child(even)
      background: #2E2E2E
    &:hover
      background: #373737
    .list-img
      width: 60px
      height: 60px
      line-height: 60px
      margin-top: 10px
      vertical-align: top
      border-radius: 8px
    .list-name
      display: inline-block
      width: 40%
      min-width: 250px
      margin-left: 14px
      color: $text-color-ll
      no-wrap()
    .list-count
      display: inline-block
      width: 18%
      min-width: 144px
      margin-right: 14px
      color: #939393
      no-wrap()
    .list-creator
      display: inline-block
      width: 18%
      min-width: 144px
      margin-right: 14px
      color: #939393
      no-wrap()
      &:hover
        color: $text-color-ll
      .desc
        margin-right: 4px
        font-size: $font-size-m-s
        color: #686868
</style>

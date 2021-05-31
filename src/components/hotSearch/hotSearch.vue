<template>
  <div class="hot-search">
    <h5 class="hot-title">热搜榜</h5>
    <ul class="hot-list">
      <li
        class="hot-keyword"
        v-for="(item, index) in hotList"
        :key="index"
        @click="selectKeyword(index)"
      >
        <div class="hot-index" :class="{'red': index <= 2}">{{index + 1}}</div>
        <div class="hot-content">
          <div class="hot-info">
            <span class="hot-word">{{item.searchWord}}</span>
            <span class="hot-score">{{item.score}}</span>
          </div>
          <p class="hot-desc">{{item.content}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HotSearch',
  props: {
    hotList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    selectKeyword(index) {
      this.$emit('select', index)
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.hot-search
  width: 352px
  .hot-title
    height: 46px
    padding: 0 20px
    line-height: 46px
    font-size: $font-size-m
    color: #8D8D8D
  .hot-list
    .hot-keyword
      height: 54px
      width: 100%
      padding-left: 54px
      cursor: pointer
      clearfix()
      &:hover
        background: #333333
      .hot-index
        position: relative
        width: 54px
        height: 54px
        line-height: 54px
        float: left
        left: -54px
        margin-right: -54px
        font-size: $font-size-m
        color: #5B5B5B
        text-align: center
        &.red
          color: #FF3A3A
      .hot-content
        width: 100%
        height: 54px
        float: left
        .hot-info
          margin-top: 8px
          .hot-word
            margin-right: 10px
            font-size: $font-size-m-s
            color: #D3D3D3
          .hot-score
            font-size: $font-size-s
            color: #5B5B5B
        .hot-desc
          width: 100%
          margin-top: 8px
          font-size: $font-size-s
          color: #6E6E6E
          no-wrap()
</style>

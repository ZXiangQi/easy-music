<template>
  <ul class="song-sheet-list">
    <li class="sheet-item" v-for="(item, index) in sheetData" :key="index+'_'+item.name" @click="selectSheet(item)">
      <div class="img-wrapper">
        <img v-lazy="item.picUrl">
        <span class="play-count"><i class="iconfont icon-play-2"></i>{{item.playCount | formatCount}}</span>
        <span class="sheet-user" v-if="item.userNickname"><i class="iconfont icon-user"></i>{{item.userNickname}}</span>
        <i class="iconfont icon-play-1"></i>
      </div>
      <a class="sheet-desc">{{item.name}}</a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SongSheetList',
  props: {
    sheetData: {
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
  filters: {
    formatCount(value) {
      if (!value) return ''
      value = parseInt(value)
      if (value < 10000) {
        return value
      } else {
        value = Math.floor(value / 10000)
        return value + '万'
      }
    }
  },
  methods: {
    selectSheet(sheet) {
      this.$emit('select', sheet)
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.song-sheet-list
  // width: 100%
  margin-left: -18px
  clearfix()
  .sheet-item
    width: 205px
    height: 260px
    float: left
    margin-left: 18px
    margin-bottom: 18px
    .img-wrapper
      position: relative
      width: 205px
      height: 205px
      margin-bottom: 10px
      cursor: pointer
      img
        width: 100%
        height: 100%
        border-radius: 8px
      .play-count
        position: absolute
        top: 8px
        right: 8px
        font-size: $font-size-s
        color: #fff
        .icon-play-2
          margin-right: 4px
          font-size: 10px
      .sheet-user
        position: absolute
        left: 10px
        bottom: 10px
        color: #fff
        font-size: $font-size-s
      .icon-play-1
        position: absolute
        right: 10px
        bottom: 10px
        font-size: 30px
        color: #fff
        opacity: 0
        transition: opacity 0.8s
      &:hover
        .icon-play-1
          opacity: 1
    .sheet-desc
      font-size: 14px
      line-height: 20px
      cursor: pointer
      color: $text-color-ll
      &:hover
        color: #fff
</style>

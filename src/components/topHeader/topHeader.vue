<template>
  <div class="top-header">
    <h1 class="title"><a href="/" alt="网易云音乐">网易云音乐</a></h1>
    <div class="nav-bar">
      <ul>
        <router-link
        v-for="(item, index) in titleList"
        tag="li"
        :to="item.link"
        :key="index"
        class="nav-item"
        >
          <span>{{item.title}}</span>
        </router-link>
      </ul>
    </div>
    <search></search>
  </div>
</template>

<script>
import Search from 'components/search/search'
export default {
  name: 'Header',
  data() {
    return {
      titleList: [
        { title: '个性推荐', link: '/recommend' },
        { title: '歌单', link: '/songsheet' },
        { title: '排行榜', link: '/ranking' },
        { title: '歌手', link: '/singer' },
        { title: '最新音乐', link: '/latestmusic' }
      ]
    }
  },
  methods: {
  },
  components: {
    Search
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'

.top-header
  position: fixed
  top: 0
  left: 0
  z-index: 99
  width: 100%
  min-width: 1300px
  height: 58px
  background: $bg-color-d
  color: $text-color-d
  border-bottom: 2px solid $red-color-d
  .title
    width: 200px
    height: 58px
    float: left
    a
      display: block
      height: 100%
      margin-left: 18px
      text-indent: -999px
      background: url(./topbar.png)
      background-repeat: no-repeat
      background-position: 0 -6px
  .nav-bar
    position: absolute
    top: 0
    left: 230px
    .nav-item
      position: relative
      float: left
      width: 82px
      padding: 0 10px
      line-height: 58px
      text-align: center
      font-size: $font-size-l
      color: $text-color-l
      cursor: pointer
      &.current
        span
          font-size: $font-size-l-x
          color: $text-color-ll
          font-weight: bolder
        ::after
          position: absolute
          bottom: 0
          left: 50%
          margin-left: -8px
          content: ''
          width: 0
          height: 0
          border: 8px solid transparent
          border-bottom-color: $red-color-d
</style>

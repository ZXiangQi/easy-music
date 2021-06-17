<template>
  <scroll :data="newSongs" @touchbottom="touchbottom">
    <div class="latest-music">
      <ul class="category">
        <li
          v-for="(item, index) in types"
          :key="item.id"
          class="category-item"
          :class="{'current': currentIndex === index}"
          @click="selectCat(index)"
        >{{item.name}}</li>
      </ul>
      <ul class="song-list">
        <li
          v-for="(item, index) in newSongs"
          :key="item.id"
          class="song-item"
        >
          <span class="song-index">{{index | prefixIndex}}</span>
          <span class="song-img-wrapper" @click="selectSong(item)">
            <img class="song-img" v-lazy="item.picUrl">
            <i class="iconfont icon-play-1"></i>
          </span>
          <span class="song-name">{{item.name}}</span>
          <span class="singer">{{item.singer.join(' / ')}}</span>
          <span class="album">{{item.album}}</span>
          <span class="duration">{{item.duration | durationTime}}</span>
        </li>
      </ul>
    </div>
    <loading v-show="!newSongs.length"></loading>
  </scroll>
</template>

<script>
import { getLatestMusic } from 'api/latestMusic'
import { ERR_OK } from 'common/js/config'
import { createSong } from 'common/js/song'
import { formatTime, prefixNum } from 'common/js/util'
import { mapActions } from 'vuex'
import Scroll from 'baseCpn/scroll/scroll'
import Loading from 'baseCpn/loading/loading'

const LIMIT = 15
export default {
  name: 'LatestMusic',
  data() {
    return {
      types: [
        {
          id: 0,
          name: '全部'
        },
        {
          id: 7,
          name: '华语'
        },
        {
          id: 96,
          name: '欧美'
        },
        {
          id: 16,
          name: '韩国'
        },
        {
          id: 8,
          name: '日本'
        }
      ],
      currentIndex: 0,
      newSongs: [],
      offset: 0,
      isMore: true
    }
  },
  filters: {
    prefixIndex(index) {
      return prefixNum(index + 1)
    },
    durationTime(d) {
      return formatTime(d)
    }
  },
  created() {
    this.data = []
    this._getLatestMusic()
  },
  methods: {
    _getLatestMusic() {
      this.newSongs = []
      this.offset = 0
      this.isMore = true
      const type = this.types[this.currentIndex].id
      getLatestMusic(type).then(res => {
        if (res.code === ERR_OK) {
          this.data = res.data
          this.getSongs()
        }
      })
    },
    getSongs() {
      // 由于数据长度为100，加载很慢，所以每次只加载15条
      const length = this.data.length
      let lastIndex = this.offset + LIMIT
      if (lastIndex > length) {
        lastIndex = length
        this.isMore = false
      }
      this.data.slice(this.offset, lastIndex).forEach(song => {
        this.newSongs.push(createSong(song))
      })
      this.offset = lastIndex
    },
    touchbottom() {
      if (!this.isMore) return
      this.getSongs()
    },
    selectCat(index) {
      this.currentIndex = index
      this._getLatestMusic()
    },
    selectSong(song) {
      this.insertSong(song)
    },
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.latest-music
  padding: 30px 20px
  .category
    clearfix()
    .category-item
      float: left
      margin-left: 24px
      font-size: $font-size-m
      color: #878787
      cursor: pointer
      &.current
        font-weight: 700
        color: $text-color-ll
  .song-list
    padding: 20px 0
    .song-item
      width: 100%
      height: 80px
      line-height: 80px
      white-space: nowrap
      font-size: $font-size-m
      &:nth-child(even)
        background: #2E2E2E
      &:hover
        background: #373737
      .song-index
        display: inline-block
        width: 76px
        color: #55554E
        vertical-align: text-bottom
        padding-left: 30px
        padding-right: 18px
        font-size: $font-size-s
      .song-img-wrapper
        display: inline-block
        position: relative
        width: 60px
        height: 60px
        line-height: 60px
        margin-top: 10px
        vertical-align: top
        cursor: pointer
        .song-img
          width: 100%
          height: 100%
          border-radius: 8px
        .iconfont
          position: absolute
          left: 50%
          margin-left: -12px
          font-size: 24px
          color: $red-color-l
      .song-name
        display: inline-block
        width: 30%
        min-width: 200px
        margin-left: 14px
        color: $text-color-ll
        no-wrap()
      .singer
        display: inline-block
        width: 18%
        min-width: 144px
        margin-right: 14px
        color: #939393
        no-wrap()
      .album
        display: inline-block
        width: 25%
        min-width: 192px
        margin-right: 14px
        color: #939393
        no-wrap()
      .duration
        display: inline-block
        width: 9%
        min-width: 68px
        vertical-align: text-bottom
        font-size: $font-size-s
        color: #6F7575
</style>

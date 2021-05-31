<template>
  <div class="singer-detail">
    <scroll ref="singerDetailScroll" :data="songList" @touchbottom="touchBottom">
      <div class="singer-info">
        <img :src="info.picUrl">
        <div class="info">
          <h2>{{info.name}}</h2>
          <p class="count">
            <span>单曲数:{{info.musicSize}}</span>
            <span>专辑数:{{info.albumSize}}</span>
            <span>MV数:{{info.mvSize}}</span>
          </p>
          <p class="brief-desc" v-show="currentIndex!==1">{{info.briefDesc}}</p>
        </div>
      </div>
      <div class="tab-title">
        <a
          href="javascript:;"
          v-for="(item, index) in tabTitle"
          :key="index"
          class="tab-title-item"
          :class="{'current':currentIndex === index}"
          @click="selectTab(index)"
        >{{item}}</a>
      </div>
      <div class="tab-content-wrapper">
        <song-list :songs="songList" v-if="currentIndex === 0"></song-list>
        <singer-desc v-else-if="currentIndex === 1" :desc="desc"></singer-desc>
        <singer-similar v-else-if="currentIndex === 2" :similar="similar" @select="selectSinger"></singer-similar>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'baseCpn/scroll/scroll'
import { mapGetters, mapMutations } from 'vuex'
import { getSingerDetail, getSingerDesc, getSimilar, getSingerSongs } from 'api/singer'
import { singerInfo, shortSinger } from 'common/js/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import { getSheetSongDetail } from 'api/songSheet'
import SingerDesc from 'components/singerDesc/singerDesc'
import SingerSimilar from 'components/singerSimilar/singerSimilar'
import SongList from 'components/songList/songList'

const LIMIT = 30
export default {
  name: 'SingerDetail',
  data() {
    return {
      info: {},
      tabTitle: ['专辑', '歌手详情', '相似歌手'],
      currentIndex: 0,
      desc: [],
      similar: [],
      songList: [],
      songIsMore: false,
      offset: 0
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  watch: {
    singer(newValue, oldValue) {
      if (newValue === oldValue) return
      this._getSinger()
    }
  },
  created() {
    this._getSinger()
  },
  methods: {
    // 获取歌手各种信息
    _getSinger() {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      this.desc = []
      this.similar = []
      this.songList = []
      this.songIsMore = false
      this.offset = 0

      this._getSingerDetail()
      this._getSingerDesc()
      this._getSingerSimilar()
      this._getSingerSongs()
    },
    // 获取歌手详情
    _getSingerDetail() {
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.info = singerInfo(res.data.artist)
        }
      })
    },
    // 获取歌手描述
    _getSingerDesc() {
      getSingerDesc(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.desc = res.introduction
          this.desc.splice(0, 0, {
            ti: this.singer.name,
            txt: res.briefDesc
          })
        }
      })
    },
    // 获取相似歌手
    _getSingerSimilar() {
      getSimilar(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          res.artists.forEach(item => {
            this.similar.push(shortSinger(item))
          })
        }
      })
    },
    // 获取歌手歌曲
    _getSingerSongs() {
      const options = {
        id: this.singer.id,
        limit: LIMIT,
        offset: this.offset
      }
      // 先获得歌手的歌曲id
      getSingerSongs(options).then(res => {
        if (res.code === ERR_OK) {
          this.songIsMore = res.more
          const idList = []
          res.songs.forEach(song => {
            idList.push(song.id)
          })
          // 再去获取歌曲的详细信息
          return getSheetSongDetail(idList)
        }
      }).then(res => {
        if (res.code === ERR_OK) {
          res.songs.forEach(song => {
            this.songList.push(createSong(song))
          })
        }
      })
    },
    // 点击切换tab显示
    selectTab(index) {
      this.currentIndex = index
      this.refreshScroll()
    },
    // 点击相似歌手时，跳到相应的歌手页
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    // 更新高度，使可滚动
    refreshScroll() {
      this.$nextTick(() => {
        this.$refs.singerDetailScroll.refresh()
      })
    },
    // 滑动到底部时，增加数据
    touchBottom() {
      if (!this.songIsMore) return
      this.offset = this.offset + LIMIT
      this._getSingerSongs()
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    Scroll,
    SingerDesc,
    SingerSimilar,
    SongList
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.singer-detail
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: $bg-color
  z-index: 50
  .singer-info
    height: 184px
    overflow: hidden
    margin: 30px
    padding-left: 184px
    clearfix()
    img
      position: relative
      width: 184px
      height: 184px
      float: left
      left: -184px
      margin-right: -184px
      border-radius: 8px
    .info
      float: left
      margin-left: 20px
      h2
        margin-bottom: 14px
        font-size: $font-size-l-x
        font-weight: bolder
        color: $text-color-ll
      .count
        font-size: $font-size-m-s
        color: $text-color-ll
        span
          margin-right: 22px
      .brief-desc
        margin-top: 14px
        line-height: 25px
        font-size: $font-size-m-s
        color: 878787
  .tab-title
    padding: 0 30px
    clearfix()
    .tab-title-item
      display: block
      height: 28px
      line-height: 28px
      float: left
      margin-right: 20px
      font-size: $font-size-m
      color: $text-color-ll
      &.current
        font-weight: 700
        border-bottom: 3px solid $red-color-l
  .tab-content-wrapper
    padding: 30px
</style>

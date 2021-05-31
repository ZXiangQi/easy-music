<template>
  <div class="search-detail">
    <scroll :data="songs" ref="scroll">
      <h5 class="search-count">找到 {{count}} 个{{types[currentType].name}}</h5>
      <div class="tab-title">
        <a
          href="javascript:;"
          v-for="(type, index) in types"
          :key="type.id"
          class="tab-title-item"
          :class="{'current':currentType === index}"
          @click="selectTab(index)"
        >
          {{type.name}}
        </a>
      </div>
      <div class="tab-content">
        <song-list v-if="currentType === 0" :songs="songs" :like="false" :playInCpn="false" @select="playSong"></song-list>
        <search-detail-list v-else-if="currentType === 1" :list="singers" @select="selectSinger"></search-detail-list>
        <search-detail-list v-else-if="currentType === 2" :list="sheets" @select="selectSheet"></search-detail-list>
      </div>
      <pager :total="count" :limit="30" :currentPage="currentPage" @selectPage="selectPage"></pager>
    </scroll>
  </div>
</template>

<script>
import { getSearchRes } from 'api/search'
import { ERR_OK } from 'api/config'
import { shortSong, shortSinger, shortSheet } from 'common/js/search'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { getSheetSongDetail } from 'api/songSheet'
import { createSong } from 'common/js/song'

import Scroll from 'baseCpn/scroll/scroll'
import SongList from 'components/songList/songList'
import SearchDetailList from 'components/searchDetailList/searchDetailList'
import Pager from 'baseCpn/pager/pager'

const LIMIT = 30
export default {
  name: 'SearchDetail',
  data() {
    return {
      types: [
        { name: '单曲', id: 1 },
        { name: '歌手', id: 100 },
        { name: '歌单', id: 1000 }
      ],
      offset: 0,
      currentType: 0,
      songs: [],
      singers: [],
      sheets: [],
      count: 0,
      currentPage: 1
    }
  },
  computed: {
    ...mapGetters([
      'query'
    ])
  },
  watch: {
    query(newV, oldV) {
      if (newV === oldV) return
      this.selectPage(1)
    }
  },
  created() {
    this._getSearchRes()
  },
  methods: {
    // 获取搜索的结果
    _getSearchRes() {
      if (this.query === '') {
        this.$router.push('/')
      }
      // 先清空数据
      this.songs = []
      this.singers = []
      this.sheets = []

      const options = {
        keywords: this.query,
        type: this.types[this.currentType].id,
        limit: LIMIT,
        offset: this.offset
      }
      getSearchRes(options).then(res => {
        if (res.code === ERR_OK) {
          this._normalizeData(res.result)
        }
      })
    },
    // 依据选择的项格式化提取数据
    _normalizeData(res) {
      const type = this.types[this.currentType].name
      if (type === '单曲') {
        this.count = res.songCount
        res.songs.forEach(song => {
          this.songs.push(shortSong(song))
        })
      } else if (type === '歌手') {
        this.count = res.artistCount
        res.artists.forEach(singer => {
          this.singers.push(shortSinger(singer))
        })
      } else if (type === '歌单') {
        this.count = res.playlistCount
        res.playlists.forEach(sheet => {
          this.sheets.push(shortSheet(sheet))
        })
      }
      this.$refs.scroll.refresh()
    },
    // 选择tab
    selectTab(index) {
      this.currentType = index
      this.selectPage(1)
    },
    // 点击页码
    selectPage(p) {
      this.$refs.scroll.scrollToEle(0, 0.5)
      this.currentPage = p
      this.offset = (p - 1) * LIMIT
      this._getSearchRes()
    },
    // 点击歌手项跳转到歌手详情页
    selectSinger(index) {
      const singer = this.singers[index]
      this.setSinger(singer)
      this.$router.push({
        path: `/singer/${singer.id}`
      })
    },
    // 点击歌单项跳转到歌单详情页
    selectSheet(index) {
      const sheet = this.sheets[index]
      this.setSheet(sheet)
      this.$router.push({
        path: `/songsheet/${sheet.id}`
      })
    },
    // 点击歌曲播放歌曲
    playSong(song) {
      this._getSongInfo(song.id).then(song => {
        this.insertSong(song)
      })
    },
    // 选中歌曲时获取歌曲的详细信息
    _getSongInfo(id) {
      const ids = []
      ids.push(id)
      return getSheetSongDetail(ids).then(res => {
        if (res.code === ERR_OK) {
          return new Promise(resolve => {
            const song = createSong(res.songs[0])
            resolve(song)
          })
        }
      })
    },
    ...mapMutations({
      setSheet: 'SET_SHEET',
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    Scroll,
    SongList,
    SearchDetailList,
    Pager
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.search-detail
  width: 100%
  height: 100%
  .search-count
    padding: 30px
    font-size: $font-size-l
    font-weight: 700
    color: $text-color-ll
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
      &:hover
        color: #fff
      &.current
        font-weight: 700
        border-bottom: 3px solid $red-color-l
  .tab-content
    padding: 30px
</style>

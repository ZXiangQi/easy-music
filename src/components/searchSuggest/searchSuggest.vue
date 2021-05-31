<template>
  <div class="search-suggest">
    <p class="info">搜"<span class="info-key">{{keywords}}</span>"相关的结果</p>
    <div class="suggest-cat" v-if="songs">
      <h5 class="suggest-title"><i class="iconfont icon-music"></i>单曲</h5>
      <ul class="suggest-list">
        <li class="suggest-item" v-for="item in songs" :key="item.id" @click="selectQuery(item, 'song')">
          {{item.name}} - {{parseSinger(item.artists)}}
        </li>
      </ul>
    </div>
    <div class="suggest-cat" v-if="artists">
      <h5 class="suggest-title"><i class="iconfont icon-singer"></i>歌手</h5>
      <ul class="suggest-list">
        <li class="suggest-item" v-for="item in artists" :key="item.id" @click="selectQuery(item, 'singer')">
          {{item.name}}
        </li>
      </ul>
    </div>
    <div class="suggest-cat" v-if="playlists">
      <h5 class="suggest-title"><i class="iconfont icon-playlist"></i>歌单</h5>
      <ul class="suggest-list">
        <li class="suggest-item" v-for="item in playlists" :key="item.id" @click="selectQuery(item, 'songsheet')">
          {{item.name}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getSheetSongDetail } from 'api/songSheet'
import { ERR_OK } from 'api/config'
import { mapMutations, mapActions } from 'vuex'
import { createSong } from 'common/js/song'
export default {
  name: 'SearchSuggest',
  props: {
    keywords: {
      type: String,
      default: ''
    },
    suggest: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      song: null
    }
  },
  computed: {
    songs() {
      return this.suggest.songs ? this.suggest.songs : null
    },
    artists() {
      return this.suggest.artists ? this.suggest.artists : null
    },
    playlists() {
      return this.suggest.playlists ? this.suggest.playlists : null
    }
  },
  methods: {
    // 格式化歌手
    parseSinger(artists) {
      const arr = Array.from(artists, item => item.name)
      return arr.join(' / ')
    },
    // 点击选择搜索建议，根据不同的类型做不同的处理
    selectQuery(query, type) {
      // console.log(query, type)
      switch (type) {
        case 'song':
          this._getSongInfo(query.id).then(song => {
            this.insertSong(song)
          })
          break
        case 'singer':
          this.setSinger(query)
          this.$router.push({
            path: `/singer/${query.id}`
          })
          break
        case 'songsheet':
          this.setSheet(query)
          this.$router.push({
            path: `/songsheet/${query.id}`
          })
          break
      }
      this.$emit('select', query.name)
    },
    // 选中建议中的歌曲时获取歌曲的详细信息
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
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.search-suggest
  .info
    height: 30px
    line-height: 30px
    padding-left: 8px
    font-size: $font-size-m-s
    color: #909090
    .info-key
      font-size: $font-size-m
      color: #85B9E6
  .suggest-cat
    .suggest-title
      height: 24px
      line-height: 24px
      font-size: $font-size-m-s
      color: #D7D7D7
      background: #3A3A3A
      border-top: 1px solid #3F3F3F
      border-bottom: 1px solid #3F3F3F
      .iconfont
        line-height: 1
        vertical-align: middle
        padding: 0 6px 0 6px
    .suggest-list
      font-size: $font-size-m-s
      color: #D7D7D7
      .suggest-item
        height: 28px
        line-height: 28px
        padding-left: 28px
        cursor: pointer
        no-wrap()
        &:hover
          background: #333333
        .key
          color: #85B9E6
</style>

<template>
  <scroll :data="songList" class="sheet-detail">
    <div class="sheet-intro">
      <img class="sheet-img" :src="detail.picUrl">
      <div class="intro-text">
        <h2 class="title">{{detail.name}}</h2>
        <div class="creator">
          <img class="avatar" :src="detail.userAvatar">
          <a href="javascript:;" class="name">{{detail.userNickname}}</a>
          <span class="create-time">{{detail.createTime | formatDate}} 创建</span>
        </div>
        <div class="oparate">
          <div class="play-btn">
            <span class="play-all" @click.stop="selectAllPlay">
              <i class="iconfont icon-bofang"></i>播放全部
            </span>
            <span class="add-list"><i class="iconfont icon-plus"></i></span>
          </div>
        </div>
        <div class="sheet-text">标签：<span class="tags" v-html="sheetTags()"></span></div>
        <div>
          <span class="sheet-text">歌曲：<span>{{detail.songCount}}</span></span>
          <span class="sheet-text">播放：<span>{{detail.playCount | formatCount}}</span></span>
        </div>
        <div class="sheet-text">
          简介：<span>{{detail.description}}</span>
        </div>
      </div>
    </div>
    <song-list :songs="songList"></song-list>
    <loading v-show="!songList.length"></loading>
  </scroll>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getSheetDetail, getSheetSongDetail } from 'api/songSheet'
import { ERR_OK } from 'common/js/config'
import { createSheet } from 'common/js/songSheet'
import { createSong } from 'common/js/song'

import Scroll from 'baseCpn/scroll/scroll'
import SongList from 'components/songList/songList'
import Loading from 'baseCpn/loading/loading'
export default {
  name: 'SongSheetDetail',
  data() {
    return {
      detail: {},
      songList: []
    }
  },
  computed: {
    ...mapGetters([
      'sheet'
    ])
  },
  watch: {
    sheet(newValue, oldValue) {
      if (newValue === oldValue) return
      this._getSheetDetail()
    }
  },
  created() {
    this._getSheetDetail()
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
    },
    formatDate(date) {
      if (!date) return ''
      const fDate = new Date(date)
      const y = 1900 + fDate.getYear()
      let m = fDate.getMonth() + 1
      let d = fDate.getDate()

      m = m < 10 ? '0' + m : m
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    }
  },
  methods: {
    // 获取数据
    _getSheetDetail() {
      if (!this.sheet.id) {
        this.$router.push('/songsheet')
        return
      }
      this.songList = []
      // 获取歌单详情
      getSheetDetail(this.sheet.id)
        .then(res => {
          if (res.code === ERR_OK) {
            // 获取歌单的详细信息
            this.detail = createSheet(res.playlist)
            // 获取歌单音乐列表各项音乐的id值
            const idList = []
            res.playlist.trackIds.forEach(track => {
              idList.push(track.id)
            })
            return getSheetSongDetail(idList)
          }
        })
        // 获取歌单中歌曲列表中的数据
        .then(res => {
          if (res.code === ERR_OK) {
            res.songs.forEach(song => this.songList.push(createSong(song)))
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 歌单标签的格式化
    sheetTags() {
      if (Array.isArray(this.detail.tags) && this.detail.tags.length > 0) {
        const tagArr = []
        this.detail.tags.forEach(tag => {
          tagArr.push(`<a class="tag" href="#">${tag}</a>`)
        })
        return tagArr.join(' / ')
      }
    },
    selectAllPlay() {
      this.playAll(this.songList)
    },
    ...mapActions([
      'playAll'
    ])
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.sheet-detail
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: $bg-color
  z-index: 50
  .sheet-intro
    margin: 30px 80px 30px 30px
    padding-left: 184px
    clearfix()
    .sheet-img
      position: relative
      width: 184px
      height: 184px
      left: -184px
      margin-right: -184px
      float: left
      border-radius: 6px
    .intro-text
      width: 100%
      float: left
      margin-left: 20px
      .title
        font-size: 22px
        margin-bottom: 10px
        color: $text-color-ll
      .creator
        margin-bottom: 14px
        line-height: 24px
        vertical-align: middle
        .avatar
          width: 24px
          height: 24px
          vertical-align: middle
          border-radius: 50%
        .name
          margin: 0 8px
          font-size: $font-size-m-s
          color: #85B9E6
          &:hover
            color: $text-color-ll
        .create-time
          font-size: 10px
          color: #878787
      .oparate
        margin-bottom: 16px
        .play-btn
          display: inline-block
          width: 140px
          height: 32px
          line-height: 32px
          font-size: $font-size-m
          color: #FFFFFF
          cursor: pointer
          .play-all
            display: inline-block
            width: 104px
            height: 32px
            text-align: center
            border-radius: 32px 0 0 32px
            background: $red-color-l
            .icon-bofang
              padding: 0 8px
              font-size: $font-size-m
            &:hover
              background: #d73535
          .add-list
            display: block
            float: right
            width: 35px
            height: 32px
            text-align: center
            border-left: 1px solid #ED5353
            border-radius: 0 32px 32px 0
            background: $red-color-l
            .icon-plus
              font-size: 18px
            &:hover
              background: #d73535
      .sheet-text
        line-height: 24px
        margin-right: 14px
        font-size: $font-size-m
        color: $text-color-ll
        .tags
          color: $text-color-ll
          .tag
            color: red
            &:hover
              color: $text-color-ll
        span
          font-size: $font-size-m
          color: #878787
</style>

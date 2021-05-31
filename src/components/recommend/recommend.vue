<template>
  <scroll :data="recNewMusic">
    <div class="recommend content-inner">
      <banner :list="banners"></banner>
      <div class="song-sheet">
        <h2 class="recommned-title">
          <router-link tag="a" to="/songsheet">推荐歌单</router-link>
        </h2>
        <song-sheet-list :sheetData="recommendSheet" @select="selectSheet"></song-sheet-list>
      </div>
      <div class="new-music">
        <h2 class="recommned-title">
          <router-link tag="a" to="/latestmusic">最新音乐</router-link>
        </h2>
        <ul class="new-music-list">
          <li v-for="item in recNewMusic" :key="item.id" class="music-item">
            <div class="img-wrapper" @click="selectSong(item)">
              <img v-lazy="item.picUrl">
              <i class="iconfont icon-play-1"></i>
            </div>
            <div class="item-inner">
              <p class="song-name">{{item.name}}</p>
              <p class="song-singer">{{item.singer.join(' / ')}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </scroll>
</template>

<script>
import { getBanner, getRecommendSheet, getRecNewMusic } from 'api/recommend'
import { ERR_OK } from 'common/js/config'
import { createSong } from 'common/js/song'
import { mapMutations, mapActions } from 'vuex'

import Banner from 'baseCpn/banner/banner'
import SongSheetList from 'components/songSheetList/songSheetList'
import Scroll from 'baseCpn/scroll/scroll'

export default {
  name: 'Recommend',
  data() {
    return {
      banners: [],
      recommendSheet: [],
      recNewMusic: []
    }
  },
  created() {
    this._getBanner()
    this._getRecommendSheet()
    this._getRecNewMusic()
  },
  methods: {
    _getBanner() {
      getBanner().then(res => {
        if (res.code === ERR_OK) {
          this.banners = res.banners
        }
      })
    },
    _getRecommendSheet() {
      getRecommendSheet().then(res => {
        if (res.code === ERR_OK) {
          this.recommendSheet = res.result
        }
      })
    },
    _getRecNewMusic() {
      getRecNewMusic().then(res => {
        if (res.code === ERR_OK) {
          res.result.forEach(item => {
            const song = item.song
            this.recNewMusic.push(createSong(song))
          })
        }
      })
    },
    selectSheet(sheet) {
      this.$router.push({
        path: `/songsheet/${sheet.id}`
      })
      this.setSheet(sheet)
    },
    selectSong(song) {
      this.insertSong(song)
    },
    ...mapActions([
      'insertSong'
    ]),
    ...mapMutations({
      setSheet: 'SET_SHEET'
    })
  },
  components: {
    Banner,
    SongSheetList,
    Scroll
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.recommend
  &.content-inner
    width: 1100px
    height: 100%
    margin: 60px auto 0
  .recommned-title
    margin-bottom: 18px
    a
      font-size: $font-size-l-x
      font-weight: bolder
      color: $text-color-ll
  .new-music
    width: 100%
    .new-music-list
      width: 100%
      clearfix()
      .music-item
        width: 33.3%
        float: left
        box-sizing: border-box
        margin-bottom: 16px
        padding-left: 58px
        border-radius: 10px
        &:hover
          background: #3B3B3B
        .img-wrapper
          position: relative
          width: 48px
          height: 48px
          float: left
          left: -58px
          margin-right: -58px
          cursor: pointer
          img
            width: 100%
            height: 100%
            border-radius: 5px
          .icon-play-1
            position: absolute
            top: 0
            left: 0
            width: 48px
            height: 48px
            line-height: 48px
            text-align: center
            font-size: 30px
        .item-inner
          float: left
          width: 100%
          .song-name
            line-height: 20px
            color: $text-color-ll
            font-size: $font-size-m
            no-wrap()
          .song-singer
            line-height: 28px
            font-size: $font-size-s
            color: $text-color-d
            no-wrap()
            &:hover
              color: $text-color-l
</style>

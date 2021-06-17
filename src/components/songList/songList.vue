<template>
  <div class="song-list">
    <ul>
      <li class="list-title">
        <span class="oprate"></span>
        <span class="song-name">音乐标题</span>
        <span class="singer">歌手</span>
        <span class="album">专辑</span>
        <span class="duration">时长</span>
      </li>
      <li
        class="list-song"
        v-for="(song, index) in songs"
        :key="song.id"
        :class="{'current': currentSong === song}"
        @dblclick="select(song, index)">
        <i class="iconfont icon-sound"></i>
        <span class="oprate">
          <span class="song-index">{{index | prefixIndex}}</span>
          <span v-if="like" class="song-like" @click="toggleLike(song)">
            <i class="iconfont" :class="song.like ? 'icon-xin' : 'icon-like'"></i>
          </span>
        </span>
        <span class="song-name">{{song.name}}</span>
        <span class="singer">{{song.singer.join(' / ')}}</span>
        <span class="album">{{song.album}}</span>
        <span class="duration">{{song.duration | durationTime}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { formatTime, prefixNum } from 'common/js/util'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'SongList',
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    like: {
      type: Boolean,
      default: true
    },
    playInCpn: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'currentSong'
    ])
  },
  filters: {
    prefixIndex(index) {
      return prefixNum(index + 1)
    },
    durationTime(d) {
      return formatTime(d)
    }
  },
  methods: {
    select(song, index) {
      // 是否在这个组件进行播放操作
      if (this.playInCpn) {
        if (this.currentSong === song) return
        this.selectPlay({ list: this.songs, index })
      } else {
        this.$emit('select', song)
      }
    },
    toggleLike(song) {
      song.like = !song.like
      if (song.like) {
        this.saveFavoriteList(song)
      } else {
        this.deleteFavoriteSong(song)
      }
    },
    ...mapActions([
      'selectPlay',
      'saveFavoriteList',
      'deleteFavoriteSong'
    ])
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'
.song-list
  width: 100%
  li
    position: relative
    height: 34px
    line-height: 34px
    vertical-align: text-bottom
    font-size: $font-size-m
    white-space: nowrap
    background: $bg-color
    &:nth-child(even)
      background: #2E2E2E
    &:hover
      background: #373737
    .icon-sound
      position: absolute
      top: 0
      left: 6px
      color: $red-color-l
      visibility: hidden
    &.current
      .icon-sound
        visibility: visible
      .song-name
        color: $red-color-l
    .oprate
      display: inline-block
      height: 34px
      line-height: 34px
      vertical-align: top
      width: 76px
      color: #55554E
      .song-index
        padding-left: 30px
        padding-right: 18px
        font-size: $font-size-s
      .song-like
        text-align: right
        cursor: pointer
        .icon-xin
          color: $red-color-l
        &:hover
          color: $text-color-ll
    .song-name
      display: inline-block
      width: 30%
      min-width: 250px
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
    &.list-title span
      color: #888888
</style>

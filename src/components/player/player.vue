<template>
  <div class="player-wrapper">
    <div class="player">
      <!-- 左边歌曲信息 -->
      <div class="music-info" v-if="currentSong">
        <div class="music-img" @click="clickDetail">
          <img :src="currentSong.picUrl">
        </div>
        <div class="music-desc">
          <h3 class="song-name">
            <a href="javascript:;">{{currentSong.name}}</a>
            <i class="iconfont" :class="currentSong.like ? 'icon-xin' : 'icon-like'" @click="toggleLike"></i>
          </h3>
          <span class="singer">{{currentSong.singer.join(' / ')}}</span>
        </div>
      </div>
      <!-- 中间播放器 -->
      <div class="player-wrapper">
        <!-- 切换歌曲 -->
        <div class="player-switch">
          <div class="player-btn player-prev" @click="playPrev">
            <i class="iconfont icon-prev"></i>
          </div>
          <div class="player-btn player-cur" @click="togglePlay">
            <i class="iconfont" :class="playIcon"></i>
          </div>
          <div class="player-btn player-next" @click="playNext">
            <i class="iconfont icon-next"></i>
          </div>
        </div>
        <!-- 歌曲进度条 -->
        <div class="player-progress">
          <span class="music-time music-cur-time">{{curTime}}</span>
          <progress-bar class="player-progress-bar" :percent="percent" @percentChange="onProgressChange"></progress-bar>
          <span class="music-time music-all-time">{{allTime}}</span>
        </div>
      </div>
      <div class="player-control">
        <!-- 切换播放模式 -->
        <div class="play-mode" @click="changePlayMode">
          <i class="iconfont" :class="playModeIcon"></i>
        </div>
        <!-- 调节音量 -->
        <div class="player-volume">
          <i class="iconfont" :class="volumeIcon" @click="toggleMuted"></i>
          <div class="volume-progress">
            <progress-bar :percent="volume" @percentChange="changeVolume"></progress-bar>
          </div>
        </div>
      </div>
    </div>
    <transition name="slide">
      <div class="player-detail" v-if="showDetail">
        <div class="song-info">
          <div class="song-lyric">
            <lyric :song="currentSong" :current-time="currentTime"></lyric>
          </div>
          <div class="song-img">
            <disc :is-play="playing" :img-url="songImgUrl"></disc>
          </div>
          <div class="song-recommend">
            <h3 class="rmd-title">包含这首歌的歌单</h3>
            <ul>
              <li class="rmd-item" v-for="(item, index) in recommend" :key="index" @click="selectRec(item)">
                <img class="rmd-img" :src="item.picUrl">
                <p class="rmd-text">{{item.name}}</p>
              </li>
            </ul>
          </div>
        </div>
        <!-- 评论区 -->
        <!-- <div class="comment-wrapper"></div> -->
      </div>
    </transition>
    <audio
      ref="audio"
      autoplay
      :src="songUrl"
      @playing="ready"
      @ended="end"
      @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script>
import ProgressBar from 'baseCpn/progressBar/progressBar'
import Disc from 'baseCpn/disc/disc'
import Lyric from 'baseCpn/lyric/lyric'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { formatTime, shuffle } from 'common/js/util'
import { playMode, ERR_OK } from 'common/js/config'
import { getRecommend } from 'api/song'
import { shortSheet } from 'common/js/songSheet'

export default {
  name: 'Player',
  data() {
    return {
      songReady: false,
      currentTime: 0,
      muted: false,
      percent: 0,
      volume: 1,
      showDetail: false,
      recommend: []
    }
  },
  computed: {
    // 进度条左右两边的时间
    curTime() {
      if (!this.currentSong) return ''
      return formatTime(this.currentTime)
    },
    allTime() {
      if (!this.currentSong) return ''
      return formatTime(this.currentSong.duration)
    },
    songUrl() {
      return this.currentSong ? this.currentSong.url : ''
    },
    songImgUrl() {
      return this.currentSong ? this.currentSong.picUrl : ''
    },
    // 播放按钮图标的切换
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // 切换音量是否静音
    volumeIcon() {
      return this.muted ? 'icon-mute' : 'icon-volume'
    },
    // 切换播放模式图标
    playModeIcon() {
      return this.mode === playMode.sequence ? 'icon-list-loop' : (this.mode === playMode.loop ? 'icon-single-loop' : 'icon-shuffle-play')
    },
    ...mapGetters([
      'currentSong',
      'currentIndex',
      'playlist',
      'mode',
      'playing',
      'sequenceList'
    ])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong === oldSong) return
      this.getSongDetail()
    }
  },
  created() {
    this.getSongDetail()
  },
  mounted() {
    // 设置默认音量大小
    this.$refs.audio.volume = this.volume
  },
  methods: {
    // 获取当前播放歌曲的url
    getSongDetail() {
      if (!this.currentSong) return
      // 获取歌曲url
      this.currentSong.getSongUrl()
      // 获取歌词
      this.currentSong.getLyric()
      // 获取相似歌单推荐
      getRecommend(this.currentSong.id).then(res => {
        if (res.code === ERR_OK) {
          res.playlists.forEach(item => {
            this.recommend.push(shortSheet(item))
          })
        }
      })
    },
    // 歌曲播放时，更新当前播放时间和进度条
    updateTime(event) {
      this.currentTime = event.target.currentTime
      this.percent = this.currentTime / this.currentSong.duration
    },
    // 拖动进度条时，更改歌曲播放进度
    onProgressChange(percent) {
      const currentTime = this.currentSong.duration * percent
      this.currentTime = this.$refs.audio.currentTime = currentTime
    },
    // 切换播放和暂停
    togglePlay() {
      if (!this.songReady) return
      this.setPlayingState(!this.playing)
      const audio = this.$refs.audio
      this.playing ? audio.play() : audio.pause()
      // this.songReady = false
    },
    // 播放上一首
    playPrev() {
      if (!this.songReady) return
      let index = this.currentIndex - 1
      if (index < 0) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlay()
      }
      // this.songReady = false
    },
    // 播放下一首
    playNext() {
      if (!this.songReady) return
      let index = this.currentIndex + 1
      if (index > this.playlist.length - 1) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlay()
      }
      // this.songReady = false
    },
    ready() {
      this.songReady = true
      this.savePlayHistory(this.currentSong)
    },
    // error(err) {
    //   console.log('err', err)
    // },
    // 歌曲播放完之后，播放下一首
    end() {
      if (this.mode === playMode.loop || this.playlist.length === 1) {
        this.loop()
      } else {
        this.playNext()
      }
    },
    // 循环播放，将歌曲的currentTime调为0
    loop() {
      const audio = this.$refs.audio
      audio.currentTime = 0
      audio.play()
    },
    // 切换音量静音
    toggleMuted() {
      this.$refs.audio.muted = !this.muted
      this.muted = !this.muted
    },
    // 调节音量大小
    changeVolume(percent) {
      percent = percent.toFixed(1)
      this.$refs.audio.volume = percent
    },
    // 改变播放模式
    changePlayMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    // 改变播放模式后，其索引可能会被改变
    resetCurrentIndex(list) {
      const index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 点击进入歌词页
    clickDetail() {
      this.showDetail = !this.showDetail
    },
    // 点击推荐的歌单
    selectRec(sheet) {
      this.showDetail = false
      this.$router.replace({
        path: `/songsheet/${sheet.id}`
      })
      this.setSheet(sheet)
    },
    toggleLike() {
      const song = this.currentSong
      song.like = !song.like
      if (song.like) {
        this.saveFavoriteList(song)
      } else {
        this.deleteFavoriteSong(song)
      }
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
      setSheet: 'SET_SHEET'
    }),
    ...mapActions([
      'savePlayHistory',
      'saveFavoriteList',
      'deleteFavoriteSong'
    ])
  },
  components: {
    ProgressBar,
    Disc,
    Lyric
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.player
  position: absolute
  left: 0
  bottom: 0
  z-index: 999
  width: 100%
  height: 72px
  border-top: 1px solid #444444
  background: $bg-color-d
  // 歌曲信息
  .music-info
    position: absolute
    top: 0
    left: 0
    padding: 12px
    .music-img
      position: relative
      float: left
      width: 48px
      height: 48px
      border-radius: 4px
      overflow: hidden
      cursor: pointer
      &:hover
        &::after
          content: ''
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
          z-index: 9
          background: rgba(0, 0, 0, 0.7) url('./icon-up.png') center center/24px no-repeat
      img
        width: 100%
        height: 100%
    .music-desc
      float: left
      padding-left: 12px
      line-height: 22px
      color: $text-color-ll
      .song-name
        font-size: $font-size-m
        a
          color: $text-color-ll
          &:hover
            color: #fff
        .iconfont
          margin-left: 8px
          font-size: 18px
          cursor: pointer
          color: $text-color-d
          &.icon-xin
            color: $red-color-l
      .singer
        font-size: $font-size-m-s
  // 播放器切换和进度条
  .player-wrapper
    width: 440px
    margin: 0 auto
    .player-switch
      position: relative
      width: 160px
      margin: 10px auto 0
      .player-btn
        line-height: 36px
        cursor: pointer
        .iconfont
          color: #D3D3D3
          font-size: $font-size-m
        &.player-prev
          position: absolute
          top: 0
          left: 0
          &:hover
            .iconfont
              color: #C23A3B
        &.player-next
          position: absolute
          top: 0
          right: 0
          &:hover
            .iconfont
              color: #C23A3B
        &.player-cur
          height: 36px
          width: 36px
          margin: 0 auto
          text-align: center
          border-radius: 50%
          background-color: #2B2B2E
          &:hover
            background-color: #363639
    .player-progress
      position: relative
      height: 24px
      padding: 0 40px
      .music-time
        position: absolute
        top: 0
        font-size: $font-size-s
        line-height: 17px
        color: #5A605C
        &.music-cur-time
          left: 0
        &.music-all-time
          right: 0
      .player-progress-bar
        padding: 7px 0
  // 播放模式和调节音量
  .player-control
    position: absolute
    top: 0
    right: 24px
    height: 100%
    width: 200px
    line-height: 72px
    .play-mode, .player-volume
      height: 100%
      padding: 0 5px
      cursor: pointer
      .iconfont
        font-size: 20px
        color: #D2D2D3
      &:hover
        .iconfont
          color: #fff
    .play-mode
      position: relative
      float: right
    .player-volume
      float: left
      .volume-progress
        position: absolute
        top: 34.5px
        left: 30px
        width: 100px
.player-detail
  position: fixed
  top: 60px
  left: 0
  right: 0
  bottom: 72px
  z-index: 99
  background-color: #2C2B2B
  &.slide-enter-active, &.slide-leave-active
    transition: all 0.5s
  &.slide-enter, &.slide-leave-to
    transform: translate3d(0, 100%, 0)
  .song-info
    width: 40%
    min-width: 450px
    height: 800px
    margin: 0 auto
    padding: 0 300px 0 330px
    clearfix()
    .song-lyric
      width: 100%
      float: left
      height: 100%
    .song-img
      position: relative
      float: left
      width: 330px
      left: -330px
      margin-left: -100%
      height: 100%
    .song-recommend
      position: relative
      float: left
      width: 300px
      right: -300px
      margin-left: -300px
      height: 100%
      .rmd-title
        margin-top: 160px
        margin-left: 20px
        height: 50px
        line-height: 50px
        font-weight: 700
        font-size: $font-size-m
      .rmd-item
        height: 40px
        margin-left: 20px
        line-height: 40px
        clearfix()
        color: #D5D5D5
        cursor: pointer
        border-radius: 5px
        &:hover
          background: #393939
          color: #FFFFFF
        .rmd-img
          height: 28px
          width: 28px
          float: left
          padding: 6px
          border-radius: 10px
        .rmd-text
          font-size: $font-size-m-s
          no-wrap()
</style>

<template>
  <div v-if="song" class="lyric">
    <h2 class="song-title">{{song.name}}</h2>
    <p class="song-info">
      {{singerName}} - {{song.album}}
    </p>
    <div class="lyric-content">
      <scroll :data="lyric" :clickTo="false" ref="lrcScroll">
        <p
          class="lrc-text"
          v-for="(item, index) in lyric"
          :key="index"
          :class="{'current':lrcIndex === index}"
        >{{item.lrc}}</p>
      </scroll>
    </div>
  </div>
</template>

<script>
import Scroll from 'baseCpn/scroll/scroll'
const HEIGHT = 40
export default {
  name: '',
  props: {
    song: {
      type: Object,
      default() {
        return {}
      }
    },
    currentTime: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      lyric: [],
      lrcIndex: -1
    }
  },
  computed: {
    singerName() {
      return this.song.singer.join(' / ')
    }
  },
  watch: {
    song() {
      this.parseLyric()
    },
    currentTime() {
      this.update()
    }
  },
  created() {
    this.parseLyric()
  },
  methods: {
    // 解析歌词
    parseLyric() {
      if (!this.song.lyric) return
      this.lyric = []

      const lrc = this.song.lyric.split('\n')
      const reg = /(\[\d{2,}:\d{2}\.\d{2,3}\])(.*)/
      const timeReg = /\[(\d{2,}):(\d{2})\.(\d{2,3})\]/
      lrc.forEach(item => {
        const str = reg.exec(item)
        if (str !== null) {
          const timeArr = timeReg.exec(str[1])
          const time = parseInt(timeArr[1]) * 60 + parseInt(timeArr[2]) + parseInt(timeArr[3]) / 1000
          const obj = {
            lrc: str[2],
            time
          }
          this.lyric.push(obj)
        }
      })
    },
    update() {
      const oldIndex = this.lrcIndex
      const lyric = this.lyric
      for (let i = 0; i < lyric.length; i++) {
        if ((i + 1) >= lyric.length) {
          this.lrcIndex = i
          break
        }
        if (this.currentTime > lyric[i].time && this.currentTime <= lyric[i + 1].time) {
          this.lrcIndex = i
          break
        }
      }
      if (this.lrcIndex < 5) {
        this.scrollTo(0)
      }
      if (this.lrcIndex !== oldIndex && this.lrcIndex >= 5) {
        this.scrollTo(this.lrcIndex - 5)
      }
    },
    scrollTo(index) {
      if (index > -1) {
        const top = index * HEIGHT
        this.$refs.lrcScroll.scrollToEle(top, 0.8)
      }
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'

.lyric
  margin-top: 60px
  text-align: center
  .song-title
    margin-bottom: 14px
    font-size: 30px
    font-weight: 500
    color: $text-color-ll
  .song-info
    font-size: $font-size-m
    color: $text-color-d
  .lyric-content
    width: 100%
    height: 500px
    margin-top: 60px
    overflow: hidden
    .lrc-text
      height: 40px
      line-height: 40px
      font-size: $font-size-m
      color: #6A6A6A
      &.current
        font-size: $font-size-l
        font-weight: 500
        color: #FFFFFF
</style>

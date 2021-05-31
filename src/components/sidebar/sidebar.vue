<template>
  <div class="sidebar">
    <scroll ref="sidebarScroll">
      <play-list title="我喜欢的" :list="favoriteList" @slide="refreshScroll" @selectMusic="playMusic" @clear="clearFavorite"></play-list>
      <play-list title="播放列表" :list="sequenceList" @slide="refreshScroll" @selectMusic="playMusic" @clear="clearSequence"></play-list>
      <play-list title="历史记录" :list="playHistory" @slide="refreshScroll" @selectMusic="playMusic" @clear="clearHistory"></play-list>
    </scroll>
  </div>
</template>

<script>
import PlayList from 'components/playList/playList'
import Scroll from 'baseCpn/scroll/scroll'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Sidebar',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'sequenceList',
      'playHistory',
      'currentSong',
      'favoriteList'
    ])
  },
  methods: {
    refreshScroll() {
      this.$refs.sidebarScroll.refresh()
    },
    playMusic(song) {
      if (this.currentSong === song) return
      this.insertSong(song)
    },
    clearSequence() {
      this.clearSongList()
    },
    clearHistory() {
      this.clearHistory()
    },
    clearFavorite() {
      this.clearFavoriteList()
    },
    ...mapActions([
      'insertSong',
      'clearSongList',
      'clearHistory',
      'clearFavoriteList'
    ])
  },
  components: {
    PlayList,
    Scroll
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'

.sidebar
  position: absolute
  top: 60px
  left: 0
  bottom: 72px
  z-index: 3
  width: 199px
  overflow: auto
  box-sizing: border-box
  border-right: 1px solid #444444
  background: $bg-color
</style>

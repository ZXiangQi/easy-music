<template>
  <div class="app">
    <top-header></top-header>
    <sidebar></sidebar>
    <player></player>
    <div class="content-view">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import TopHeader from 'components/topHeader/topHeader'
import Sidebar from 'components/sidebar/sidebar'
import Player from 'components/player/player'

export default {
  name: 'App',
  data() {
    return {
    }
  },
  components: {
    TopHeader,
    Sidebar,
    Player
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'

.app
  position: relative
  height: 100%
  width: 100%
  min-width: 1300px
  .content-view
    position: absolute
    top: 60px
    left: 200px
    bottom: 72px
    right: 0
</style>

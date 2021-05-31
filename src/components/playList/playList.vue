<template>
  <div class="play-list">
    <h2 class="title" @click.stop="toggleList">
      <i class="iconfont icon-list"></i>{{title}}
      <i class="iconfont icon-delete" title="清空" @click.stop="clear"></i>
    </h2>
    <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <ul class="list-wrapper" v-show="slideUp">
        <li
          class="list-item"
          v-for="(item, index) in list"
          :class="{'current': currentSong === item}"
          :key="index"
          @dblclick="selectMusic(item)"
        >
          <i class="iconfont icon-sound"></i>
          {{item.name}}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const ITEM_HEIGHT = 35
const DURATION = 0.5
export default {
  name: 'PlayList',
  props: {
    title: {
      type: String,
      default: '列表'
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      slideUp: false,
      listHeight: 0
    }
  },
  computed: {
    ...mapGetters([
      'currentSong'
    ])
  },
  methods: {
    // 切换上下拉与动画
    toggleList() {
      this.slideUp = !this.slideUp

      // 因为展开列表有动画时间延迟，所以需要在动画执行完之后再触发事件
      setTimeout(() => {
        this.$emit('slide')
      }, DURATION * 1000)
    },
    beforeEnter(el) {
      el.style.height = 0
    },
    enter(el, done) {
      // 为了第一次点击时也能开启动画
      /* eslint-disable */
      el.offsetHeight
      // 设置计算出来的高度
      const listHeight = this.list.length * ITEM_HEIGHT
      el.style.height = listHeight + 'px'
      el.style.transition = 'all ' + DURATION + 's'
    },
    leave(el, done) {
      el.style.height = 0
    },
    selectMusic(song) {
      this.$emit('selectMusic', song)
    },
    clear() {
      this.$emit('clear')
      this.slideUp = false
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.play-list
  width: 100%
  overflow: hidden
  .title
    position: relative
    height: 40px
    line-height: 40px
    padding: 0 10px
    font-size: $font-size-l
    &:hover
      background: $bg-color-l
    .icon-list
      margin-right: 0.5em
      font-size: $font-size-m
    .icon-delete
      position: absolute
      right: 10px
      cursor: pointer
      color: #909090
  .list-wrapper
    overflow: hidden
    height: 100%
    .list-item
      position: relative
      height: 35px
      line-height: 35px
      font-size: $font-size-m
      text-indent: 2em
      no-wrap()
      &:hover
        background: $bg-color-l
      &:nth-child(even)
        background: #2E2E2E
      .icon-sound
        position: absolute
        left: -24px
        visibility: hidden
      &.current
        color: $red-color-l
        .icon-sound
          visibility: visible
          color: $red-color-l
</style>

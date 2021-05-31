<template>
  <div class="banner" @mouseover="stop" @mouseout="replay">
    <i class="iconfont icon-prev-btn" @click.stop="prev"></i>
    <i class="iconfont icon-next-btn" @click.stop="next"></i>
    <ul class="banner-group" ref="bannerGroup">
      <li class="banner-item" v-for="(item, index) in list" :key="index" :style="styles[index]">
        <a :href="item.url" target="_blank">
          <img :src="item.imageUrl">
        </a>
      </li>
    </ul>
    <div class="dot-group">
      <i
        v-for="(item, index) in list"
        class="dot" :class="{'active':index === currentIndex}"
        @mouseover="setCurrent(index)"
        :key="index"
      ></i>
    </div>
  </div>
</template>

<script>
const itemW = 442
export default {
  name: 'Banner',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    speed: {
      type: Number,
      default: 1500
    }
  },
  data() {
    return {
      styles: [],
      currentIndex: 0,
      timer: null
    }
  },
  // 因为轮播图组件依赖外部数据的传入，组件创建并挂载到DOM时，数据可能还没有传入
  // 所以这里需要检测传入数据的变化，以使DOM更新
  watch: {
    list(newList) {
      this.styles = new Array(newList.length)
      this.getItemPos()
      this.setItemPos()
      this.autoPlay()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getItemPos()
      this.setItemPos()
      this.autoPlay()
    })
  },
  methods: {
    // 获取图片的各个位置样式
    getItemPos() {
      const groupW = this.$refs.bannerGroup.offsetWidth
      this.pos1 = {
        left: 0,
        'z-index': 3
      }
      this.pos2 = {
        left: (groupW - itemW) / 2 + 'px',
        transform: 'scale(1.2)',
        'z-index': 5
      }
      this.pos3 = {
        left: groupW - itemW + 'px',
        'z-index': 3
      }
      this.pos4 = {
        left: (groupW - itemW) / 2 + 'px',
        'z-index': 1
      }
    },
    // 设置合法的index值
    getRightIndex(index) {
      const minIndex = 0
      const maxIndex = this.list.length - 1
      if (index < minIndex) {
        return maxIndex
      } else if (index > maxIndex) {
        return minIndex
      } else {
        return index
      }
    },
    // 根据currentIndex值，设置位置样式
    setItemPos() {
      this.currentIndex = this.getRightIndex(this.currentIndex)
      const prevIndex = this.getRightIndex(this.currentIndex - 1)
      const nextIndex = this.getRightIndex(this.currentIndex + 1)

      for (let i = 0; i <= this.styles.length - 1; i++) {
        switch (i) {
          case prevIndex:
            this.$set(this.styles, i, this.pos1)
            break
          case nextIndex:
            this.$set(this.styles, i, this.pos3)
            break
          case this.currentIndex:
            this.$set(this.styles, i, this.pos2)
            break
          default:
            this.$set(this.styles, i, this.pos4)
        }
      }
    },
    // 自动轮播
    autoPlay() {
      this.stop()
      this.timer = setInterval(() => {
        this.currentIndex = this.getRightIndex(this.currentIndex + 1)
        this.setItemPos()
      }, this.speed)
    },
    stop() {
      this.timer && clearInterval(this.timer)
    },
    replay() {
      this.autoPlay()
    },
    prev() {
      this.currentIndex--
      this.setItemPos()
    },
    next() {
      this.currentIndex++
      this.setItemPos()
    },
    setCurrent(index) {
      this.currentIndex = index
      this.setItemPos()
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
.banner
  position: relative
  width: 100%
  padding: 10px 0 30px
  .iconfont
    display: none
    position: absolute
    top: 84px
    z-index: 10
    width: 30px
    height: 30px
    line-height: 30px
    text-align: center
    border-radius: 50%
    background: rgba(0, 0, 0, 0.3)
    cursor: pointer
    &.icon-prev-btn
      left: 8px
    &.icon-next-btn
      right: 8px
  &:hover
    .iconfont
      display: block
  .banner-group
    width: 100%
    height: 198px
    .banner-item
      position: absolute
      top: 18px
      width: 442px
      height: 162px
      border-radius: 8px
      overflow: hidden
      transition: all 0.6s
      a
        display: block
        img
          width: 100%
          height: 100%
  .dot-group
    width: 100%
    text-align: center
    .dot
      display: inline-block
      width: 6px
      height: 6px
      margin: 0 4px
      border-radius: 50%
      background: #2E3033
      &.active
        background: $red-color-l
</style>

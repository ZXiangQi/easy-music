<template>
  <div class="scroll-wrapper" ref="scrollWrapper" @mousewheel="scroll" @wheel="scroll">
    <div class="scroll-bar-wrapper" ref="barWrapper" @click.stop="clickBar">
      <div class="scroll-bar" ref="scrollBar" @mousedown.stop="moveBar"></div>
    </div>
    <div class="scroll-content" ref="scrollContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Scroll',
  data() {
    return {
      speed: 50,
      isDown: false,
      clientTop: 0
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    clickTo: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    data() {
      this.$nextTick(() => {
        this.refresh()
      })
    }
  },
  mounted() {
    // 总是报错 offsetHeight为undefined
    this.$nextTick(() => {
      setTimeout(() => {
        this.init()
      }, 0)
    })
  },
  methods: {
    // 初始化高度
    init() {
      this.client = this.$refs.scrollWrapper
      this.inner = this.$refs.scrollContent
      this.bar = this.$refs.scrollBar

      this.clientTop = this.client.getBoundingClientRect().top

      this.clientH = this.client.offsetHeight
      this.innerH = this.inner.scrollHeight
      this.barH = 0

      this.setScrollBarHeight()
      this.setTransition()
    },
    refresh() {
      this.$nextTick(() => {
        this.init()
      })
    },
    // 设置滚动条的高度 - 根据滚动的内容高与窗口高的比例
    setScrollBarHeight() {
      const rate = this.clientH / this.innerH

      if (rate >= 1) {
        this.barH = 0
      } else {
        this.barH = this.clientH * rate
      }

      // 根据滑块的高度设置速度，否则在内容很高的时候速度很快
      this.speed = parseInt(this.barH / 3)
      this.bar.style.height = this.barH + 'px'
    },
    // 设置滚动时的动画效果
    setTransition(speed) {
      speed = speed || 0.15
      this.bar.style.transition = `top ${speed}s ease`
      this.inner.style.transition = `top ${speed}s ease`
    },
    // 监听鼠标滚轮滑动时，滚动内容
    scroll(event) {
      if (event.deltaY > 0) {
        this.scrollUp()
      } else if (event.deltaY < 0) {
        this.scrollDown()
      }
    },
    // 点击滚动条时，滚动到相应区域
    clickBar(event) {
      if (!this.clickTo) return
      let clickTop = event.clientY - this.clientTop
      const barTop = this.bar.offsetTop
      const barBottom = barTop + this.barH
      // 假如点击的是滚动滑块区域，不做任何操作
      if (clickTop > barTop && clickTop < barBottom) {
        return
      }
      // 假如点击的区域在滑块以下
      if (clickTop > barBottom) {
        clickTop = clickTop - this.barH
      }
      this.scrollToTarget(clickTop)
    },
    // 监听滑块被鼠标移动时
    moveBar(event) {
      const barTop = this.bar.offsetTop
      const mouseTop = event.clientY - this.clientTop
      const _this = this
      let flag = true
      this.isDown = true

      function mouseMove(e) {
        if (!_this.isDown) {
          return
        }
        if (flag) {
          _this.bar.style.transition = ''
          _this.inner.style.transition = ''
          flag = false
        }
        const Y = (e.clientY - _this.clientTop) - mouseTop
        const top = barTop + Y
        _this.scrollToTarget(top)
      }

      function mouseUp() {
        _this.isDown = false
        _this.setTransition()
        document.removeEventListener('mousemove', mouseMove, false)
        document.removeEventListener('mouseup', mouseUp, false)
      }

      document.addEventListener('mousemove', mouseMove, false)
      document.addEventListener('mouseup', mouseUp, false)
    },
    // bindEvent() {
    //   // wheel  - 高版本浏览器都支持
    //   // mousewheel - Webkit 和 IE一定支持"mousewheel"
    //   // DOMMouseScroll - 低版本firefox
    //   const support = 'onwheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll'
    //   const _this = this
    //   this.client.addEventListener(support, function(e) {
    //     if (e.deltaY > 0) {
    //       _this.scrollUp()
    //     } else if (e.deltaY < 0) {
    //       _this.scrollDown()
    //     }
    //   }, false)
    // },
    // 向上滚动
    scrollUp() {
      const barTop = this.bar.offsetTop + this.speed
      this.scrollToTarget(barTop)
    },
    // 向下滚动
    scrollDown() {
      const barTop = this.bar.offsetTop - this.speed
      this.scrollToTarget(barTop)
    },
    // 根据滑块的top值，使内容区与滑块滚动到相应区域
    scrollToTarget(top) {
      // 滚动时设置的top值的最大和最小值
      const maxTop = this.clientH - this.barH
      const minTop = 0
      let innerTop
      if (top <= minTop) {
        top = minTop
        innerTop = minTop
      } else if (top >= maxTop) {
        top = maxTop
        innerTop = -(this.innerH - this.clientH)
        // 滚动到底时
        this.$emit('touchbottom')
      } else {
        innerTop = -top / (this.clientH - this.barH) * (this.innerH - this.clientH)
      }

      this.bar.style.top = top + 'px'
      this.inner.style.top = innerTop + 'px'
    },
    // 移动到指定的内容区的top值的位置
    scrollToEle(top, speed) {
      const barTop = top * (this.clientH - this.barH) / (this.innerH - this.clientH)
      this.setTransition(speed)

      this.bar.style.top = barTop + 'px'
      this.inner.style.top = -top + 'px'
    }
  }
}
</script>

<style lang='stylus' scoped>
.scroll-wrapper
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  .scroll-bar-wrapper
    position: absolute
    top: 0
    right: 0
    bottom: 0
    width: 7px
    z-index: 5
    .scroll-bar
      display: none
      position: absolute
      top: 0
      right: 0
      z-index: 10
      width: 7px
      background: #444444
      border-radius: 7px
  &:hover
    .scroll-bar
      display: block
  .scroll-content
    position: absolute
    top: 0
    left: 0
    width: 100%
</style>

<template>
  <div class="progress-bar">
    <div class="progress-bg" ref="progressBg" @click="progressClick">
      <div class="progress-line" ref="progressLine"></div>
      <div
        class="progress-dot"
        ref="progressDot"
        @mousedown="mouseDown"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
    }
  },
  created() {
    this.downX = 0
    this.rate = 0
    this.isMouseDown = false
    this.$nextTick(() => {
      this.setProgressRate(this.percent)
    })
  },
  watch: {
    percent(newValue, oldValue) {
      if (newValue === oldValue) return
      this.setProgressRate(newValue)
    }
  },
  methods: {
    // 根据百分比设置进度条
    setProgressRate(percent) {
      const barWidth = this.$refs.progressBg.clientWidth
      const progressRate = barWidth * percent
      this._setRate(progressRate)
    },
    _setRate(rate) {
      this.$refs.progressLine.style.width = rate + 'px'
      this.$refs.progressDot.style.left = rate + 'px'
    },
    // 点击进度条
    progressClick(event) {
      const rect = this.$refs.progressBg.getBoundingClientRect()
      const rate = event.clientX - rect.left
      this._setRate(rate)
      this.triggerPercent()
    },
    // 移动进度条
    mouseDown(event) {
      this.downX = event.clientX
      this.rate = this.$refs.progressLine.clientWidth
      this.isMouseDown = true

      // 在移动进度条时，绑定document的事件
      this.documentMouseMove()
    },
    documentMouseMove() {
      if (!this.isMouseDown) return
      const _this = this
      const barWidth = this.$refs.progressBg.clientWidth
      function mouseMove(event) {
        let progressRate = event.clientX - _this.downX + _this.rate
        if (progressRate < 0) {
          progressRate = 0
        } else if (progressRate > barWidth) {
          progressRate = barWidth
        }
        _this._setRate(progressRate)
      }
      function mouseUp() {
        _this.isMouseDown = false
        _this.triggerPercent()
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseUp)
      }
      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', mouseUp)
    },
    // 获取进度条进度
    _getPercent() {
      const barWidth = this.$refs.progressBg.clientWidth
      const rateWidth = this.$refs.progressLine.clientWidth
      return rateWidth / barWidth
    },
    triggerPercent() {
      this.$emit('percentChange', this._getPercent())
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'

.progress-bar
  width: 100%
  .progress-bg
    position: relative
    width: 100%
    height: 3px
    background-color: #49494C
    .progress-line
      position: absolute
      top: 0
      left: 0
      height: 3px
      width: 0
      background-color: #EC4141
    .progress-dot
      position: absolute
      top: -2.5px
      left: 0
      width: 6px
      height: 6px
      margin-left: -4px
      border-radius: 50%
      background-color: #EC4141
      border: 1px solid #fff
      cursor: pointer
</style>

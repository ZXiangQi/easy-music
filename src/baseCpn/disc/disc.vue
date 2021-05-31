<template>
  <div class="img-wrapper" :class="imgRotate">
    <img :src="imgUrl" :class="imgRotate">
  </div>
</template>

<script>
export default {
  name: 'Disc',
  props: {
    isPlay: {
      type: Boolean,
      default: false
    },
    imgUrl: {
      type: String,
      default: ''
    }
  },
  computed: {
    imgRotate() {
      return this.isPlay ? 'play' : 'pause'
    }
  }
}
</script>

<style lang='stylus' scoped>
.img-wrapper
  position: absolute
  left: 15px
  top: 144px
  width: 310px
  height: 310px
  border-radius: 50%
  background-image: url('./disc.png')
  background-size: 100%
  background-repeat: no-repeat
  &::after
    content: ''
    position: absolute
    top: -66px
    left: 136px
    width: 95px
    height: 138px
    background: url('./needle.png')
    background-size: 95px 138px
    transform-origin: 0 0
    transform: rotate(-30deg)
    transition: transform 0.5s
  &.play::after
    transform: rotate(0deg)
  img
    position: absolute
    top: 62px
    left: 62px
    width: 186px
    height: 186px
    border-radius: 50%
    animation: rotate 40s linear infinite
    &.play
      animation-play-state: running
    &.pause
      animation-play-state: paused
@keyframes rotate
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)
</style>

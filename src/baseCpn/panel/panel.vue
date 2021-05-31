<template>
  <div class="panel">
    <h2 class="title">
      <span @click="selectAll" :class="{'current': currentCat === allCat}">{{allCat}}</span>
    </h2>
    <div class="content">
      <ul>
        <li class="cat-list" v-for="(cat, name) in data" :key="name">
          <div class="cat-title"><i :class="catIcon(name)"></i>{{name}}</div>
          <ul class="cat-group">
            <li class="cat-item" v-for="type in cat" :key="type.name" @click="selectCategory(type.name)" :class="{'current': currentCat === type.name}">
              {{type.name}}<sup v-if="type.hot" class="iconfont icon-hot"></sup>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Panel',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    current: {
      type: String,
      default: '全部歌单'
    }
  },
  data() {
    return {
      currentCat: this.current,
      allCat: '全部歌单'
    }
  },
  methods: {
    catIcon(name) {
      const clsName = 'iconfont '
      let type = ''
      switch (name) {
        case '语种':
          type = 'icon-earth'
          break
        case '风格':
          type = 'icon-piano'
          break
        case '场景':
          type = 'icon-coffee'
          break
        case '情感':
          type = 'icon-laugh'
          break
        case '主题':
          type = 'icon-menu'
          break
      }
      return clsName + type
    },
    // 点击时触发事件
    selectCategory(catName) {
      this.currentCat = catName
      this.$emit('change', catName)
    },
    selectAll() {
      this.currentCat = this.allCat
      this.$emit('change', this.allCat)
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.panel
  width: 744px
  box-shadow: 0 0 0 1px #000
  border-radius: 8px
  background: #363636
  .title
    width: 100%
    height: 55px
    padding: 12px 20px
    box-sizing: border-box
    border-bottom: 1px solid #494949
    span
      display: block
      height: 30px
      width: 80px
      line-height: 30px
      font-size: $font-size-m
      text-align: center
      border-radius: 30px
      &.current
        color: $red-color-l
        background: #3E3636
  .content
    padding: 30px 0 30px 20px
    .cat-list
      width: 100%
      margin-bottom: 20px
      line-height: 24px
      text-align: left
      font-size: $font-size-m
      clearfix()
      .cat-title
        float: left
        width: 116px
        height: 24px
        color: $text-color-d
        .iconfont
          margin-right: 6px
          vertical-align: bottom
          font-size: 24px
          color: #999999
      .cat-group
        float: left
        width: 600px
        .cat-item
          display: inline-block
          width: 100px
          margin-bottom: 20px
          color: $text-color-ll
          cursor: pointer
          &:hover
            color: $red-color-l
          .icon-hot
            color: $red-color-l
          &.current
            color: $red-color-l
</style>

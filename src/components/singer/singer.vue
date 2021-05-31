<template>
  <div class="singer">
    <scroll :data="singerList" @touchbottom="touchBottom">
      <div class="content-inner">
        <div class="singer-category">
          <div class="language-cat category">
            <h6 class="cat-title"><span>语种：</span></h6>
            <ul class="cat-list">
              <li class="cat-item" v-for="(item, index) in language" :key="item.type" @click="selectLanguage(index)">
                <span class="cat-name" :class="{'current':languageCurIdx===index}">{{item.name}}</span>
              </li>
            </ul>
          </div>
          <div class="singer-cat category">
            <h6 class="cat-title"><span>分类：</span></h6>
            <ul class="cat-list">
              <li class="cat-item" v-for="(item, index) in singerCat" :key="item.type" @click="selectSingerCat(index)">
                <span class="cat-name" :class="{'current':singerCurIdx===index}">{{item.name}}</span>
              </li>
            </ul>
          </div>
          <div class="initial-cat category">
            <h6 class="cat-title"><span>分类：</span></h6>
            <ul class="cat-list">
              <li class="cat-item" v-for="(item, index) in initialCat" :key="item.type" @click="selectInitial(index)">
                <span class="cat-name" :class="{'current':initialCurIdx===index}">{{item.name}}</span>
              </li>
            </ul>
          </div>
        </div>
        <singer-list :list="singerList" @select="selectSinger"></singer-list>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSinger } from 'api/singer'
import { ERR_OK } from 'api/config'
import { shortSinger } from 'common/js/singer'
import { mapMutations } from 'vuex'
import SingerList from 'components/singerList/singerList'
import Scroll from 'baseCpn/scroll/scroll'
const LIMIT = 30
export default {
  name: 'Singer',
  data() {
    return {
      language: [
        { type: -1, name: '全部' },
        { type: 7, name: '华语' },
        { type: 96, name: '欧美' },
        { type: 8, name: '日本' },
        { type: 16, name: '韩国' },
        { type: 0, name: '其他' }
      ],
      singerCat: [
        { type: -1, name: '全部' },
        { type: 1, name: '男歌手' },
        { type: 2, name: '女歌手' },
        { type: 3, name: '乐队' }
      ],
      initialCat: [
        { type: -1, name: '热门' },
        { type: 'a', name: 'A' },
        { type: 'b', name: 'B' },
        { type: 'c', name: 'C' },
        { type: 'd', name: 'D' },
        { type: 'e', name: 'E' },
        { type: 'f', name: 'F' },
        { type: 'g', name: 'G' },
        { type: 'h', name: 'H' },
        { type: 'i', name: 'I' },
        { type: 'j', name: 'J' },
        { type: 'k', name: 'K' },
        { type: 'l', name: 'L' },
        { type: 'm', name: 'M' },
        { type: 'n', name: 'N' },
        { type: 'o', name: 'O' },
        { type: 'p', name: 'P' },
        { type: 'q', name: 'Q' },
        { type: 'r', name: 'R' },
        { type: 's', name: 'S' },
        { type: 't', name: 'T' },
        { type: 'u', name: 'U' },
        { type: 'v', name: 'V' },
        { type: 'w', name: 'W' },
        { type: 'x', name: 'X' },
        { type: 'y', name: 'Y' },
        { type: 'z', name: 'Z' },
        { type: 0, name: '#' }
      ],
      languageCurIdx: 0,
      singerCurIdx: 0,
      initialCurIdx: 0,
      offset: 0,
      isMore: false,
      singerList: []
    }
  },
  created() {
    this._getSinger()
  },
  methods: {
    // 获取数据，根据offset - 页面请求的数据分页
    _getSinger() {
      const options = {
        area: this.language[this.languageCurIdx].type,
        type: this.singerCat[this.singerCurIdx].type,
        initial: this.initialCat[this.initialCurIdx].type,
        limit: LIMIT,
        offset: this.offset
      }
      getSinger(options).then(res => {
        if (res.code === ERR_OK) {
          this.isMore = res.more
          res.artists.forEach(item => {
            this.singerList.push(shortSinger(item))
          })
        }
      })
    },
    // 清空歌手列表，然后再根据选择的类型请求数据
    selectCategory() {
      this.singerList = []
      this.offset = 0
      this._getSinger()
    },
    // 点击语种类型
    selectLanguage(index) {
      if (this.languageCurIdx === index) return
      this.languageCurIdx = index
      this.selectCategory()
    },
    // 点击歌手类型
    selectSingerCat(index) {
      if (this.singerCurIdx === index) return
      this.singerCurIdx = index
      this.selectCategory()
    },
    // 点击字母开头的类型
    selectInitial(index) {
      if (this.initialCurIdx === index) return
      this.initialCurIdx = index
      this.selectCategory()
    },
    // 滚动到底部时，加载更多数据
    touchBottom() {
      if (!this.isMore) return
      this.offset = this.offset + LIMIT
      this._getSinger()
    },
    // 选中歌手时
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    SingerList,
    Scroll
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.singer
  width: 100%
  height: 100%
  .content-inner
    width: 1100px
    margin: 0 auto
    .singer-category
      margin-top: 20px
      .category
        padding-left: 36px
        line-height: 14px
        vertical-align: middle
        clearfix()
        .cat-title
          position: relative
          left: -36px
          width: 36px
          margin: 8px -36px 8px 0
          float: left
          font-size: $font-size-m-s
          span
            display: block
            padding: 2px 0
        .cat-list
          float: left
          width: 100%
          .cat-item
            float: left
            margin: 8px 0
            padding: 0 15px
            border-right: 1px solid #343434
            .cat-name
              display: block
              padding: 2px 10px
              font-size: $font-size-m-s
              color: #878787
              cursor: pointer
              &:hover
                color: #D0D0D0
              &.current
                border-radius: 20px
                color: $red-color-l
                background-color: #332B2B
            &:last-child
              border-right: none
</style>

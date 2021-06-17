<template>
  <div class="song-sheet">
    <scroll :data="currentSheet" ref="sheetScroll">
      <div class="content-inner">
        <!-- 精品歌单 -->
        <!-- <div class="high-quality"></div> -->
        <!-- 歌单分类 -->
        <div class="category">
          <!-- 全部分类 -->
          <div class="all-category">
            <span @click="togglePanel" class="category-btn">{{currentCat}}<i class="iconfont icon-next-btn"></i></span>
            <panel v-if="showPanel" class="sheet-panel" :data="category" :current="currentCat" @change="selectCategory"></panel>
          </div>
          <!-- 热门分类 -->
          <ul class="hot-category">
            <li v-for="item in hotSheet" :key="item.id" class="item" :class="{'current': item.name === currentCat}" @click="selectCategory(item.name)">
              {{item.name}}
            </li>
          </ul>
        </div>
        <!-- 歌单展示 -->
        <song-sheet-list :sheetData="currentSheet" @select="selectSheet"></song-sheet-list>
        <!-- 页码 -->
        <pager :total="totalSheet" :currentPage="currentPage" @selectPage="getPageData"></pager>
      </div>
      <loading v-show="!currentSheet.length"></loading>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getHotSheet, getCategory, getSheet } from 'api/songSheet'
import { shortSheet } from 'common/js/songSheet'
import { mapMutations } from 'vuex'
import { ERR_OK } from 'common/js/config'
import Panel from 'baseCpn/panel/panel'
import SongSheetList from 'components/songSheetList/songSheetList'
import Pager from 'baseCpn/pager/pager'
import Scroll from 'baseCpn/scroll/scroll.vue'
import Loading from 'baseCpn/loading/loading'

const SHEET_LIMIT = 50
const ALL_CAT = '全部歌单'
export default {
  name: 'SongSheet',
  data() {
    return {
      hotSheet: [],
      category: {},
      all: {},
      currentCat: ALL_CAT,
      currentSheet: [],
      showPanel: false,
      totalSheet: 0,
      moreSheet: true,
      currentPage: 1,
      pageOffset: 0
    }
  },
  created() {
    // 加载歌单分类数据和歌单数据，此时的歌单类型为全部
    this._getSheetCategory()
    this._getSheet()
  },
  methods: {
    // 用于获取歌单的分类数据
    _getSheetCategory() {
      getHotSheet().then(res => {
        if (res.code === ERR_OK) {
          this.hotSheet = res.tags
        }
      })
      getCategory().then(res => {
        if (res.code === ERR_OK) {
          this.category = this._normalizeCategory(res)
          this.all = res.all
        }
      })
    },
    // 用于获取具体类型的歌单数据, cat 为歌单类型
    _getSheet(tag) {
      const options = {
        tag: tag,
        limit: SHEET_LIMIT,
        offset: this.pageOffset
      }
      getSheet(options).then(res => {
        if (res.code === ERR_OK) {
          this.currentSheet = this._normalizeSheet(res.playlists)
          this.totalSheet = res.total
          this.moreSheet = res.more
        }
      })
    },
    // 格式化歌单分类数据
    _normalizeCategory(obj) {
      const cat = {}
      const { categories, sub } = obj
      for (const i in categories) {
        cat[categories[i]] = []
        sub.forEach(item => {
          if (parseInt(item.category) === parseInt(i)) {
            cat[categories[i]].push(item)
          }
        })
      }
      return cat
    },
    // 格式化一种类型的歌单数据
    _normalizeSheet(playlists) {
      const list = []
      playlists.forEach(item => {
        list.push(shortSheet(item))
      })
      return list
    },
    togglePanel() {
      this.showPanel = !this.showPanel
    },
    // 通过点击歌单类型，并传入类型名，加载相应的数据，并切换样式
    selectCategory(catName) {
      // 避免点击类型与当前展示的类型相同，而重复请求数据
      if (catName === this.currentCat) return

      this.currentCat = catName
      this.pageOffset = 0
      this.showPanel = false
      // this._getSheet(catName)
      // 获取相应类型第一页的数据
      this.getPageData(1)
    },
    getPageData(p) {
      this.$refs.sheetScroll.scrollToEle(0, 0.5)
      this.currentPage = p
      this.pageOffset = (p - 1) * SHEET_LIMIT
      this._getSheet(this.currentCat)
    },
    // 点击歌单，跳到相应的歌单详情页
    selectSheet(sheet) {
      this.$router.push({
        path: `/songsheet/${sheet.id}`
      })
      this.setSheet(sheet)
    },
    ...mapMutations({
      setSheet: 'SET_SHEET'
    })
  },
  components: {
    Panel,
    SongSheetList,
    Pager,
    Scroll,
    Loading
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.song-sheet
  width: 100%
  height: 100%
  .content-inner
    width: 1100px
    height: 100%
    margin: 40px auto 0
    // .high-quality
    //   width: 100%
    //   height: 170px
    //   border-radius: 8px
    //   background: skyblue
    .category
      position: relative
      margin: 14px 0
      .all-category
        position: relative
        .category-btn
          display: inline-block
          width: 100px
          height: 30px
          line-height: 30px
          text-align: center
          font-size: $font-size-m
          border: 1px solid $text-color-d
          border-radius: 30px
          cursor: pointer
          &:hover
            background: #343434
          .icon-next-btn
            font-size: $font-size-m
            margin-left: 4px
        .sheet-panel
          position: absolute
          top: 40px
          left: 0
          z-index: 10
      .hot-category
        position: absolute
        top: 0
        right: 0
        line-height: 30px
        clearfix()
        .item
          float: left
          margin: 0 10px
          color: $text-color-d
          font-size: $font-size-m-s
          &:hover
            color: $text-color-ll
          &.current
            color: $red-color-l
</style>

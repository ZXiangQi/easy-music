<template>
  <div class="search" ref="search">
    <i class="iconfont icon-search"></i>
    <input
      type="text"
      :placeholder="placeholder"
      @keyup.enter="enterSearch"
      @focus="focusSearch"
      @click.stop.capture
      v-model="query"
    >
    <div class="search-tips" v-show="isShowTips" @click.stop>
      <scroll ref="searchScroll">
        <div class="search-history" v-if="searchHistory.length!==0 && !query">
          <div class="title">
            搜索历史<i class="iconfont icon-delete" @click="clearSearchHistory"></i>
          </div>
          <ul class="history-list">
            <li class="history-item" v-for="item in searchHistory" :key="item" @click="clickHistory(item)">
              {{item}}
            </li>
          </ul>
        </div>
        <hot-search v-show="!query" :hot-list="hotSearch" @select="selectHot"></hot-search>
        <search-suggest v-show="query" :keywords="query" :suggest="suggest" @select="selectSuggest"></search-suggest>
      </scroll>
    </div>
  </div>
</template>

<script>
import { getHotSearch, getSuggest } from 'api/search'
import { ERR_OK } from 'api/config'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { debounce } from 'common/js/util'

import Scroll from 'baseCpn/scroll/scroll'
import HotSearch from 'components/hotSearch/hotSearch'
import SearchSuggest from 'components/searchSuggest/searchSuggest'
export default {
  name: 'Search',
  props: {
    placeholder: {
      type: String,
      default: '搜索'
    }
  },
  data() {
    return {
      query: '',
      hotSearch: [],
      suggest: {},
      isShowTips: false
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  watch: {
    // 监听query的变化，请求搜索建议
    query(newV, oldV) {
      if (newV === oldV) return
      if (newV === '') {
        this.$refs.searchScroll.refresh()
        return
      }
      this.debounceSuggest(newV)
    }
  },
  created() {
    this._getHotSearch()
    // 防抖
    this.debounceSuggest = debounce(this._getSuggest, 200)
  },
  methods: {
    // 获取热搜榜
    _getHotSearch() {
      getHotSearch().then(res => {
        if (res.code === ERR_OK) {
          this.hotSearch = res.data
        }
      })
    },
    // 获取搜索建议
    _getSuggest(keywords) {
      getSuggest(keywords).then(res => {
        if (res.code === ERR_OK) {
          this.suggest = this._normalizeSuggest(res.result)
        }
      })
    },
    // 只提取以下三种数据进行展示
    _normalizeSuggest(obj) {
      return {
        songs: obj.songs,
        artists: obj.artists,
        playlists: obj.playlists
      }
    },
    // 聚焦输入框时
    focusSearch() {
      this.isShowTips = true
      this.$refs.searchScroll.refresh()
      this.clickDocument()
    },
    // 点击document时，将提示框关掉而不是在失去焦点时，该方法只会在聚焦于输入框时生效
    // 且输入框与提示框均给点击事件取消冒泡，所以点击它们时，不会触发绑定给document的事件
    clickDocument() {
      const _this = this
      function clickDoc(event) {
        _this.isShowTips = false
        document.removeEventListener('click', clickDoc, false)
      }
      document.addEventListener('click', clickDoc, false)
    },
    // 选中搜索建议时
    selectSuggest(query) {
      this.query = query
      this.isShowTips = false
    },
    // 按下enter键时
    enterSearch() {
      if (this.query.trim() === '') return
      this.saveSearchHistory(this.query)
      if (this.$route.query.keywords === this.query) return
      this.$router.push({
        path: '/searchdetail',
        query: { keywords: this.query }
      })
      this.setQuery(this.query)
      this.isShowTips = false
    },
    // 点击历史搜索记录
    clickHistory(query) {
      this.query = query
      this.enterSearch()
    },
    selectHot(index) {
      this.query = this.hotSearch[index].searchWord
      this.enterSearch()
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ]),
    ...mapMutations({
      setQuery: 'SET_QUERY'
    })
  },
  components: {
    Scroll,
    HotSearch,
    SearchSuggest
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.search
  position: absolute
  right: 200px
  top: 14px
  z-index: 99
  height: 32px
  padding: 8px 10px 8px 30px
  box-sizing: border-box
  border-radius: 32px
  background-color: $bg-color
  .icon-search
    position: absolute
    top: 9px
    left: 12px
    color: $text-color-ll
  input
    width: 160px
    height: 100%
    font-size: 10px
    color: $text-color-ll
    outline: none
    background: $bg-color
    transition: all 0.5s
  .search-tips
    position: absolute
    top: 35px
    left: -55px
    width: 352px
    height: 448px
    overflow: hidden
    border-radius: 8px
    border: 1px solid #3F3F3F
    box-shadow: 0 0 0 1px #000
    background: #363636
    .search-history
      padding: 0 20px
      .title
        height: 42px
        line-height: 42px
        font-size: $font-size-m-s
        color: #8D8D8D
        .icon-delete
          margin-left: 10px
          line-height: 1
          vertical-align: text-bottom
          color: #626262
          cursor: pointer
      .history-list
        clearfix()
        .history-item
          height: 24px
          float: left
          margin: 0 10px 10px 0
          line-height: 24px
          padding: 0 16px
          font-size: $font-size-m-s
          color: #D2D2D2
          border: 1px solid #535353
          border-radius: 24px
          cursor: pointer
          &:hover
            background: #333333
            border-color: #515151
</style>

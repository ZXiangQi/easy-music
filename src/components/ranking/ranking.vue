<template>
  <scroll :data="topList">
    <div class="ranking">
      <div class="official">
        <h2 class="title">官方榜</h2>
        <ul class="rank-list">
          <li
            class="rank-item"
            v-for="item in officialList"
            :key="item.id"
            @click="selectList(item)"
          >
            <div class="img-wrapper">
              <img v-lazy="item.picUrl">
              <span class="play-count" v-show="item.playCount">
                <i class="iconfont icon-play-2"></i>{{item.playCount | formatCount}}
              </span>
              <i class="iconfont icon-play-1"></i>
            </div>
            <p class="item-name">{{item.name}}</p>
          </li>
        </ul>
      </div>
      <div class="global">
        <h2 class="title">全球榜</h2>
        <ul class="rank-list">
          <li
            class="rank-item"
            v-for="item in globalList"
            :key="item.id"
            @click="selectList(item)"
          >
            <div class="img-wrapper">
              <img v-lazy="item.picUrl">
              <span class="play-count">
                <i class="iconfont icon-play-2"></i>{{item.playCount | formatCount}}
              </span>
              <i class="iconfont icon-play-1"></i>
            </div>
            <p class="item-name">{{item.name}}</p>
          </li>
        </ul>
      </div>
    </div>
  </scroll>
</template>

<script>
import { getToplist } from 'api/ranking'
import { ERR_OK } from 'api/config'
import { mapMutations } from 'vuex'
import Scroll from 'baseCpn/scroll/scroll'
export default {
  name: 'Ranking',
  data() {
    return {
      topList: []
    }
  },
  computed: {
    officialList() {
      return this.topList.slice(0, 5)
    },
    globalList() {
      return this.topList.slice(5)
    }
  },
  filters: {
    formatCount(value) {
      if (!value) return ''
      value = parseInt(value)
      if (value < 10000) {
        return value
      } else {
        value = Math.floor(value / 10000)
        return value + '万'
      }
    }
  },
  created() {
    this._getToplist()
  },
  methods: {
    _getToplist() {
      getToplist().then(res => {
        if (res.code === ERR_OK) {
          res.list.forEach(item => {
            this.topList.push(this._normalizeList(item))
          })
          this.topList.splice(4, 0, {
            name: res.artistToplist.name,
            picUrl: res.artistToplist.coverUrl,
            id: 'artistToplist'
          })
        }
      })
    },
    _normalizeList(list) {
      return {
        picUrl: list.coverImgUrl,
        name: list.name,
        id: list.id,
        playCount: list.playCount
      }
    },
    selectList(sheet) {
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
    Scroll
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

.ranking
  width: 1100px
  margin: 0 auto
  h2.title
    height: 80px
    line-height: 80px
    font-size: $font-size-l-x
    color: $text-color-ll
    font-weight: bolder
  .rank-list
    margin-left: -18px
    clearfix()
    .rank-item
      width: 205px
      margin-left: 18px
      margin-bottom: 24px
      float: left
      .img-wrapper
        position: relative
        width: 205px
        height: 205px
        cursor: pointer
        img
          width: 100%
          height: 100%
          border-radius: 8px
        .play-count
          position: absolute
          top: 8px
          right: 8px
          font-size: $font-size-m-s
          color: #FFFFFF
          .icon-play-2
            margin-right: 4px
            font-size: 10px
        .icon-play-1
          display: none
          position: absolute
          top: 50%
          left: 50%
          margin: -20px 0 0 -20px
          font-size: 40px
          color: $red-color-l
        &:hover
          .icon-play-1
            display: block
      .item-name
        margin-top: 12px
        text-align: center
        font-size: $font-size-m
        color: $text-color-ll
        cursor: pointer
        &:hover
          color: #fff
</style>

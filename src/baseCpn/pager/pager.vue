<template>
  <div v-if="totalPage.length" class="pager">
    <button class="page-item iconfont icon-prev-btn" @click="prevPage" :disabled=isPrev></button>
    <button
      v-for="(p, index) in page"
      class="page-item"
      :class="{'current': currentPage===p}"
      :key="index"
      @click="selectPage(p)"
      :disabled= isDisabled(p)
    >{{p}}</button>
    <button class="page-item iconfont icon-next-btn" @click="nextPage" :disabled=isNext></button>
  </div>
</template>

<script>
const PAGE_LENGTH = 10
export default {
  name: 'Pager',
  props: {
    total: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {
      totalPage: [],
      page: [],
      ellipsis: '...'
    }
  },
  computed: {
    isPrev() {
      return this.currentPage === 1
    },
    isNext() {
      return this.currentPage === this.totalPage.length
    }
  },
  watch: {
    total() {
      this.initPages()
    },
    currentPage() {
      this.updatePage()
    }
  },
  created() {
    this.initPages()
  },
  methods: {
    initPages() {
      // 计算出总页数，并生成一个index为1起始的内容，length为总页数的数组
      const totalPage = Math.floor(this.total / this.limit)
      for (let i = 1; i <= totalPage; i++) {
        this.totalPage.push(i)
      }
      this.updatePage()
    },
    updatePage() {
      // 最后一页的页码
      const lastPage = this.totalPage.length
      // 如果最后一页或总页数小于要显示的页数，则不用更新
      if (lastPage < PAGE_LENGTH) {
        this.page = this.totalPage
        return
      }

      // 要显示的页面按钮数量为 PAGE_LENGTH
      // front 为最前几页
      // behind 为最后几页
      const front = Math.floor(PAGE_LENGTH / 2)
      const behind = lastPage - front

      // 根据 当前页 是在 最前几页 还是在 最后几页 亦或在之间 得出需要显示的页码
      if (this.currentPage < front) {
        this.page = this.totalPage.slice(0, PAGE_LENGTH)
        this.page[this.page.length - 2] = this.ellipsis
      } else if (this.currentPage > behind) {
        this.page = this.totalPage.slice(lastPage - PAGE_LENGTH, lastPage)
        this.page[1] = this.ellipsis
      } else {
        this.page = this.totalPage.slice(this.currentPage - front, this.currentPage + front)
        this.page[1] = this.page[this.page.length - 2] = this.ellipsis
      }

      // 无论如何，第一页和最后一页都需要显示
      this.page[0] = 1
      this.page[this.page.length - 1] = lastPage
    },
    selectPage(p) {
      // 如果选择的页码是个NaN 返回
      if (isNaN(parseInt(p))) return
      // 选择的页数为当前页数，则无效
      if (this.currentPage === p) return
      // 选择的页数不能小于1或大于总页数
      if (p < 1 || p > this.totalPage.length) return

      this.$emit('selectPage', p)
    },
    prevPage() {
      this.selectPage(this.currentPage - 1)
    },
    nextPage() {
      this.selectPage(this.currentPage + 1)
    },
    isDisabled(p) {
      return this.ellipsis === p
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~common/stylus/variable.styl'

.pager
  width: 100%
  height: 40px
  line-height: 40px
  margin: 30px 0 100px
  font-size: 0
  text-align: center
  .page-item
    display: inline-block
    height: 30px
    width: 30px
    margin: 0 2px
    text-align: center
    font-size: $font-size-s
    border: 1px solid #3F3F3F
    border-radius: 4px
    color: #878781
    cursor: pointer
    background: $bg-color-l
    &:hover
      color: $text-color-ll
      border: 1px solid transparent
    &.current
      color: #FDFFE1
      background: $red-color-l
      border-color: #ED5353
    &[disabled]
      cursor: auto
      &:hover
        color: #878781
        border: 1px solid #3F3F3F
        background: $bg-color-l
</style>

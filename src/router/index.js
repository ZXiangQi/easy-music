import Vue from 'vue'
import VueRouter from 'vue-router'

const Recommend = () => import('components/recommend/recommend')
const SongSheet = () => import('components/songSheet/songSheet')
const Ranking = () => import('components/ranking/ranking')
const Singer = () => import('components/singer/singer')
const LatestMusic = () => import('components/latestMusic/latestMusic')
const SearchDetail = () => import('components/searchDetail/searchDetail')

const SongSheetDetail = () => import('components/songSheetDetail/songSheetDetail')
const SingerDetail = () => import('components/singerDetail/singerDetail')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend
  },
  {
    path: '/songsheet',
    component: SongSheet,
    children: [
      {
        path: ':id',
        component: SongSheetDetail
      }
    ]
  },
  {
    path: '/ranking',
    component: Ranking
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/latestmusic',
    component: LatestMusic
  },
  {
    path: '/searchdetail',
    component: SearchDetail
  }
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'current'
})

export default router

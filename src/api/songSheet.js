import axios from 'axios'
import { baseUrl } from './config'

// 获取热门的歌单分类
export function getHotSheet() {
  const url = baseUrl + '/playlist/hot'
  return axios.get(url).then(res => {
    return res.data
  })
}
// 获取所有的歌单分类
export function getCategory() {
  const url = baseUrl + '/playlist/catlist'
  return axios.get(url).then(res => {
    return res.data
  })
}

// 根据选项获取相应类型相应页码的歌单数据
export function getSheet(options) {
  const url = baseUrl + '/top/playlist'
  const cat = options.tag || '全部'
  const limit = options.limit || 50
  const offset = options.offset || 0

  const params = {
    limit,
    order: 'hot',
    cat,
    offset
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}

// 获取歌单详情
export function getSheetDetail(id) {
  const url = baseUrl + '/playlist/detail'
  const params = {
    id
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}
// 根据歌单音乐的id数组获取各项音乐的详情
export function getSheetSongDetail(idList) {
  if (idList.length === 0) {
    return Promise.reject(new Error('请求的歌曲id列表为空'))
  }
  const url = baseUrl + '/song/detail'

  const params = {
    ids: idList.join(',')
  }

  return axios.get(url, { params }).then(res => {
    return res.data
  })
}

// 根据歌单类型获取精品歌单
export function getHighQuality(cat) {
  const url = baseUrl + '/top/playlist/highquality'
  const params = {
    cat
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}

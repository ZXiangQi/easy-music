import axios from 'axios'
import { baseUrl } from './config'

// 获取歌曲的url
export function getSongUrl(id) {
  const url = baseUrl + '/song/url'
  const params = {
    id
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}

// 检查歌曲是否可用
export function checkSong(id) {
  const url = baseUrl + '/check/music'
  const params = {
    id
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}
// 获取歌词
export function getLyric(id) {
  const url = baseUrl + '/lyric'
  const params = {
    id
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}
// 获取相似歌单推荐
export function getRecommend(id) {
  const url = baseUrl + '/simi/playlist'
  const params = {
    id
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}

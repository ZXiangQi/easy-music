import axios from 'axios'
import { baseUrl } from './config'

// 获取歌手列表
export function getSinger(options) {
  const url = baseUrl + '/artist/list'
  const type = options.type || -1
  const area = options.area || -1
  const initial = options.initial || -1
  const limit = options.limit || 30
  const offset = options.offset || 0

  const params = {
    type,
    area,
    initial,
    limit,
    offset
  }

  return axios.get(url, { params }).then(res => {
    return res.data
  })
}

// 获取歌手详情
export function getSingerDetail(id) {
  const url = baseUrl + '/artist/detail'
  const params = {
    id
  }

  return axios.get(url, { params }).then(res => {
    return res.data
  })
}
// 获取歌手专辑
export function getSingerAlbum(id) {
  const url = baseUrl + '/artist/album'
  const params = {
    id,
    limit: 30
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}
// 获取歌手描述
export function getSingerDesc(id) {
  const url = baseUrl + '/artist/desc'
  const params = {
    id
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}
// 获取相似歌手
export function getSimilar(id) {
  const url = baseUrl + '/simi/artist'
  const params = {
    id
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}

export function getSingerSongs(options) {
  const url = baseUrl + '/artist/songs'
  const params = {
    id: options.id,
    limit: options.limit || 30,
    offset: options.offset || 0
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}

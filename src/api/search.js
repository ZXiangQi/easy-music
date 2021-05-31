import axios from 'axios'
import { baseUrl } from './config'

// 获取热门搜索
export function getHotSearch() {
  const url = baseUrl + '/search/hot/detail'

  return axios.get(url).then(res => {
    return res.data
  })
}
// 获取搜索建议
export function getSuggest(keywords) {
  const url = baseUrl + '/search/suggest'
  const params = {
    keywords
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}
// 获取搜索结果
export function getSearchRes(options) {
  const url = baseUrl + '/search'
  const params = {
    keywords: options.keywords,
    limit: options.limit || 30,
    offset: options.offset || 0,
    type: options.type || 1
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}

import axios from 'axios'
import { baseUrl } from './config'

export function getToplist() {
  const url = baseUrl + '/toplist'
  return axios.get(url).then(res => {
    return res.data
  })
}

export function getTopListDetail() {
  const url = baseUrl + '/toplist/detail'
  return axios.get(url).then(res => {
    return res.data
  })
}

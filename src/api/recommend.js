import axios from 'axios'
import { baseUrl } from './config'

export function getBanner() {
  const url = baseUrl + '/banner'
  const params = {
    type: 0
  }

  return axios.get(url, { params }).then(res => {
    return res.data
  })
}

export function getRecommendSheet() {
  const url = baseUrl + '/personalized'
  const params = {
    limit: 10
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}

export function getRecNewMusic() {
  const url = baseUrl + '/personalized/newsong'
  const params = {
    limit: 12
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}

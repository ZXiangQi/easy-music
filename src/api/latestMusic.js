import axios from 'axios'
import { baseUrl } from './config'

export function getLatestMusic(type) {
  const url = baseUrl + '/top/song'
  const params = {
    type: type || 0
  }
  return axios.get(url, { params }).then(res => {
    return res.data
  })
}

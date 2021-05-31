import { saveItem, loadItem } from 'common/js/storage'

const PLAY_HISTORY = '_history_'
const PLAY_HISTORY_LENGTH = 100

const FAVORITE_KEY = '_favorite_'
const FAVORITE_LENGTH = 100

const SEARCH_KEY = '_search_'
const SEARCH_LENGTH = 15

// 添加元素到数组的第一位
function insertArray(arr, item, maxlen, compareFn) {
  // 通过传入的比较函数比对数组
  const index = arr.findIndex(compareFn)

  if (index === 0) return
  if (index > 0) {
    // 如果数组中有该元素，先删除
    arr.splice(index, 1)
  }
  // 无论有无，都将元素添加到第一位
  arr.unshift(item)
  if (arr.length > maxlen) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 将歌曲保存到历史列表
export function savePlay(song) {
  const songs = loadItem(PLAY_HISTORY, [])

  insertArray(songs, song, PLAY_HISTORY_LENGTH, item => {
    return item.id === song.id
  })
  saveItem(PLAY_HISTORY, songs)
  return songs
}
// 加载播放历史
export function loadPlay() {
  return loadItem(PLAY_HISTORY, [])
}
// 清空播放历史
export function clearPlay() {
  const empty = []
  saveItem(PLAY_HISTORY, empty)
  return empty
}

// 保存我喜欢的
export function saveFavorite(song) {
  const songs = loadItem(FAVORITE_KEY, [])

  insertArray(songs, song, FAVORITE_LENGTH, item => {
    return item.id === song.id
  })

  saveItem(FAVORITE_KEY, songs)
  return songs
}
// 加载我喜欢的
export function loadFavorite() {
  return loadItem(FAVORITE_KEY, [])
}
// 删除我喜欢的
export function deleteFavorite(song) {
  const songs = loadItem(FAVORITE_KEY, [])
  deleteFromArray(songs, item => {
    return item.id === song.id
  })

  saveItem(FAVORITE_KEY, songs)
  return songs
}
// 清空我喜欢的
export function clearFavorite() {
  const empty = []
  saveItem(FAVORITE_KEY, empty)
  return empty
}

// 保存搜索历史
export function saveSearch(query) {
  const searches = loadItem(SEARCH_KEY, [])
  insertArray(searches, query, SEARCH_LENGTH, item => {
    return item === query
  })

  saveItem(SEARCH_KEY, searches)
  return searches
}
// 加载搜索历史
export function loadSearch() {
  return loadItem(SEARCH_KEY, [])
}
// 删除搜索历史
export function deleteSearch(query) {
  const searches = loadItem(SEARCH_KEY, [])
  deleteFromArray(searches, query, item => {
    return item === query
  })

  saveItem(SEARCH_KEY, searches)
  return searches
}
// 清空搜索历史
export function clearSearch() {
  const empty = []
  saveItem(SEARCH_KEY, empty)
  return empty
}

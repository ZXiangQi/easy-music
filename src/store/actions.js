import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle, findSongIndex } from 'common/js/util'
import {
  savePlay,
  clearPlay,
  saveFavorite,
  deleteFavorite,
  clearFavorite,
  saveSearch,
  deleteSearch,
  clearSearch
} from 'common/js/cache'

function findIndex(list, song) {
  if (list.length === 0) {
    return -1
  }
  return list.findIndex(item => {
    return item.id === song.id
  })
}

// 选中歌单中的歌曲时,播放歌曲，并将整个歌单添加到播放列表中
export const selectPlay = function({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    const randomList = shuffle(list)
    index = findSongIndex(randomList, list[index])
    commit(types.SET_PLAYLIST, randomList)
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING_STATE, true)
}

// 点击歌单中的播放全部，将播放列表替换为歌单列表
export const playAll = function({ commit, state }, list) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    const randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING_STATE, true)
}

// 保存播放历史
export const savePlayHistory = function({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 往播放列表中插入歌曲，并播放
export const insertSong = function({ commit, state }, song) {
  const playlist = state.playlist.slice()
  const sequenceList = state.playlist.slice()
  let currentIndex = state.currentIndex
  const currentSong = playlist[currentIndex]

  // 查找当前播放列表和顺序列表中是否有待插入的歌曲
  const fpIndex = findIndex(playlist, song)
  const fsIndex = findIndex(sequenceList, song)

  // 将歌曲添加到当前播放歌曲的后面
  currentIndex++
  playlist.splice(currentIndex, 0, song)
  // 假如播放列表中已有待插入歌曲，将其删除
  if (fpIndex > -1) {
    if (fpIndex < currentIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  // 将歌曲添加到当前顺序列表播放歌曲的后面
  const curSlIndex = findIndex(sequenceList, currentSong)
  sequenceList.splice(curSlIndex + 1, 0, song)
  // 假如顺序列表中已有待插入歌曲，将其删除
  if (fsIndex > -1) {
    if (fsIndex < curSlIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING_STATE, true)
}

// 删除播放列表
export const clearSongList = function({ commit }) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}
// 删除播放历史
export const clearHistory = function({ commit }) {
  commit(types.SET_PLAY_HISTORY, clearPlay())
}

// 保存歌曲到我喜欢的
export const saveFavoriteList = function({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}
// 删除我喜欢的
export const deleteFavoriteSong = function({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
// 清空我喜欢的
export const clearFavoriteList = function({ commit }) {
  commit(types.SET_FAVORITE_LIST, clearFavorite())
}

// 保存搜索历史
export const saveSearchHistory = function({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
// 删除搜索历史
export const deleteSearchHistory = function({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}
// 清空搜索历史
export const clearSearchHistory = function({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

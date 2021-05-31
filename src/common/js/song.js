import { getSongUrl, getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import Vue from 'vue'

function getNameArr(artists) {
  return Array.from(artists, item => item.name)
}

export class Song {
  constructor(song) {
    const album = song.al || song.album
    const artists = song.ar || song.artists
    const duration = song.dt || song.duration

    this.name = song.name
    this.album = album.name
    this.singer = getNameArr(artists)
    this.id = song.id
    this.duration = (duration / 1000)
    this.picUrl = album.picUrl + '?param=200y200'
    this.url = ''
    this.like = false
  }

  getSongUrl() {
    if (this.url !== '') return
    getSongUrl(this.id).then(res => {
      if (res.code === ERR_OK) {
        const url = res.data[0].url
        Vue.set(this, 'url', url)
      }
    })
  }

  getLyric() {
    if (this.lyric !== undefined) return
    getLyric(this.id).then(res => {
      if (res.code === ERR_OK) {
        let lyric = ''
        if (res.nolyric && res.lrc === undefined) {
          lyric = '无歌词'
        } else {
          lyric = res.lrc.lyric
        }
        Vue.set(this, 'lyric', lyric)
      }
    })
  }
}

export function createSong(song) {
  return new Song(song)
}

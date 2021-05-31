function getNameArr(artists) {
  return Array.from(artists, item => item.name)
}

export function shortSong(song) {
  return {
    name: song.name,
    id: song.id,
    singer: getNameArr(song.artists),
    duration: song.duration,
    album: song.album.name
  }
}

export function shortSinger(singer) {
  return {
    name: singer.name,
    id: singer.id,
    picUrl: singer.img1v1Url + '?param=60y60'
  }
}

export function shortSheet(sheet) {
  return {
    name: sheet.name,
    id: sheet.id,
    picUrl: sheet.coverImgUrl + '?param=60y60',
    trackCount: sheet.trackCount,
    creator: sheet.creator.nickname
  }
}

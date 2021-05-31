export function shortSinger(singer) {
  return {
    name: singer.name,
    id: singer.id,
    picUrl: singer.picUrl + '?param=168y168'
  }
}

export function singerInfo(singer) {
  return {
    name: singer.name,
    id: singer.id,
    albumSize: singer.albumSize,
    musicSize: singer.musicSize,
    mvSize: singer.mvSize,
    picUrl: singer.cover + '?param=184y184',
    briefDesc: singer.briefDesc
  }
}

// 歌单列表的简短数据
export function shortSheet(sheetData) {
  return {
    name: sheetData.name,
    id: sheetData.id,
    picUrl: sheetData.coverImgUrl + '?param=205y205',
    playCount: sheetData.playCount,
    userNickname: sheetData.creator.nickname
  }
}

// 歌单详情数据
export class SheetDetail {
  constructor(sheetData) {
    this.name = sheetData.name
    this.id = sheetData.id
    this.picUrl = sheetData.coverImgUrl
    this.description = sheetData.description
    this.createTime = sheetData.createTime
    this.tags = sheetData.tags
    this.playCount = sheetData.playCount
    this.songCount = sheetData.trackCount
    this.commentCount = sheetData.commentCount
    this.subscribedCount = sheetData.subscribedCount
    this.shareCount = sheetData.shareCount

    this.userNickname = sheetData.creator.nickname
    this.userId = sheetData.userId
    this.userAvatar = sheetData.creator.avatarUrl
  }
}
export function createSheet(sheetData) {
  return new SheetDetail(sheetData)
}

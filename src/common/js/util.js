// 将毫秒转为mm:ss
export function formatTime(time) {
  let m = parseInt(time / 60)
  let s = parseInt(time % 60)

  m = prefixNum(m)
  s = prefixNum(s)
  return (m + ':' + s)
}
// 给小于10的数字加前缀0
export function prefixNum(m) {
  if (parseInt(m) >= 10) return m
  return '0' + m
}

// 在歌曲列表中在找歌曲的index值
export function findSongIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

// 获取指定范围内的随机整数
export function getRandomRange(min, max) {
  // max-min: 向下取整为：[0, max-min)
  // max-min+1: 向下取整为： [0, max-min]
  // (max - min + 1) + min： 向下取整为：[min, max]
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 将数组打乱后返回
export function shuffle(list) {
  const _list = list.slice()
  for (let i = 0; i < _list.length - 1; i++) {
    // 通过随机获取 0 - i 之间的整数值，之后数组通过两两互换，实现打乱数组的作用
    const j = getRandomRange(0, i)
    const v = _list[i]
    _list[i] = _list[j]
    _list[j] = v
  }
  return _list
}

export function debounce(func, delay) {
  let timer = null
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

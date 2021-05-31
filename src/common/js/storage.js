const SPACE = 'easy_music'

// 保存数据到localStorage
export function saveItem(key, value) {
  let storage = window.localStorage.getItem(SPACE)

  if (!storage) {
    storage = {}
  } else {
    storage = JSON.parse(storage)
  }

  storage[key] = value
  window.localStorage.setItem(SPACE, JSON.stringify(storage))
}

// 从localStorage中获取数据
export function loadItem(key, def) {
  let storage = window.localStorage.getItem(SPACE)

  if (!storage) {
    return def
  }

  storage = JSON.parse(storage)
  const result = storage[key]
  return result || def
}

import { playMode } from 'common/js/config'
import { loadPlay, loadFavorite, loadSearch } from 'common/js/cache'

const state = {
  sheet: {},
  singer: {},
  playing: false,
  playlist: [],
  sequenceList: [],
  playHistory: loadPlay(),
  favoriteList: loadFavorite(),
  currentIndex: -1,
  mode: playMode.sequence,
  searchHistory: loadSearch(),
  query: ''
}

export default state

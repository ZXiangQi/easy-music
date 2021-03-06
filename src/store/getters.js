export const sheet = state => state.sheet

export const singer = state => state.singer

export const playing = state => state.playing

export const mode = state => state.mode

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const playHistory = state => state.playHistory

export const currentIndex = state => state.currentIndex

export const currentSong = state => state.playlist[state.currentIndex] || null

export const favoriteList = state => state.favoriteList

export const searchHistory = state => state.searchHistory

export const query = state => state.query

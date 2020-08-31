

export function retrieveCurrentPlaylistIndex (state, index){
    state.currentPlaylistIndex = index
}

export function retrievePlaylist(state, playlist){
    state.playlist = playlist
}
export function retrieveCurrentSong(state, currentSong){
    state.currentSong = currentSong
}

export function retrieveSongVersion(state, version){
    state.songVersion = version
}

export function retrieveSearchText(state, searchText){
    state.searchText = searchText
}
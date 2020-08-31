import Vue from "vue";

export function setPlaylistIndex(context, index) {
  sessionStorage.setItem("currentPlaylistSongIndex", index);

  context.commit("retrieveCurrentPlaylistIndex", index);
}

export function setSongVersion(context, version) {
  sessionStorage.setItem("songVersion", version);

  context.commit("retrieveSongVersion", version);
}

export function addToPlaylist(context, song) {
  let playlist = JSON.parse(sessionStorage.getItem("playlist"));

  playlist.items.push(song);

  sessionStorage.setItem("playlist", JSON.stringify(playlist));
  context.commit("retrievePlaylist", playlist);
}

export function setPlaylist(context, playlist) {
  sessionStorage.setItem("playlist", JSON.stringify(playlist));
  context.commit("retrievePlaylist", playlist);
}

export function setCurrentSong(context, currentSong) {
  sessionStorage.setItem("currentSong", currentSong);

  context.commit("retrieveCurrentSong", currentSong);
}

export function setSearchText(context, searchText) {
  sessionStorage.setItem("searchText", searchText);
  context.commit("retrieveSearchText", searchText);
}

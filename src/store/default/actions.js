import Vue from "vue";




export function setPlaylistIndex(context, index) {
  sessionStorage.setItem('currentPlaylistSongIndex',index)

  context.commit("retrieveCurrentPlaylistIndex", index)
}

export function addToPlaylist(context, song){
  let playlist = JSON.parse(sessionStorage.getItem("playlist"));


      let sng = {}
      sng['title'] = song.title
      sng['author'] = song.author
      sng['number'] = song.number
      sng['id'] = song._id
    playlist.items.push(sng);

    sessionStorage.setItem("playlist", JSON.stringify(playlist));
    context.commit("retrievePlaylist", playlist)
}


export function setPlaylist(context, playlist) {
  sessionStorage.setItem("playlist", JSON.stringify(playlist));
    context.commit("retrievePlaylist", playlist)
}

export function setCurrentSong(context, currentSong) {
  sessionStorage.setItem('currentSong',currentSong)

  context.commit("retrieveCurrentSong", currentSong)
}

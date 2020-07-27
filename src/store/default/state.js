export default {
  currentPlaylistIndex: parseInt(sessionStorage.getItem('currentPlaylistSongIndex') || 0),
  currentSong:sessionStorage.getItem('currentSong') || null,
  playlist: JSON.parse(sessionStorage.getItem('playlist')) || {
    name: null,
    items: []
  },
  songVersion:null

}

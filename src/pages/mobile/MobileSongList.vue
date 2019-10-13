<template>
  <div class="q-pa-md">
    <q-list bordered separator>
      <q-slide-item 
      @right="addToPlaylist(song)" 
      @action="action"
      v-for="(song,index) in songs" 
      :key="index"
      left-color="red" right-color="purple"
      >
        <template v-slot:left>Left</template>
        <template v-slot:right>Add to playlist</template>
        <q-item clickable v-ripple  @click="$socket.emit('playlist_song', song)">
          <q-item-section>
            <q-item-label>{{song.title}}</q-item-label>
            <q-item-label caption>{{song.author}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-slide-item>
    </q-list>
  </div>
</template>
<script>
export default {
  name: "MobileSongList",
  mounted() {
    this.getAllSongs();
  },
  data() {
    return {
      songs: []
    };
  },
  methods: {
    getAllSongs() {
      this.songs = [];
      this.$ws.allSongs().then(songs => {
        this.songs = songs;
      });
    },
     addToPlaylist(song) {
        this.$q.notify('Song added to playlist')
      this.finalize()
      this.$socket.emit("add_to_playlist", song);
    },
   

    action ({ reset }) {
      this.finalize(reset)
    },
  
      finalize (reset) {
      this.timer = setTimeout(() => {
        reset()
      }, 1000)
    
    
  },
  },
  
};
</script>
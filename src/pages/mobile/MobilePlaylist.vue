<template>
  <div class="q-pa-md">

    <q-list bordered separator>
      <q-item clickable v-ripple v-for="(song,index) in playlist" :key="index"
        @click="$socket.emit('playlist_song', song)"
      >
        <q-item-section>
          <q-item-label>{{song.title}}</q-item-label>
          <q-item-label caption>{{song.author}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script>
export default {
  name: "PlaylistData",
  mounted() {
    this.$socket.emit("get_playlist");
     this.txtServer = this.$store.getters["defaultModule/getServerUrl"];
  },
  data() {
    return {
      playlist: [],
      txtServer:null
    };
  },
  sockets: {
    playlist_data: function(data) {
      this.playlist = data;
    }
  }
};
</script>
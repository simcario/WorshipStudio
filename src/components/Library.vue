<template>
  <q-card dark class="bg-grey-9" style="width:100%; height:48vh">
    <q-bar dense class="bg-grey-10">{{ $t("library") }}</q-bar>
    <q-card-section style="height:43px ;padding:0px;overflow:hidden">
      <q-input filled dense dark :label="$t('search')" v-model="searchText">
        <template v-slot:prepend>
          <q-icon name="fas fa-search" />
        </template>
        <template v-slot:append v-if="searchText !== ''">
          <q-icon name="close" @click="clearText()" />
        </template>
      </q-input>
    </q-card-section>
    <q-card-section
      class="scroll"
      style="height:70% ;padding:0px;overflow-y:scroll"
    >
      <q-list dense>
        <div v-for="(song, index) in songs" :key="index">
          <q-item
            clickable
            v-ripple
            :active="song._id === currentSong"
            active-class="bg-grey-8 text-white"
            style="padding: 0px 16px;"
            @click="$root.$emit('library-single-click', song._id)"
            @dblclick.once="$root.$emit('library-double-click', song._id)"
          >
            <q-menu touch-position context-menu>
              <!-- Context Menu -->
              <q-list dense style="min-width: 100px">
                <q-item
                  clickable
                  v-close-popup
                  @click="$root.$emit('library-double-click', song._id)"
                >
                  <q-item-section avatar>
                    <q-icon size="16px" name="fas fa-external-link-alt" />
                  </q-item-section>
                  <q-item-section>{{ $t("open") }}</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="$root.$emit('edit-song', song._id)"
                >
                  <q-item-section avatar>
                    <q-icon size="16px" name="fas fa-edit" />
                  </q-item-section>
                  <q-item-section>{{ $t("edit") }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="openDeleteDialog(song)">
                  <q-item-section avatar>
                    <q-icon size="16px" name="fas fa-trash-alt" />
                  </q-item-section>
                  <q-item-section>{{ $t("delete") }}</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="openPad(song._id)">
                  <q-item-section avatar>
                    <q-icon size="16px" name="fas fa-volume-off" />
                  </q-item-section>
                  <q-item-section>{{ $t("choose_pad") }}</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  v-close-popup
                  @click="$store.dispatch('defaultModule/addToPlaylist',song)"
                >
                  <q-item-section avatar>
                    <q-icon size="16px" name="fas fa-list" />
                  </q-item-section>
                  <q-item-section>{{ $t("add_to_playlist") }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            <q-item-section>
              <q-item-label style="font-weight:bold">{{
                song.title
              }}</q-item-label>
              <q-item-label caption class="text-white">{{
                song.author
              }}</q-item-label>
            </q-item-section>
            <q-item-section top side class="text-white">
              {{ song.number }}
            </q-item-section>
          </q-item>
          <q-separator v-if="index < songs.length - 1" />
        </div>
      </q-list>
      
    </q-card-section>
    <q-bar dense><q-btn dense round flat icon="fas fa-plus" @click="$router.push({ path: 'ViewEditSong/newSong/false' })" /></q-bar>
  </q-card>
  <!-- Library-->
</template>

<script>
export default {
  name: "Library",
  mounted() {
    this.reloadSongs();
  },

  data() {
    return {
      songs: {},
      searchText: ""
    };
  },
  methods: {
        openPad(songid) {
      this.$renderer.send("select-file", {
        title: this.$t("choose_pad"),
        event: "choose-pad",
        data: songid,
        filters: [
          {
            name: this.$t("file_audio"),
            extensions: ["mp3", "wav"]
          }
        ]
      });
    },
    reloadSongs() {
      this.$ws.allSongs("").then(songs => {
        this.songs = songs;
      });
    },
    clearText() {
      this.searchText = "";
      this.$ws.allSongs("").then(songs => (this.songs = songs));
    },
    
    openDeleteDialog(song) {
      this.$q.notify({
        message: this.$t("delete_song_confirm"),
        color: "negative",
        icon: "fas fa-exclamation-triangle",
        textColor: "white",
        position: "center",
        actions: [
          {
            label: "Yes",
            color: "yellow",
            handler: () =>
              this.$ws.deleteSong(song).then(() => this.reloadSongs())
          },
          {
            label: "Dismiss",
            color: "white",
            handler: () => console.log("dismiss")
          }
        ]
      });
      // this.alert=true
    },
 
  },
  computed:{
    currentSong(){
      return this.$store.getters['defaultModule/getCurrentSong']
    }
  },
  watch: {
    searchText() {
      this.$ws.allSongs(this.searchText).then(songs => {
        this.songs = songs;
      });
    }
  }
};
</script>

<style></style>

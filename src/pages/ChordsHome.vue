<template>
  <q-page class="flex">
    <NewSongDialog :show="newSongDialog" :songEdit="songEdit" />
    <ChordViewer v-if=" this.moduleSettings.showChords=== true" :show="ChordViewer" />
    <TextViewer v-else :show="ChordViewer" />
    <!--<QCode :qrcode="showQCode" />-->

    <div class="row full-width q-pa-md">
      <div class="col-6 q-pa-md">
        <q-card>
          <q-toolbar class="bg-primary glossy text-white">
            <q-toolbar-title>Songs</q-toolbar-title>
            <q-input
              dark
              dense
              standout
              v-model="searchText"
              input-class="text-right"
              class="q-ml-md"
              @input="filterSongs(searchText)"
            >
              <template v-slot:append>
                <q-icon v-if="searchText === ''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="clearText()" />
              </template>
            </q-input>
          </q-toolbar>
          <q-card-section>
            <q-list bordered style="max-height:500px; overflow:scroll">
              <div v-for="(song,index) in songs" :key="index">
                <q-item clickable v-ripple style="padding: 0px 16px;">
                  <q-menu touch-position context-menu>
                    <!-- Context Menu -->
                    <q-list dense style="min-width: 100px">
                      <q-item clickable v-close-popup @click="openSong(song)">
                        <q-item-section avatar>
                          <q-icon size="16px" name="fas fa-external-link-alt" />
                        </q-item-section>
                        <q-item-section>Open...</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="editSong(song)">
                        <q-item-section avatar>
                          <q-icon size="16px" name="fas fa-edit" />
                        </q-item-section>
                        <q-item-section>Edit</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="openDeleteDialog(song.songid)">
                        <q-item-section avatar>
                          <q-icon size="16px" name="fas fa-trash-alt" />
                        </q-item-section>
                        <q-item-section>Delete</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item clickable v-close-popup @click="$ws.addToPlaylist(song)">
                        <q-item-section avatar>
                          <q-icon size="16px" name="fas fa-list" />
                        </q-item-section>
                        <q-item-section>Add to Playlist</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                  <q-item-section @dblclick="$ws.playSong(song.songid)">
                    <q-item-label>{{song.title}}</q-item-label>
                    <q-item-label caption>{{song.author}}</q-item-label>
                  </q-item-section>
                  <q-item-section top side>{{song.number}}</q-item-section>
                </q-item>
                <q-separator v-if="index < songs.length-1" />
              </div>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
      <!-- Songs -->
      <div class="col-6 q-pa-md">
        <q-tabs dense v-model="activeTab" class="bg-primary text-white shadow-2 glossy">
          <q-tab name="currentPlaylist" icon="fas fa-clock" label="Current Playlist" />
          <q-tab name="cloudPlaylists" icon="fas fa-list" label="Cloud Playlists">
            <q-badge v-show="cloudPlaylists.length>0" color="red" floating>{{cloudPlaylists.length}}</q-badge>
          </q-tab>
        </q-tabs>
        <q-tab-panels v-model="activeTab">
          <q-tab-panel name="currentPlaylist" class="q-pa-none">
            <q-input filled v-model="currentPlaylistTitle" label="Playlist Title" />
            <q-card>
              <q-card-section></q-card-section>
              <q-card-section>
                <q-list
                  bordered
                  v-shortkey="{down:['arrowdown'],up:['arrowup']}"
                  @shortkey.native="moveSong"
                >
                  <draggable
                    class="list-group"
                    tag="div"
                    v-model="playlist.items"
                    @end="$ws.updatePlaylist(playlist)"
                  >
                    <q-item
                      clickable
                      v-ripple
                      v-for="(song,index) in playlist.items"
                      :key="index"
                      @click="playlistSong(index)"
                    >
                      <q-menu touch-position context-menu>
                        <!-- Context Menu -->
                        <q-list dense style="min-width: 100px">
                          <q-item clickable v-close-popup @click="$ws.removeFromPlaylist(index)">
                            <q-item-section avatar>
                              <q-icon size="16px" name="fas fa-ban" />
                            </q-item-section>
                            <q-item-section>Remove</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                      <q-item-section>
                        <div>
                          <q-badge
                            color="primary"
                            text-color="white"
                            :floating="false"
                            :label="index+1"
                          />
                          {{song.title}}
                        </div>
                      </q-item-section>
                      <q-item-label caption>{{song.author}}</q-item-label>
                    </q-item>
                  </draggable>
                </q-list>
              </q-card-section>
              <q-card-actions>
                <q-space />
                <q-btn
                  flat
                  color="primary"
                  @click="$ws.savePlaylist(playlist, currentPlaylistTitle).then(()=>getCloudPlaylists())"
                >Save</q-btn>
              </q-card-actions>
            </q-card>
          </q-tab-panel>
          <q-tab-panel name="cloudPlaylists" class="q-pa-none">
            <q-list bordered>
              <q-item
                clickable
                v-ripple
                v-for="(pl, index) in cloudPlaylists"
                :key="index"
                @dblclick="$ws.loadCloudPlaylist(pl)"
              >
                <q-menu touch-position context-menu>
                  <!-- Context Menu -->
                  <q-list dense style="min-width: 100px">
                    <q-item clickable v-close-popup @click="removeCloudPlaylist(pl.id) ">
                      <q-item-section avatar>
                        <q-icon size="16px" name="fas fa-trash-alt" />
                      </q-item-section>
                      <q-item-section>Delete</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
                <q-item-section>
                  <q-item-label>{{pl.title}}</q-item-label>
                  <q-item-label caption>
                    Created by
                    <strong>{{pl.createdBy}}</strong>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <!-- Playlist -->

    <UpdateDialog :updateDialog="updateDialog" :data="updateData"></UpdateDialog>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<style>
</style>

<script>
import NewSongDialog from "../components/index/NewSongDialog";
import ChordViewer from "../components/index/ChordViewer";
import TextViewer from "../components/index/TextViewer";
import UpdateDialog from '../components/index/NewUpdateDialog'
//import QCode from "../components/index/QCode";
import draggable from "vuedraggable";
export default {
  name: "ChordsHome",
  components: { NewSongDialog, ChordViewer, TextViewer, draggable, UpdateDialog },
  mounted() {
    this.$root.$on("editSong", song => {
      this.songEdit = true;
      this.newSongDialog = true;
    });
    this.$root.$on("closeEditor", () => {
      this.newSongDialog = false;
    });
    this.$root.$on("closeChordViewer", () => {
      this.ChordViewer = false;
    });
  
    this.$root.$on("updateSongs", () => {
      this.getAllSongs();
    });

    this.$root.$on("new-song", () => {
      this.newSong();
    });
   this.$root.$on("close-update-dialog", () => {
      this.updateDialog = false;
    });
  

    this.$bus.$on("loading-true", () => {
      this.loading = true;
    });

    this.$bus.$on("new-version", (data) => {
    
     this.updateDialog = true,
     this.updateData = data;
    });
    this.$bus.$on("loading-false", () => {
      this.loading = false;
    });

    /*
    this.$ws.loadAllSongs().then(songs => {
      this.songs = songs;
    });
  */
    this.$renderer.send("get-playlist");

    this.$renderer.on("playlist-data", (evt, playlist) => {
      this.playlist = playlist;
    });

     this.$renderer.on("F5", (evt) => {
      this.playlistSong(0)
    });

    this.$renderer.on("pagedown", (evt) => {
      this.nextSong()
    });
     this.$renderer.on("pageup", (evt) => {
      this.prevSong()
    });

    this.$renderer.on("song", evt => {
      this.ChordViewer = true;
    });

    this.getCloudPlaylists();
  },
  data() {
    return {
      loading: false,
      updateDialog:false,
      updateData:null,
      activeTab: "currentPlaylist",
      showQCode: false,
      newSongDialog: false,
      ChordViewer: false,
      TextViewer: false,
      searchText: "",
      songEdit: false,
      deleteSongID: null,
      mode: "text",
      song: {
        text: [],
        chords: []
      },
      songs: [],
      currentPlaylistTitle: null,
      cloudPlaylists: [],
      playlist: [],
      currentPlaylistSongIndex: null,
      selectedSection: null
    };
  },
  methods: {
    clearText() {
      let songs = this.$store.getters["defaultModule/getSongs"];
      this.searchText = "";
      this.songs = songs;
    },
    newSong() {
      this.songEdit = false;
      this.$root.$emit("newSong");
      this.newSongDialog = true;
    },
    openDeleteDialog(songID) {
      (this.deleteSongID = songID),
        this.$q.notify({
          message: "Are you sure you want to delete the song?",
          color: "negative",
          icon: "fas fa-exclamation-triangle",
          textColor: "white",
          position: "center",
          actions: [
            { label: "Yes", color: "yellow", handler: () => this.deleteSong() },
            {
              label: "Dismiss",
              color: "white",
              handler: () => console.log("dismiss")
            }
          ]
        });
      // this.alert=true
    },
    getAllSongs() {
      // this.songs = [];
      this.loading = true;
      this.$ws.allSongs().then(songs => {
        this.songs = songs;
        this.loading = false;
      });
    },
    openSong(song) {
      this.$renderer.send("song", song);
      //this.$root.$emit("song", song)
    },
    editSong(song) {
      this.$root.$emit("editSong", song);
    },
    deleteSong() {
      /*
      this.$firestore
        .collection("songs")
        .doc(this.deleteSongID)
        .update({ deleted: true });

      */
      this.$ws.deleteSong(this.deleteSongID).then(songs => {
        this.songs = songs;
      });

      this.$q.notify({
        message: "Song was deleted",
        color: "positive",
        actions: [
          {
            label: "Cancel",
            color: "yellow",
            handler: () => {
              this.$firestore
                .collection("songs")
                .doc(this.deleteSongID)
                .update({ deleted: false });
              this.getAllSongs();
            }
          }
        ]
      });
    },
    filterSongs(filter) {
      this.$ws.filterSongs(filter).then(songs => {
        this.songs = songs;
      });
    },
    getCloudPlaylists() {
      this.cloudPlaylists = [];
      this.$ws.cloudPlaylists().then(playlists => {
        this.cloudPlaylists = playlists;
      });
    },
    removeCloudPlaylist(id) {
      this.$q.notify({
        message: "Cloud Playlist will be removed. Continue?",
        color: "primary",
        actions: [
          {
            label: "Yes",
            color: "white",
            handler: () => {
              this.$ws.removeCloudPlaylist(id).then(() => {
                this.getCloudPlaylists();
              });
            }
          },
          { label: "No", color: "white" }
        ]
      });
    },
    playlistSong(index) {
      this.currentPlaylistSongIndex = index;
      console.log('Current Index:', index)
      const song = this.playlist.items[index];
      this.$renderer.send("song", song);
    },
    nextSong() {
      const index = this.currentPlaylistSongIndex + 1;
      if (index < this.playlist.items.length) {
        this.playlistSong(index);
      }
    },
    prevSong() {
      const index = this.currentPlaylistSongIndex - 1;
       if (index > -1) {
            this.playlistSong(index);
          }
    },
    moveSong(event) {
      let index;
      event.preventDefault()
      console.log(event.srcKey)
       switch (event.srcKey) {
        case "up":
          index = this.currentPlaylistSongIndex - 1;
          if (index > -1) {
            this.playlistSong(index);
          }
          break;
          case "pageup":
          index = this.currentPlaylistSongIndex - 1;
          if (index > -1) {
            this.playlistSong(index);
          }
          break;
        case "down":
          index = this.currentPlaylistSongIndex + 1;
          if (index < this.playlist.items.length) {
            this.playlistSong(index);
          }
          break;
          case "pagedown":
          index = this.currentPlaylistSongIndex + 1;
          if (index < this.playlist.items.length) {
            this.playlistSong(index);
          }
          break;
      }
     
    }
  },
  computed: {
    user() {
      return {
        email: this.$store.getters["defaultModule/getEmail"],
        organizationID: this.$store.getters["defaultModule/getOrganizationID"]
      };
    },
    moduleSettings() {
      return this.$store.getters["defaultModule/getModuleChords"];
    },
    computerName() {
      return this.$store.getters["defaultModule/getComputerName"];
    }
  },
  watch: {}
};
</script>
<style scoped>
.songText {
  font-size: 18px;
  line-height: 40px;
  position: absolute;
  top: 15px;
  display: block;
}
.songChords {
  font-size: 18px;
  line-height: 40px;
  color: red;

  white-space: pre;
}
.sectionContainer {
  position: relative;
  margin: 0px;
}
.selectedSection {
  border: 1px dotted #dddddd;
  border-radius: 5px;
}
</style>

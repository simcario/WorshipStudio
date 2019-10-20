<template>
  <div class="q-pa-md">
    <!--
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab glossy icon="fas fa-bars" color="accent" direction="up">
        <q-fab-action glossy color="accent" icon="fas fa-plus" @click="newSong()"></q-fab-action>
        <q-fab-action glossy color="accent" icon="fas fa-qrcode" @click="showQCode = true"></q-fab-action>
      </q-fab>
    </q-page-sticky>
    -->
    <NewSongDialog :show="newSongDialog" :songEdit="songEdit" />
    <!--<QCode :qrcode="showQCode" />-->
    <div class="row">
      <div class="col-4 q-pa-md">
        <q-tabs v-model="activeTab" class="bg-purple text-white shadow-2 glossy">
          <q-tab name="songs" icon="fas fa-guitar" label="Songs" />
          <q-tab name="announces" icon="fas fa-bullhorn" label="Announces" > 
             <q-badge v-show="announces.length>0" color="red" floating>{{announces.length}}</q-badge>
          </q-tab>
        </q-tabs>
        <q-tab-panels v-model="activeTab">
          <q-tab-panel name="songs" class="q-pa-none">
            <q-card>
              <q-input filled dense bottom-slots v-model="searchText" @input="filterSongs">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
                <template v-slot:append v-if="searchText !== ''">
                  <q-icon name="close" @click="clearText()" />
                </template>
              </q-input>
              <q-card-section style="max-height: 600px; overflow:scroll">
                <q-list bordered>
                  <div v-for="(song,index) in songs" :key="index">
                    <q-item clickable v-ripple style="padding: 0px 16px;">
                      <q-menu touch-position context-menu>
                        <!-- Context Menu -->
                        <q-list dense style="min-width: 100px ">
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
                      <q-item-section @dblclick="openSong(song)">
                        <q-item-label>{{song.title}}</q-item-label>
                        <q-item-label caption>{{song.author}}</q-item-label>
                      </q-item-section>
                      <q-item-section top side></q-item-section>
                    </q-item>
                    <q-separator v-if="index < songs.length-1" />
                  </div>
                </q-list>
              </q-card-section>
            </q-card>
          </q-tab-panel>
          <!-- Songs -->
          <q-tab-panel name="announces" class="q-pa-none">
            <q-card>
              <q-card-section>
                <q-input
                  v-model="announceText"
                  filled
                  type="textarea"
                  label="Announce Text"
                  style="height:100px"
                />
              </q-card-section>
              <q-card-section>
                <q-input filled v-model="announceExpiry" readonly label="Expiry"  >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date 
                        v-model="announceExpiry" 
                        @input="() => $refs.qDateProxy.hide()"
                        mask="DD/MM/YYYY"
                         />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-card-section>
              <q-card-actions>
                <q-space />
                <q-btn flat color="primary" @click="saveAnnounce()">Add</q-btn>
              </q-card-actions>
            </q-card>
            <q-card class="q-ma-xs">
              <q-list bordered separator>
                <q-item
                  clickable
                  v-ripple
                  v-for="(announce, index) in announces"
                  :key="index"
                  @click="playSlide(announce,0)"
                >
                  <q-item-section>{{announce.text}}</q-item-section>
                  <q-item-label caption>Exp. {{announce.expiry}}</q-item-label>
                  <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                      <q-btn
                        class="gt-xs"
                        size="10px"
                        flat
                        dense
                        round
                        icon="delete"
                        @click="showDeleteNotify(announce.announceid)"
                      />
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <!-- Song List -->
      <div class="col-4 q-pa-md">
        <q-tabs v-model="activePlaylistTab" class="bg-purple text-white shadow-2 glossy">
          <q-tab name="currentPlaylist" icon="fas fa-clock" label="Current Playlist" />
          <q-tab name="cloudPlaylists" icon="fas fa-list" label="Cloud Playlists" >
            <q-badge v-show="cloudPlaylists.length>0" color="red" floating>{{cloudPlaylists.length}}</q-badge>
          </q-tab>
        </q-tabs>
        <q-tab-panels v-model="activePlaylistTab">
          <q-tab-panel name="currentPlaylist" class="q-pa-none">
            <q-input filled v-model="currentPlaylistTitle" label="Playlist Title" />
            <q-card>
              <q-card-section></q-card-section>
              <q-card-section>
                <q-list bordered>
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
                      @click="openSong(song)"
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
                          <q-badge color="purple" text-color="white" :floating="false" :label="index+1" />
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
      <!-- Playlist -->
      <div class="col-4 q-pa-md text-center">
        <div class="row">
          <q-card class="full-width">
            <q-toolbar class="bg-purple glossy text-white">
              <q-toolbar-title>Slides</q-toolbar-title>
              <q-btn flat round dense icon="fas fa-window-restore" @click="toggleSlideWindow()"></q-btn>
              <q-btn
                flat
                round
                dense
                icon="cancel_presentation"
                @click="toggleBlack()"
                :color="isBlack"
              />
            </q-toolbar>
            <q-card-section style="max-height: 600px; overflow:scroll">
              <div class="row q-pa-md justify-center">
                <div
                  v-for="(slide, index) in songParts"
                  :key="index"
                  class="col-auto slide"
                  v-bind:class="{'selectedSlide': selectedSlide(index)}"
                  @click="playSlide(slide,index)"
                >
                  <div class="centered">{{slide.text}}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <!-- Slides -->
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import { openURL } from "quasar";
import NewSongDialog from "../components/index/NewSongDialog";
//import QCode from "../components/index/QCode";
import draggable from "vuedraggable";
export default {
  name: "SlidesHome",
  components: { NewSongDialog, draggable },
  mounted() {
    this.getAnnounces();
    this.getCloudPlaylists();
    this.$renderer.send("open-slide-window");

    this.$root.$on("updateSongs", () => {
      console.log("UPDATE SONGS");
      this.getAllSongs();
    });
    this.$root.$on("closeEditor", () => {
      this.newSongDialog = false;
    });
    this.$root.$on("editSong", song => {
      this.songEdit = true;
      this.newSongDialog = true;
    });
    /*
    this.$root.$on("closeQCode", () => {
      this.showQCode = false;
    });
    */
    this.$bus.$on("loading-true", () => {
      this.loading = true;
    });
    this.$bus.$on("loading-false", () => {
      this.loading = false;
    });

    this.$root.$on("new-song", () => {
      this.newSong();
    });
    /*
    this.$root.$on("join-remote", () => {
      this.showQCode = true;
    });
*/
      this.$renderer.send('get-playlist')
    this.$renderer.on("playlist-data",(evt, playlist)=>{ 
      this.playlist = playlist;
    })  

    this.$ws.loadAllSongs().then(songs => {
      this.songs = songs;
    });
  },
  data() {
    return {
      loading: false,
      activeTab: "songs",
      activePlaylistTab: "currentPlaylist",
      showQCode: false,
      admin: true,
      newSongDialog: false,
      songEdit: false,
      slideWindow: true,
      leftDrawerOpen: false,
      searchText: "",
      selectedSlideText: null,
      selectedSlideIndex: null,
      selectedAnnounceID: null,
      black: false,
      alert: false,
      deleteSongID: null,
      version: "1.0.0",
      songs: [],
      playlist: {},
      playlistID: null,
      currentSong: null,
      songParts: [],
      announces: [],
      announceText: "",
      announceExpiry: null,
      currentPlaylistTitle: null,
      cloudPlaylists: []
    };
  },
  methods: {
    openURL,
     clearText(){
       let songs = this.$store.getters["defaultModule/getSongs"];
       this.searchText = ''
       this.songs = songs
    },
    newSong() {
      this.editSong = false;
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
      //his.songs = [];

      this.$ws.allSongs().then(songs => {
        this.songs = songs;

        // console.log(songs)
      });
    },
    openSong(song) {
      let sections = [];
      this.selectedSlideIndex = null;
      song.columns.forEach(element => {
        element.sections.forEach(section => {
          sections.push(section);
        });
      });
      this.songParts = sections;
    },
    editSong(song) {
      this.$root.$emit("editSong", song);
    },
    deleteSong() {
      this.$firestore
        .collection("songs")
        .doc(this.deleteSongID)
        .update({ deleted: true });

      this.getAllSongs();
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
    setCurrentSong(index) {
      // console.log("setCurrentSong");
      this.currentSong = index;
    },
    playSlide(slide, index) {
      this.selectedSlideText = slide.text;
      this.selectedSlideIndex = index;
      this.$renderer.send("slide", this.selectedSlideText)
      //this.$socket.emit("slide", this.selectedSlideText);
    },
    toggleBlack() {
      if (this.black === false) {
      
        this.$renderer.send("black", true)
        this.black = true;
      } else {
       this.$renderer.send("black", false)
        this.black = false;
      }
    },
    toggleSlideWindow() {
      if (this.slideWindow === true) {
        this.slideWindow = false;
        this.$renderer.send("hide-slide-window");
      } else {
        this.slideWindow = true;
        this.$renderer.send("show-slide-window");
      }
    },
    getAnnounces() {
      this.announces = [];
      this.$ws.getAnnounces().then(announces => {
        this.announces = announces;
      });
    },
    saveAnnounce() {
      let announce = {
        text: this.announceText,
        expiry: this.announceExpiry,
        createdBy: this.$store.getters["defaultModule/getDisplayName"],
        organizationID: this.$store.getters["defaultModule/getOrganizationID"]
      };
      this.$firestore.collection("announces").add(announce);
      this.announceText = "";
      this.announceExpiry = "";
      this.getAnnounces();
    },
    showDeleteNotify(id) {
      this.selectedAnnounceID = id;
      this.$q.notify({
        message: "Are you sure you want to delete this announce?",
        color: "negative",
        icon: "fas fa-exclamation-triangle",
        textColor: "white",
        position: "center",
        actions: [
          {
            label: "Yes",
            color: "yellow",
            handler: () => this.deleteAnnounce()
          },
          {
            label: "Dismiss",
            color: "white",
            handler: () => console.log("dismiss")
          }
        ]
      });
    },
    deleteAnnounce() {
      this.$firestore
        .collection("announces")
        .doc(this.selectedAnnounceID)
        .delete();
      this.getAnnounces();
    },
    selectedSlide(index) {
      return this.selectedSlideIndex === index;
    },
    getCloudPlaylists() {
      this.cloudPlaylists = [];
      this.$ws.cloudPlaylists().then(playlists => {
        this.cloudPlaylists = playlists;
      });
    },
    removeCloudPlaylist(id) {
      // console.log(id);
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
    }
  },
  computed: {
    isBlack() {
      return this.black === true ? "blue" : "white";
    }
  },
  watch: {
    searchText() {
      this.filterSongs(this.searchText);
    }
  }
};
</script>

<style>
.pageTitle {
  font-family: "damion";
  font-weight: bold;
}

.slide {
  position: relative;
  border-radius: 5px;
  background-color: black;
  color: white;
  font-size: 12px;
  text-align: center;
  text-transform: uppercase;
  margin: 5px;
  padding: 5px;
  width: 320px !important;
  height: 180px !important;
  justify-content: center;
  align-items: center;
  display: flex;
  white-space: pre-line;
}

.selectedSlide {
  border: 4px solid red;
}

.verse {
  font-weight: normal;
}
.chorus {
  font-weight: bold;
}
.prechorus {
  font-style: italic;
}
.bridge {
  font-weight: bold;
  font-style: italic;
}
</style>

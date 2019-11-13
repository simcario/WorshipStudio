<template>
  <q-page>
    <NewSongDialog :show="newSongDialog" :songEdit="songEdit" :songToEdit="songToEdit" />
    <ChordViewer :showChords="moduleSettings.showChords" :show="ChordViewer" />

    <q-toolbar class="bg-grey-4 glossy">
      <q-btn flat icon @click="TemplateEditorDialog=true">
        <q-icon name="fas fa-columns"></q-icon>
        <q-tooltip>New Template</q-tooltip>
      </q-btn>
      <q-btn flat icon @click="newSong()">
        <q-icon name="fas fa-music"></q-icon>
        <q-tooltip>New Song</q-tooltip>
      </q-btn>
    </q-toolbar>
    <splitpanes class="default-theme" style="height: 88vh">
      <pane size="25">
        <splitpanes horizontal>
          <pane class="bg-grey-5"></pane>
          <!-- Preview -->
          <pane>
            <q-tabs dense v-model="activeTab" class="bg-grey-6 shadow-2 glossy">
              <q-tab name="library" label="Library" />
              <q-tab name="currentPlaylist" label="Playlist" />
              <q-tab name="cloudPlaylists" label="Cloud Playlists">
                <q-badge
                  v-show="cloudPlaylists.length>0"
                  color="red"
                  floating
                >{{cloudPlaylists.length}}</q-badge>
              </q-tab>
            </q-tabs>
            <q-tab-panels v-model="activeTab">
              <!-- Library -->
              <q-tab-panel style="padding:0px; overflow:scroll" name="library">
                <q-input filled dense label="Search" v-model="searchText">
                  <template v-slot:prepend>
                    <q-icon name="fas fa-search" />
                  </template>
                  <template v-slot:append v-if="searchText !== ''">
                    <q-icon name="close" @click="clearText()" />
                  </template>
                </q-input>
                <q-list style="height:39vh">
                  <div v-for="(song,index) in songs" :key="index">
                    <q-item
                      clickable
                      v-ripple
                      :active="song.id === currentSong"
                      active-class="bg-teal-1 text-grey-8"
                      style="padding: 0px 16px;"
                      @click="openSong(song.songid)"
                    >
                      <q-menu touch-position context-menu>
                        <!-- Context Menu -->
                        <q-list dense style="min-width: 100px">
                          <q-item clickable v-close-popup @click="openSong(song.songid)">
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
                      <q-item-section @dblclick="openSongFull(song)">
                        <q-item-label>{{song.title}}</q-item-label>
                        <q-item-label caption>{{song.author}}</q-item-label>
                      </q-item-section>
                      <q-item-section top side>{{song.number}}</q-item-section>
                    </q-item>
                    <q-separator v-if="index < songs.length-1" />
                  </div>
                </q-list>
              </q-tab-panel>
              <!-- /Library -->
              <!--Playlist -->
              <q-tab-panel name="currentPlaylist" style="padding:0px; overflow:scroll">
                <q-list style="height:39vh">
                  <draggable
                    class="list-group"
                    tag="div"
                    v-model="playlist.items"
                    @end="$ws.updatePlaylist(playlist)"
                  >
                    <div v-for="(song,index) in playlist.items" :key="index">
                      <q-item
                        clickable
                        v-ripple
                        :active="song.songid === currentSong.songid"
                        active-class="bg-teal-1 text-grey-8"
                        style="padding: 0px 16px;"
                        @click="openPlaylistSong(index)"
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
                            <!--
                          <q-badge
                            color="purple"
                            text-color="white"
                            :floating="false"
                            :label="index+1"
                            />-->
                            {{song.title}}
                          </div>
                        </q-item-section>
                        <q-item-label caption>{{song.author}}</q-item-label>
                      </q-item>
                      <q-separator v-if="index < playlist.items.length-1" />
                    </div>
                  </draggable>
                </q-list>
              </q-tab-panel>
              <q-tab-panel name="cloudPlaylists" class="q-pa-none">
                <q-list bordered>
                  <div v-for="(pl, index) in cloudPlaylists" :key="index">
                    <q-item clickable v-ripple @dblclick="$ws.loadCloudPlaylist(pl)">
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
                    <q-separator v-if="index < cloudPlaylists.length-1" />
                  </div>
                </q-list>
              </q-tab-panel>
            </q-tab-panels>
          </pane>
          <!-- Library & Playlists -->
        </splitpanes>
      </pane>
      <!-- Left Panel -->

      <pane size="75" bg-grey-5>
        <splitpanes horizontal>
          <pane class="bg-grey-5 q-pa-xs">
            <q-card square style="height:100%; overflow:scroll">
              <!-- Song Items -->
              <q-card-section v-if="selectedSong !== undefined">
                <div class="row">
                  <div
                    class="col"
                    style="padding-left:20px; "
                    v-for="(column,index) in partPosition"
                    :key="index"
                  >
                    <div v-for="(section, i) in column" :key="i" class="sectionContainer">
                      <div
                        :style="{
                            'white-space': 'pre-line', 
                            'color':textStyle.chordsColor, 
                            'font-size': textStyle.size + 'px',
                             'font-weight': textStyle.chordsWeight,
                            'line-height': textStyle.size*2.2 + 'px',
                            'position': 'absolute',
                            }"
                        v-if="selectedSong.sections[section] !== undefined"
                      >{{transposedChords(selectedSong.sections[section].chords)}}</div>
                      <div
                        :style="{
                            'white-space': 'pre-line', 
                            'color':textStyle.textColor, 
                            'font-size': textStyle.size + 'px',
                            'font-weight': textStyle.textWeight,
                            'padding-top': textStyle.size + 'px',
                            'line-height': textStyle.size*2.2 + 'px',
 
                            }"
                        v-if="selectedSong.sections[section] !== undefined"
                        editable="true"
                      >{{selectedSong.sections[section].text}}</div>
                    </div>
                  </div>
                </div>
                <!-- Song Items -->
              </q-card-section>
            </q-card>
          </pane>
        </splitpanes>
      </pane>
      <!-- Right Panel -->
    </splitpanes>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import draggable from "vuedraggable";
import SlideThumb from "../components/SlideThumb";
import TemplateEditor from "../components/dialogs/TemplateEditor";
import NewSongDialog from "../components/index/NewSongDialog";
import ChordViewer from "../components/index/ChordViewer";
import TextViewer from "../components/index/TextViewer";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

export default {
  name: "Chords",
  components: {
    Splitpanes,
    Pane,
    SlideThumb,
    TemplateEditor,
    draggable,
    NewSongDialog,
    ChordViewer,
    TextViewer
  },
  mounted() {
    this.getCloudPlaylists();
    this.$root.$on("editSong", song => {
      this.songEdit = true;
      this.newSongDialog = true;
    });
    this.$root.$on("closeEditor", refresh => {
      this.newSongDialog = false;

      if (refresh === true) {
        this.reloadSongs();
      }
    });
    this.$bus.$on("loading", loading => {
      this.loading = loading;
    });
     this.$root.$on("closeChordViewer", () => {
      this.ChordViewer = false;
    });
     this.$renderer.on("song", evt => {
      this.ChordViewer = true;
    });

    this.reloadSongs();

    this.$renderer.send("get-playlist");

    this.$renderer.on("playlist-data", (evt, playlist) => {
      this.playlist = playlist;
    });
  },
  data() {
    return {
      activeTab: "library",
      activeTab2: "slide-templates",
      cloudPlaylists: [],
      currentSong: {},
      playlist: [],
      searchText: "",
      selectedSlideIndex: null,
      selectedPlaylistIndex: null,
      selectedTemplate: null,
      songList: this.$store.getters["defaultModule/getSongList"],
      songParts: [],

      songs: {},
      songToEdit: null,
      TemplateEditorDialog: false,
      transpose: 0,
      newSongDialog: false,
      ChordViewer: false,
      songEdit: false,
      loading: false
    };
  },
  methods: {
    reloadSongs() {
      this.$ws.allSongs().then(songs => {
        this.songs = songs;
      });
    },
    newSong() {
      this.songEdit = false;
      this.$root.$emit("newSong");
      this.newSongDialog = true;
      this.songToEdit = null;
    },
    openSong(id) {
      //let sections = [];
      this.selectedSlideIndex = null;
      this.currentSong = id;
      let song = this.songs[id];
      //this.currentSong = song.songid;
      /*
      song.columns.forEach(element => {
        element.sections.forEach(section => {
          sections.push(section);
        });
      });
      this.songParts = sections;
      */
    },
    openSongFull(song) {
      this.$renderer.send("song", song);
      //this.$root.$emit("song", song)
    },
    editSong(song) {
      this.$root.$emit("editSong", song);

      this.songToEdit = song;
    },
    filterSongs(filter) {
      this.$ws.filterSongs(filter).then(songs => {
        this.songList = songs;
      });
    },
    openPlaylistSong(index) {
      let sections = [];
      this.selectedPlaylistIndex = index;
      this.currentSong = this.playlist.items[index];
      this.currentSong.columns.forEach(element => {
        element.sections.forEach(section => {
          sections.push(section);
        });
      });
      this.songParts = sections;
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

    transposedChords(chords) {
      return this.$ws.transpose(
        chords,
        this.transpose,
        this.selectedSong.notation
      );
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
    deleteSong() {
      this.$ws.deleteSong(this.deleteSongID).then(() => {
       
        this.reloadSongs();
      })

    }
  },
  computed: {
    selectedSong() {
      return this.songs[this.currentSong];
    },
    partPosition() {
      if (!this.songLocalSettings.partPosition) {
        let partPosition = [[]];
        this.selectedSong.sections.forEach((section, index) => {
          partPosition[0].push(index);
        });
        return partPosition;
      } else {
        return this.songLocalSettings.partPosition;
      }
    },
    textStyle() {
      if (!this.songLocalSettings.textStyle) {
        return {
          size: 18,
            chordsColor: "red",
            textColor: "black",
            textWeight: "normal",
            chordsWeight: "bold"
        };
      } else {
        return this.songLocalSettings.textStyle;
      }
    },
    songLocalSettings() {
      let localSettings = this.$store.getters[
        "defaultModule/getSongsLocalSettings"
      ];

      return {
        partPosition:
          localSettings[this.currentSong] !== undefined &&
          localSettings[this.currentSong]["partPosition"] !== undefined
            ? localSettings[this.currentSong]["partPosition"]
            : null,
        textStyle:
          localSettings[this.currentSong] !== undefined &&
          localSettings[this.currentSong]["textStyle"] !== undefined
            ? localSettings[this.currentSong]["textStyle"]
            : null
      };
    },
    /*
    songs() {
      return this.$store.getters["defaultModule/getSongs"];
    },
    */
    moduleSettings() {
      return this.$store.getters["defaultModule/getModuleChords"];
    }
  },
  watch: {
    searchText() {
      this.$ws.filterSongs(this.searchText).then(ret => {
        this.songList = ret;
      });
    }
  }
};
</script>

<style lang="scss">
.splitpanes__pane {
}

.splitpanes__pane span {
  font-family: Helvetica, Arial, sans-serif;
  color: #fff;
  font-size: 5em;
  opacity: 0.6;
}
</style>
<style >
.toolbar-bg {
  background: linear-gradient(
    to bottom,
    rgba(199, 199, 199, 1) 0%,
    rgba(184, 184, 184, 1) 47%,
    rgba(120, 120, 120, 1) 100%
  );
}

.songText {
  color: #595959;
  font-size: 18px;
}
.songChords {
  position: absolute;
  white-space: pre;
}
.sectionContainer {
  position: relative;
  /* margin-bottom: 15px; */
  border-radius: 5px;
}
.sectionContainer:hover {
  background-color: #eaf6ff;
}
.selectedSection {
  border: 1px dotted #dddddd;
  border-radius: 5px;
}
.no-overflow {
  overflow: hidden;
}
.title {
  font-size: 18px;
  line-height: 40px;
  padding-top: 15px;
  font-size: 40px;
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

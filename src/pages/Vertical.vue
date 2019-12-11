<template>
  <q-page>
    <q-card class="q-pa-xs main-bg fixed-bottom" style="margin-bottom:21px;">
      <q-tab-panels
        v-model="tab"
        animated
        style="height:90vh; padding-top:55px"
      >
        <q-tab-panel name="songs" style="padding:0px">
          <q-list dark dense separator class="main-bg">
            <div v-for="(song, index) in songList" :key="index">
              <q-item
                clickable
                v-ripple
                :active="song._id === currentSong"
                active-class="bg-grey-8 text-white"
                style="padding: 0px 16px;"
                @click="openFullScreen(song._id)"
              >
                <q-menu touch-position context-menu>
                  <!-- Context Menu -->
                  <q-list dense style="min-width: 100px">
                    <q-item
                      clickable
                      v-close-popup
                      @click="openFullScreen(song_id,false)"
                    >
                      <q-item-section avatar>
                        <q-icon size="16px" name="fas fa-external-link-alt" />
                      </q-item-section>
                      <q-item-section>{{ $t("open") }}</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="editSong(song)">
                      <q-item-section avatar>
                        <q-icon size="16px" name="fas fa-edit" />
                      </q-item-section>
                      <q-item-section>{{ $t("edit") }}</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="openDeleteDialog(song._id)"
                    >
                      <q-item-section avatar>
                        <q-icon size="16px" name="fas fa-trash-alt" />
                      </q-item-section>
                      <q-item-section>{{ $t("delete") }}</q-item-section>
                    </q-item>
                    <q-separator />
  
                    <q-item
                      clickable
                      v-close-popup
                      @click="$root.$emit('add-to-playlist', song._id)"
                    >
                      <q-item-section avatar>
                        <q-icon size="16px" name="fas fa-list" />
                      </q-item-section>
                      <q-item-section>{{
                        $t("add_to_playlist")
                      }}</q-item-section>
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
        </q-tab-panel>

        <q-tab-panel name="playlist" style="padding:0px" class="bg-grey-9">
          <q-list dark class="bg-grey-9">
            <draggable
              class="list-group bg-grey-9"
              tag="div"
              v-model="playlist.items"
              @end="$ws.updatePlaylist(playlist)"
            >
              <div v-for="(song, index) in playlist.items" :key="index">
                <q-item
                  clickable
                  v-ripple
                  :active="song === currentSong"
                  active-class="bg-grey-8 text-white"
                  style="padding: 0px 16px;"
                  @click="openPlaylistSong(index)"
                  v-if="songList[song] !== undefined"
                >
                  <q-menu touch-position context-menu>
                    <!-- Context Menu -->
                    <q-list dense style="min-width: 100px">
                      <q-item
                        clickable
                        v-close-popup
                        @click="$ws.removeFromPlaylist(index)"
                      >
                        <q-item-section avatar>
                          <q-icon size="16px" name="fas fa-ban" />
                        </q-item-section>
                        <q-item-section>Remove</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                  <q-item-section>
                    <div>{{ songList[song].title }}</div>
                  </q-item-section>
                  <q-item-label caption>{{
                    songList[song].author
                  }}</q-item-label>
                  <q-item-section top side class="text-white">
                    {{ songList[song].number }}
                    <br />
                    <q-icon
                      flat
                      name="fas fa-volume-off"
                      size="12px"
                      v-show="
                        songsSettings[song] !== undefined &&
                          songsSettings[song].pad !== undefined
                      "
                    />
                  </q-item-section>
                </q-item>
                <q-separator v-if="index < playlist.items.length - 1" />
              </div>
            </draggable>
          </q-list>
        </q-tab-panel>

      </q-tab-panels>

      <q-separator />

      <q-tabs
        v-model="tab"
        dense
        class="bg-grey-3"
        align="justify"
        narrow-indicator
      >
        <q-tab name="songs" label="Songs" />
        <q-tab name="playlist" label="Playlists" />
      </q-tabs>
    </q-card>
<!-- ####################### EDIT/VIEW DIALOG ############################### -->
    <q-dialog
      v-model="ChordViewer"
      v-if="songToEdit !== null"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card v-if="currentSong !== null">
        <q-bar class="bg-grey-10 text-white">
          <q-space />
          <q-btn
            dense
            flat
            icon="fas fa-save"
            @click="saveSong()"
            v-show="songEdit === true"
          >
            <q-tooltip content-class="bg-white text-primary">Save</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" @click="closeChordViewer()">
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h4 text-center">{{ songToEdit.title }}</div>

          <draggable
            tag="div"
            class="column"
            style="height:88vh"
            v-model="songToEdit.sections"
          >
            <div
              class="col-auto sectionContainer"
              style="margin:0px"
              v-for="(section, index) in songToEdit.sections"
              :key="index"
              @click="selectedSection = index"
              v-bind:class="{
                selectedSection: selectedSection === index,
                visibleBorders: songEdit === true
              }"
            >
              <div
                :style="{
                  'white-space': 'pre-line',
                  color: textStyle.chordsColor,
                  'font-size': textStyle.size + 'px',
                  'font-weight': textStyle.chordsWeight,
                  'line-height': textStyle.size * 2.2 + 'px',
                  position: 'absolute'
                }"
                v-if="section !== undefined"
              >
                {{ transposedChords(section.chords) }}
              </div>
              <div
                :style="{
                  'white-space': 'pre-line',
                  color: textStyle.textColor,
                  'font-size': textStyle.size + 'px',
                  'font-weight': textStyle.textWeight,
                  'padding-top': textStyle.size + 'px',
                  'line-height': textStyle.size * 2.2 + 'px'
                }"
                editable="true"
              >
                {{ section.text }}
              </div>
            </div>
          </draggable>
          <!-- Song Items -->
        </q-card-section>
      </q-card>

  <vue-draggable-resizable
        :w="560"
        :h="360"
        :x="500"
        :y="100"
        :parent="true"
        class="no-overflow"
        drag-cancel=".nodrag"
        v-if="selectedSection !== undefined && songEdit === true"
      >
        <q-card style="width 50%;">
          <q-bar dark class="bg-primary text-white">
            <q-btn
              flat
              icon="fas fa-file"
              label="Add Section"
              @click="addSection"
            />
          </q-bar>
          <q-tabs dense v-model="selectedTab">
            <q-tab name="info" label="Song Info" icon="fas fa-info" />
            <q-tab name="style" label="Text Style" icon="fas fa-fill-drip" />
            <q-tab name="text" label="Text" icon="fas fa-font" />
            <q-tab name="chords" label="Chords" icon="fas fa-music" />
          </q-tabs>
          <q-tab-panels v-model="selectedTab">
            <q-tab-panel style="padding:0px" name="info">
              <q-card flat>
                <q-card-section>
                  <q-input
                    color="primary"
                    v-model="songToEdit.title"
                    filled
                    dense
                    placeholder="Title"
                    class="nodrag"
                  />
                </q-card-section>
                <q-card-section>
                  <q-input
                    color="primary"
                    v-model="songToEdit.original_title"
                    filled
                    dense
                    placeholder="Original Title"
                    class="nodrag"
                  />
                </q-card-section>
                <q-card-section>
                  <q-input
                    color="primary"
                    v-model="songToEdit.author"
                    filled
                    dense
                    placeholder="Author"
                    class="nodrag"
                  />
                </q-card-section>
                <q-card-section>
                  <div class="row">
                    <div class="col-6">
                      <q-input
                        color="primary"
                        v-model="songToEdit.number"
                        filled
                        dense
                        placeholder="Number"
                        class="nodrag"
                        style="margin-right:5px"
                      />
                    </div>
                    <div class="col-6">
                      <q-input
                        color="primary"
                        v-model="songToEdit.category"
                        filled
                        dense
                        placeholder="Category"
                        class="nodrag"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-tab-panel>
            <q-tab-panel name="style">
              <q-card flat>
                <div class="row">
                  <div class="col-4">
                    <q-btn-group outline>
                      <q-btn
                        outline
                        color="purple"
                        @click="selectedSongSettings.textStyle.size--"
                        icon="fas fa-minus"
                      />
                      <q-btn
                        outline
                        color="purple"
                        @click="selectedSongSettings.textStyle.size++"
                        icon="fas fa-plus"
                      />
                      <q-tooltip>Text Size</q-tooltip>
                    </q-btn-group>
                  </div>
                  <div class="col-4">
                    <q-btn-group push class="q-ma-xs">
                      <q-btn
                        dark
                        text-color="purple"
                        outline
                        unelevated
                        icon="fas fa-font"
                      >
                        <q-tooltip>Text Color</q-tooltip>
                        <div class="small-icon">
                          <q-icon name="fas fa-fill-drip" size="10px" />
                        </div>
                        <div
                          class="picker-result"
                          :style="{
                            'background-color':
                              selectedSongSettings.textStyle.textColor
                          }"
                        >
                          &nbsp;
                        </div>
                        <q-popup-proxy>
                          <q-color
                            v-model="selectedSongSettings.textStyle.textColor"
                            format-model="hexa"
                          />
                        </q-popup-proxy>
                      </q-btn>
                      <q-btn
                        outline
                        color="purple"
                        @click="textStyle.textWeight = 'bold'"
                        icon="fas fa-bold"
                      >
                        <q-tooltip>Text Bold</q-tooltip>
                      </q-btn>
                    </q-btn-group>
                    <q-btn-group>
                      <q-btn
                        dark
                        text-color="purple"
                        outline
                        unelevated
                        icon="fas fa-music"
                      >
                        <q-tooltip>Chords Color</q-tooltip>
                        <div class="small-icon">
                          <q-icon name="fas fa-fill-drip" size="10px" />
                        </div>
                        <div
                          class="picker-result"
                          :style="{
                            'background-color':
                              selectedSongSettings.textStyle.chordsColor
                          }"
                        >
                          &nbsp;
                        </div>
                        <q-popup-proxy>
                          <q-color
                            v-model="selectedSongSettings.textStyle.chordsColor"
                            format-model="hexa"
                          />
                        </q-popup-proxy>
                      </q-btn>
                    </q-btn-group>
                  </div>
                </div>
              </q-card>
            </q-tab-panel>
            <q-tab-panel style="padding:0px" name="text">
              <q-card flat>
                <q-card-section class="text-center">
                  <q-btn-toggle
                    v-model="songToEdit.sections[selectedSection].type"
                    size="sm"
                    push
                    flat
                    toggle-color="primary"
                    v-if="songToEdit.sections[selectedSection] !== undefined"
                    :options="[
                      { label: 'Verse', value: 'verse' },
                      { label: 'Chorus', value: 'chorus' },
                      { label: 'Pre-Chorus', value: 'prechorus' },
                      { label: 'Bridge', value: 'bridge' },
                      { label: 'Special', value: 'special' }
                    ]"
                  />
                </q-card-section>
                <q-card-section>
                  <q-input
                    color="primary"
                    filled
                    type="textarea"
                    placeholder="Enter text here"
                    class="nodrag"
                    v-if="songToEdit.sections[selectedSection] !== undefined"
                    v-model="songToEdit.sections[selectedSection].text"
                  />
                </q-card-section>
              </q-card>
            </q-tab-panel>
            <q-tab-panel style="padding:0px" name="chords">
              <q-card
                flat
                v-if="
                  currentSong !== null &&
                    songToEdit.sections.length > 0 &&
                    songToEdit.sections[selectedSection] !== undefined
                "
              >
                <q-card-section>
                  <q-input
                    color="primary"
                    filled
                    type="textarea"
                    placeholder="Enter chords here"
                    v-if="songToEdit.sections[selectedSection] !== undefined"
                    v-model="songToEdit.sections[selectedSection].chords"
                    class="nodrag"
                  />
                </q-card-section>
              </q-card>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
  </vue-draggable-resizable>
      <!-- Editor -->
    </q-dialog>
<!-- ####################### FINE EDIT/VIEW DIALOG ############################### -->
    <q-dialog v-model="playListNameDialog">
      <q-card style="min-width: 250px" class="bg-grey-8">
        <q-bar>Save Playlist</q-bar>
        <q-input
          dark
          dense
          v-model="currentPlaylistTitle"
          label="Playlist Title"
        ></q-input>
        <q-card-actions>
          <q-btn color="primary" @click="savePlaylist()">SAVE</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
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
import LeftDrawer from "../components/LeftDrawer";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import WaveSurfer from "wavesurfer.js";
import regions from "../../node_modules/wavesurfer.js/dist/plugin/wavesurfer.regions";
WaveSurfer.regions = regions;
export default {
  name: "Vertical",
  components: {
    Splitpanes,
    Pane,
    SlideThumb,
    TemplateEditor,
    draggable,
    NewSongDialog,
    ChordViewer,
    LeftDrawer
  },
  mounted() {
    window.addEventListener("keypress", this.bindKey);
    this.$renderer.send("close-slide-window");
    localStorage.setItem("startModule", "Chords");
    this.getCloudPlaylists();
    /*
    this.$root.$on("editSong", song => {
      this.songEdit = true;
      this.newSongDialog = true;
    });
  
    this.$root.$on("closeEditor", refresh => {
      this.newSongDialog = false;
      this.ChordViewer = false;
      if (refresh === true) {
        this.reloadSongs();
      }
    });
    */
    this.$root.$on("new-song", () => {
      this.newSong();
    });
    this.$root.$on("set-pad", name => {
      if (this.currentSong !== null) {
        this.$store.dispatch("defaultModule/setSongPad", {
          songID: this.currentSong,
          fileName: name
        });
      }
    });
    this.$root.$on("open-pad", name => {
      this.padLoading = true;

      this.waveName = name;
    });
    this.$renderer.send("send-me-files");
    this.$renderer.on("choose-pad", (e, data) => {
      Object.keys(this.wave.regions.list).forEach(region => {
        let waveInfo = {
          songID: data.data,
          fileName: data.filePath,
          region: {
            color: this.wave.regions.list[region].color,
            start: this.wave.regions.list[region].start,
            end: this.wave.regions.list[region].end,
            loop: true
          }
        };
        this.$store.dispatch("defaultModule/setSongPad", waveInfo);
      });
    });
    this.$renderer.on("library-folders", (e, folders) => {
      this.libraryFolders = folders;
    });
    this.$bus.$on("loading", loading => {
      this.loading = loading;
    });
    /*
    this.$root.$on("closeChordViewer", () => {
      this.ChordViewer = false;
    });
    this.$renderer.on("song", evt => {
      this.ChordViewer = true;
    });
*/
    //this.$renderer.send("get-playlist");
    this.reloadSongs()
    this.$renderer.on("F5", evt => {
      this.playlistSong(0);
    });
    this.$renderer.on("pagedown", evt => {
      this.nextSong();
    });
    this.$renderer.on("pageup", evt => {
      this.prevSong();
    });
  },
  data() {
    return {
      w: null,
      activeTab: "currentPlaylist",
      activeTab2: "slide-templates",
      tab: "songs",
      selectedTab: "info",
      playListNameDialog: false,
      cloudPlaylists: [],
      currentPlaylistTitle: null,
      currentPlaylistSongIndex: 0,
      currentSong: null,
      //playlist: [],
      searchText: "",
      selectedSection: null,
      selectedSlideIndex: null,
      selectedPlaylistIndex: null,
      selectedTemplate: null,
      songParts: [],
      wave: null,
      waveRegion: {},
      waveName: null,
      waveTitle: null,
      songs: {},
      allSongs: {},
      songToEdit: null,
      TemplateEditorDialog: false,
      transpose: 0,
      newSongDialog: false,
      ChordViewer: false,
      songEdit: false,
      loading: false,
      padLoading: false,
      libraryFolders: {}
    };
  },
  methods: {
    bindKey(e) {
      if (e.keyCode === 112) {
        if (this.wave !== null) {
          this.wave.playPause();
        }
      }
      if (e.keyCode === 43) {
        this.transpose++;
        this.$ws.createAlert("Transpose " + this.transpose);
      }
      if (e.keyCode === 45) {
        this.transpose--;
        this.$ws.createAlert("Transpose " + this.transpose);
      }
    },
    clearText() {
      this.searchText = "";
      this.$ws.allSongs().then(songs => (this.songs = songs));
    },
    reloadSongs() {
      this.$ws.allSongs("").then(songs => {
        this.songs = songs;
      });
    },
    newSong() {
      this.songEdit = false;
      this.$root.$emit("newSong");
      this.newSongDialog = true;
      this.songToEdit = null;
    },

    openFullScreen(id, edit) {
      this.$socket.emit("openSong", {
        sector: this.licenseInfo.sector,
        id: id,
        name: this.preferences.computerName
      });
      let path = "ViewEditSong/" + id + "/" + edit;

      this.$router.push({ path: path });
      return;
    },
    
   
    playlistSong(index) {
      this.currentPlaylistSongIndex = index;
      this.openFullScreen(this.allSongs[this.playlist.items[index]]);
      console.log(index);
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
    openPlaylistSong(index) {
      let sections = [];
      this.selectedPlaylistIndex = index;
      this.currentSong = this.playlist.items[index];
      this.openFullScreen(this.songList[this.playlist.items[index]]);
    },
    getCloudPlaylists() {
      this.cloudPlaylists = [];
      this.$ws.cloudPlaylists().then(playlists => {
        this.cloudPlaylists = playlists;
      });
    },
    savePlaylist() {
      this.$ws
        .savePlaylist(this.playlist, this.currentPlaylistTitle)
        .then(id => {
          this.getCloudPlaylists();
          this.playListNameDialog = false;
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
      });
    },
    addSection() {
      this.songToEdit.sections.push({
        type: "verse",
        text: "",
        chords: ""
      });

      this.selectedSection = this.songToEdit.sections.length - 1;
    },
    closeChordViewer() {
      (this.ChordViewer = false), (this.songToEdit = null);
    }
  },
  computed: {

  
    playlist() {
      return this.$parent.$parent.$parent.$data.playlist;
    },
    licenseInfo() {
      return this.$parent.$parent.$parent.$data.licenseInfo;
    },
    link() {
      return this.$parent.$parent.$parent.$data.link;
    },
    preferences() {
      return this.$parent.$parent.$parent.$data.preferences;
    },
    songList() {
      let obj = {};
      Object.keys(this.songs).forEach(key => {
        if (
          this.songs[key].searchref.indexOf(this.searchText.toLowerCase()) !==
          -1
        ) {
          obj[key] = this.songs[key];
        }
      });
      return obj;
    }
  },
  watch: {
    searchText() {}
  }
};
</script>

<style lang="scss">
.splitpanes__pane {
  background-color: #2c2c2c !important;
}

.splitpanes__pane span {
  font-family: Helvetica, Arial, sans-serif;
  color: #fff;
  font-size: 5em;
  opacity: 0.6;
}

.default-theme.splitpanes--vertical > .splitpanes__splitter,
.default-theme .splitpanes--vertical > .splitpanes__splitter {
  width: 9px;
  border-left: 1px solid #171616;
  margin-left: -1px;
}
.splitpanes.default-theme .splitpanes__splitter {
  background-color: #484848;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  position: relative;
}
</style>
<style scoped>
.songText {
  color: #595959;
  font-size: 18px;
}
.songChords {
  position: absolute;
  white-space: pre;
}
.visibleBorders {
  border: 1px dotted #dddddd;
}
.sectionContainer {
  /* margin-bottom: 15px; */
  border-radius: 5px;
}
.sectionContainer:hover {
  background-color: #eaf6ff;
  border: 1px dotted red;
}
.selectedSection {
  border-radius: 5px;
  background-color: #eaf6ff;
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

#waverform {
  width: 100%;
  overflow: hidden;
}
wave {
  overflow: hidden !important;
}
</style>

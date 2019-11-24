<template>
  <q-page>
    <NewSongDialog
      :show="newSongDialog"
      :songEdit="songEdit"
      :songToEdit="songToEdit"
      :chordViewer="ChordViewer"
    />
    <!--<ChordViewer :showChords="moduleSettings.showChords" :show="ChordViewer" />-->
    <LeftDrawer />

    <div class="q-pa-xs main-bg" style="height:100vh">
      <splitpanes class="default-theme" style="height: 88vh">
        <pane size="25">
          <splitpanes horizontal>
            <pane size="20">
              <q-card dark style="text-align:center;" class="bg-grey-9">
                <q-card-section>
                  <div class="text-h6">PAD Player</div>
                  <marquee direction="left">{{waveName}}</marquee>
                </q-card-section>
                <q-card-section style="padding:0px">
                  <div id="waveform"></div>
                </q-card-section>
                <q-card class="section text-center"></q-card>
                <q-inner-loading :showing="padLoading">
                  <q-spinner-bars size="50px" color="primary" />
                </q-inner-loading>
                <q-menu touch-position context-menu>
                  <!-- Context Menu -->
                  <q-list dense style="min-width: 100px">
                    <q-item clickable v-close-popup @click="setPad()" :disable="currentSong===null">
                      <q-item-section avatar>
                        <q-icon size="16px" name="fas fa-file-import" />
                      </q-item-section>
                      <q-item-section>Apply to song</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-card>
              <!-- Pad Player -->
            </pane>
            <pane size="40" style="display:flex">
              <q-card dark class="bg-grey-9" style="width:100%">
                <q-card-section style="height:20% ;padding:0px;overflow:hidden">
                  <q-input filled dense dark label="Search" v-model="searchText">
                    <template v-slot:prepend>
                      <q-icon name="fas fa-search" />
                    </template>
                    <template v-slot:append v-if="searchText !== ''">
                      <q-icon name="close" @click="clearText()" />
                    </template>
                  </q-input>
                </q-card-section>
                <q-card-section class="scroll" style="height:80% ;padding:0px;overflow-y:scroll">
                  <q-list dense>
                    <div v-for="(song,index) in songList" :key="index">
                      <q-item
                        clickable
                        v-ripple
                        :active="song.songid === currentSong"
                        active-class="bg-grey-8 text-white"
                        style="padding: 0px 16px;"
                        @click="openSong(song.songid)"
                        @dblclick="openFullScreen(song)"
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
                            <q-item clickable v-close-popup @click="$ws.addToPlaylist(song.songid)">
                              <q-item-section avatar>
                                <q-icon size="16px" name="fas fa-list" />
                              </q-item-section>
                              <q-item-section>Add to Playlist</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                        <q-item-section @dblclick="openSongFull(song)">
                          <q-item-label style="font-weight:bold">{{song.title}}</q-item-label>
                          <q-item-label caption class="text-white">{{song.author}}</q-item-label>
                        </q-item-section>
                        <q-item-section top side class="text-white">
                          {{song.number}}
                          <br />
                          <q-icon
                            flat
                            name="fas fa-volume-off"
                            size="12px"
                            v-show="songsSettings[song.songid] !== undefined && songsSettings[song.songid].pad !== undefined"
                          />
                        </q-item-section>
                      </q-item>
                      <q-separator v-if="index < songs.length-1" />
                    </div>
                  </q-list>
                </q-card-section>
              </q-card>
              <!-- Library-->
            </pane>
            <pane style="display:flex">
              <q-card class="bg-grey-9 fill" style="width:100%">
                <q-tabs
                  dense
                  v-model="activeTab"
                  class="bg-grey-9 shadow-2 glossy text-white"
                  style="height:20%"
                >
                  <q-tab name="currentPlaylist" label="Playlist" />
                  <q-tab name="cloudPlaylists" label="Cloud Playlists">
                    <q-badge
                      v-show="cloudPlaylists.length>0"
                      color="red"
                      floating
                    >{{cloudPlaylists.length}}</q-badge>
                  </q-tab>
                </q-tabs>
                <q-tab-panels v-model="activeTab" class="bg-grey-9" style="height:70%">
                  <!--Playlist -->
                  <q-tab-panel name="currentPlaylist" style="padding:0px; overflow-y:auto">
                    <q-list dark class="bg-grey-9">
                      <draggable
                        class="list-group bg-grey-9"
                        tag="div"
                        v-model="playlist.items"
                        @end="$ws.updatePlaylist(playlist)"
                      >
                        <div v-for="(song,index) in playlist.items" :key="index">
                          <q-item
                            clickable
                            v-ripple
                            :active="song === currentSong"
                            active-class="bg-grey-8 text-white"
                            style="padding: 0px 16px;"
                            @click="openPlaylistSong(index)"
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
                              <div>
                                <!--
                          <q-badge
                            color="purple"
                            text-color="white"
                            :floating="false"
                            :label="index+1"
                                />-->
                                {{songs[song].title}}
                              </div>
                            </q-item-section>
                            <q-item-label caption>{{songs[song].author}}</q-item-label>
                            <q-item-section top side class="text-white">
                              {{songs[song].number}}
                              <br />
                              <q-icon
                                flat
                                name="fas fa-volume-off"
                                size="12px"
                                v-show="songsSettings[song] !== undefined && songsSettings[song].pad !== undefined"
                              />
                            </q-item-section>
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
                <q-bar dark dense class="bg-grey-8">
                  <q-btn
                    flat
                    round
                    icon="fas fa-save"
                    color="white"
                    @click="playListNameDialog=true"
                  >
                    <q-tooltip>Save Playlist</q-tooltip>
                  </q-btn>
                </q-bar>
              </q-card>
              <!-- Playlists and Cloud -->
            </pane>
          </splitpanes>
        </pane>
        <pane size="75">
          <q-card style="height:88vh; overflow-y:auto">
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
    </div>
    <q-dialog v-model="playListNameDialog">
      <q-card style="min-width: 250px" class="bg-grey-8">
        <q-bar>Save Playlist</q-bar>
        <q-input dark dense v-model="currentPlaylistTitle" label="Playlist Title"></q-input>
        <q-card-actions>
          <q-btn color="primary" @click="$ws.savePlaylist(playlist, currentPlaylistTitle)">SAVE</q-btn>
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
  name: "Chords",
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

    this.getCloudPlaylists();
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
    this.$renderer.on("library-folders", (e, folders) => {
      this.libraryFolders = folders;
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
      w: null,
      activeTab: "currentPlaylist",
      activeTab2: "slide-templates",
      playListNameDialog: false,
      cloudPlaylists: [],
      currentPlaylistTitle: null,
      currentSong: null,
      playlist: [],
      searchText: "",
      selectedSlideIndex: null,
      selectedPlaylistIndex: null,
      selectedTemplate: null,
      songParts: [],
      wave: null,
      waveRegion: {},
      waveName: null,
      songs: {},
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
    openWave() {
      return new Promise(resolve => {
        var waversurfer = WaveSurfer.create({
          container: "#waveform",
          waveColor: "#D9DCFF",
          progressColor: "#4353FF",
          cursorColor: "#4353FF",
          barWidth: 3,
          barRadius: 3,
          cursorWidth: 1,
          height: 100,
          barGap: 3,
          pixelRatio: 1,
          responsive: true,
          plugins: [
            WaveSurfer.regions.create({
              regions: []
            })
          ]
        });

        resolve(waversurfer);
      });
    },
    setPad() {
      Object.keys(this.wave.regions.list).forEach(region => {
        let waveInfo = {
          songID: this.currentSong,
          fileName: this.waveName,
          region: {
            color: this.wave.regions.list[region].color,
            start: this.wave.regions.list[region].start,
            end: this.wave.regions.list[region].end,
            loop: true
          }
        };
        console.log(waveInfo);
        this.$store.dispatch("defaultModule/setSongPad", waveInfo);
      });
    },
    bindKey(e) {
      if (e.keyCode === 112) {
        if (this.wave !== null) {
          this.wave.playPause();
        }
      }
    },
    clearText() {
      this.searchText = "";
      this.$ws.allSongs().then(songs => (this.songs = songs));
    },
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
      this.selectedSlideIndex = null;
      this.currentSong = id;
      let song = this.songs[id];
    },
    openSongFull(song) {
      this.$renderer.send("song", song);
      //this.$root.$emit("song", song)
    },
    editSong(song) {
      this.$root.$emit("editSong", song);

      this.songToEdit = song;
    },
    openFullScreen(song) {
      this.ChordViewer = true;
      this.editSong(song);
    },
    filterSongs(filter) {
      this.$ws.filterSongs(filter).then(songs => {
        console.log("FILTERED", songs);
        this.songs = songs;
      });
    },
    openPlaylistSong(index) {
      let sections = [];
      this.selectedPlaylistIndex = index;
      this.currentSong = this.playlist.items[index];
      console.log(this.playlist.items[index]);
      this.openSong(this.currentSong);
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
      });
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
    pad() {
      return this.songLocalSettings.pad || null;
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
            : null,
        pad:
          localSettings[this.currentSong] !== undefined &&
          localSettings[this.currentSong]["pad"] !== undefined
            ? localSettings[this.currentSong]["pad"]
            : null
      };
    },

    songsSettings() {
      return this.$store.getters["defaultModule/getSongsLocalSettings"];
    },

    moduleSettings() {
      return this.$store.getters["defaultModule/getModuleChords"];
    },
    songList() {
      return this.songs;
    }
  },
  watch: {
    searchText() {
      this.$ws.filterSongs(this.searchText).then(ret => {
        this.songs = ret;
      });
    },

    pad: {
      deep: true,
      handler() {
        this.waveName = this.pad ? this.pad.filename : null;
      }
    },
    waveName() {
      // this.wave.destroy();
      if (this.wave !== null) {
        this.wave.stop();
        this.wave.destroy();
      }
      this.openWave().then(wave => {
        this.wave = wave;
        this.wave.load(this.libraryFolders.pads + "/" + this.waveName);
        this.padLoading = true;

        this.wave.on("ready", () => {
          this.padLoading = false;
          console.log("WAVEFORM READY WATCHER");
          this.wave.clearRegions();

          if (this.pad !== null) {
            console.log("waveName WATCHER pad null");

            this.wave.addRegion(this.pad.region);
          } else {
            this.wave.addRegion({
              start: 0,
              end: this.wave.getDuration(),
              color: "rgba(91, 96, 153, 0.21)",
              loop: true
            });
          }
        });
      });
    }
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
<style >
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

#waverform {
  width: 100%;
  overflow: hidden;
}
wave {
  overflow: hidden !important;
}
</style>

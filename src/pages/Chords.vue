<template>
  <q-page>
    <div class="q-pa-xs main-bg" style="height:100vh">
      <splitpanes class="default-theme" style="height: 88vh">
        <pane size="25">
          <splitpanes horizontal>
            <pane size="20">
              <q-card dark style="text-align:center;" class="bg-grey-9">
                <q-bar dense class="bg-grey-10">PAD Player </q-bar>
                <q-card-section v-if="wave !== null">
                  <marquee direction="left">{{ waveTitle }}</marquee>
                </q-card-section>
                <q-card-section style="padding:0px">
                  <div id="waveform"></div>
                  <q-inner-loading :showing="padLoading">
                    <q-spinner-bars size="50px" color="primary" />
                  </q-inner-loading>
                </q-card-section>
                <q-card class="section text-center"></q-card>

                <q-menu touch-position context-menu>
                  <!-- Context Menu -->
                  <q-list dense style="min-width: 100px">
                    <q-item
                      clickable
                      v-close-popup
                      @click="setPad()"
                      :disable="currentSong === null"
                    >
                      <q-item-section avatar>
                        <q-icon size="16px" name="fas fa-retweet" />
                      </q-item-section>
                      <q-item-section>{{
                        $t("save_loop_region")
                      }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-card>
              <!-- Pad Player --> </pane
            ><!-- Pad Player Pane -->
            <pane size="40" style="display:flex">
              <q-card dark class="bg-grey-9" style="width:100%">
                <q-bar dense class="bg-grey-10">{{ $t("library") }}</q-bar>
                <q-card-section
                  style="height:43px ;padding:0px;overflow:hidden"
                >
                  <q-input
                    filled
                    dense
                    dark
                    :label="$t('search')"
                    v-model="searchText"
                  >
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
                        @click="openSong(song._id)"
                        @dblclick="openFullScreen(song._id, false)"
                      >
                        <q-menu touch-position context-menu>
                          <!-- Context Menu -->
                          <q-list dense style="min-width: 100px">
                            <q-item
                              clickable
                              v-close-popup
                              @click="openFullScreen(song._id, false)"
                            >
                              <q-item-section avatar>
                                <q-icon
                                  size="16px"
                                  name="fas fa-external-link-alt"
                                />
                              </q-item-section>
                              <q-item-section>{{ $t("open") }}</q-item-section>
                            </q-item>
                            <q-item
                              clickable
                              v-close-popup
                              @click="openFullScreen(song._id, true)"
                            >
                              <q-item-section avatar>
                                <q-icon size="16px" name="fas fa-edit" />
                              </q-item-section>
                              <q-item-section>{{ $t("edit") }}</q-item-section>
                            </q-item>
                            <q-item
                              clickable
                              v-close-popup
                              @click="openDeleteDialog(song)"
                            >
                              <q-item-section avatar>
                                <q-icon size="16px" name="fas fa-trash-alt" />
                              </q-item-section>
                              <q-item-section>{{
                                $t("delete")
                              }}</q-item-section>
                            </q-item>
                            <q-separator />
                            <q-item
                              clickable
                              v-close-popup
                              @click="openPad(song._id)"
                            >
                              <q-item-section avatar>
                                <q-icon size="16px" name="fas fa-volume-off" />
                              </q-item-section>
                              <q-item-section>{{
                                $t("choose_pad")
                              }}</q-item-section>
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
                </q-card-section>
              </q-card>
              <!-- Library-->
            </pane>
            <!-- Library Pane -->
            <pane style="display:flex">
              <q-card class="bg-grey-9 fill" style="width:100%">
                <q-tabs
                  dense
                  v-model="activeTab"
                  class="bg-grey-9 shadow-2 glossy text-white"
                  style="height:40px"
                >
                  <q-tab name="currentPlaylist" label="Playlist" />
                  <q-tab name="cloudPlaylists" label="Cloud Playlists">
                    <q-badge
                      v-show="cloudPlaylists.length > 0"
                      color="red"
                      floating
                      >{{ cloudPlaylists.length }}</q-badge
                    >
                  </q-tab>
                </q-tabs>
                <q-tab-panels
                  v-model="activeTab"
                  class="bg-grey-9"
                  style="height:70%"
                >
                  <!--Playlist -->
                  <q-tab-panel
                    name="currentPlaylist"
                    style="padding:0px; overflow-y:auto"
                  >
                    <q-list dark class="bg-grey-9">
                      <draggable
                        class="list-group bg-grey-9"
                        tag="div"
                        v-model="playlist.items"
                        @end="$ws.updatePlaylist(playlist)"
                      >
                        <div
                          v-for="(song, index) in playlist.items"
                          :key="index"
                        >
                          <q-item
                            clickable
                            v-ripple
                            :active="song === currentSong"
                            active-class="bg-grey-8 text-white"
                            style="padding: 0px 16px;"
                            @click="openPlaylistSong(index)"
                            v-if="selectedSong !== undefined"
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
                              <div>{{ selectedSong.title }}</div>
                            </q-item-section>
                            <q-item-label caption>{{
                              selectedSong.author
                            }}</q-item-label>
                            <q-item-section top side class="text-white">
                              {{ selectedSong.number }}
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
                          <q-separator
                            v-if="index < playlist.items.length - 1"
                          />
                        </div>
                      </draggable>
                    </q-list>
                  </q-tab-panel>
                  <q-tab-panel name="cloudPlaylists" class="q-pa-none">
                    <q-list dark>
                      <div v-for="(pl, index) in cloudPlaylists" :key="index">
                        <q-item
                          clickable
                          v-ripple
                          @dblclick="$ws.loadCloudPlaylist(pl)"
                        >
                          <q-menu touch-position context-menu>
                            <!-- Context Menu -->
                            <q-list dense style="min-width: 100px">
                              <q-item
                                clickable
                                v-close-popup
                                @click="removeCloudPlaylist(pl.id)"
                              >
                                <q-item-section avatar>
                                  <q-icon size="16px" name="fas fa-trash-alt" />
                                </q-item-section>
                                <q-item-section>Delete</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                          <q-item-section>
                            <q-item-label>{{ pl.name }}</q-item-label>
                            <q-item-label caption>
                              {{ $t("created_by") }}
                              <strong>{{ pl.createdBy }}</strong>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-separator v-if="index < cloudPlaylists.length - 1" />
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
                    @click="playListNameDialog = true"
                  >
                    <q-tooltip>{{ $t("save_playlist") }}</q-tooltip>
                  </q-btn>
                </q-bar>
              </q-card>
              <!-- Playlists and Cloud -->
            </pane>
            <!-- Playlist Pane -->
          </splitpanes>
        </pane>
        <pane size="75">
          <q-card style="height:88vh; overflow-y:scroll">
            <q-card-section v-if="currentSong !== null">
              <div class="column" style="height:88vh; ">
                <div
                  class="col-auto  q-pb-md"
                  style="margin:0px"
                  v-for="(section, index) in selectedSong.sections"
                  :key="index"
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
                    {{ transposeChords[index] }}
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
    created(){
      document.addEventListener("keypress", this.bindKey);
  },
  destroyed(){
      document.removeEventListener("keypress", this.bindKey);
  },
  mounted() {
    this.reloadSongs();
    this.$renderer.send("close-slide-window");
    this.getCloudPlaylists();
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
      this.$pouchSongsPref
        .find({
          selector: { songID: this.currentSong }
        })
        .then(res => {
          if (res.docs.length === 0) {
            this.$pouchSongsPref
              .post({
                songID: data.data,
                fileName: data.filePath
              })
              .then(doc => {
              
                this.applyWave({
                  fileName: data.filePath
                });
              });
          }
        });
    });

    this.$bus.$on("loading", loading => {
      this.loading = loading;
    });

    
  },
  sockets: {
    connect: function() {
      console.log("socket connected from chords");
    },
    openSong: function(data) {
      console.log("SOCKET FULL SCREEN");
      if (this.link === true) {
        this.$q.notify({
          message: data.name + " has selected current song!",
          position: "center"
        });
        this.openFullScreen(data.id, false);
      }
    }
  },
  data() {
    return {
      w: null,
      activeTab: "currentPlaylist",
      activeTab2: "slide-templates",
      allSongs: {},
      cloudPlaylists: [],
      ChordViewer: false,
      currentPlaylistTitle: null,
      currentPlaylistSongIndex: 0,
      currentSong: null,
      currentSongRef: null,

      loading: false,
      newSongDialog: false,
      padLoading: false,
      playListNameDialog: false,
      searchText: "",
      selectedSection: null,
      selectedSlideIndex: null,
      selectedPlaylistIndex: null,
      selectedSong:null,
      selectedTab: "info",
      selectedTemplate: null,
      songs: {},
      songEdit: false,
      songNew: false,
      songParts: [],
      songToEdit: {},
      wave: null,
      waveRegion: {},
      waveName: null,
      waveTitle: null,
      TemplateEditorDialog: false,
      transpose: 0
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
    applyWave(pad) {
      let padArray;
      if (this.wave !== null) {
        this.wave.stop();
        this.wave.destroy();
      }
      this.openWave().then(wave => {
        this.wave = wave;
        this.wave.load(pad.fileName);
        this.padLoading = true;
        this.$bus.$emit("status", {
          message: "Loading pad file ...",
          color: "yellow",
          textColor: "black"
        });
        this.wave.on("ready", () => {
          this.$bus.$emit("status", {
            message: "Pad file ready!"
          });
          this.padLoading = false;
          console.log("WAVEFORM READY WATCHER");
          this.wave.clearRegions();

          if (pad.region !== undefined && pad.region !== null) {
            console.log("waveName WATCHER not null");

            this.wave.addRegion(pad.region);
          } else {
            console.log("waveName WATCHER NULL");
            this.wave.addRegion({
              start: 0,
              end: this.wave.getDuration(),
              color: "rgba(91, 96, 153, 0.21)",
              loop: true
            });
          }
        });

        this.wave.on("error", err => {
          this.padLoading = false;
          console.log(err);
          this.$bus.$emit("status", {
            message: "Pad not found",
            color: "red"
          });
        });
      });
    },
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
    setPad() {
      let record = this.currentSongRef;

      Object.keys(this.wave.regions.list).forEach(regionk => {
        record.region = {
          color: this.wave.regions.list[regionk].color,
          start: this.wave.regions.list[regionk].start,
          end: this.wave.regions.list[regionk].end,
          loop: true
        };
        this.$pouchSongsPref.put(record);
      });
    },
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
      this.$ws.allSongs("").then(songs => (this.songs = songs));
    },
    reloadSongs() {
      this.$ws.allSongs("").then(songs => {
        this.songs = songs;
      });
    },
    openSong(id) {
      this.selectedSlideIndex = null;
      this.currentSong = id;
    },
    editSong(song) {
      this.songEdit = true;
      this.songToEdit = JSON.parse(JSON.stringify(song));

      this.ChordViewer = true;
      this.currentSong = song.songid;
    },
    saveSong() {
      let song = {};
      song = this.songToEdit;
      if (this.songEdit === false) {
        let searchref = song.title;

        song.sections.forEach(section => {
          searchref = searchref + " " + section.text;
        });
        song.searchref = searchref.toLowerCase();
        song.organizationID = this.licenseInfo.licenseID;
        song.email = this.licenseInfo.userEmail;
        this.$pouchSongs
          .post(song)
          .then(doc => console.log("DOCUMENT INSERTED", doc));
      } else {
        this.$pouchSongs
          .put(song)
          .then(doc => console.log("DOCUMENT UPDATED", doc));
      }

      this.$root.$emit("reload-songs");
      this.closeChordViewer();
      this.$q.notify({
        message: "Song was saved",
        color: "positive"
      });
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
   
      this.$ws.getSong(this.playlist.items[index]).then(song=>{
         this.openFullScreen(song._id, false);
      })
     
     
    
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
      this.$ws.getSong(this.playlist.items[index]).then(song=>{
       this.openFullScreen(song._id, false);
     })
     
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
            handler: () => this.deleteSong(song)
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
  computed: {
    transposeChords() {
      let parts = [];
      this.selectedSong.sections.forEach(section => {
        // Start Transpose

        var txtChords = section.chords.toLowerCase();
        const chords = {
            anglo: {
              c: ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"],
              "c#": ["c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b", "c"],
              db: ["db", "d", "eb", "e", "f", "gb", "g", "ab", "a", "bb", "b", "c"],
              d: ["d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b", "c", "c#"],
              "d#": ["d#", "e", "f", "f#", "g", "g#", "a", "a#", "b", "c", "c#", "d"],
              eb: ["eb", "e", "f", "gb", "g", "ab", "a", "bb", "b", "c", "db", "d"],
              e: ["e", "f", "f#", "g", "g#", "a", "a#", "b", "c", "c#", "d", "d#"],
              f: ["f", "f#", "g", "g#", "a", "a#", "b", "c", "c#", "d", "d#", "e"],
              "f#": ["f#", "g", "g#", "a", "a#", "b", "c", "c#", "d", "d#", "e", "f"],
              gb: ["gb", "g", "ab", "a", "bb", "b", "c", "db", "d", "eb", "e", "f"],
              g: ["g", "g#", "a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#"],
              "g#": ["g#", "a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g"],
              ab: ["ab", "a", "bb", "b", "c", "db", "d", "eb", "e", "f", "gb", "g"],
              a: ["a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#"],
              "a#": ["a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a"],
              bb: ["bb", "b", "c", "db", "d", "eb", "e", "f", "gb", "g", "ab", "a"],
              b: ["b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#"]
            },
            latin: {
              do:["do","do#","re","re#","mi","fa","fa#","sol","sol#","la","la#","si"],
              "do#":["do#","re","re#","mi","fa","fa#","sol","sol#","la","la#","si","do"],
              reb:["reb","re","mib","mi","fa","solb","sol","lab","la","sib","si","do"],
              re:["re","re#","mi","fa","fa#","sol","sol#","la","la#","si","do","do#"],
              "re#":["re#","mi","fa","fa#","sol","sol#","la","la#","si","do","do#","re"],
              mib:["mib","mi","fa","solb","sol","lab","la","sib","si","do","reb","re"],
              mi:["mi","fa","fa#","sol","sol#","la","la#","si","do","do#","re","re#"],
              fa:["fa","fa#","sol","sol#","la","la#","si","do","do#","re","re#","mi"],
              "fa#":["fa#","sol","sol#","la","la#","si","do","do#","re","re#","mi","fa"],
              solb:["solb","sol","lab","la","sib","si","do","reb","re","mib","mi","fa"],
              sol:["sol","sol#","la","la#","si","do","do#","re","re#","mi","fa","fa#"],
              "sol#":["sol#","la","la#","si","do","do#","re","re#","mi","fa","fa#","sol"],
              lab:["lab","la","sib","si","do","reb","re","mib","mi","fa","solb","sol"],
              la:["la","la#","si","do","do#","re","re#","mi","fa","fa#","sol","sol#"],
              "la#":["la#","si","do","do#","re","re#","mi","fa","fa#","sol","sol#","la"],
              sib:["sib","si","do","reb","re","mib","mi","fa","solb","sol","lab","la"],
              si:["si","do","do#","re","re#","mi","fa","fa#","sol","sol#","la","la#"]}
          };
        let configChords = chords[this.$config.notation];

        const extensions = [
          "m",
          "m7",
          "7",
          "dim",
          "sus4",
          "sus9",
          "9",
          "11",
          "13"
        ];

        const chordTranslate = {
          anglo: {
            do: "c",
            "do#": "c#",
            reb: "db",
            re: "d",
            "re#": "d#",
            mib: "eb",
            mi: "e",
            fa: "f",
            "fa#": "f#",
            solb: "gb",
            sol: "g",
            "sol#": "g#",
            lab: "ab",
            la: "a",
            "la#": "a#",
            sib: "bb",
            si: "b"
          },
          latin: {
            c: "do",
            "c#": "do#",
            db: "reb",
            d: "re",
            "d#": "re#",
            eb: "mib",
            e: "mi",
            f: "fa",
            "f#": "fa#",
            gb: "solb",
            g: "sol",
            "g#": "sol#",
            ab: "lab",
            a: "la",
            "a#": "la#",
            bb: "sib",
            b: "si"
          }
        };

        const lines = txtChords.split("\n");
        let newline = "";
        lines.forEach(line => {
          const chords = line.split(" ");

          chords.forEach(fullChord => {
            if (fullChord === "") {
              newline += "\xa0";
            } else {
              const chordParts = fullChord.split("/");

              chordParts.forEach((chordPart, index) => {
                let found = false;
                let newChord;
                let ext;
                let chordExtension = false;
                let chord;
                extensions.forEach(extension => {
                  if (
                    chordPart.substr(chordPart.length - extension.length) ===
                    extension
                  ) {
                    chord = chordPart.replace(extension, "");
                    chordExtension = true;
                    ext = extension;
                  }
                });

                if (chordExtension === false) {
                  chord = chordPart;
                  ext = "";
                }
                let currentNotation;
                if (chordTranslate.anglo[chord] !== undefined) {
                  currentNotation = "latin";
                } else {
                  currentNotation = "anglo";
                }

                if (currentNotation !== this.$config.notation) {
                  chord = chordTranslate[this.$config.notation][chord];
                }
                if (configChords[chord] !== undefined) {
                  newChord = configChords[chord][this.transpose];
                } else {
                  if (currentNotation === "latin") {
                    newChord = configChords["do"][this.transpose];
                  } else {
                    newChord = "{err}";
                  }
                }

                newChord = newChord + ext;
                newChord = newChord.charAt(0).toUpperCase() + newChord.slice(1);

                newline += newChord;

                if (chordParts.length > 1 && index === 0) {
                  newline += "/";
                }
              });
            }
          });

          newline += "\n";
        });

        parts.push(newline);
      });
      return parts;
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
    playlist() {
      return this.$parent.$parent.$parent.$data.playlist;
    },
  

    textStyle() {
      return {
        size: 18,
        chordsColor: "red",
        textColor: "black",
        textWeight: "normal",
        chordsWeight: "bold"
      };
    },

  
  },
  watch: {
    searchText() {
      this.$ws.allSongs(this.searchText).then(songs => {
        this.songs = songs;
      });
    },
    currentSong() {
      this.$ws.getSong(this.currentSong).then(song=>{
          return this.selectedSong = song
        })
      this.$pouchSongsPref
        .find({
          selector: { songID: this.currentSong }
        })
        .then(data => {
          const pad = data.docs[0] !== undefined ? data.docs[0] : null;
          this.currentSongRef = data.docs[0];

          if (pad !== null) {
            if (this.wave !== null) {
              this.wave.stop();
              this.wave.destroy();
            }
            this.applyWave(pad);
          }
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
<style scoped>
.songText {
  font-size: 18px;
  padding-top: 18px;
  line-height: 39.6px;
}
.songChords {
  position: absolute;
  font-size: 18px;
  line-height: 39.6px;
  color: red;
  font-weight: bold;
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

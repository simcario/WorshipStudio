<template>
  <q-page>
    <splitpanes class="default-theme" style="height: 97vh">
      <pane size="25">
        <q-card dark style="text-align:center; height:20vh" class="bg-grey-9">
          <q-bar dense class="bg-grey-10">PAD Player </q-bar>
          <q-card-section style="padding:5px 0px" v-if="wave !== null">
            <marquee direction="left">{{ waveName }}</marquee>
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
                <q-item-section>{{ $t("save_loop_region") }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-card>

        <Library />

        <q-card class="bg-grey-9 fill" style="width:100%; height:29vh">
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
              <q-list dense dark class="bg-grey-9">
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
                      dense
                      :active="song === currentSong"
                      active-class="bg-grey-8 text-white"
                      style="padding: 0px 16px;"
                      @click="playlistSong(index)"
                    >
                      <q-menu touch-position context-menu>
                        <!-- Context Menu -->
                        <q-list dense style="min-width: 100px">
                          <q-item
                            clickable
                            v-close-popup
                            @click="removeFromPlaylist(index)"
                          >
                            <q-item-section avatar>
                              <q-icon size="16px" name="fas fa-ban" />
                            </q-item-section>
                            <q-item-section>Remove</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                      <q-item-section>
                        <div>{{ song.title }}</div>
                      </q-item-section>
                      <q-item-label caption>{{ song.author }}</q-item-label>
                      <q-item-section top side class="text-white">
                        {{ song.number }}
                      </q-item-section>
                    </q-item>
                    <q-separator v-if="index < playlist.items.length - 1" />
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
                    @dblclick="$ws.loadCloudPlaylist(pl).then(()=>{activeTab = 'currentPlaylist'})"
                  >
                    <q-menu touch-position context-menu>
                      <!-- Context Menu -->
                      <q-list dense style="min-width: 100px">
                        <q-item
                          clickable
                          v-close-popup
                          @click="removeCloudPlaylist(pl)"
                          v-if="
                            licenseInfo.userProfile === 'superadmin' ||
                              licenseInfo.userProfile === 'admin' ||
                              licenseInfo.userProfile === 'worshipleader'
                          "
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
              v-if="
                licenseInfo.userProfile === 'superadmin' ||
                  licenseInfo.userProfile === 'admin' ||
                  licenseInfo.userProfile === 'worshipleader'
              "
            >
              <q-tooltip>{{ $t("save_playlist") }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              icon="fas fa-ban"
              color="white"
              @click="playlist.items = []"
            >
              <q-tooltip>{{ $t("clear_playlist") }}</q-tooltip>
            </q-btn>
          </q-bar>
        </q-card>
      </pane>
      <pane size="75">
        <!--
        <q-tabs dense v-model="selectedViewTab" class="text-white">
          <q-tab
            name="preview"
            icon="far fa-file-image"
            :label="$t('preview')"
          /> 
          <q-tab name="alarms" icon="fas fa-stream" label="Multitracks" /> 
        </q-tabs> -->
        <q-tab-panels v-model="selectedViewTab">
          <q-tab-panel name="preview" style="padding:0px">
            <q-card style="overflow:scroll; height:95vh"  ref="printMe">
              <q-card-section
                v-if="currentSong !== null"
                class="q-pa-xs"
               
              >
                <div style="text-align:center">
                  <h4>{{ selectedSong.title }}</h4>
                </div>
                <div class="row" v-if="selectedSong !== null">
                  <div
                    class="col-12  q-pb-md"
                    style="margin:0px"
                    v-for="(section, index) in selectedSong.sections"
                    :key="index"
                  >
                    <nl2br
                      v-if="preferences.showChords === true"
                      tag="div"
                      :text="transposeChords[index]"
                      class-name="songChords"
                    />

                    <nl2br
                      tag="div"
                      :text="section.text"
                      :class-name="
                        preferences.showChords === false
                          ? 'songTextNoChords ' + section.type
                          : 'songText ' + section.type
                      "
                    />
                  </div>
                </div>
               
                <!-- Song Items -->
              </q-card-section>

              <q-btn-group
                rounded
                style="margin-bottom:30px;"
                class="fixed-bottom-right"
                :class="{ trasparency: !isHovering }"
                @mouseenter="isHovering = true"
                @mouseleave="isHovering = false"
              >
                <q-btn
                  color="red"
                  rounded
                  glossy
                  icon="fab fa-youtube"
                  v-if="
                    selectedSong !== null && selectedSong.youtube !== undefined
                  "
                  @click="$renderer.send('open-link', selectedSong.youtube)"
                />
                <q-btn
                  color="orange"
                  rounded
                  glossy
                  icon="fab fa-soundcloud"
                  v-if="
                    selectedSong !== null &&
                      selectedSong.soundcloud !== undefined
                  "
                  @click="$renderer.send('open-link', selectedSong.soundcloud)"
                />
              </q-btn-group>
             
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </pane>
    </splitpanes>

    <q-dialog v-model="playListNameDialog">
      <q-card style="min-width: 250px" class="bg-grey-8">
        <q-bar>Save Playlist</q-bar>
        <q-input
          dark
          dense
          v-model="playlist.name"
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
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import WaveSurfer from "wavesurfer.js";
import regions from "../../node_modules/wavesurfer.js/dist/plugin/wavesurfer.regions";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
WaveSurfer.regions = regions;
export default {
  name: "Chords",
  components: {
    Splitpanes,
    Pane,
    Library: () => import("../components/Library"),
    draggable: () => import("vuedraggable")
  },
  created() {
    document.addEventListener("keypress", this.bindKey);
  },
  destroyed() {
    document.removeEventListener("keypress", this.bindKey);
  },
  beforeDestroy() {
    this.$root.$off("edit-song");
    this.$root.$off("library-single-click");
    this.$root.$off("library-double-click");
  },

  mounted() {
    this.$renderer.on("F5", evt => {
      this.playlistSong(0);
    });

    this.$renderer.send("hide-slide-window");
    this.getCloudPlaylists();
    this.$bus.$on("loadplaylist", () => {
      this.getCloudPlaylists();
    });
    this.$root.$once("set-pad", name => {
      if (this.currentSong !== null) {
        this.$store.dispatch("defaultModule/setSongPad", {
          songID: this.currentSong,
          fileName: name
        });
      }
    });
     this.$root.$on("print-version", version => {
       console.log('print-verion')
       this.selectedSong.sections = version.sections
    });
    this.$root.$once("open-pad", name => {
      this.padLoading = true;
      this.waveName = name;
    });
    this.$root.$on("library-single-click", id => {
     
      this.$store.dispatch("defaultModule/setCurrentSong", id);
      
      this.openSong(id);
    });
    this.$root.$on("library-print", id => {
      this.$store.dispatch("defaultModule/setCurrentSong", id);
      
      this.openSong(id).then(() => {
        this.print();
      });
    });
    this.$root.$once("library-double-click", id => {
   
      this.openFullScreen(id, false);
    });
    this.$root.$once("edit-song", id => {
      this.openFullScreen(id, true);
    });
    this.$root.$once("reader", id => {
      this.openReader(id);
    });
    this.$bus.$once("update-playlist", playlist => {
      this.currentPlaylistTitle = playlist.name; //TODO Update playlist (with ID) ad replicate on Slides
      this.playlist = playlist;
      sessionStorage.setItem("playlist", JSON.stringify(playlist));
    });

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
          } else {
            let doc = res.docs[0];
            doc.fileName = data.filePath;
            this.$pouchSongsPref.put(doc).then(() => {
              this.applyWave({
                fileName: data.filePath
              });
            });
          }
        });
    });

    this.$bus.$once("loading", loading => {
      this.loading = loading;
    });

    this.$bus.$on("linkAction", action => {
      if (
        action.doc.actions.openSong !== undefined &&
        action.doc.actions.openSong.computer !==
          this.preferences.computerName &&
        this.link === true
      ) {
        this.$q.notify(
          action.doc.actions.openSong.computer + " ha aperto un brano"
        );
        this.openFullScreen(action.doc.actions.openSong.songID, false);
      }
    });
  },
  sockets: {
    connect: function() {
      console.log("socket connected from chords");
    },
    openSong: function(data) {
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
      cloudPlaylists: [],
      currentPlaylistTitle: null,
      currentSong: null,
      currentSongRef: null,
      isHovering: false,
      loading: false,
      newSongDialog: false,
      padLoading: false,

      playListNameDialog: false,
      searchText: "",
      selectedSection: null,
      selectedSlideIndex: null,
      selectedPlaylistIndex: null,
      selectedSong: null,
      selectedViewTab: "preview",
      selectedTab: "info",
      selectedTemplate: null,
      //songs: {},
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

          this.wave.clearRegions();

          if (pad.region !== undefined && pad.region !== null) {
            this.wave.addRegion(pad.region);
          } else {
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
      if (e.keyCode === 42) {
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

    openSong(id) {
      return new Promise((res, rej) => {
        this.selectedSlideIndex = null;
        this.currentSong = id;
        res("ok");
      });
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
      /*
      this.$socket.emit("openSong", {
        sector: this.licenseInfo.sector,
        id: id,
        name: this.preferences.computerName
      });
      */
      this.$ws.linkAction({
        action: "openSong",
        songID: id,
        computerName: this.preferences.computerName,
        sector: this.licenseInfo.sector
      });

      let path = "ViewEditSong/" + id + "/" + edit + "/" + this.link;

      this.$router.push({ path: path });
      return;
    },

    playlistSong(index) {
      console.log(
        "selectedVErsion",
        this.playlist.items[index].selectedVersion
      );
      let selectedVersion =
        this.playlist.items[index].selectedVersion !== undefined
          ? this.playlist.items[index].selectedVersion
          : null;
      this.$store.dispatch("defaultModule/setPlaylistIndex", index);
      this.$store.dispatch("defaultModule/setSongVersion", selectedVersion);

      this.$ws.getSong(this.playlist.items[index]._id).then(song => {
        this.openFullScreen(song._id, false);
      });
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
    openPlaylistSong(song) {
      let sections = [];

      this.openFullScreen(song, false);
    },
    getCloudPlaylists() {
      this.cloudPlaylists = [];
      this.$ws.cloudPlaylists().then(playlists => {
        this.cloudPlaylists = playlists;
      });
    },
    savePlaylist() {
      this.$ws.savePlaylist(this.playlist, this.playlist.name).then(id => {
        this.getCloudPlaylists();
        this.playListNameDialog = false;
      });
    },
    clearPlaylist() {
      let playlist = {
        name: null,
        items: [],
        id: null
      };
      sessionStorage.setItem("playlist", JSON.stringify(playlist));
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

    removeFromPlaylist(index) {
      let playlist = JSON.parse(JSON.stringify(this.playlist));

      playlist.items.splice(index, 1);
      this.$store.dispatch("defaultModule/setPlaylist", playlist);
    },
    print() {
      const el = this.$refs.printMe.$el;
      console.log(el);

      var opt = {
        margin: 0.4,
        filename: this.selectedSong.title + ".pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        
      };

      // New Promise-based usage:
      html2pdf()
        .set(opt)
        .from(el.innerHTML)
        .save();
      /*
      html2canvas(el)
        .then(canvas => {
          var imgdata = canvas.toDataURL("image/png");
          var doc = new jsPDF();
          doc.addImage(imgdata, "PNG", 10, 10);
          doc.save("output.pdf");
        })
        .catch(error => {
          console.log(error);
          alert("Error descargando el reporte visual");
        });
        */
    }
  },
  computed: {
    currentPlaylistIndex() {
      return this.$store.getters["defaultModule/getCurrentPlaylistIndex"];
    },
    playlist() {
      return this.$store.getters["defaultModule/getCurrentPlaylist"];
    },
    transposeChords() {
      let val = this.transpose;

      if (val < 0) {
        val = 12 + val;
      }
      let parts = [];
      this.selectedSong.sections.forEach(section => {
        // Start Transpose

        var txtChords = section.chords.toLowerCase();
        const chords = {
          anglo: {
            c: [
              "c",
              "c#",
              "d",
              "d#",
              "e",
              "f",
              "f#",
              "g",
              "g#",
              "a",
              "a#",
              "b"
            ],
            "c#": [
              "c#",
              "d",
              "d#",
              "e",
              "f",
              "f#",
              "g",
              "g#",
              "a",
              "a#",
              "b",
              "c"
            ],
            db: [
              "db",
              "d",
              "eb",
              "e",
              "f",
              "gb",
              "g",
              "ab",
              "a",
              "bb",
              "b",
              "c"
            ],
            d: [
              "d",
              "d#",
              "e",
              "f",
              "f#",
              "g",
              "g#",
              "a",
              "a#",
              "b",
              "c",
              "c#"
            ],
            "d#": [
              "d#",
              "e",
              "f",
              "f#",
              "g",
              "g#",
              "a",
              "a#",
              "b",
              "c",
              "c#",
              "d"
            ],
            eb: [
              "eb",
              "e",
              "f",
              "gb",
              "g",
              "ab",
              "a",
              "bb",
              "b",
              "c",
              "db",
              "d"
            ],
            e: [
              "e",
              "f",
              "f#",
              "g",
              "g#",
              "a",
              "a#",
              "b",
              "c",
              "c#",
              "d",
              "d#"
            ],
            f: [
              "f",
              "f#",
              "g",
              "g#",
              "a",
              "a#",
              "b",
              "c",
              "c#",
              "d",
              "d#",
              "e"
            ],
            "f#": [
              "f#",
              "g",
              "g#",
              "a",
              "a#",
              "b",
              "c",
              "c#",
              "d",
              "d#",
              "e",
              "f"
            ],
            gb: [
              "gb",
              "g",
              "ab",
              "a",
              "bb",
              "b",
              "c",
              "db",
              "d",
              "eb",
              "e",
              "f"
            ],
            g: [
              "g",
              "g#",
              "a",
              "a#",
              "b",
              "c",
              "c#",
              "d",
              "d#",
              "e",
              "f",
              "f#"
            ],
            "g#": [
              "g#",
              "a",
              "a#",
              "b",
              "c",
              "c#",
              "d",
              "d#",
              "e",
              "f",
              "f#",
              "g"
            ],
            ab: [
              "ab",
              "a",
              "bb",
              "b",
              "c",
              "db",
              "d",
              "eb",
              "e",
              "f",
              "gb",
              "g"
            ],
            a: [
              "a",
              "a#",
              "b",
              "c",
              "c#",
              "d",
              "d#",
              "e",
              "f",
              "f#",
              "g",
              "g#"
            ],
            "a#": [
              "a#",
              "b",
              "c",
              "c#",
              "d",
              "d#",
              "e",
              "f",
              "f#",
              "g",
              "g#",
              "a"
            ],
            bb: [
              "bb",
              "b",
              "c",
              "db",
              "d",
              "eb",
              "e",
              "f",
              "gb",
              "g",
              "ab",
              "a"
            ],
            b: ["b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#"]
          },
          latin: {
            do: [
              "do",
              "do#",
              "re",
              "re#",
              "mi",
              "fa",
              "fa#",
              "sol",
              "sol#",
              "la",
              "la#",
              "si"
            ],
            "do#": [
              "do#",
              "re",
              "re#",
              "mi",
              "fa",
              "fa#",
              "sol",
              "sol#",
              "la",
              "la#",
              "si",
              "do"
            ],
            reb: [
              "reb",
              "re",
              "mib",
              "mi",
              "fa",
              "solb",
              "sol",
              "lab",
              "la",
              "sib",
              "si",
              "do"
            ],
            re: [
              "re",
              "re#",
              "mi",
              "fa",
              "fa#",
              "sol",
              "sol#",
              "la",
              "la#",
              "si",
              "do",
              "do#"
            ],
            "re#": [
              "re#",
              "mi",
              "fa",
              "fa#",
              "sol",
              "sol#",
              "la",
              "la#",
              "si",
              "do",
              "do#",
              "re"
            ],
            mib: [
              "mib",
              "mi",
              "fa",
              "solb",
              "sol",
              "lab",
              "la",
              "sib",
              "si",
              "do",
              "reb",
              "re"
            ],
            mi: [
              "mi",
              "fa",
              "fa#",
              "sol",
              "sol#",
              "la",
              "la#",
              "si",
              "do",
              "do#",
              "re",
              "re#"
            ],
            fa: [
              "fa",
              "fa#",
              "sol",
              "sol#",
              "la",
              "la#",
              "si",
              "do",
              "do#",
              "re",
              "re#",
              "mi"
            ],
            "fa#": [
              "fa#",
              "sol",
              "sol#",
              "la",
              "la#",
              "si",
              "do",
              "do#",
              "re",
              "re#",
              "mi",
              "fa"
            ],
            solb: [
              "solb",
              "sol",
              "lab",
              "la",
              "sib",
              "si",
              "do",
              "reb",
              "re",
              "mib",
              "mi",
              "fa"
            ],
            sol: [
              "sol",
              "sol#",
              "la",
              "la#",
              "si",
              "do",
              "do#",
              "re",
              "re#",
              "mi",
              "fa",
              "fa#"
            ],
            "sol#": [
              "sol#",
              "la",
              "la#",
              "si",
              "do",
              "do#",
              "re",
              "re#",
              "mi",
              "fa",
              "fa#",
              "sol"
            ],
            lab: [
              "lab",
              "la",
              "sib",
              "si",
              "do",
              "reb",
              "re",
              "mib",
              "mi",
              "fa",
              "solb",
              "sol"
            ],
            la: [
              "la",
              "la#",
              "si",
              "do",
              "do#",
              "re",
              "re#",
              "mi",
              "fa",
              "fa#",
              "sol",
              "sol#"
            ],
            "la#": [
              "la#",
              "si",
              "do",
              "do#",
              "re",
              "re#",
              "mi",
              "fa",
              "fa#",
              "sol",
              "sol#",
              "la"
            ],
            sib: [
              "sib",
              "si",
              "do",
              "reb",
              "re",
              "mib",
              "mi",
              "fa",
              "solb",
              "sol",
              "lab",
              "la"
            ],
            si: [
              "si",
              "do",
              "do#",
              "re",
              "re#",
              "mi",
              "fa",
              "fa#",
              "sol",
              "sol#",
              "la",
              "la#"
            ]
          }
        };
        let configChords = chords[this.preferences.notation];

        const extensions = [
          "m",
          "m7",
          "2",
          "7",
          "7+",
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
                    chord = chordPart.substr(
                      0,
                      chordPart.length - extension.length
                    );
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

                if (currentNotation !== this.preferences.notation) {
                  chord = chordTranslate[this.preferences.notation][chord];
                }

                if (configChords[chord] !== undefined) {
                  newChord = configChords[chord][val];
                } else {
                  if (currentNotation === "latin") {
                    newChord = configChords["do"][val];
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
    }
  },
  watch: {
    transpose() {
      if (this.transpose < -11) {
        this.transpose = 0;
      }
      if (this.transpose > 11) {
        this.transpose = 0;
      }
    },
    searchText() {
      this.$ws.allSongs(this.searchText).then(songs => {
        this.songs = songs;
      });
    },
    currentSong() {
      this.$ws.getSong(this.currentSong).then(song => {
        return (this.selectedSong = song);
      });
      this.$pouchSongsPref
        .find({
          selector: { songID: this.currentSong }
        })
        .then(data => {
          const pad = data.docs[0] !== undefined ? data.docs[0] : null;
          this.currentSongRef = data.docs[0];
          if (data.docs[0] !== undefined && data.docs[0].fileName !== undefined) {
            let filePath = data.docs[0].fileName.split("/");

            this.waveName = filePath[filePath.length - 1];
          }
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
.trasparency {
  opacity: 0.3;
}

.songText {
  font-size: 18px;
  padding-top: 18px;
  line-height: 39.6px;
  white-space: pre-line;
}
.songTextNoChords {
  font-size: 25px;
  white-space: pre-line;
  padding-bottom: 10px;
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

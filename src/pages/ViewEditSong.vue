<template>
  <q-page>
    <q-card :dark="chordsBackground=='dark'" :style="chordsBackground==='dark' ? 'background:transparent' : ''" v-if="songToEdit !== null">
      <q-bar class="bg-grey-10 text-white">
        <q-btn dense flat label="Close" icon="close" @click="$router.go(-1)">
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
        <q-space />
        <!-- <q-btn
          dense
          flat
          icon="fas fa-save"
          @click="saveSong()"
          v-show="
            $route.params.edit === 'true' || $route.params.songid === 'newSong'
          "
        >
          <q-tooltip content-class="bg-white text-primary">Save</q-tooltip>
        </q-btn> -->
      </q-bar>

      <q-card-section>
        <div class="title text-center">{{ songToEdit.title }}</div>
        <q-separator color="white" />
        <q-scroll-area style="height:88vh">
          <draggable
            tag="div"
            class="column"
            :style="preferences.showChords === true ? 'height:88vh' : ''"
            v-model="sections"
          >
            <div
              class="col-auto"
              style="margin:0px; position:relative"
              v-for="(section, index) in sections"
              :key="index"
              v-bind:class="{
                visibleBorders: $route.params.edit === 'true'
              }"
               @click="selectSection(section, index)"
            >
              <q-chip
                square
                class="absolute-right"
               
              >
                <q-avatar :color="selectedSection !== index ? 'red' : 'blue'"  text-color="white">{{
                  index + 1
                }}</q-avatar>
                {{ $t(section.type) }}
              </q-chip>
              <q-btn
                flat
                dense
                round
                icon="fas fa-trash"
                size="xs"
                class="absolute-right"
                @click="removeSection(index)"
                v-if="$route.params.edit === 'true'"
              />
              <nl2br
                v-if="preferences.showChords === true"
                tag="div"
                :text="
                  $route.params.edit === 'false' &&
                  $route.params.songid !== 'newSong'
                    ? transposeChords[index]
                    : section.chords + '|'
                "
                class-name="songChords"
              />

              <nl2br
                tag="div"
                :text="
                  $route.params.edit === 'false' &&
                  $route.params.songid !== 'newSong'
                    ? section.text
                    : section.text + '|'
                "
                :class-name="
                  preferences.showChords === false
                    ? 'songTextNoChords ' + section.type
                    : 'songText ' + section.type
                "
              />
              <q-separator color="white" />
            </div>
          </draggable>
        </q-scroll-area>
        <!-- Song Items -->
      </q-card-section>
       <q-page-sticky position="top-right" :offset="[45,45]" v-if="transpose !== 0">
            <q-btn disable fab :label="transpose" color="accent" />
          </q-page-sticky>
    </q-card>

    <vue-draggable-resizable
      :w="560"
      :h="380"
      :x="500"
      :y="100"
      :parent="true"
      class="no-overflow"
      drag-cancel=".nodrag"
      v-if="
        selectedSection !== undefined &&
          ($route.params.edit === 'true' || $route.params.songid === 'newSong')
      "
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
          <q-tab name="text" label="Text" icon="fas fa-font" />
          <q-tab name="chords" label="Chords" icon="fas fa-music" />
          <q-tab name="links" label="Links" icon="fas fa-link" />
          <q-tab name="versions" label="Versions" icon="fas fa-layer-group" />
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

          <q-tab-panel style="padding:0px" name="text">
            <q-card flat>
              <q-card-section class="text-center">
                <q-btn-toggle
                  v-model="sections[selectedSection].type"
                  size="sm"
                  push
                  flat
                  toggle-color="primary"
                  v-if="sections[selectedSection] !== undefined"
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
                  v-if="sections[selectedSection] !== undefined"
                  v-model="sections[selectedSection].text"
                />
              </q-card-section>
            </q-card>
          </q-tab-panel>
          <q-tab-panel style="padding:0px" name="chords">
            <q-card
              flat
              v-if="
                sections.length > 0 && sections[selectedSection] !== undefined
              "
            >
              <q-card-section>
                <q-input
                  color="primary"
                  filled
                  type="textarea"
                  placeholder="Enter chords here"
                  v-if="sections[selectedSection] !== undefined"
                  v-model="sections[selectedSection].chords"
                  class="nodrag"
                />
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel style="padding:0px" name="links">
            <q-card flat>
              <q-card-section>
                <q-input
                  color="primary"
                  v-model="songToEdit.youtube"
                  filled
                  dense
                  placeholder="Youtube"
                  class="nodrag"
                />
              </q-card-section>
              <q-card-section>
                <q-input
                  color="primary"
                  v-model="songToEdit.soundcloud"
                  filled
                  dense
                  placeholder="SoundCloud"
                  class="nodrag"
                />
              </q-card-section>
            </q-card>
          </q-tab-panel>
          <q-tab-panel style="padding:0px" name="versions">
            <q-card>
              <q-card-section>
                <q-list bordered separator>
                  <q-item
                    clickable
                    v-ripple
                    :active="selectedVersion === null"
                    active-class="bg-teal-1 text-grey-8"
                    @click="selectedVersion = null"
                  >
                    <q-item-section>Original</q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-ripple
                    v-for="(version, index) in songToEdit.versions"
                    :key="index"
                    :active="selectedVersion === index"
                    active-class="bg-teal-1 text-grey-8"
                    @click="selectedVersion = index"
                  >
                    <q-item-section>{{ version.title }}</q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
              <q-card-actions>
                <q-btn
                  flat
                  icon="fas fa-plus"
                  label="Add New Version"
                  @click="newVersionDialog = true"
                />
              </q-card-actions>
              
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
        <q-card-actions>
          <q-space />
          <q-btn
            dense
            flat
            icon="fas fa-save"
            label="Save"
            @click="saveSong()"
            v-show="
              $route.params.edit === 'true' ||
                $route.params.songid === 'newSong'
            "
          >
            <q-tooltip content-class="bg-white text-primary">Save</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </vue-draggable-resizable>

    <q-dialog v-model="newVersionDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">New Version</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="newVersionTitle" label="New Version Title" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="OK"
            color="primary"
            @click="addVersion()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "ViewEditSong",
  components: { draggable },
  created() {
    document.addEventListener("keypress", this.bindKey);
  },
  destroyed() {
    document.removeEventListener("keypress", this.bindKey);
     this.$store.dispatch(
        "defaultModule/setSongVersion",
       null
      );
      this.transpose = 0;

  },
  mounted() {
    this.loadPreferences();

    this.loadLicenseInfo().then(() => {
      this.getSong();
    });
    this.$renderer.on("pagedown", evt => {
      console.log("pagedown");
      this.nextSong();
    });
    this.$renderer.on("pageup", evt => {
      this.prevSong();
    });

    // playlistSong(currentPlaylistIndex + 1)
  },
  sockets: {
    connect: function() {
      console.log("socket connected from ViewEdit");
    }
  },
  data() {
    return {
      songToEdit: null,
      selectedSection: 0,
      selectedTab: "info",
      newVersionDialog: false,
      newVersionTitle: null,
      selectedVersion: null,
      chordsBackground:'dark',
      sections: [],
      songID: null,
      songRev: null,
      preferences: {},
      licenseInfo: {},
      transpose: 0
    };
  },
  methods: {
    bindKey(e) {
      if (e.keyCode === 43) {
        this.transpose++;

        //this.$ws.createAlert("Transpose " + this.transpose);
      }
      if (e.keyCode === 45) {
        this.transpose--;
       // this.$ws.createAlert("Transpose " + this.transpose);
      }
    },
    loadLicenseInfo() {
      return new Promise(res => {
        this.$ws.getLicense().then(info => {
          this.licenseInfo = info;
          res("ok");
        });
      });
    },
    getSong() {
      if (this.$route.params.songid !== "newSong") {
        this.songID = this.$route.params.songid;
        this.$pouchSongs.get(this.$route.params.songid).then(song => {
          this.songToEdit = song;
          console.log(song)
          this.sections = this.selectedSongVersion === null ? song.sections : song.versions[this.selectedSongVersion].sections;
     
        });
      } else {
        this.songToEdit = {
          email: this.licenseInfo.userEmail,
          licenseID: this.licenseInfo.licenseID,
          title: null,
          original_title: null,
          number: null,
          author: null,
          category: null,
          sections: [
            {
              text: "",
              chords: ""
            }
          ]
        };
      }
    },
    playlistSong(index) {
      console.log("Playlistsong", index);
      if (index > -1 && index < this.playlist.items.length) {
        this.$pouchSongs.get(this.playlist.items[index]._id).then(song => {
          this.$store.dispatch("defaultModule/setPlaylistIndex", index);

          this.songToEdit = song;
        });
      }
    },
    nextSong() {
      this.playlistSong(this.currentPlaylistIndex + 1);
    },
    prevSong() {
      this.playlistSong(this.currentPlaylistIndex - 1);
    },
    addSection() {
      this.songToEdit.sections.push({
        type: "verse",
        text: "",
        chords: ""
      });

      this.selectedSection = this.songToEdit.sections.length - 1;
    },
    selectSection(section, index) {
      this.selectedSection = index;
      this.$socket.emit("playSlide", {
        sector: this.licenseInfo.sector,
        slide: section,
        index: index
      });
    },
    saveSong() {
      let song = {};
      song = this.songToEdit;
      if (this.songID === null) {
        let searchref = song.title;
        song.sections.forEach(section => {
          searchref = searchref + " " + section.text;
        });
        song.searchref = searchref.toLowerCase();
        song.organizationID = this.licenseInfo.licenseID;
        song.email = this.licenseInfo.userEmail;
        this.$pouchSongs.post(song).then(doc => {
          this.songToEdit["_id"] = doc.id;
          this.songToEdit["_rev"] = doc.rev;
          console.log("DOCUMENT INSERTED", doc);
        });
      } else {
        this.$pouchSongs
          .put(song)
          .then(doc => console.log("DOCUMENT UPDATED", doc));
      }
      this.$q.notify({
        message: "Song was saved",
        color: "positive"
      });
    },
    addVersion() {
      let song = {};
      song = this.songToEdit;
      if (song.versions === undefined) {
        song.versions = [];
      }
      this.songToEdit.versions.push({
        title: this.newVersionTitle,
        sections: JSON.parse(JSON.stringify(song.sections))
      });
      this.selectedVersion = this.songToEdit.versions.length - 1;
    },
    removeSection(index) {
      this.songToEdit.sections.splice(index, 1);
    },
    loadPreferences() {
      return new Promise(res => {
        this.$ws.getPreferences().then(pref => {
          console.log(pref)
          this.preferences.computerName = pref.data.computerName;
          this.preferences.showChords = pref.data.showChords;
          this.preferences.startModule = pref.data.startModule;
          this.preferences.notation = pref.data.notation;
          this.chordsBackground = pref.data.chordsBackground;
          res("ok");
        });
      });
    }
  },
  computed: {
    transposeChords() {
      let parts = [];
      this.sections.forEach(section => {
        // Start Transpose

        let val = this.transpose;

        if (val < 0) {
          val = 12 + val;
        }

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
    currentPlaylistIndex() {
      return this.$store.getters["defaultModule/getCurrentPlaylistIndex"];
    },
    playlist() {
      return this.$store.getters["defaultModule/getCurrentPlaylist"];
    },
    selectedSongVersion() {
      return this.$store.getters["defaultModule/getCurrentSongVersion"];
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
    selectedSongVersion() {
      if (this.selectedSongVersion === null) {
        console.log("Null");
        this.sections = this.songToEdit.sections;
      } else {
        console.log(this.songToEdit.versions[this.selectedSongVersion].sections);
        this.sections = this.songToEdit.versions[this.selectedSongVersion].sections;
      }
    },
    currentPlaylistIndex(){
     if(this.playlist.items[this.currentPlaylistIndex].versions !== undefined){
       if(this.playlist.items[this.currentPlaylistIndex].selectedVersion !== null){
         this.sections = this.playlist.items[this.currentPlaylistIndex].versions[this.playlist.items[this.currentPlaylistIndex].selectedVersion].sections
       } else {
         this.sections = this.playlist.items[this.currentPlaylistIndex].sections
       }
     } else {
        this.sections = this.playlist.items[this.currentPlaylistIndex].sections
     }
    }
  }
};
</script>

<style scoped>
.songText {
  font-size: 25px;
  padding-top: 25px;
  line-height: 50px;
  white-space: pre-line;
  text-transform: uppercase;
}
.songTextNoChords {
  font-size: 40px;
  text-align: center;
  white-space: pre-line;
  padding: 20px;
  text-transform: uppercase;
}
.songChords {
  position: absolute;
  font-size: 25px;
  line-height: 50px;
  white-space: pre;
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
  background-color: #eeeeee;
}
.no-overflow {
  overflow: hidden;
}
.title {
  font-size: 60px;
  text-transform: uppercase;
  font-weight: bold;
  color: white;
  -webkit-text-stroke-width: 0.1px;
  -webkit-text-stroke-color: black;
  font-family: "GloriaHallelujah" !important;
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

<template>
  <q-page>
       <q-bar class="bg-grey-10 text-white">
        <q-space />
        <q-btn
          dense
          flat
          icon="fas fa-save"
          @click="saveSong()"
          v-show="
            $route.params.edit === 'true' || $route.params.songid === 'newSong'
          "
        >
          <q-tooltip content-class="bg-white text-primary">Save</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" @click="$router.go(-1)">
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card >
          <q-scroll-area style="height:200px">
              <q-card-section v-if="currentSong !== null" class="q-pa-xs">
                <div
                  class="column"
                  style="height:94vh; "
                  v-if="songToEdit !== null"
                >
                  <div
                    class="col-auto  q-pb-md"
                    style="margin:0px"
                    v-for="(section, index) in songToEdit.sections"
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
              </q-scroll-area>
            </q-card>
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
  },
  mounted() {
    this.loadPreferences();

    this.loadLicenseInfo().then(() => {
      this.getSong();
    });
    this.$renderer.on("pagedown", evt => {
      console.log('pagedown')
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

        this.$ws.createAlert("Transpose " + this.transpose);
      }
      if (e.keyCode === 45) {
        this.transpose--;
        this.$ws.createAlert("Transpose " + this.transpose);
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
     
        this.songID = this.$route.params.songid;
        this.$pouchSongs.get(this.$route.params.songid).then(song => {
          this.songToEdit = song;
        });
     
      
    },
    playlistSong(index) {
      console.log("Playlistsong",index)
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
    removeSection(index){
        this.songToEdit.sections.splice(index,1)
    },
    loadPreferences() {
      return new Promise(res => {
        this.$ws.getPreferences().then(pref => {
          this.preferences.computerName = pref.data.computerName;
          this.preferences.showChords = pref.data.showChords;
          this.preferences.startModule = pref.data.startModule;
          this.preferences.notation = pref.data.notation;
          res("ok");
        });
      });
    }
  },
  computed: {
    transposeChords() {
      let parts = [];
      this.songToEdit.sections.forEach(section => {
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
    }
  }
};
</script>

<style scoped>
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

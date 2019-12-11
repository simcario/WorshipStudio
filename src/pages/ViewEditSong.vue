<template>
  <q-page>
    <q-card v-if="songToEdit!==null">
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
        <q-btn
          dense
          flat
          icon="close"
          @click="$router.push({ path: '/Chords' })"
        >
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
              visibleBorders: $route.params.edit === 'true'
            }"
          >
            <nl2br
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
              class-name="songText"
            />
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
  </q-page>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "ViewEditSong",
  components: { draggable },
      created(){
          document.addEventListener("keypress", this.bindKey);
      },
      destroyed(){
          document.removeEventListener("keypress", this.bindKey);
      },
  mounted() {

  
    this.loadLicenseInfo().then(() => {
      this.getSong();
    });
  },
  data() {
    return {
      songToEdit: null,
      selectedSection: 0,
      selectedTab: "info",
      songID:null,
      songRev:null,
      licenseInfo: {},
      transpose:0
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
    addSection() {
      this.songToEdit.sections.push({
        type: "verse",
        text: "",
        chords: ""
      });

      this.selectedSection = this.songToEdit.sections.length - 1;
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
        this.$pouchSongs
          .post(song)
          .then(doc =>{
              this.songToEdit['_id'] = doc.id
              this.songToEdit['_rev'] = doc.rev
               console.log("DOCUMENT INSERTED", doc)
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
    }
  },
  computed:{
     transposeChords() {
      let parts = [];
      this.songToEdit.sections.forEach(section => {
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
                  if (chordPart.substr(chordPart.length - extension.length) === extension) {
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
  }
};
</script>

<style>
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

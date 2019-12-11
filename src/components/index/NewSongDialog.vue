<template>
  <q-dialog
    v-model="show"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card v-if="songToEdit !== null">
      <q-bar dark class="bg-primary text-white">
        <div v-if="chordViewer === false">
          <div v-if="edit === false">New Song</div>
          <div v-else>Edit Song</div>
          -
        </div>
        {{ title }}
        <q-space />
        <q-btn
          dense
          flat
          icon="fas fa-save"
          @click="saveSong()"
          v-if="chordViewer === false"
        >
          <q-tooltip content-class="bg-white text-primary">Save</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" @click="closeEditor(false)">
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="column" style="height:98vh">
          <div
            class="col-auto"
            v-for="(section, index) in currentSong.sections"
            :key="index"
            @click="makeSelection(index)"
            v-bind:class="{
              selectedSection: selectedSection === index 
            }"
          >
          
               <q-bar dense class="bg-white">
                <q-space />

                <q-btn
                  icon="fas fa-arrow-up"
                  color="primary"
                  dense
                  flat
                  round
                  size="xs"
                  v-if="index>0 && chordViewer===false"
                  @click="moveSectionUp(index)"
                >
                  <q-tooltip>Move Up</q-tooltip>
                </q-btn>
                <!-- Btn Up-->

                <q-btn
                  icon="fas fa-arrow-down"
                  color="primary"
                  dense
                  flat
                  round
                  size="xs"
                  v-if="currentSong.sections.length>1 && index<currentSong.sections.length-1 && chordViewer===false"
                  @click="moveSectionDown(index)"
                >
                  <q-tooltip>Move Down</q-tooltip>
                </q-btn>
                <!-- Btn Down-->

                <q-btn
                  icon="fas fa-times"
                  color="primary"
                  dense
                  flat
                  round
                  size="xs"
                  v-if="currentSong.sections.length > 1 && chordViewer===false"
                  @click="removeSection(index)"
                >
                  <q-tooltip>Remove</q-tooltip>
                </q-btn>
                <!-- Btn Remove -->
              </q-bar>


            <div
              :style="{
                'white-space': 'pre',
                color: songLocalSettings.textStyle.chordsColor,
                'font-size': songLocalSettings.textStyle.size + 'px',
                'font-weight': songLocalSettings.textStyle.chordsWeight,
                'line-height': songLocalSettings.textStyle.size * 2.2 + 'px',
                position: 'absolute'
              }"
              v-if="section !== undefined"
              v-show="showChords"
            >
              {{ section.chords
              }}<span v-if="chordViewer === false">|</span>
            </div>
            <div
              :style="{
                'white-space': 'pre',
                color: songLocalSettings.textStyle.textColor,
                'font-size': songLocalSettings.textStyle.size + 'px',
                'font-weight': songLocalSettings.textStyle.textWeight,
                'padding-top': songLocalSettings.textStyle.size + 'px',
                'line-height': songLocalSettings.textStyle.size * 2.2 + 'px'
              }"
              v-if="section !== undefined"
              editable="true"
            >
              {{ section.text }}
            </div>
          </div>
        </div>

        <!-- Song Items -->
      </q-card-section>
    </q-card>
    <vue-draggable-resizable
      :w="550"
      :h="350"
      :x="500"
      :y="100"
      :parent="true"
      class="no-overflow"
      drag-cancel=".nodrag"
      v-if="selectedSection !== undefined && chordViewer === false"
    >
      <q-card style="width 100%; margin:10px">
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
                  v-model="currentSong.title"
                  filled
                  dense
                  placeholder="Title"
                  class="nodrag"
                />
              </q-card-section>
              <q-card-section>
                <q-input
                  color="primary"
                  v-model="currentSong.original_title"
                  filled
                  dense
                  placeholder="Original Title"
                  class="nodrag"
                />
              </q-card-section>
              <q-card-section>
                <q-input
                  color="primary"
                  v-model="currentSong.author"
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
                      v-model="currentSong.number"
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
                      v-model="currentSong.category"
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
                      @click="songLocalSettings.textStyle.size--"
                      icon="fas fa-minus"
                    />
                    <q-btn
                      outline
                      color="purple"
                      @click="songLocalSettings.textStyle.size++"
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
                        :style="{ 'background-color': songLocalSettings.textStyle.textColor }"
                      >
                        &nbsp;
                      </div>
                      <q-popup-proxy>
                        <q-color
                          v-model="songLocalSettings.textStyle.textColor"
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
                        :style="{ 'background-color': songLocalSettings.textStyle.chordsColor }"
                      >
                        &nbsp;
                      </div>
                      <q-popup-proxy>
                        <q-color
                          v-model="songLocalSettings.textStyle.chordsColor"
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
                  v-model="currentSong.sections[selectedSection].type"
                  size="sm"
                  push
                  flat
                  toggle-color="primary"
                  v-if="currentSong.sections[selectedSection] !== undefined"
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
                  v-if="currentSong.sections[selectedSection] !== undefined"
                  v-model="currentSong.sections[selectedSection].text"
                />
              </q-card-section>
            </q-card>
          </q-tab-panel>
          <q-tab-panel style="padding:0px" name="chords">
            <q-card
              flat
              v-if="
                selectedSection !== null &&
                  currentSong.sections.length > 0 &&
                  currentSong.sections[selectedSection] !== undefined
              "
            >
              <q-card-section>
                <q-input
                  color="primary"
                  filled
                  type="textarea"
                  placeholder="Enter chords here"
                  v-if="currentSong.sections[selectedSection] !== undefined"
                  v-model="currentSong.sections[selectedSection].chords"
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
</template>
<script>
export default {
  name: "NewSongDialog",
  props: {
    show: {
      required: true
    },
    songToEdit: {
      default: null
    },
    songEdit: {
      required: true
    },
    showChords: {
      default: true
    },
    chordViewer: {
      default: false
    }
  },
  mounted() {
    this.$root.$on("newSong", song => {
      this.title = null;
      this.author = null;
      this.deleted = false;
      this.partPosition = [[0]];
      this.original_title = null;
      this.number = null;
      this.category = null;
      this.notation = null;
      this.sections = [];
      this.textStyle = {
        size: 18,
        chordsColor: "red",
        textColor: "black",
        textWeight: "normal",
        chordsWeight: "bold"
      };
      this.sections = [{ text: "", chords: "", type: "verse" }];

      this.selectedSection = 0;
      this.selectedColumn = 0;
    });
  },
  data() {
    return {
      edit: true,
      selectedTab: "info",
      original_title: null,
      title: null,
      author: null,
      number: null,
      category: null,
      deleted: false,
      partPosition: [],
      sections: [],
      songID: null,
      notation: null,
      textStyle: null,
      selectedSection: 0,
      selectedColumn: 0,
      expandedItem: null
    };
  },
  methods: {
    addSection() {
      this.sections.push({
        type: "verse",
        text: "",
        chords: ""
      });
      this.partPosition[this.selectedColumn].push(this.sections.length - 1);

      this.selectedSection = this.sections.length - 1;
    },
     moveSectionDown(section) {
      this.songToEdit.sections.splice(
        section + 1,
        0,
       this.songToEdit.sections.splice(section, 1)[0]
      );
    },
    moveSectionUp(section) {
      this.songToEdit.sections.splice(
        section - 1,
        0,
        this.songToEdit.sections.splice(section, 1)[0]
      );
    },
    makeSelection(index) {
      this.selectedSection = index;

    },
    removeSection(section) {
      this.songToEdit.sections.splice(section, 1);
    },

  
    selectSection(index) {
      this.selectedSection = index;
    },
   
  
    saveSong() {
      let song = {};
  
      if (this.songEdit === false) {
            song.email = this.user.email;

      song.title = this.title || "";
      song.original_title = this.original_title || "";
      song.author = this.author || "";
      song.number = this.number || "";
      song.category = this.category || "";
      song.sections = this.sections;
      song.deleted = false;
        this.$firestore
          .collection('organizations').doc(this.user.organizationID)
          .collection("songs")
          .add(song)
          .then(docRef => {
            this.songID = docRef.id;
          });
      } else {
        const songid = this.songID;

        delete this.songid;

        this.$firestore
         .collection('organizations').doc(this.user.organizationID)
          .collection("songs")
          .doc(this.songToEdit.songid)
          .set(song, { merge: true });
      }
      /*
      this.$store.dispatch("defaultModule/setSongPartPosition", {
        partPosition: this.partPosition,
        songID: this.songID
      });
      */
      this.$store.dispatch("defaultModule/setSongTextStyle", {
        textStyle: this.textStyle,
        songID: this.songID
      });

      this.$root.$emit("updateSongs");
      this.closeEditor(true);
      this.$q.notify({
        message: "Song was saved",
        color: "positive"
      });
    },
    closeEditor(refresh) {
      this.$root.$emit("closeEditor", refresh);
    },
    transposedChords(chords) {
      return this.$ws.transpose(
        chords,
        this.transpose,
        this.selectedSong.notation
      );
    }
  },
  computed: {
     songs(){
      return this.$parent.$parent.$parent.$parent.$parent.$data.songs
    },
    currentSong(){
        return this.songs[this.songToEdit]
    },
    user() {
      return {
        email: this.$store.getters["defaultModule/getEmail"],
        organizationID: this.$store.getters["defaultModule/getOrganizationID"]
      };
    },
    songLocalSettings() {
      let localSettings = this.$store.getters[
        "defaultModule/getSongsLocalSettings"
      ];
  console.log(localSettings)
      return {
        partPosition:
          localSettings[this.songID] !== undefined &&
          localSettings[this.songID]["partPosition"] !== undefined
            ? localSettings[this.songID]["partPosition"]
            : null,
        textStyle:
          localSettings[this.songID] !== undefined &&
          localSettings[this.songID]["textStyle"] !== undefined
            ? localSettings[this.songID]["textStyle"]
            : {
        size: 18,
        chordsColor: "red",
        textColor: "black",
        textWeight: "normal",
        chordsWeight: "bold"
      }
      };
    }
  },
  watch: {
    songToEdit() {
      //console.log(this.songLocalSettings.songPosition)
      if (this.songToEdit !== null) {
        let song = this.songToEdit;
        this.title = song.title;
        this.author = song.author;
        this.original_title = song.original_title;
        this.number = song.number;
        this.category = song.category;
        this.sections = song.sections;
        this.notation = song.notation;
        this.songID = song.songid;
        if (this.songLocalSettings.partPosition === null) {
          let partPosition = [[]];
          this.sections.forEach((section, index) => {
            partPosition[0].push(index);
          });
          this.partPosition = partPosition;
        } else {
          this.partPosition = this.songLocalSettings.partPosition;
        }
        if (this.songLocalSettings.textStyle === null) {
          this.textStyle = {
            size: 18,
            chordsColor: "red",
            textColor: "black",
            textWeight: "normal",
            chordsWeight: "bold"
          };
        } else {
          this.textStyle = this.songLocalSettings.textStyle;
        }
      } else {
        /*
         let song = null;
        this.title = null;
        this.author = null;
        this.original_title = null;
        this.number = null;
        this.category = null;
        this.sections = null;
        this.songID = null;
        */
      }
    },
    show() {
      /*
      if(this.show === false){
        this.songToEdit = null
          let song = null;
        this.title = null;
        this.author = null;
        this.original_title = null;
        this.number = null;
        this.category = null;
        this.sections = null;
        this.songID = null;
       this.partPosition = [[]];
       this.textStyle = {
            size: 18,
            chordsColor: "red",
            textColor: "black"
          };
      }
      */
    }
  }
};
</script>
<style scoped>
.bg-col {
  background: #cccccc;
}
.songText {
  color: #595959;
}
.songChords {
  font-size: 18px;
  line-height: 40px;
  color: red;
  position: absolute;
  white-space: pre;
}
.sectionContainer {
  position: relative;
  margin-bottom: 15px;
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
  font-size: 18px;
  line-height: 40px;
  padding-top: 15px;
}
.chorus {
  font-size: 18px;
  line-height: 40px;
  padding-top: 15px;

  font-weight: bold;
}
.prechorus {
  font-size: 18px;
  line-height: 40px;
  padding-top: 15px;

  font-style: italic;
}
.bridge {
  font-size: 18px;
  line-height: 40px;
  padding-top: 15px;

  font-weight: bold;
  font-style: italic;
}
.picker-result {
  width: 100%;
  height: 4px;
  position: absolute;
  bottom: 0px;
  right: 0px;
  border: 1px solid grey;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}
.small-icon {
  position: absolute;
  right: 5px;
  top: 0px;
}
</style>

<template>
  <q-dialog
    v-model="show"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-bar dark class="bg-primary text-white">
        <div v-if="edit===false">New Song</div>
        <div v-else>Edit Song</div>
        - {{title}}
        <q-space />
        <q-btn dense flat icon="fas fa-save" @click="saveSong()">
          <q-tooltip content-class="bg-white text-primary">Save</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" @click="closeEditor(false)">
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="row">
          <div
            class="col"
            style="padding-left:20px; "
            v-for="(column,index) in partPosition"
            :key="index"
          >
            <q-bar
              dense
              dark
              class="text-white"
              v-bind:class="{'bg-accent':selectedColumn===index,'bg-col':selectedColumn!==index}"
              @click="selectedColumn=index"
            >
              Column {{index+1}}
              <q-space />
              <q-btn
                dense
                flat
                icon="close"
                v-if="partPosition.length>1"
                @click="confirmRemove(index)"
              ></q-btn>
            </q-bar>
            <div
              v-for="(section, i) in column"
              :key="i"
              class="sectionContainer"
              v-bind:class="{'selectedSection': selectedSection === i && selectedColumn=== index }"
              @click="makeSelection(section,index)"
            >
              <q-bar dense class="bg-white">
                <q-space />

                <q-btn
                  icon="fas fa-arrow-right"
                  color="primary"
                  dense
                  flat
                  round
                  size="xs"
                  v-if="index + 1 < partPosition.length && sections.length > 1"
                  @click="moveSectionRight(index,section,i)"
                >
                  <q-tooltip>Move Right</q-tooltip>
                </q-btn>
                <!-- Btn Right-->

                <q-btn
                  icon="fas fa-arrow-left"
                  color="primary"
                  dense
                  flat
                  round
                  size="xs"
                  v-if="partPosition.length > 1 && index > 0"
                  @click="moveSectionLeft(index,section,i)"
                >
                  <q-tooltip>Move Left</q-tooltip>
                </q-btn>
                <!-- Btn Left-->

                <q-btn
                  icon="fas fa-arrow-up"
                  color="primary"
                  dense
                  flat
                  round
                  size="xs"
                  v-if="i>0"
                  @click="moveSectionUp(index,i)"
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
                  v-if="partPosition[index].length>1 && i<column.length-1"
                  @click="moveSectionDown(index, i)"
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
                  v-if="column.length > 1"
                  @click="removeSection(index,i,section)"
                >
                  <q-tooltip>Remove</q-tooltip>
                </q-btn>
                <!-- Btn Remove -->
              </q-bar>

              <div
                :style="{
                            'white-space': 'pre', 
                            'color':textStyle.chordsColor, 
                            'font-size': textStyle.size + 'px',
                            'font-weight': textStyle.chordsWeight,
                            'line-height': textStyle.size*2.2 + 'px',
                            'position': 'absolute',
                            }"
                v-if="sections[section] !== undefined"
                v-show="showChords"
              >{{sections[section].chords}} |</div>
              <div
                :style="{
                            'white-space': 'pre', 
                            'color':textStyle.textColor, 
                            'font-size': textStyle.size + 'px',
                            'font-weight': textStyle.textWeight,
                            'padding-top': textStyle.size + 'px',
                            'line-height': textStyle.size*2.2 + 'px',
 
                            }"
                v-if="sections[section] !== undefined"
                editable="true"
              >{{sections[section].text}}</div>
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
      v-if="sections[selectedSection] !== undefined "
    >
      <q-card style="width 100%; margin:10px">
        <q-bar dark class="bg-primary text-white">
          <q-btn flat icon="fas fa-file" label="Add Section" @click="addSection" />
          <q-btn flat icon="fas fa-columns" label="Add Column" @click="addColumn" />
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
                  v-model="title"
                  filled
                  dense
                  placeholder="Title"
                  class="nodrag"
                />
              </q-card-section>
              <q-card-section>
                <q-input
                  color="primary"
                  v-model="original_title"
                  filled
                  dense
                  placeholder="Original Title"
                  class="nodrag"
                />
              </q-card-section>
              <q-card-section>
                <q-input
                  color="primary"
                  v-model="author"
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
                      v-model="number"
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
                      v-model="category"
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
                    <q-btn outline color="purple" @click="textStyle.size --" icon="fas fa-minus" />
                    <q-btn outline color="purple" @click="textStyle.size ++" icon="fas fa-plus" />
                    <q-tooltip>Text Size</q-tooltip>
                  </q-btn-group>
                </div>
                <div class="col-4">
                  <q-btn-group push class="q-ma-xs">
                    <q-btn dark text-color="purple" outline unelevated icon="fas fa-font">
                      <q-tooltip>Text Color</q-tooltip>
                      <div class="small-icon">
                        <q-icon name="fas fa-fill-drip" size="10px" />
                      </div>
                      <div
                        class="picker-result"
                        :style="{'background-color': textStyle.textColor}"
                      >&nbsp;</div>
                      <q-popup-proxy>
                        <q-color v-model=" textStyle.textColor" format-model="hexa" />
                      </q-popup-proxy>
                    </q-btn>
                    <q-btn outline color="purple" @click="textStyle.textWeight = 'bold'" icon="fas fa-bold" >
                       <q-tooltip>Text Bold</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                  <q-btn-group>
                    <q-btn dark text-color="purple" outline unelevated icon="fas fa-music">
                      <q-tooltip>Chords Color</q-tooltip>
                      <div class="small-icon">
                        <q-icon name="fas fa-fill-drip" size="10px" />
                      </div>
                      <div
                        class="picker-result"
                        :style="{'background-color': textStyle.chordsColor}"
                      >&nbsp;</div>
                      <q-popup-proxy>
                        <q-color v-model=" textStyle.chordsColor" format-model="hexa" />
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
                  v-model="sections[selectedSection].type"
                  size="sm"
                  push
                  flat
                  toggle-color="primary"
                  v-if="sections[selectedSection] !== undefined"
                  :options="[
                        {label: 'Verse', value: 'verse'},
                        {label: 'Chorus', value: 'chorus'},
                        {label: 'Pre-Chorus', value: 'prechorus'},
                        {label: 'Bridge', value: 'bridge'},
                        {label: 'Special', value: 'special'},
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
              v-if="selectedSection !== null && sections.length>0 && sections[selectedSection] !== undefined"
            >
              <q-card-section>
                <q-input
                  color="primary"
                  filled
                  @input.prevent
                  type="textarea"
                  placeholder="Enter chords here"
                  v-if="sections[selectedSection] !== undefined"
                  v-model="sections[selectedSection].chords"
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
    makeSelection(section, column) {
      this.selectedSection = section;
      this.selectedColumn = column;
    },
    removeSection(position, index, section) {
      this.sections.splice(section, 1);
      this.partPosition[position].splice(index, 1);
      this.partPosition.forEach((column, index) => {
        column.forEach((part, i) => {
          if (part > section) {
            this.partPosition[index][i] = part - 1;
          }
        });
      });
    },
    addColumn() {
      // this.sections.push({ text: "", chords: "", type: "verse" });

      this.partPosition.push([this.sections.length - 1]);
      this.selectedColumn = this.partPosition.length - 1;
      this.selectedSection = this.sections.length - 1;
    },
    removeColumn(column, action) {
      this.partPosition[column].forEach((section, index) => {
        if (action === "left") {
          this.partPosition[column - 1].push(section);
        }
        if (action === "remove") {
          this.removeSection(column, section, index);
        }
      });
      this.partPosition.splice(column, 1);
    },
    confirmRemove(index) {
      this.$q.notify({
        message: "Delete sections or move them to the right or left",
        color: "negative",
        icon: "fas fa-exclamation-triangle",
        textColor: "white",
        position: "center",
        actions: [
          {
            label: "DELETE",
            color: "yellow",
            handler: () => this.removeColumn(index, "remove")
          },
          {
            label: "MOVE LEFT",
            color: "yellow",
            handler: () => this.removeColumn(index, "left")
          },
          {
            label: "Cancel",
            color: "white",
            handler: () => console.log("dismiss")
          }
        ]
      });
    },
    selectSection(index) {
      this.selectedSection = index;
    },
    moveSectionDown(column, section) {
      this.partPosition[column].splice(
        section + 1,
        0,
        this.partPosition[column].splice(section, 1)[0]
      );
    },
    moveSectionUp(column, section) {
      this.partPosition[column].splice(
        section - 1,
        0,
        this.partPosition[column].splice(section, 1)[0]
      );
    },
    moveSectionRight(column, section, index) {
      this.partPosition[column].splice(index, 1);
      this.partPosition[column + 1].push(section);
    },
    moveSectionLeft(column, section, index) {
      console.log(section);
      this.partPosition[column].splice(index, 1);
      this.partPosition[column - 1].push(section);
    },
    saveSong() {
      let song = {};
      song.email = this.user.email;
      song.organizationID = this.user.organizationID;
      song.title = this.title || "";
      song.original_title = this.original_title || "";
      song.author = this.author || "";
      song.number = this.number || "";
      song.category = this.category || "";
      song.sections = this.sections;
      song.deleted = false;
      if (this.songEdit === false) {
        this.$firestore
          .collection("songs")
          .add(song)
          .then(docRef => {
            this.songID = docRef.id;
          });
      } else {
        const songid = this.songID;

        delete this.songid;

        this.$firestore
          .collection("songs")
          .doc(songid)
          .set(song, { merge: true });
      }
      this.$store.dispatch("defaultModule/setSongPartPosition", {
        partPosition: this.partPosition,
        songID: this.songID
      });
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
            : null
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
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
        <div v-if="edit===false">New Song </div>
        <div v-else>Edit Song </div> - {{song.title}}
        <q-space />
        <q-btn dense flat icon="fas fa-save" @click="saveSong()">
          <q-tooltip content-class="bg-white text-primary">Save</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" @click="closeEditor()">
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="row">
          <div
            class="col"
            style="padding-left:20px; "
            v-for="(column,index) in song.columns"
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
              <q-btn dense flat icon="close" v-if="song.columns.length>1" @click="confirmRemove()"></q-btn>
            </q-bar>
            <div
              v-for="(section, i) in column.sections"
              :key="i"
              class="sectionContainer"
              v-bind:class="{'selectedSection': selectedSection === i && selectedColumn=== index }"
              @click="makeSelection(i,index)"
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
                  v-if="index + 1 < song.columns.length && column.sections.length > 1"
                  @click="moveSectionRight(index,i)"
                >
                  <q-tooltip>Move Right</q-tooltip>
                </q-btn>
                <!-- Btn Right -->

                <q-btn
                  icon="fas fa-arrow-left"
                  color="primary"
                  dense
                  flat
                  round
                  size="xs"
                  v-if="song.columns.length > 1 && index > 0"
                  @click="moveSectionLeft(index,i)"
                >
                  <q-tooltip>Move Left</q-tooltip>
                </q-btn>
                <!-- Btn Left -->
                <q-btn
                  icon="fas fa-arrow-up"
                  color="primary"
                  dense
                  flat
                  round
                  size="xs"
                  v-if="i>0"
                  @click="moveSectionUp(i)"
                >
                  <q-tooltip>Move Up</q-tooltip>
                </q-btn>
                <!-- Btn Up -->
                <q-btn
                  icon="fas fa-arrow-down"
                  color="primary"
                  dense
                  flat
                  round
                  size="xs"
                  v-if="column.sections.length>1 && i<column.sections.length-1"
                  @click="moveSectionDown(i)"
                >
                  <q-tooltip>Move Down</q-tooltip>
                </q-btn>
                <!-- Btn Down -->
                <q-btn
                  icon="fas fa-times"
                  color="primary"
                  dense
                  flat
                  round
                  size="xs"
                  v-if="i > 0"
                  @click="removeSection(index,i)"
                >
                  <q-tooltip>Remove</q-tooltip>
                </q-btn>
                <!-- Btn Remove -->
              </q-bar>

              <nl2br
                v-if="section !== undefined"
                tag="div"
                :text="section.chords + '|'"
                class-name="songChords"
              />
              <nl2br
                v-if="section !== undefined"
                tag="div"
                :text="section.text"
                :class-name="'songText ' + section.type"
              />
            </div>
          </div>
        </div>

        <!-- Song Items -->
      </q-card-section>
    </q-card>
    <vue-draggable-resizable
      :w="400"
      :h="400"
      :x="500"
      :y="100"
      :parent="true"
      class="no-overflow"
      drag-cancel=".nodrag"
      v-if="song.columns[selectedColumn] !== undefined "
    >
      <q-card style="width 100%; margin:10px">
        <q-bar dark class="bg-primary text-white">
          <q-btn flat icon="fas fa-file" label="Add Section" @click="addSection" />
          <q-btn flat icon="fas fa-columns" label="Add Column" @click="addColumn" />
        </q-bar>
        <q-list bordered class="rounded-borders">
          <q-expansion-item expand-separator icon="fas fa-info" label="Song Info" group="accordion">
            <q-card>
              <q-card-section>
                <q-input
                  color="primary"
                  v-model="song.title"
                  filled
                  dense
                  placeholder="Title"
                  class="nodrag"
                />
              </q-card-section>
              <q-card-section>
                <q-input
                  color="primary"
                  v-model="song.original_title"
                  filled
                  dense
                  placeholder="Original Title"
                  class="nodrag"
                />
              </q-card-section>
              <q-card-section>
                <q-input
                  color="primary"
                  v-model="song.author"
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
                      v-model="song.number"
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
                      v-model="song.category"
                      filled
                      dense
                      placeholder="Category"
                      class="nodrag"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <!-- Song Info -->
          <q-expansion-item expand-separator icon="fas fa-font" label="Lyrics" group="accordion">
            <q-card>
              <q-card-section class="text-center">
                <q-btn-toggle
                  v-model="song.columns[selectedColumn].sections[selectedSection].type"
                  size="sm"
                  push
                  flat
                  toggle-color="primary"
                  v-if="song.columns[selectedColumn].sections[selectedSection] !== undefined"
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
                  v-if="song.columns[selectedColumn].sections[selectedSection] !== undefined"
                  v-model="song.columns[selectedColumn].sections[selectedSection].text"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <!-- Text Section -->
          <q-expansion-item expand-separator icon="fas fa-music" label="Chords" group="accordion">
            <q-card
              v-if="selectedSection !== null && song.columns[selectedColumn].sections.length>0 && song.columns[selectedColumn].sections[selectedSection] !== undefined"
            >
              <q-card-section>
                <q-input
                  color="primary"
                  filled
                  type="textarea"
                  placeholder="Enter chords here"
                  v-if="song.columns[selectedColumn].sections[selectedSection] !== undefined"
                  v-model="song.columns[selectedColumn].sections[selectedSection].chords"
                  class="nodrag"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <!-- Chords Section -->
        </q-list>
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
    songEdit:{
      required:true
    }
  },
  mounted() {
    
     this.$root.$on("editSong", song => {
      this.song = song;
      
    });
     this.$root.$on("newSong", song => {
      this.song = {
        title: null,
        author: null,
        deleted:false,
        columns: []
      };
      this.addColumn();
    });
    
  },
  data() {
    return {
      edit:true,
      song: {
        title: null,
        author: null,
        deleted:false,
        columns: []
      },

      selectedSection: 0,
      selectedColumn: 0,
      expandedItem: null
    };
  },
  methods: {
    addSection() {
      this.song.columns[this.selectedColumn].sections.push({
        type: "verse",
        text: "",
        chords: ""
      });
      this.selectedSection =
        this.song.columns[this.selectedColumn].sections.length - 1;
    },
    makeSelection(section, column) {
      this.selectedSection = section;
      this.selectedColumn = column;
    },
    removeSection(columns,index) {
      this.song.columns[columns].sections.splice(index, 1);
    },
    addColumn() {
      this.song.columns.push({
        sections: [{ text: "", chords: "", type: "verse" }]
      });
      this.selectedColumn = this.song.columns.length - 1;
      this.selectedSection = 0;
    },
    removeColumn() {
      this.song.columns.splice(this.selectedColumn, 1);
      this.selectedColumn--;
    },
    confirmRemove(){
       this.$q.notify({
        message:"All elements of this column will be deleted. Do you want to continue?",
        color:'negative',
        icon:'fas fa-exclamation-triangle',
        textColor:'white',
        position:'center',
        actions: [
          { label: 'Yes', color: 'yellow', handler: () => this.removeColumn() },
         { label: 'Dismiss', color: 'white', handler: () => console.log('dismiss') }
        ]
      });
    },
    selectSection(index) {
      this.selectedSection = index;
    },
    moveSectionDown(index) {
      this.song.columns[this.selectedColumn].sections.splice(
        index + 1,
        0,
        this.song.columns[this.selectedColumn].sections.splice(index, 1)[0]
      );
    },
    moveSectionUp(index) {
      this.song.columns[this.selectedColumn].sections.splice(
        index - 1,
        0,
        this.song.columns[this.selectedColumn].sections.splice(index, 1)[0]
      );
    },
    moveSectionRight(column, section) {
      let sectionArray = this.song.columns[column].sections[section];
      this.song.columns[column].sections.splice(section, 1);
      this.song.columns[column + 1].sections.push(sectionArray);
    },
    moveSectionLeft(column, section) {
      let sectionArray = this.song.columns[column].sections[section];
      this.song.columns[column].sections.splice(section, 1);
      this.song.columns[column - 1].sections.push(sectionArray);
    },
    saveSong() {
      this.song.email = this.user.email;
      this.song.organizationID = this.user.organizationID;
      if(this.songEdit===false){
         this.$firestore.collection('songs').add(this.song)
      } else {
        const songid = this.song.songid;
     
        delete this.song.songid;
           console.log(songid)
        this.$firestore.collection('songs').doc(songid).update(this.song)
      }
      


      /*
      this.$axios
        .post("http://localhost:7777/api/songs", { song: this.song })
        .then(res => {
          console.log(res);
        });
        */
      this.song = {
        title: null,
        author: null,
        columns: []
      };
      this.$root.$emit("updateSongs");
      this.closeEditor();
        this.$q.notify({
        message: 'Song was saved',
        color: 'positive'
      })
    },
    closeEditor() {
      this.$root.$emit("closeEditor");
    }
  },
  computed: {
   user(){
     return {
       email: this.$store.getters["defaultModule/getEmail"],
       organizationID: this.$store.getters["defaultModule/getOrganizationID"]
     }
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
</style>
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
        {{song.title}}
        <q-space />
        <q-btn dense flat icon="close" @click="closeDialog()">
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
            <div v-for="(section, i) in column.sections" :key="i" class="sectionContainer">
              <nl2br
                v-if="section !== undefined"
                tag="div"
                :text="transposedChords(section.chords)"
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
  </q-dialog>
</template>
<script>
export default {
  name: "ChordViewer",
  props: {
    show: {
      required: true
    }
  },
  mounted() {
  
    this.$renderer.on("song",(event,song)=>{
      console.log(song)
      this.song = song
    })

    this.$renderer.on("left", (evt) => {
      this.transpose--
     
    });
    this.$renderer.on("right", (evt) => {
      this.transpose++
        
    });
  },
  data() {
    return {
      open: false,
      alert: false,
      transpose: 0,
      lineheight: 40,
      song: {
        title: null,
        author: null,
        columns: []
      },

      selectedSection: 0,
      selectedColumn: 0,
      expandedItem: null
    };
  },
  methods: {
    closeDialog() {
      this.$root.$emit("closeChordViewer");
    },
    transposedChords(chords) {
      return this.$ws.transpose(chords, this.transpose, this.song.notation);
    }
  },
  computed: {
    textStyle() {
      return this.song.column[this.selectedColumn].sections[
        this.selectedSection
      ].chords;
    }
  },
  watch:{
    transpose(){
       console.log("TRANSPOSE PRIMA",this.transpose)
      if(this.transpose > 11){
        this.transpose = 0;
      }
      if(this.transpose === -1){
        this.transpose = 11 
      }
       console.log("TRANSPOSE DOPO",this.transpose)
    }
  }
};
</script>
<style >
:root {
  --songtext_lineheight: 40px;
}
.bg-col {
  background: #cccccc;
}
.songText {
  color: #595959;
  font-size: 18px;
  line-height: var(--songtext_lineheight);
  padding-top: 15px;
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
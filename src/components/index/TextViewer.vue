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
          <div style="padding-left:20px; " v-for="(column,index) in song.columns" :key="index">
            <div v-for="(section, i) in column.sections" :key="i" class="sectionContainer">
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
  name: "TextViewer",
  props: {
    show: {
      required: true
    }
  },
  mounted() {
   this.$renderer.on("song",(event,song)=>{
      this.song = song
    })
  },
  data() {
    return {
      open: false,
      alert: false,
      transpose: 0,
      lineheight: 40,
      font_size:50,
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
      return this.$ws.transpose(chords, this.transpose);
    },
    
  },
  computed: {
    cssProps() {
      return {
        '--text-font-size': this.font_size + "px"
      };
    }
  }
};
</script>
<style scoped >

.bg-col {
  background: #cccccc;
}
.songText {
  color: #595959;
  font-size: 30px;
  line-height: 35px; /* TODO */
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
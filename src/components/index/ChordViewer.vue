<template>
  <q-dialog
    v-model="show"
    persistent
    :maximized="true"
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card>
      <q-bar dark class="bg-grey glossy text-white">
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
            v-for="(column,index) in partPosition"
            :key="index"
          >
            <div v-for="(section, i) in column" :key="i" class="sectionContainer">
              <div
                :style="{
                             'white-space': 'pre', 
                            'color':textStyle.chordsColor, 
                            'font-size': textStyle.size + 'px',
                            'font-weight': textStyle.chordsWeight,
                            'line-height': textStyle.size*2.2 + 'px',
                            'position': 'absolute',
                            }"
                v-if="song.sections[section] !== undefined"
                v-show="showChords"
              >{{song.sections[section].chords}}</div>
              <div
                :style="{
                              'white-space': 'pre', 
                            'color':textStyle.textColor, 
                            'font-size': textStyle.size + 'px',
                              'font-weight': textStyle.textWeight,
                            'padding-top': textStyle.size + 'px',
                            'line-height': textStyle.size*2.2 + 'px',
 
 
                            }"
                v-if="song.sections[section] !== undefined"
                editable="true"
              >{{song.sections[section].text}}</div>
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
    },
    showChords: {
      default: true
    }
  },
  mounted() {
    this.$renderer.on("song", (event, song) => {
      console.log(song);
      this.song = song;
    });

    this.$renderer.on("left", evt => {
      this.transpose--;
    });
    this.$renderer.on("right", evt => {
      this.transpose++;
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
    partPosition() {
      let localSettings = this.$store.getters[
        "defaultModule/getSongsLocalSettings"
      ];

      if (
        localSettings[this.song.songid] !== undefined &&
        localSettings[this.song.songid]["partPosition"] !== undefined
      ) {
        return localSettings[this.song.songid]["partPosition"];
      } else {
        let partPosition = [[]];
        this.song.sections.forEach((section, index) => {
          partPosition[0].push(index);
        });
        return partPosition;
      }
    },
    textStyle() {
      let localSettings = this.$store.getters[
        "defaultModule/getSongsLocalSettings"
      ];
      return localSettings[this.song.songid] !== undefined &&
        localSettings[this.song.songid]["textStyle"] !== undefined
        ? localSettings[this.song.songid]["textStyle"]
        : {
            size: 18,
            chordsColor: "red",
            textColor: "black",
            textWeight: "normal",
            chordsWeight: "bold"
          };
    },
    lineHeight() {
      return this.showChords == true ? 2.2 : 1.5;
    }
  },
  watch: {
    transpose() {
      console.log("TRANSPOSE PRIMA", this.transpose);
      if (this.transpose > 11) {
        this.transpose = 0;
      }
      if (this.transpose === -1) {
        this.transpose = 11;
      }
      console.log("TRANSPOSE DOPO", this.transpose);
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
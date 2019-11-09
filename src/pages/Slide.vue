<template>
  <q-layout>
    <q-page-container >
      <q-page
        class="flex flex-center"
        style="background-color:#000000;"
       v-bind:style="$ws.getSlideBackround(slide.songID,slide.index)"
      >
        <div
          style="width: 100%;height:100%"
          v-if="$ws.getSlideBackgroundInfo(slide.songID,slide.index).backgroundType === 'video'"
        >
          <div class="video-container">
            <div class="songText" style="width: 100%; height: 100%;  position:absolute; top:25%;  z-index: 999;">
              <div style="padding-left:20px; ">
                <div class="sectionContainer" v-bind:style="$ws.getSlideTextColor(currentSongId,index)">
                  <nl2br
                    tag="div"
                    :text="slide.text"
                    :class-name="'songText '"
                    v-if="black===false"
                  />
                </div>
              </div>
            </div>
            <video
              autoplay
              muted
              loop
              v-if="$ws.getSlideBackgroundInfo(slide.songID,slide.index).backgroundType === 'video'"
              id="video"
              :src="$ws.getSlideBackgroundInfo(slide.songID,slide.index).filePath"
              style="width: 100%; height: 100%;"
            ></video>
          </div>
        </div>

        <div class="songText"   v-else>
          <div style="padding-left:20px;  ">
            <div class="sectionContainer" v-bind:style="$ws.getSlideTextColor(currentSongId,index)">
              <nl2br tag="div" v-resize-text :text="slide.text" :class-name="'songText '" v-if="black===false" />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style>
</style>

<script>
export default {
  name: "Slide",
  components: {},
  mounted() {
    this.$renderer.on("slide-content-play", (evt, slide) => {
      this.slide = slide;
    });

    this.$renderer.on("black", (evt, status) => {
      this.black = status;
    });
  },
  data() {
    return {
      slide: "",
      black: false
    };
  },
  methods: {},
  computed: {
    songsLocalSettings() {
      return this.$store.getters["defaultModule/getSongsLocalSettings"];
    }
  }
};
</script>
<style scoped>
.songText {
  font-size: 65px;
  line-height: 80px;
  display: block;
  color: #ffffff;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  -webkit-text-stroke: 2px black; 

}

.sectionContainer {
  position: relative;
  margin: 0px;
}
.selectedSection {
  border: 1px dotted #dddddd;
  border-radius: 5px;
}
.video-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%; 
  overflow: hidden;
}

.video-container video {
  /* Make video to at least 100% wide and tall */
  min-width: 100%; 
  min-height: 100%; 
  
  /* Setting width & height to auto prevents the browser from stretching or squishing the video */
  width: auto;
  height: auto;
  z-index: 0;
  /* Center the video */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}



</style>

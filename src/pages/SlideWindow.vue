<template>
  <div
    class="slide-container"
    :style="{width: '100vw', height: '100vh', 'background-color':template.backgroundColor}"
  >
    <transition :name="transitionName">
      <div
        v-if="visible && black===false"
        class="text"
        :style="{'align-self':template.valign, 'background-color':template.textBackground,color:template.textColor, 'text-shadow':'2px 2px 2px black', border:'1px solid ' + template.textBoxColor}"
        v-resize-text="{ratio:'1.8', minFontSize:'35px', maxFontSize:'65px', delay:200, }"
      >{{text}}</div>
    </transition>
    <div class="background-container" :style="{'background-image':'url('+template.filePath+')'}" v-if="black===false">
      <div class="wrapper">
        <transition name="fade">
          <video
            v-if="fileExtension==='mp4'"
            muted
            loop
            autoplay
            id="video"
            :src="template.filePath"
          ></video>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SlideWindow",
  mounted() {
    this.$renderer.on("slide-content-play", (evt, slide) => {
    this.slide = slide
      this.text = slide.text.toUpperCase()
      this.template = slide.template
    });

    this.$renderer.on("black", (evt, status) => {
      console.log("black",status)
      this.black = status;
    });

    this.$renderer.on("text", (evt, status) => {
        console.log("text",status)
      this.visible = status;
    });
  },
  props: {},
  data() {
    return {
      video: null,
      visible: true,
      slide: null,
      black:false,
      src: "",
      text: `Amazing Grace, How sweet the sound
That saved a wretch like me
I once was lost, but now am found
T'was blind but now I see`.toUpperCase(),
      template: {
        default: {
          id: null,
          templateName: null,
          filePath: null,
          backgroundColor: "black",
          textColor: "white",
          textAlign: "flex-center",
          textBackground: "transparent",
          textBoxColor: "transparent",
          textShadow: "black",
          transition: "fade",
          valign: "flex-center"
        }
      }
    };
  },
  methods: {
    transition() {
      this.visible = false;
      setTimeout(() => {
        this.visible = true;
      }, 200);
    }
  },
  watch: {
    text() {
      this.transition();
    },

    transitionName() {
      this.transition();
    },
    backgroundColor() {
      this.template.filePath = null;
    }
  },
  computed: {
    fileExtension() {
  if(this.template.filePath !== undefined && this.template.filePath !== null) {
        const extArray = this.template.filePath.split(".");
        return extArray[extArray.length - 1];
      }
    },
    backgroundColor() {
      return this.template.backgroundColor;
    },
    transitionName() {
      return this.template.transition;
    }
  }
};
</script>

<style>
.slide {
  /*
 width:160px;
  height:110px;
  */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer !important;
}
.slide-container {
  /*
  width:150px;
  height:100px;
  */
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 3px;
  position: relative;
}

.selected {
  background: linear-gradient(
    to bottom,
    rgba(248, 80, 50, 1) 0%,
    rgba(241, 111, 92, 1) 50%,
    rgba(246, 41, 12, 1) 51%,
    rgba(240, 47, 23, 1) 71%,
    rgba(231, 56, 39, 1) 100%
  );
}

.unselected {
  background: linear-gradient(
    to bottom,
    rgba(161, 161, 161, 1) 0%,
    rgba(156, 156, 156, 1) 50%,
    rgba(148, 148, 148, 1) 51%,
    rgba(181, 181, 181, 1) 100%
  );
}

.text {
  width: 100%;
  line-height: 120%;
  font-weight: bolder;
  text-align: center;
  white-space: pre-line;
  margin-bottom: 5px;
  z-index: 2;
}

.background-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-size: cover;
}
.background-container video {
  /* Make video to at least 100% wide and tall */
  min-width: 100%;
  min-height: 100%;

  /* Setting width & height to auto prevents the browser from stretching or squishing the video */
  width: auto;

  /* Center the video */
  position: absolute;
  /*top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);*/
}
</style>
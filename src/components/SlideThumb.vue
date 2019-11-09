<template>
  <div
    class="slide"
    :style="{width: w+10 + 'px', height: h+10 + 'px'}"
    :class="{'selected': selected, 'unselected': !selected}"
  >
    <div class="slide-container" :style="{width: w + 'px', height: h + 'px', 'background-color':template.backgroundColor}">
      <transition
        :name="transitionName"
      >
        <div
          v-if="visible"
          class="text"
          :style="{'align-self':template.valign, 'background-color':template.textBackground,color:template.textColor, 'text-shadow':'1px 1px 2px black', border:'1px solid ' + template.textBoxColor}"
          v-resize-text="{ratio:ratio, minFontSize:'8px', maxFontSize:'16px', delay:200, }"
        >{{text}}</div>
      </transition>
      <div class="background-container" :style="{'background-image':'url('+template.filePath+')'}">
        <div class="wrapper">
          <video
            v-if="fileExtension==='mp4'"
            :style="{height:h+'px'}"
            muted
            loop
            :autoplay="autoplay"
            preload="metadata"
            id="video"
            :src="template.filePath"
          ></video>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "SlideThumb",
  props: {
    text: {
      default:  `Amazing Grace, How sweet the sound
That saved a wretch like me
I once was lost, but now am found
T'was blind but now I see`.toUpperCase()
    },
    selected: {
      required: true
    },
    w: {
      required: true
    },
    h: {
      required: true
    },
    ratio: {
      required: true
    },
    autoplay: {
      default: false
    },
    src: {
      default: ""
    },
    template:{
      default:{
            id:null,
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
          },
    }
  },
  mounted() {
    this.transition()
  },
  data() {
    return {
      video: null,
      visible:true
    };
  },
  methods:{
    transition(){
      this.visible = false
      setTimeout(()=>{
        this.visible = true
      },200)
    }
  },
  watch:{
    text(){
      this.transition()
    },

    transitionName(){
      this.transition()
    },
    backgroundColor(){
      this.template.filePath = null
    }
  },
 computed:{
   fileExtension(){
     if(this.template.filePath !== undefined && this.template.filePath !== null)
     {
        const extArray = this.template.filePath.split('.')
      return extArray[extArray.length-1]
     }
   },
   backgroundColor(){
     return this.template.backgroundColor
   },
   transitionName(){
     return this.template.transition
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
  border-radius: 5px;
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
 font-family: Helvetica, Arial, sans-serif;
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
  background-size: cover
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
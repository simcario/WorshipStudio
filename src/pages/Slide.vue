<template>
  <q-layout>
    <q-page-container>
    <q-page class="flex flex-center" style="background-color:#000000;">
    <div class="songText">
      <div style="padding-left:20px; ">
        <div class="sectionContainer" >
          <nl2br
            tag="div"
            :text="slide"
            :class-name="'songText '"
            v-if="black===false"
          />
        
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
    this.$renderer.on("slide-content-play",(evt, text)=>{ 
     this.slide = text;
    })  

     this.$renderer.on("black",(evt, status)=>{ 
      this.black = status;
    })  
  },
  data() {
    return {
        slide:'',
        black:false

    };
  },
  methods: {},
  computed: {
     
  }
};
</script>
<style scoped>
.songText {
  font-size:55px;
  line-height: 80px;
  display: block;
  color: #FFFFFF;
  text-align: center;
  text-transform: uppercase
  
}

.sectionContainer {
  position: relative;
  margin: 0px;
}
.selectedSection {
  border: 1px dotted #dddddd;
  border-radius: 5px;
}
</style>

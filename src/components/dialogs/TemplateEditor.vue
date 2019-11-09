<template>
  <q-dialog v-model="open" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card style="min-width:900px">
      <q-bar>
        {{scope==='new' ? 'New' : 'Edit'}} Template
        <q-space />
        <q-btn dense flat icon="close" @click="closePupup()">
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="q-pa-md">
          <div class="row">
            <div class="col-6">
              <SlideThumb
                :w="350"
                :h="250"
                :ratio="1"
                :selected="false"
                :autoplay="true"
                :template="templateProperties"
              />
            </div>
            <div class="col-6 q-pa-xs">
              <div class="row">
                <div class="col-12">
                  <q-input filled dense label="Template Name" v-model="templateName"></q-input>
                </div>

                <div class="col-12">
                  <q-btn-group push class="q-ma-xs">
                    <!-- Background Image Button -->
                    <q-btn
                      style="background: #DDDDDD;"
                      text-color="purple"
                      glossy
                      unelevated
                      flat
                      icon="fas fa-image"
                      @click="chooseBackground()"
                    >
                      <q-tooltip>Background Video or Image</q-tooltip>
                    </q-btn>

                    <!-- Background Color Button -->
                    <q-btn
                      dark
                      :style="{background: '#DDDDDD'}"
                      text-color="purple"
                      lossy
                      unelevated
                      icon="fas fa-fill-drip"
                      flat
                    >
                      <q-tooltip>Background Color</q-tooltip>

                      <div
                        class="picker-result"
                        :style="{'background-color': backgroundColor}"
                      >&nbsp;</div>
                      <q-popup-proxy>
                        <q-color v-model="backgroundColor" format-model="hexa" />
                      </q-popup-proxy>
                    </q-btn>
                  </q-btn-group>
                  <q-btn-group push class="q-ma-xs">
                    <!--Font ColorButton -->
                    <q-btn
                      dark
                      :style="{background: '#DDDDDD'}"
                      text-color="purple"
                      lossy
                      unelevated
                      icon="fas fa-font"
                      flat
                    >
                      <q-tooltip>Text Color</q-tooltip>
                      <div class="small-icon">
                        <q-icon name="fas fa-palette" size="10px" />
                      </div>
                      <div
                        class="picker-result"
                        :style="{'background-color': textColor}"
                      >&nbsp;</div>
                      <q-popup-proxy>
                        <q-color v-model="textColor" format-model="hexa" />
                      </q-popup-proxy>
                    </q-btn>
                    <!-- Text Background Button -->
                    <q-btn
                      dark
                      :style="{background: '#DDDDDD'}"
                      text-color="purple"
                      lossy
                      unelevated
                      icon="fas fa-font"
                      flat
                    >
                      <q-tooltip>Text Background Color</q-tooltip>
                      <div class="small-icon">
                        <q-icon name="fas fa-fill-drip" size="10px" />
                      </div>
                      <div
                        class="picker-result"
                        :style="{'background-color': textBackground}"
                      >&nbsp;</div>
                      <q-popup-proxy>
                        <q-color v-model="textBackground" format-model="hexa" />
                      </q-popup-proxy>
                    </q-btn>
                    <q-btn
                      dark
                      :style="{background: '#DDDDDD'}"
                      text-color="purple"
                      lossy
                      unelevated
                      icon="fas fa-font"
                      flat
                    >
                      <q-tooltip>Text Box Border Color</q-tooltip>
                      <div class="small-icon">
                        <q-icon name="crop_16_9" size="10px" />
                      </div>
                      <div
                        class="picker-result"
                        :style="{'background-color': textBoxColor}"
                      >&nbsp;</div>
                      <q-popup-proxy>
                        <q-color v-model="textBoxColor" format-model="hexa" />
                      </q-popup-proxy>
                    </q-btn>
                  </q-btn-group>
                  <q-btn-group class="q-ma-xs">
                    <q-btn
                      style="background: #DDDDDD;"
                      text-color="purple"
                      glossy
                      unelevated
                      flat
                      icon="vertical_align_bottom"
                      @click="valign = 'flex-end'"
                    >
                      <q-tooltip>Text Align Top</q-tooltip>
                    </q-btn>
                    <q-btn
                      style="background: #DDDDDD;"
                      text-color="purple"
                      glossy
                      unelevated
                      flat
                      icon="vertical_align_center"
                      @click="valign = 'center'"
                    >
                      <q-tooltip>Text Align Middle</q-tooltip>
                    </q-btn>
                    <q-btn
                      style="background: #DDDDDD;"
                      text-color="purple"
                      glossy
                      unelevated
                      flat
                      icon="vertical_align_top"
                      @click="valign = 'flex-start'"
                    >
                      <q-tooltip>Text Align Bottom</q-tooltip>
                    </q-btn>
                  </q-btn-group>

                  <q-select
                    filled
                    v-model="transition"
                    :options="transitions"
                    label="Transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn
          color="grey-5"
          text-color="purple"
          glossy
          icon="fas fa-save"
          label="Save"
          @click="saveTemplate()"
        />
        <q-btn
          color="grey-5"
          text-color="purple"
          glossy
          icon="fas fa-ban"
          label="Cancel"
          @click="closePupup()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import SlideThumb from "../SlideThumb";
import uniqid from "uniqid";
export default {
  name: "TemplateEditor",
  components: { SlideThumb },
  props: {
    open: {
      default: false
    },
    scope: {
      default: "new"
    },
    templateProps: {
      default: null
    },
  },
  mounted() {
    
   

    this.$renderer.on("choose-background", (event, data) => {
      const filePath = data.filePath.replace(/\\/g, "/");
    
      this.template.filePath = filePath;
    });
  },
  data() {
    return {
      transitions: [
        "bounce",
        "bounceDown",
        "bounceLeft",
        "bounceRight",
        "bounceUp",
        "fade",
        "fadeDown",
        "fadeDownBig",
        "fadeLeft",
        "fadeLeftBig",
        "fadeRight",
        "fadeRightBig",
        "fadeUp",
        "fadeUpBig",
        "flip",
        "flipX",
        "flipY",
        "rotate",
        "rotateDownLeft",
        "rotateDownRight",
        "rotateUpLeft",
        "rotateUpRight",
        "slideDown",
        "slideLeft",
        "slideRight",
        "slideUp",
        "zoom",
        "zoomDown",
        "zoomLeft",
        "zoomRight",
        "zoomUp",
        "lightSpeed"
      ],

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
          valign: "center"
    };
  },
  methods: {
    closePupup() {
       this.id= null;
          this.templateName=null;
          this.filePath= null;
          this.backgroundColor= "black";
          this.textColor= "white";
          this.textAlign="flex-center";
          this.textBackground="transparent"
          this.textBoxColor= "transparent"
          this.textShadow= "black"
          this.transition="fade";
         this.valign = "center"
      this.$root.$emit("close-template-editor");
    },
    chooseBackground() {
      this.$renderer.send("select-file", {
        title: "Choose Background File",
        event: "choose-background",
        filters: [
          { name: "All Files", extensions: ["jpg", "png", "mp4"] },
          { name: "jpg", extensions: ["jpg"] },
          { name: "png", extensions: ["png"] },
          { name: "mp4", extensions: ["mp4"] }
        ],
        data: []
      });
    },
    saveTemplate() {
      this.id = this.templateID;

      this.$store
        .dispatch("defaultModule/saveSlideTemplate",this.templateProperties)
        .then(
          
          this.closePupup()
        );
    }
  },
  computed: {
    templateID() {
      if (this.id === null) {
        return uniqid("template-");
      } else {
        return this.id;
      }
    },
    templateProperties(){
      return {
            id:this.id,
            templateName: this.templateName,
            filePath: this.filePath,
            backgroundColor: this.backgroundColor,
            textColor: this.textColor,
            textAlign: this.textAlign,
            textBackground: this.textBackground,
            textBoxColor: this.textBoxColor,
            textShadow: this.textShadow,
            transition: this.transition,
            valign: this.valign
          }
    }

  },
  watch:{
    open(){
       if(this.templateProps !== null){
          this.id= this.templateProps.id;
          this.templateName= this.templateProps.templateName;
          this.filePath= this.templateProps.filePath;
          this.backgroundColor= this.templateProps.backgroundColor;
          this.textColor= this.templateProps.textColor;
          this.textAlign= this.templateProps.textAlign;
          this.textBackground=this.templateProps.textBackground;
          this.textBoxColor= this.templateProps.textBoxColor;
          this.textShadow= this.templateProps.textShadow;
          this.transition= this.templateProps.transition;
         this.valign = this.templateProps.valign
    }
    }
  }
};
</script>

<style>
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
  right: 10px;
  top: 0px;
}
</style>
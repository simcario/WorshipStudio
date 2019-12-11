<template>
  <q-page>
    <splitpanes class="default-theme" style="height: 88vh">
      <pane size="25">
        <splitpanes horizontal>
          <pane class="bg-grey-5" size="42">
            <div class="row justify-center">
              <div class="col-auto">
                <SlideThumb
                  v-if="selectedSlideIndex !== null"
                  :text="songParts[selectedSlideIndex].text.toUpperCase()"
                  :w="350"
                  :h="250"
                  :ratio="1"
                  :selected="false"
                  :autoplay="true"
                  :template="slideTemplate(selectedSlideIndex)"
                />
              </div>
            </div> </pane
          ><!-- Slide Preview -->
          <pane size="40" style="display:flex">
            <q-card dark class="bg-grey-9" style="width:100%">
              <q-card-section style="height:20% ;padding:0px;overflow:hidden">
                <q-input
                  filled
                  dense
                  dark
                  :label="$t('search')"
                  v-model="searchText"
                >
                  <template v-slot:prepend>
                    <q-icon name="fas fa-search" />
                  </template>
                  <template v-slot:append v-if="searchText !== ''">
                    <q-icon name="close" @click="clearText()" />
                  </template>
                </q-input>
              </q-card-section>
              <q-card-section
                class="scroll"
                style="height:80% ;padding:0px;overflow-y:scroll"
              >
                <q-list dense>
                  <div v-for="(song, index) in songs" :key="index">
                    <q-item
                      clickable
                      v-ripple
                      :active="song._id === currentSong"
                      active-class="bg-grey-8 text-white"
                      style="padding: 0px 16px;"
                      @click="openSong(song._id)"
                   
                    >
                      <q-menu touch-position context-menu>
                        <!-- Context Menu -->
                        <q-list dense style="min-width: 100px">
                          <q-item
                            clickable
                            v-close-popup
                            @click="openSong(song._id)"
                          >
                            <q-item-section avatar>
                              <q-icon
                                size="16px"
                                name="fas fa-external-link-alt"
                              />
                            </q-item-section>
                            <q-item-section>Open...</q-item-section>
                          </q-item>
                          <q-item
                            clickable
                            v-close-popup
                            @click="editSong(song)"
                          >
                            <q-item-section avatar>
                              <q-icon size="16px" name="fas fa-edit" />
                            </q-item-section>
                            <q-item-section>Edit</q-item-section>
                          </q-item>
                          <q-item
                            clickable
                            v-close-popup
                            @click="openDeleteDialog(song._id)"
                          >
                            <q-item-section avatar>
                              <q-icon size="16px" name="fas fa-trash-alt" />
                            </q-item-section>
                            <q-item-section>Delete</q-item-section>
                          </q-item>
                          <q-separator />
                          <q-item
                            clickable
                            v-close-popup
                            @click="$root.$emit('add-to-playlist', song._id)"
                          >
                            <q-item-section avatar>
                              <q-icon size="16px" name="fas fa-list" />
                            </q-item-section>
                            <q-item-section>Add to Playlist</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                      <q-item-section @dblclick="openSongFull(song)">
                        <q-item-label style="font-weight:bold">{{
                          song.title
                        }}</q-item-label>
                        <q-item-label caption class="text-white">{{
                          song.author
                        }}</q-item-label>
                      </q-item-section>
                      <q-item-section top side class="text-white">
                        {{ song.number }}
                      </q-item-section>
                    </q-item>
                    <q-separator v-if="index < songs.length - 1" />
                  </div>
                </q-list>
              </q-card-section>
            </q-card>
          </pane>
          <!-- Library-->

          <pane style="display:flex">
            <q-card dark class="bg-grey-9 fill" style="width:100%">
              <q-tabs
                dense
                v-model="activeTab"
                class="bg-grey-9 shadow-2 glossy text-white"
                style="height:50px"
              >
                <q-tab name="currentPlaylist" label="Playlist" />
                <q-tab name="cloudPlaylists" label="Cloud Playlists">
                  <q-badge
                    v-show="cloudPlaylists.length > 0"
                    color="red"
                    floating
                    >{{ cloudPlaylists.length }}</q-badge
                  >
                </q-tab>
              </q-tabs>
              <q-tab-panels
                v-model="activeTab"
                style="height:70%"
                class="bg-grey-9"
              >
                <!--Playlist -->
                <q-tab-panel
                  name="currentPlaylist"
                  style="padding:0px; overflow-y:auto"
                >
                  <q-list dark class="bg-grey-9">
                    <draggable
                      class="list-group bg-grey-9"
                      tag="div"
                      v-model="playlist.items"
                      @end="$ws.updatePlaylist(playlist)"
                    >
                      <div v-for="(song, index) in playlist.items" :key="index">
                        <q-item
                          clickable
                          v-ripple
                          :active="song === currentSong"
                          active-class="bg-grey-8 text-white"
                          style="padding: 0px 16px;"
                          @click="openPlaylistSong(index)"
                          v-if="songList[song] !== undefined"
                        >
                          <q-menu touch-position context-menu>
                            <!-- Context Menu -->
                            <q-list dense style="min-width: 100px">
                              <q-item
                                clickable
                                v-close-popup
                                @click="$ws.removeFromPlaylist(index)"
                              >
                                <q-item-section avatar>
                                  <q-icon size="16px" name="fas fa-ban" />
                                </q-item-section>
                                <q-item-section>Remove</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                          <q-item-section>
                            <div>
                             
                              {{ songList[song].title }}
                            </div>
                          </q-item-section>
                          <q-item-label caption>{{
                            songList[song].author
                          }}</q-item-label>
                          <q-item-section top side class="text-white">
                            {{ songList[song].number }}
                           
                          </q-item-section>
                        </q-item>
                        <q-separator v-if="index < playlist.items.length - 1" />
                      </div>
                    </draggable>
                  </q-list>
                </q-tab-panel>
                <q-tab-panel name="cloudPlaylists" class="q-pa-none">
                  <q-list dark>
                    <div v-for="(pl, index) in cloudPlaylists" :key="index">
                      <q-item
                        clickable
                        v-ripple
                        @dblclick="$ws.loadCloudPlaylist(pl)"
                      >
                        <q-menu touch-position context-menu>
                          <!-- Context Menu -->
                          <q-list dense style="min-width: 100px">
                            <q-item
                              clickable
                              v-close-popup
                              @click="removeCloudPlaylist(pl.id)"
                            >
                              <q-item-section avatar>
                                <q-icon size="16px" name="fas fa-trash-alt" />
                              </q-item-section>
                              <q-item-section>Delete</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                        <q-item-section>
                          <q-item-label>{{ pl.title }}</q-item-label>
                          <q-item-label caption>
                            Created by
                            <strong>{{ pl.createdBy }}</strong>
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-separator v-if="index < cloudPlaylists.length - 1" />
                    </div>
                  </q-list>
                </q-tab-panel>
              </q-tab-panels>
              <q-bar dark dense class="bg-grey-8">
                <q-btn
                  flat
                  round
                  icon="fas fa-save"
                  color="white"
                  @click="playListNameDialog = true"
                >
                  <q-tooltip>Save Playlist</q-tooltip>
                </q-btn>
              </q-bar>
            </q-card>
          </pane>
          <!-- Library & Playlists -->
        </splitpanes>
      </pane>
      <!-- Left Panel -->

      <pane size="75" bg-grey-5>
        <splitpanes horizontal>
          <pane class="bg-grey-5">
            <div class="q-pa-xs">
              <div class="row justify-center">
                <div
                  class="col-2 q-ma-md"
                  style="cursor: pointer;"
                  v-for="(slide, index) in songParts"
                  :key="index"
                  @click="playSlide(slide, index)"
                >
                  <SlideThumb
                    :text="slide.text.toUpperCase()"
                    :w="190"
                    :h="135"
                    :ratio="2.5"
                    :selected="selectedSlideIndex === index"
                    :template="slideTemplate(index)"
                  />
                </div>
              </div>
            </div>
          </pane>
          <!-- Song Slides -->
          <pane>
            <q-tabs
              dense
              v-model="activeTab2"
              inline-label
              align="left"
              class="bg-grey-6 glossy"
            >
              <q-tab
                name="slide-templates"
                icon="fas fa-columns"
                label="Slide Templates"
              />
            </q-tabs>
            <q-tab-panels v-model="activeTab2">
              <q-tab-panel
                name="slide-templates"
                class="bg-grey-5"
                style="height:100vh;"
              >
                <q-card flat style="height:100%" class="bg-grey-5">
                  <div class="row">
                    <div
                      class="col-2 q-ma-md"
                      v-for="(template, index) in slideTemplates"
                      :key="index"
                    >
                      <SlideThumb
                        :w="190"
                        :h="135"
                        :ratio="2.5"
                        :selected="false"
                        :template="template"
                      />
                      <!-- Context Menu -->
                      <q-menu touch-position context-menu>
                        <q-list dense style="min-width: 100px">
                          <q-item
                            clickable
                            v-close-popup
                            @click="setSlideTemplate(template._id)"
                          >
                            <q-item-section
                              >Apply to selected Slide</q-item-section
                            >
                          </q-item>
                          <q-item
                            clickable
                            v-close-popup
                            @click="setSongTemplate(template._id)"
                          >
                            <q-item-section>Apply to whole Song</q-item-section>
                          </q-item>
                          <q-separator />
                          <q-item
                            clickable
                            v-close-popup
                            @click="editTemplate(template)"
                          >
                            <q-item-section>Edit Template</q-item-section>
                          </q-item>
                          <q-item
                            clickable
                            v-close-popup
                            @click="deleteTemplate(template.id)"
                          >
                            <q-item-section>Delete Template</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                      <!-- /Context Menu -->
                    </div>
                  </div>
                </q-card>
              </q-tab-panel>
            </q-tab-panels>
          </pane>
        </splitpanes>
      </pane>
      <!-- Right Panel -->
    </splitpanes>
    <TemplateEditor
      :open="TemplateEditorDialog"
      scope="edit"
      :templateProps="selectedTemplate"
      v-if="selectedTemplate !== null"
    />
    <TemplateEditor :open="TemplateEditorDialog" v-else />
  </q-page>
</template>

<script>
import draggable from "vuedraggable";
import SlideThumb from "../components/SlideThumb";
import TemplateEditor from "../components/dialogs/TemplateEditor";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

export default {
  name: "Slides",
  components: {
    Splitpanes,
    Pane,
    SlideThumb,
    TemplateEditor,
    draggable
  },
  mounted() {
    this.getCloudPlaylists();
    this.reloadSongs();
    this.$renderer.send("open-slide-window");
    this.$root.$on("open-template-editor", () => {
      this.TemplateEditorDialog = true;
    });
    this.$root.$on("close-template-editor", () => {
      this.TemplateEditorDialog = false;
      this.selectedTemplate = null;
      this.getSlideTemplates();
    });

    this.$renderer.send("get-playlist");

    this.$renderer.on("playlist-data", (evt, playlist) => {
      this.playlist = playlist;
    });

    this.getSlideTemplates();
  },
    sockets:{
    connect:function(){
      console.log("socket connected from slides")
    },
    openSong:function(data){
      console.log("SOCKET FULL SCREEN")
      if(this.link === true){
        this.$q.notify({
              message: data.name + ' has selected current song!',
              position: 'center'
            })
         this.openSong(data.id)
      }
       
    }
  },
  data() {
    return {
      activeTab: "currentPlaylist",
      activeTab2: "slide-templates",
      cloudPlaylists: [],
      currentSong: {},
      // playlist: [],
      searchText: "",
      selectedSlideIndex: null,
      selectedPlaylistIndex: null,
      selectedTemplate: null,
      slideTemplates: [],
      partsTemplates:{},
      songs: [],
      allSongs: {},
      templates: {},
      TemplateEditorDialog: false
    };
  },
  methods: {
    clearText() {
      this.searchText = "";
      this.$ws.allSongs("").then(songs => (this.songs = songs));
    },
    reloadSongs() {
      this.$ws.allSongs("").then(songs => (this.songs = songs));
    },
    openSong(id) {
      let sections = [];
      this.selectedSlideIndex = null;
      this.currentSong = id;
      let song = this.songList[id];
    },
    filterSongs(filter) {
      this.$ws.filterSongs(filter).then(songs => {
        console.log("FILTERED", songs);
        this.songs = songs;
      });
    },
    getSlideTemplates() {
      this.slideTemplates = [];
      this.$pouchApp
        .find({
          selector: {
            objectType: "slideTemplate"
          }
        })
        .then(docs => {
          docs.docs.forEach(doc => {
            this.slideTemplates.push(doc);
          });
        });
    },
    openPlaylistSong(index) {
      let sections = [];
      this.selectedPlaylistIndex = index;
      this.currentSong = this.playlist.items[index];
      this.openSong(this.currentSong);
    },
    playSlide(slide, index) {
      this.selectedSlideIndex = index;
      let slideData = {
        text: slide.text,
        index: index,
        songID: this.currentSong._id,
        template: this.slideTemplate(index)
      };
      this.$renderer.send("slide", slideData);
      //this.$socket.emit("slide", this.selectedSlideText);
    },
    slideTemplate(slideIndex) {
      
      let slidetemplate =  this.partsTemplates !== null && this.partsTemplates[slideIndex] !== undefined ? this.slideTemplatesById[this.partsTemplates[slideIndex]] :  {
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
          };
          
          return slidetemplate !== undefined ? slidetemplate : {
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
          };
     
    },
    setSlideTemplate(template) {
 

      this.$pouchSongsPref
        .find({
          selector: { songID: this.currentSong }
        })
        .then(docs => {
          docs.docs.forEach(doc => {
            doc["slideTemplates"][this.selectedSlideIndex] = template;
            this.$pouchSongsPref
              .put(doc)
              .then(() => {
                this.getSlideTemplates()
                console.log("DocumentUpdated with Slide Templates")
              });
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    setSongTemplate( template) {
        let slides = {}
        
        this.$pouchSongsPref
        .find({
          selector: { songID: this.currentSong }
        })
        .then(docs => {
          if(docs.docs.length>0){
             docs.docs.forEach(doc => {
               this.songParts.forEach((part,index)=>{
                 doc["slideTemplates"][index] = template;
              })
           
            this.$pouchSongsPref
              .put(doc)
              .then(() => {
                this.getSlideTemplates()
                console.log("Document Updated with Slide Templates")
              });
          });
          }else{
              let slides = {}
               this.songParts.forEach((part,index)=>{
                 slides[index] = template;
              })
            this.$pouchSongsPref
              .post({
                songID:this.currentSong,
                slideTemplates:slides
              })
              .then(() => console.log("Document Created with Slide Templates"));
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteTemplate(templateID) {
      this.$q.notify({
        message: "Load selected Cloud Playlist?",
        color: "warning",
        icon: "fas fa-question",
        textColor: "white",
        position: "center",
        actions: [
          {
            label: "Yes",
            color: "yellow",
            handler: () =>
              this.$store.dispatch(
                "defaultModule/deleteSongTemplate",
                templateID
              )
          },
          {
            label: "Dismiss",
            color: "white",
            handler: () => console.log("dismiss")
          }
        ]
      });
    },
    editTemplate(template) {
      console.log(template)
      this.selectedTemplate = template;
      this.TemplateEditorDialog = true;
    },
    getCloudPlaylists() {
      this.cloudPlaylists = [];
      this.$ws.cloudPlaylists().then(playlists => {
        this.cloudPlaylists = playlists;
      });
    },
    removeCloudPlaylist(id) {
      this.$q.notify({
        message: "Cloud Playlist will be removed. Continue?",
        color: "primary",
        actions: [
          {
            label: "Yes",
            color: "white",
            handler: () => {
              this.$ws.removeCloudPlaylist(id).then(() => {
                this.getCloudPlaylists();
              });
            }
          },
          { label: "No", color: "white" }
        ]
      });
    }
  },
  computed: {
    link(){
      return this.$parent.$parent.$parent.$data.link;
    },
    songParts() {
      return this.selectedSong !== undefined ? this.selectedSong.sections : [];
    },
    selectedSong() {
      return this.songList[this.currentSong];
    },
    playlist() {
      return this.$parent.$parent.$parent.$data.playlist;
    },
    slideTemplatesById(){
      let templates = {}
      this.slideTemplates.forEach(template=>{
        templates[template._id] = template
      })
      return templates;
    },
    songList() {
      let obj = {};

      if (this.songs !== null) {
        Object.keys(this.songs).forEach(k => {
          obj[this.songs[k]._id] = this.songs[k];
        });
      }
      return obj;
    },

  },
  watch: {
    searchText() {
      this.$ws.filterSongs(this.searchText).then(ret => {
        this.songs = ret;
      });
    },
    currentSong(){
      console.log('Get Local Resources')
      this.$ws.loadLocalResource(this.currentSong,'slideTemplates').then(docs=>this.partsTemplates=docs)
    }
  }
};
</script>

<style lang="scss">
.splitpanes__pane span {
  font-family: Helvetica, Arial, sans-serif;
  color: #fff;
  font-size: 5em;
  opacity: 0.6;
}
</style>
<style></style>

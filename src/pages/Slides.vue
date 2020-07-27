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
                  :w="340"
                  :h="240"
                  :ratio="2.5"
                  :selected="false"
                  :autoplay="true"
                  :template="slideTemplate(selectedSlideIndex)"
                />
              </div>
            </div> </pane
          ><!-- Slide Preview -->
          <pane size="40" style="display:flex">
            <Library />
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
                          dense
                          clickable
                          v-ripple
                          :active="song === currentSong"
                          active-class="bg-grey-8 text-white"
                          style="padding: 0px 16px;"
                          @click="openSong(song._id)"
                        >
                          <q-menu touch-position context-menu>
                            <!-- Context Menu -->
                            <q-list dense style="min-width: 100px">
                              <q-item
                                dense
                                clickable
                                v-close-popup
                                @click="removeFromPlaylist(index)"
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
                              {{ song.title }}
                            </div>
                          </q-item-section>
                          <q-item-label caption>{{ song.author }}</q-item-label>
                          <q-item-section top side class="text-white">
                            {{ song.number }}
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
                          <q-item-label>{{ pl.name }}</q-item-label>
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
                   v-if="
                licenseInfo.userProfile === 'superadmin' ||
                  licenseInfo.userProfile === 'admin' ||
                  licenseInfo.userProfile === 'worshipleader'
              "
                >
                  <q-tooltip>Save Playlist</q-tooltip>
                </q-btn>
                 <q-btn
              flat
              round
              icon="fas fa-ban"
              color="white"
              @click="playlist.items = []"
            >
              <q-tooltip>{{ $t("clear_playlist") }}</q-tooltip>
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
                  class="col-auto q-ma-md"
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
    draggable,
    Library: () => import("../components/Library")
  },
  mounted() {
    this.getCloudPlaylists();
    this.$bus.$on("loadplaylist", () => {
      this.getCloudPlaylists();
    });
    this.reloadSongs();

    this.$root.$on("library-double-click", id => {
      this.$store.dispatch("defaultModule/setCurrentSong", id);
      this.openSong(id);
    });

    this.$bus.$on("linkAction", action => {
      if (
        action.doc.actions.openSong !== undefined &&
        action.doc.actions.openSong.computer !==
          this.preferences.computerName &&
        this.link === true
      ) {
        this.$q.notify(
          action.doc.actions.openSong.computer + " ha aperto un brano"
        );
        this.openSong(action.doc.actions.openSong.songID);
      }
    });
    this.$root.$once("edit-song", id => {
      console.log("EDIT SONG");
      this.openFullScreen(id, true);
    });

    this.$renderer.send("open-slide-window");
    this.$root.$on("open-template-editor", () => {
      this.TemplateEditorDialog = true;
    });
    this.$root.$on("close-template-editor", () => {
      this.TemplateEditorDialog = false;
      this.selectedTemplate = null;
      this.getSlideTemplates();
    });
    this.$bus.$on("update-playlist", playlist => {
      console.log(playlist);
      this.playlist = playlist;
      sessionStorage.setItem("playlist", JSON.stringify(playlist));
    });

    this.getSlideTemplates();
  },
  beforeDestroy() {
    this.$root.$off("edit-song");
    this.$root.$off("library-single-click");
    this.$root.$off("library-double-click");
  },
  sockets: {
    connect: function() {
      console.log("socket connected from slides");
    },
    openSong: function(data) {
      console.log("SOCKET FULL SCREEN");
      if (this.link === true) {
        this.$q.notify({
          message: data.name + " has selected current song!",
          position: "center"
        });
        this.openSong(data.id);
      }
    },
    playSlide: function(data) {
      if (this.link === true) {
        this.playSlide(data.slide, data.index);
      }
    }
  },

  data() {
    return {
      activeTab: "currentPlaylist",
      activeTab2: "slide-templates",
      cloudPlaylists: [],
      currentSong: {},

      searchText: "",
      selectedSlideIndex: null,
      selectedSong: null,
      selectedPlaylistIndex: null,
      selectedTemplate: null,
      slideTemplates: [],
      partsTemplates: {},
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
      this.selectedSlideIndex = null;
      this.$ws.getSong(id).then(song => {
        this.$ws
          .loadLocalResource(song._id, "slideTemplates")
          .then(docs => (this.partsTemplates = docs));
        this.selectedSong = song;
      });
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
      let slidetemplate =
        this.partsTemplates !== null &&
        this.partsTemplates[slideIndex] !== undefined
          ? this.slideTemplatesById[this.partsTemplates[slideIndex]]
          : {
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

      return slidetemplate !== undefined
        ? slidetemplate
        : {
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
          selector: { songID: this.selectedSong._id }
        })
        .then(docs => {
          if (docs.docs.length > 0) {
            docs.docs.forEach(doc => {
              doc["slideTemplates"][this.selectedSlideIndex] = template;
              this.$pouchSongsPref.put(doc).then(() => {
                this.$ws
                  .loadLocalResource(this.selectedSong._id, "slideTemplates")
                  .then(docs => (this.partsTemplates = docs));
                console.log("DocumentUpdated with Slide Templates");
              });
            });
          } else {
            let slides = {};

            slides[this.selectedSlideIndex] = template;
            this.$pouchSongsPref
              .post({
                songID: this.selectedSong._id,
                slideTemplates: slides
              })
              .then(() => {
                this.$ws
                  .loadLocalResource(this.selectedSong._id, "slideTemplates")
                  .then(docs => (this.partsTemplates = docs));
                console.log("Slide Updated with selected Template");
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    setSongTemplate(template) {
      let slides = {};

      this.$pouchSongsPref
        .find({
          selector: { songID: this.selectedSong._id }
        })
        .then(docs => {
          if (docs.docs.length > 0) {
            docs.docs.forEach(doc => {
              this.songParts.forEach((part, index) => {
                doc["slideTemplates"][index] = template;
              });

              this.$pouchSongsPref.put(doc).then(() => {
                console.log("Document Updated with Slide Templates");
                this.$ws
                  .loadLocalResource(this.selectedSong._id, "slideTemplates")
                  .then(docs => (this.partsTemplates = docs));
              });
            });
          } else {
            let slides = {};
            this.songParts.forEach((part, index) => {
              slides[index] = template;
            });
            this.$pouchSongsPref
              .post({
                songID: this.selectedSong._id,
                slideTemplates: slides
              })
              .then(() => {
                this.$ws
                  .loadLocalResource(this.selectedSong._id, "slideTemplates")
                  .then(docs => (this.partsTemplates = docs));
                console.log("Document Created with Slide Templates");
              });
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
      console.log(template);
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
    },
    openDeleteDialog(song) {
      this.$q.notify({
        message: this.$t("delete_song_confirm"),
        color: "negative",
        icon: "fas fa-exclamation-triangle",
        textColor: "white",
        position: "center",
        actions: [
          {
            label: "Yes",
            color: "yellow",
            handler: () =>
              this.$ws.deleteSong(song).then(() => this.reloadSongs())
          },
          {
            label: "Dismiss",
            color: "white",
            handler: () => console.log("dismiss")
          }
        ]
      });
      // this.alert=true
    },
    addToPlaylist(id) {
      let playlist = JSON.parse(sessionStorage.getItem("playlist"));

      this.$ws.getSong(id).then(song => {
        playlist.items.push(song);
        this.playlist = playlist;
        sessionStorage.setItem("playlist", JSON.stringify(playlist));
      });
    },
    removeFromPlaylist(index) {
      let playlist = JSON.parse(JSON.stringify(this.playlist));

      playlist.items.splice(index, 1);
      this.$store.dispatch("defaultModule/setPlaylist", playlist);
    }
  },
  computed: {
    link() {
      return this.$parent.$parent.$parent.$data.link;
    },
    songParts() {
      return this.selectedSong !== null ? this.selectedSong.sections : [];
    },
    currentPlaylistIndex() {
      return this.$store.getters["defaultModule/getCurrentPlaylistIndex"];
    },
    playlist() {
      return this.$store.getters["defaultModule/getCurrentPlaylist"];
    },
  licenseInfo() {
      return this.$parent.$parent.$parent.$data.licenseInfo;
    },
    slideTemplatesById() {
      let templates = {};
      this.slideTemplates.forEach(template => {
        templates[template._id] = template;
      });
      return templates;
    },
    preferences() {
      return this.$parent.$parent.$parent.$data.preferences;
    }
  },
  watch: {
    searchText() {
      this.$ws.allSongs(this.searchText).then(songs => {
        this.songs = songs;
      });
    },
    currentSong() {}
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

<template>
  <q-drawer
    v-model="drawer"
    show-if-above
     mini-to-overlay
    :mini="!drawer || miniState"
    @click.capture="drawerClick"
    :width="350"
    :breakpoint="350"
    bordered

    content-class="bg-grey-9 text-white"
  >
    <q-scroll-area class="fit">
      <q-list padding>
        <!--
        <q-expansion-item
          expand-separator
          icon="fas fa-folder"
          label="User Library"
          style="font-size:12px"
        >
          <q-card>
            <q-card-section>
              <q-tree
                :nodes="padFolders"
                node-key="label"
                selected-color="primary"
                :selected.sync="selectedPadFolder"
                default-expand-all
              />
            </q-card-section>
          </q-card>
          <q-bar dense>
            <q-btn
              flat
              round
              size="8px"
              icon="fas fa-plus"
              @click="addToPadLibrary()"
              :disable="selectedPadFolder===null"
            />
            <q-btn flat round size="8px" icon="fas fa-folder-plus">
              <q-popup-proxy>
                <q-input
                  dense
                  label="Folder Name"
                  v-model="folderName"
                  v-touch-repeat.13="createPadFolder"
                ></q-input>
              </q-popup-proxy>
            </q-btn>
          </q-bar>
        </q-expansion-item>
-->
        <q-expansion-item
          expand-separator
          icon="fas fa-volume-off"
          label="Pads"
          style="font-size:12px"
        >
          <q-card class="bg-grey-8 text-white inset-shadow" style="height:250px; overflow-y:scroll">
            <q-list>
              <q-item clickable v-ripple v-for="(name,i) in padFiles" :key="i" @click="$root.$emit('open-pad', name)" style="min-height:0px">
                <q-item-section style="font-size:9px">{{name}}</q-item-section>
                <q-menu touch-position context-menu>
                  <!-- Context Menu -->
                  <q-list dense style="min-width: 100px">
                    <q-item clickable v-close-popup @click="$root.$emit('set-pad', name)">
                      <q-item-section avatar>
                        <q-icon size="16px" name="fas fa-file-import" />
                      </q-item-section>
                      <q-item-section>Apply</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </q-list>
          </q-card>
        </q-expansion-item>

      
      </q-list>
    </q-scroll-area>

    <!--
          in this case, we use a button (can be anything)
          so that user can switch back
          to mini-mode
    -->
    <div class="q-mini-drawer-hide absolute" style="top: 25px; right: -17px">
      <q-btn dense round unelevated color="accent" icon="chevron_left" @click="miniState = true" />
    </div>
  </q-drawer>
</template>

<script>
export default {
  name: "LeftDrawer",
  mounted() {
    this.$renderer.send("send-me-files");
    this.$renderer.on("pad-folder", (e, files) => {
      this.padFiles = files;
    });
  },
  data() {
    return {
      status: {},
      folderName: "",
      drawer: true,
      miniState: true,
      selectedPad: null,
      selectedPadFolder: null,

      padFiles: []
    };
  },
  methods: {
    drawerClick(e) {
      // if in "mini" state and user
      // click on drawer, we switch it to "normal" mode
      if (this.miniState) {
        this.miniState = false;

        // notice we have registered an event with capture flag;
        // we need to stop further propagation as this click is
        // intended for switching drawer to "normal" mode only
        e.stopPropagation();
      }
    },
    addToPadLibrary() {
      this.$renderer.send("select-file", {
        title: "Choose Pad File",
        event: "choose-padfile",
        filters: [
          { name: "All Files", extensions: ["wav", "mp3"] },
          { name: "wav", extensions: ["wav"] },
          { name: "mp3", extensions: ["mp3"] }
        ],
        data: []
      });
    },
    createPadFolder() {
      var uniqid = require("uniqid");
      let uid = uniqid();
      console.log("UNIQUEID", uid);
      this.$store.dispatch("defaultModule/createPadFolder", {
        folderID: uid,
        folderName: this.folderName
      });
      /*
     this.padFolders.push({
        label: this.folderName,
        icon: "fas fa-folder"
      });
      */
      this.folderName = "";
    }
  },
  computed: {
    padLibrary() {
      return this.$store.getters["defaultModule/getPadLibrary"];
    },
    padFolders() {
      let folders = [];
      Object.keys(this.padLibrary.folders).forEach(key => {
        folders.push({
          label: this.padLibrary.folders[key].name,
          icon: "fas fa-folder"
        });
      });
      return folders;
    }
  }
};
</script>

<style>
</style>
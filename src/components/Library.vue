<template>
  <q-card dark class="bg-grey-9" style="width:100%; height:48vh; ">
    <q-bar dense class="bg-grey-10">{{ $t("library") }}</q-bar>
    <q-card-section style="height:43px ;padding:0px;overflow:hidden">
      <q-input filled dense dark :label="$t('search')" v-model="searchText">
        <template v-slot:prepend>
          <q-icon name="fas fa-search" />
        </template>
        <template v-slot:append v-if="searchText !== ''">
          <q-icon name="close" @click="clearText()" />
        </template>
      </q-input>
    </q-card-section>
    <q-card-section class="scroll" style="padding:0px;">
      <q-list style="min-height:200px; height:34vh; overflow-y:scroll;">
        <q-item
          v-for="(item, index) in songs"
          :key="index"
          clickable
          v-ripple
          :dense="item.versions === undefined"
          :active="item._id === currentSong"
          active-class="bg-grey-8 text-white"
          style="padding: 0px 16px;"
          @click="$root.$emit('library-single-click', item._id)"
          @dblclick.once="$root.$emit('library-double-click', item._id)"
        >
          <q-menu touch-position context-menu>
            <!-- Context Menu -->
            <q-list dense style="min-width: 100px">
              <q-item
                clickable
                v-close-popup
                @click="$root.$emit('library-double-click', item._id)"
              >
                <q-item-section avatar>
                  <q-icon size="16px" name="fas fa-external-link-alt" />
                </q-item-section>
                <q-item-section>{{ $t("open") }}</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="$root.$emit('library-print', item._id)"
              >
                <q-item-section avatar>
                  <q-icon size="16px" name="fas fa-file-pdf" />
                </q-item-section>
                <q-item-section>{{ $t("export_pdf") }}</q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                @click="$root.$emit('edit-song', item._id)"
                v-if="
                  licenseInfo.userProfile === 'superadmin' ||
                    licenseInfo.userProfile === 'admin' ||
                    licenseInfo.userProfile === 'worshipleader'
                "
              >
                <q-item-section avatar>
                  <q-icon size="16px" name="fas fa-edit" />
                </q-item-section>
                <q-item-section>{{ $t("edit") }}</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="openDeleteDialog(item)"
                v-if="
                  licenseInfo.userProfile === 'superadmin' ||
                    licenseInfo.userProfile === 'admin' ||
                    licenseInfo.userProfile === 'worshipleader'
                "
              >
                <q-item-section avatar>
                  <q-icon size="16px" name="fas fa-trash-alt" />
                </q-item-section>
                <q-item-section>{{ $t("delete") }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item
                clickable
                v-close-popup
                @click="openPad(item._id)"
                v-if="
                  licenseInfo.userProfile === 'superadmin' ||
                    licenseInfo.userProfile === 'admin' ||
                    licenseInfo.userProfile === 'worshipleader'
                "
              >
                <q-item-section avatar>
                  <q-icon size="16px" name="fas fa-volume-off" />
                </q-item-section>
                <q-item-section>{{ $t("choose_pad") }}</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="addToPlaylist(item)">
                <q-item-section avatar>
                  <q-icon size="16px" name="fas fa-list" />
                </q-item-section>
                <q-item-section>{{ $t("add_to_playlist") }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
          <q-item-section>
            <q-item-label style="font-weight:bold">{{
              item.title
            }}</q-item-label>
            <q-item-label caption class="text-white">{{
              item.author
            }}</q-item-label>
          </q-item-section>
          <q-item-section
            top
            side
            class="text-white"
            v-if="item.versions !== undefined"
          >
            <q-badge
              color="blue"
              v-for="(version, index) in item.versions"
              :key="index"
              @dblclick="openVersion(index)"
            >
              {{ version.title }}
            </q-badge>
          </q-item-section>
        </q-item>
        <q-separator v-if="index < songs.length - 1" />
      </q-list>
    </q-card-section>
    <q-bar dense
      ><q-btn
        dense
        round
        flat
        icon="fas fa-plus"
        @click="$router.push({ path: 'ViewEditSong/newSong/false/false' })"
        v-if="
          licenseInfo.userProfile === 'superadmin' ||
            licenseInfo.userProfile === 'admin' ||
            licenseInfo.userProfile === 'worshipleader'
        "
    /></q-bar>
    <q-dialog v-model="versionDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Versioni</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          This song is available in multiple versions, which one do you want to
          choose?
        </q-card-section>
        <q-card-section>
          <q-list bordered separator v-if="selectedSong !== null">
            <q-item
              clickable
              v-ripple
              active-class="bg-teal-1 text-grey-8"
              @click="addToPlaylistVersion(null)"
              v-close-popup
            >
              <q-item-section>Original</q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              v-for="(version, index) in selectedSong.versions"
              :key="index"
              active-class="bg-teal-1 text-grey-8"
              @click="addToPlaylistVersion(index)"
              v-close-popup
            >
              <q-item-section>{{ version.title }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
  <!-- Library-->
</template>

<script>
export default {
  name: "Library",
  mounted() {
    this.loadLicenseInfo();
    this.$bus.$on("loadsongs", () => {
      this.reloadSongs();
    });
    this.reloadSongs();
  },

  data() {
    return {
      versionDialog: false,
      selectedSong: null,
      selectedVersion: null,
      licenseInfo: null,
      songs: [],
      searchText: ""
    };
  },
  methods: {
    loadLicenseInfo() {
      return new Promise(res => {
        this.$ws.getLicense().then(info => {
          this.licenseInfo = info;
          res("ok");
        });
      });
    },
    openPad(songid) {
      this.$renderer.send("select-file", {
        title: this.$t("choose_pad"),
        event: "choose-pad",
        data: songid,
        filters: [
          {
            name: this.$t("file_audio"),
            extensions: ["mp3", "wav"]
          }
        ]
      });
    },
    reloadSongs() {
      this.$ws.allSongs("").then(songs => {
        Object.freeze(songs);
        this.songs = songs;
      });
    },
    clearText() {
      this.searchText = "";
      this.$ws.allSongs("").then(songs => (this.songs = songs));
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
    addToPlaylist(item) {
      if (item.versions !== undefined) {
        this.selectedSong = item;
        this.versionDialog = true;

        console.log("più versioni");
      } else {
        this.$store.dispatch("defaultModule/addToPlaylist", item);
      }
      //
    },
    addToPlaylistVersion(version) {
      let song = this.selectedSong;
      song.selectedVersion = version;
     
      console.log(song);
      this.$store.dispatch("defaultModule/addToPlaylist", song);
    },
    openVersion(version) {
      this.$store.dispatch("defaultModule/setSongVersion", version);
    }
  },
  computed: {
    currentSong() {
      return this.$store.getters["defaultModule/getCurrentSong"];
    }
  },
  watch: {
    searchText() {
      this.$ws.allSongs(this.searchText).then(songs => {
        this.songs = songs;
      });
    }
  }
};
</script>

<style>
.dynamic-height {
   color: #000;
   font-size: 12px;
   margin-top: calc(100% - 10px);
   text-align: left;
}
</style>

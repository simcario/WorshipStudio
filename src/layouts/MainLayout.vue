<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-bar dense class="bg-grey glossy">
        <img src="statics/icons/64x64.png" width="20px" />
        WorshipStudio
        <q-space />
        <q-btn dense flat icon="minimize" @click="$ws.appMinimize()" />
        <q-btn dense flat icon="close" @click="$ws.appQuit()" />
      </q-bar>
      <q-toolbar class="toolbar-bg">
        <q-btn
          flat
          icon
          @click="$router.push({ path: 'ViewEditSong/newSong/false' })"
          v-if="this.$route.path === '/Chords'"
        >
          <q-icon name="fas fa-music"></q-icon>
          <q-tooltip>{{ $t("new_template") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          icon
          @click="$root.$emit('open-cloud-dialog')"
          v-if="this.$route.path === '/Vertical'"
        >
          <q-icon name="fas fa-cloud"></q-icon>
          <q-tooltip>{{ $t("cloud_playlists") }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          icon
          @click="$root.$emit('open-template-editor')"
          v-if="this.$route.path === '/Slides'"
        >
          <q-icon name="fas fa-columns"></q-icon>
          <q-tooltip>{{ $t("new_template") }}</q-tooltip>
        </q-btn>

        <q-space />
        <q-btn
          flat
          dense
          icon
          :color="slidewindow === false ? 'primary' : ''"
          @click="slidewindow = !slidewindow"
          v-if="this.$route.path === '/Slides'"
        >
          <q-icon name="fas fa-window-close"></q-icon>
          <q-tooltip>{{ $t("toggle_slide_window") }}</q-tooltip>
        </q-btn>
        <q-btn
          dense
          flat
          icon
          @click="black = !black"
          :color="black === true ? 'primary' : ''"
          v-if="this.$route.path === '/Slides'"
        >
          <q-icon name="fas fa-square"></q-icon>
          <q-tooltip>{{ $t("toggle_black") }}</q-tooltip>
        </q-btn>
        <q-btn
          dense
          flat
          icon
          @click="text = !text"
          :color="text === false ? 'primary' : ''"
          v-if="this.$route.path === '/Slides'"
        >
          <q-icon name="fas fa-font"></q-icon>
          <q-tooltip>{{ $t("toggle_text") }}</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <transition name="fade">
        <router-view />
      </transition>
      <PreferencesDialog :open="preferencesDialog" />
      <RegisterDialog :open="registerDialog" />
    </q-page-container>
    <q-footer>
      <q-bar dense class="bg-grey glossy">
        <q-btn
          round
          flat
          icon
          @click="$router.push({ path: '/Chords' })"
          v-if="
            this.$route.path === '/Slides' || this.$route.path === '/Vertical'
          "
        >
          <q-tooltip>Chords</q-tooltip>
          <q-icon name="fas fa-guitar"></q-icon>
        </q-btn>
        <q-btn
          round
          flat
          icon
          @click="$router.push({ path: '/Slides' })"
          v-if="this.$route.path === '/Chords'"
        >
          <q-tooltip>Slides</q-tooltip>
          <q-icon name="slideshow"></q-icon>
        </q-btn>
        <q-btn
          round
          flat
          icon
          @click="$router.push({ path: '/Vertical' })"
          v-if="this.$route.path === '/Chords'"
        >
          <q-icon name="fas fa-tablet-alt"></q-icon>
        </q-btn>
        <q-btn round flat icon @click="$ws.sync()">
          <q-tooltip>Syncronize</q-tooltip>
          <q-icon name="fas fa-sync-alt"></q-icon>
        </q-btn>
        <q-btn round flat icon @click="preferencesDialog = true">
          <q-tooltip>Preferences</q-tooltip>
          <q-icon name="fas fa-cog"></q-icon>
        </q-btn>
        <q-btn round flat icon @click="link = !link" :color="link===true ? 'red' : ''">
          <q-tooltip>Link</q-tooltip>
          <q-icon name="fas fa-link"></q-icon>
        </q-btn>
        <!--
         <q-btn flat icon @click="$ws.utility()">
          *
        </q-btn>
        -->
        <q-space />
        <q-btn
          flat
          icon="fas fa-key"
          :label="userLabel"
          @click="registerDialog = true"
        ></q-btn>
        <q-badge
          :color="
            licenseInfo !== null && licenseInfo.licenseType === 'Demo'
              ? 'negative'
              : 'primary'
          "
          >{{ licenseInfo.licenseType || "" }}</q-badge
        >
        <q-badge
          :text-color="status.textColor || 'white'"
          :color="status.color || 'grey'"
          >{{ status.message || "" }}</q-badge
        >
        <q-btn dense flat icon="fas fa-desktop">
          <q-popup-proxy>
            <q-list bordered separator>
              <q-item
                clickable
                v-ripple
                v-for="(client, index) in activeClients"
                :key="index"
              >
                <q-item-section>{{ client }}</q-item-section>
              </q-item>
            </q-list>
          </q-popup-proxy>
          <q-badge
            color="red"
            floating
            style="padding:2px; font-size:8px; line-height:8px"
          >
            {{ activeClients.length }}
          </q-badge>
        </q-btn>
      </q-bar>
    </q-footer>
  </q-layout>
</template>

<script>
import PreferencesDialog from "../components/dialogs/PreferencesDialog";
import RegisterDialog from "../components/dialogs/RegisterDialog";
export default {
  name: "WorshipStudio",
  components: { RegisterDialog, PreferencesDialog },
  mounted() {
    this.$renderer.on("F5", evt => {
      console.log("handle F5");
      this.playlistSong(0);
    });
    this.$renderer.on("pagedown", evt => {
      this.nextSong();
    });
    this.$renderer.on("pageup", evt => {
      this.prevSong();
    });
    this.loadLicenseInfo().then(() => {
      this.loadPreferences().then(() => {
        this.$router.push({ path: "/" + this.preferences.startModule });
      });
    });

    window.setInterval(() => {
      this.presence();
    }, 5000);

    //  this.loadSongs();
    this.$root.$on("reload-songs", page => {
      this.loadSongs();
    });
    this.$root.$on("close-preferences", () => {
      this.loadPreferences();
      this.preferencesDialog = false;
    });

    this.$root.$on("add-to-playlist", id => {
      this.playlist.items.push(id);
    });
    this.$bus.$on("remove-from-playlist", index => {
      this.playlist.items.splice(index, 1);
    });
    this.$bus.$on("update-playlist", playlist => {
      this.playlist = playlist;
    });
    this.$root.$on("close-register-dialog", () => {
      this.loadLicenseInfo();
      this.registerDialog = false;
    });
    this.$root.$on("page", page => {
      this.page = page;
    });
    this.$bus.$on("status", status => {
      this.status = status;
    });
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
      this.$socket.emit("join", this.licenseInfo.sector);
    },
    client: function(data) {
      let moment = require("moment");
      let nowTime = moment();

      this.clients[data.pcName] = data.time;
      let clients = [];
      Object.keys(this.clients).forEach(key => {
        let networkTime = moment(this.clients[key]);
        let difference = nowTime.diff(networkTime, "seconds");
        if (difference < 10) {
          clients.push(key);
        }
      });
      this.activeClients = clients;
    }
  },
  data() {
    return {
      link: false,
      registerDialog: false,
      preferencesDialog: false,
      preferences: {
        computerName: null,
        showChords: true,
        startModule: "Chords"
      },
      status: {},
      page: null,
      songs: {},
      clients: {},
      activeClients: {},
      licenseInfo: null,
      currentPlaylistSongIndex:null,
      text: true,
      slidewindow: true,
      black: false,
      playlist: {
        name: "",
        id: null,
        items: []
      }
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
    loadPreferences() {
      return new Promise(res => {
        this.$ws.getPreferences().then(pref => {
          this.preferences.computerName = pref.data.computerName;
          this.preferences.showChords = pref.data.showChords;
          this.preferences.startModule = pref.data.startModule;
          res("ok");
        });
      });
    },
    loadSongs() {
      this.$ws.allSongs("").then(songs => {
        this.songs = songs;
      });
    },
    presence() {
      //console.log("presence", this.$moment.format());
      this.$socket.emit("presence", {
        pcName: this.preferences.computerName,
        sector: this.licenseInfo.sector,
        time: this.$ws.currentTime()
      });
    },
    openFullScreen(id, edit) {
      this.$socket.emit("openSong", {
        sector: this.licenseInfo.sector,
        id: id,
        name: this.preferences.computerName
      });
      let path = "ViewEditSong/" + id + "/" + edit;

      this.$router.push({ path: path });
      return;
    },
     playlistSong(index) {
      this.currentPlaylistSongIndex = index;
      this.$ws.getSong(this.playlist.items[index]).then(song=>{
        this.openFullScreen(song._id, false);
      })
      
    },
    nextSong() {
      const index = this.currentPlaylistSongIndex + 1;
      if (index < this.playlist.items.length) {
        this.playlistSong(index);
      }
    },
    prevSong() {
      const index = this.currentPlaylistSongIndex - 1;
      if (index > -1) {
        this.playlistSong(index);
      }
    },
  },
  computed: {
    userLabel() {
      return this.licenseInfo !== null
        ? this.licenseInfo.orgName + " - " + this.licenseInfo.userName
        : "";
    },
    internetStatus() {
      return this.$store.getters["defaultModule/getInternetStatus"];
    },
    licenseExpired() {
      let validUntil = this.$moment(
        this.$store.getters["defaultModule/getValidUntil"]
      );
      let today = this.$moment();

      return validUntil.diff(today, "days");
    }
  },
  watch: {
    text() {
      this.$renderer.send("text", this.text);
    },
    black() {
      this.$renderer.send("black", this.black);
    },
    slidewindow() {
      if (this.slidewindow === true) {
        this.$renderer.send("show-slide-window");
      } else {
        this.$renderer.send("hide-slide-window");
      }
    }
  }
};
</script>

<style>
body {
  font-family: montserrat;
  overflow: hidden;
}
.main-bg {
  background-color: #2c2c2c !important;
}
.toolbar-bg {
  background: linear-gradient(
    to bottom,
    rgba(107, 107, 107, 1) 0%,
    rgba(67, 67, 67, 1) 100%
  );
}

::-webkit-scrollbar {
  width: 15px;
  height: 15px;
}
::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-thumb {
  background: #e1e1e1;
  border: 0px solid #000000;
  border-radius: 50px;
}
::-webkit-scrollbar-thumb:hover {
  background: #c6c6c6;
}
::-webkit-scrollbar-thumb:active {
  background: #909090;
}
::-webkit-scrollbar-track {
  background: #666666;
  border: 0px none #ffffff;
  border-radius: 50px;
}
::-webkit-scrollbar-track:hover {
  background: #666666;
}
::-webkit-scrollbar-track:active {
  background: #333333;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
</style>

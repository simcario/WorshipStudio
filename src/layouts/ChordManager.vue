<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-bar class="bg-primary glossy" dense>
        <span class="pageTitle">Chords Manager</span>
        <div class="cursor-pointer non-selectable">
          File
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable @click="$root.$emit('new-song')">
                <q-item-section avatar style="min-width: 16px;">
                  <q-icon name="fas fa-plus" size="12px" />
                </q-item-section>
                <q-item-section>New Song</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable @click="$ws.loadAllSongs()">
                <q-item-section avatar style="min-width: 16px;">
                  <q-icon name="fas fa-sync" size="12px" />
                </q-item-section>
                <q-item-section>Sync</q-item-section>
              </q-item>
              <q-item clickable @click="$ws.versionControl()">
                <q-item-section avatar style="min-width: 16px;">
                  <q-icon name="fas fa-download" size="12px" />
                </q-item-section>
                <q-item-section>Check For Updates</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable @click="$ws.appQuit()">
                <q-item-section>Quit</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <div class="cursor-pointer non-selectable">
          Edit
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable @click="$router.push({path:'/Preferences'})">
                <q-item-section>Preferences</q-item-section>
              </q-item>
              <q-item clickable @click="$ws.clearStorage().then(()=>$router.push('/Login'))">
                <q-item-section>Clear Storage</q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable @click="$ws.appQuit()">
                <q-item-section>Quit</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <div class="cursor-pointer non-selectable">
          Module
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable @click="$router.push({path:'/SlidesHome'})">
                <q-item-section avatar style="min-width: 16px;">
                  <q-icon name="slideshow" size="12px" />
                </q-item-section>
                <q-item-section>Slides</q-item-section>
              </q-item>
              <q-item clickable @click="$router.push({path:'/Slides'})">
                <q-item-section avatar style="min-width: 16px;">
                  <q-icon name="slideshow" size="12px" />
                </q-item-section>
                <q-item-section>New Layout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <q-space />
        <q-btn dense flat icon="minimize" @click="$ws.appMinimize()" />
        <q-btn dense flat icon="close" @click="$ws.appQuit()" />
      </q-bar>
      <!--
      <q-toolbar>
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          <span class="pageTitle">Chords Manager</span>
        </q-toolbar-title>
        <q-btn
          v-if="user.loggedIn==='false' || user.loggedIn===null"
          flat
          round
          dense
          size="xs"
          icon="fas fa-user"
          @click="$router.push({path:'/Login'})"
        />
        <q-chip square v-else>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          {{user.displayName}}
          <q-btn class="on-right" dense size="sm" flat icon="fas fa-sign-out-alt" @click="logout()"></q-btn>
        </q-chip>
      </q-toolbar>-->
    </q-header>
    <!--
    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2">
      <SideMenu />
    </q-drawer>
    -->
    <q-page-container>
      <router-view />

     <q-footer>
        <q-bar dense class="bg-black text-white">
        <q-space />

        <q-btn
          color="green"
          dense
          flat
          icon="fas fa-sync-alt"
          class="gt-xs"
          v-if="(user.loggedIn==='true' || user.loggedIn!==null) && nerworkEnabled===true"
        />
        <q-btn color="red" dense flat icon="fas fa-sync-alt"  v-else />

        <q-btn
          color="green"
          dense
          flat
          icon="fas fa-wifi"
          class="gt-xs"
          v-if="internetStatus==='online'"
        />
        <q-btn color="red" dense flat icon="fas fa-wifi"  v-else />
   
          <q-btn color="primary" dense flat icon="fas fa-user" :label="peersConnected">
            <q-menu
              transition-show="flip-right"
              transition-hide="flip-left"
            >
          <q-list style="min-width: 100px">
            <q-item clickable v-for="(peer,i) in $peers" :key="i">
              <q-item-section>{{peer.name}}</q-item-section>
            </q-item>
           
          </q-list>
        </q-menu>
        </q-btn>
      
      </q-bar>
     </q-footer>
      <q-dialog v-model="alert">
        <q-card>
          <q-card-section>
            <div class="text-h6">Delete Song</div>
          </q-card-section>

          <q-card-section>Are you sure you want to delete the song?</q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" @click="deleteSong()" v-close-popup />
            <q-btn flat label="CANCEL" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!--Alert Dialog -->
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from "quasar";
import SideMenu from "../components/index/SideMenu";
import { isObject } from 'util';
export default {
  name: "ChordManager",
  components: { SideMenu },
  mounted() {

    this.$bus.$on('peers',peers=>{
        this.peers = peers;
        console.log(peers)
    })
    if (this.licenseExpired === true) {
      this.$router.push({ path: "/RenewLicense" });
    }
    if (
      this.user.licenseType === "personal" &&
      this.user.startModule !== "ChordsHome"
    ) {
      this.$router.push({ path: "/" + this.user.startModule });
    }
    if (this.user.networkEnabled === "true") {
      this.nerworkEnabled = true;
    } else {
      this.nerworkEnabled = false;
    }
    if (this.user.loggedIn === "false" || this.user.loggedIn === false) {
      this.$router.push({ path: "/Login" });
    }
  },

  data() {
    return {
      fullscreen: true,
      leftDrawerOpen: false,
      numberofPeers:0,
      peers:{},
      alert: false,
      nerworkEnabled: true,
      version: "1.0.0"
    };
  },
  methods: {
    openURL,
    logout() {
      this.$store.commit("defaultModule/destroySession");
      this.$router.push({ path: "/Login" });
    }
  },
  computed: {
    user() {
      return {
        displayName: this.$store.getters["defaultModule/getDisplayName"],
        organizationName: this.$store.getters[
          "defaultModule/getOrganizationName"
        ],
        loggedIn: this.$store.getters["defaultModule/getLoggedIn"],
        email: this.$store.getters["defaultModule/getEmail"],
        licenseType: this.$store.getters["defaultModule/getLicenseType"],
        startModule: this.$store.getters["defaultModule/getStartModule"],
        networkEnabled: this.$store.getters["defaultModule/getNetworkEnabled"]
      };
    },
    internetStatus() {
      return this.$store.getters["defaultModule/getInternetStatus"];
    },
    licenseExpired() {
      return this.$store.getters["defaultModule/getLicenseExpired"];
    },
    peersConnected(){
      
      if(isObject(this.$peers)){
        return Object.keys(this.$peers).length
      } else {
        return 0
      }
     
    }
  },
};
</script>

<style>
.pageTitle {
  font-size: 16px;
  font-family: "damion";
  font-weight: bold;
}
</style>

<template>
  <q-layout>
    <q-header elevated>
       <q-bar class="bg-purple glossy" dense>
        <span class="pageTitle">Slides Manager</span>
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
               <q-item clickable @click="$root.$emit('join-remote')">
                 <q-item-section avatar style="min-width: 16px;">
                  <q-icon name="fas fa-qrcode" size="12px" />
                </q-item-section>
                <q-item-section>Join Remote Control</q-item-section>
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
              <q-item clickable  @click="$router.push({path:'/ChordsHome'})">
               <q-item-section avatar style="min-width: 16px;">
                  <q-icon name="fas fa-guitar" size="12px"/>
                </q-item-section>
                <q-item-section>Chords</q-item-section>
              </q-item>
              
            </q-list>
          </q-menu>
        </div>
        <q-space />
        <q-btn dense flat icon="minimize" @click="$ws.appMinimize()"/>
        <q-btn dense flat icon="close" @click="$ws.appQuit()" />
      </q-bar>
      <!--
      <q-toolbar class="bg-purple text-white">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          <strong>Worship</strong>Studio
          <span class="pageTitle">Slides Manager</span>
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
      </q-toolbar> -->
    </q-header>

           <!--
    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2">
      <SideMenu />
    </q-drawer>
-->

    <q-page-container>
      <router-view />
      <q-bar dense class="fixed-bottom">
        <q-space />

        <q-btn
          color="green"
          dense
          flat
          icon="fas fa-sync-alt"
          class="gt-xs"
          v-if="(user.loggedIn==='true' || user.loggedIn!==null) && nerworkEnabled===true"
        />
        <q-btn color="red" dense flat icon="fas fa-sync-alt" class="gt-xs" v-else />

        <q-btn
          color="green"
          dense
          flat
          icon="fas fa-wifi"
          class="gt-xs"
          v-if="internetStatus==='online'"
        />
        <q-btn color="red" dense flat icon="fas fa-wifi" class="gt-xs" v-else />
      </q-bar>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from "quasar";
import SideMenu from "../components/index/SideMenu";
export default {
  name: "SlideManager",
  components: { SideMenu },
  mounted() {
    

    if (this.licenseExpired === true) {
      this.$router.push({ path: "/RenewLicense" });
    }

    if (
      this.user.licenseType === "personal" &&
      this.user.startModule !== "SlidesHome"
    ) {
      this.$router.push({ path: "/" + this.user.startModule });
    }
    if (this.user.networkEnabled === "true") {
      this.nerworkEnabled = true;
    } else {
      this.nerworkEnabled = false;
    }
  },
  sockets: {
    playlist_data: function(data) {
      this.playlist = data;
    }
  },
  data() {
    return {
      fullscreen: true,
      nerworkEnabled: true,
      leftDrawerOpen: false,
      alert: false,
      deleteSongID: null,
      version: "1.0.0",
      songs: [],
      playlist: []
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
    }
  }
};
</script>

<style>
</style>

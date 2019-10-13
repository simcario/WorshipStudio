<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-bar class="bg-green glossy" dense>
        <span class="pageTitle">Lyrics Manager</span>
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
               <q-item-section avatar style="min-width: 16px;">
                  <q-icon name="fas fa-cogs" size="12px" />
                </q-item-section>
                <q-item-section>Preferences</q-item-section>
              </q-item>
              
            </q-list>
          </q-menu>
        </div>
        <div class="cursor-pointer non-selectable">
          Module
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item clickable @click="$router.push({path:'/ChordsHome'})">
                <q-item-section avatar style="min-width: 16px;">
                  <q-icon name="fas fa-guitar" size="12px" />
                </q-item-section>
                <q-item-section>Chords</q-item-section>
              </q-item>
              <q-item clickable @click="$router.push({path:'/SlidesHome'})">
                <q-item-section avatar style="min-width: 16px;">
                  <q-icon name="slideshow" size="12px" />
                </q-item-section>
                <q-item-section>Slides</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <q-space />
         <q-btn dense flat icon="minimize" @click="$ws.appMinimize()"/>
        <q-btn dense flat icon="close" @click="$ws.appQuit()" />
       
      </q-bar>
      <!--
      <q-toolbar class="bg-green text-white">
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>
        
        <q-toolbar-title>
          <strong>Worship</strong>Studio
          <span class="pageTitle">Lyrics Manager</span>
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
      <q-bar class="fixed-bottom">
        <q-chip
          dense
          square
          outline
          color="positive"
          text-color="positive"
          icon="fas fa-sync-alt"
          v-if="(user.loggedIn==='true' || user.loggedIn!==null) && nerworkEnabled===true"
        >Synchronization enabled</q-chip>
        <q-chip
          dense
          square
          outline
          color="negative"
          text-color="negative"
          icon="fas fa-sync-alt"
          v-else
        >Synchronization disabled</q-chip>
        <q-space />
        <q-chip
          dense
          color="green"
          text-color="white"
          v-if="internetStatus==='online'"
        >Internet Online</q-chip>
        <q-chip dense color="red" text-color="white" v-else>Internet Offline</q-chip>
      </q-bar>
    </q-page-container>
  </q-layout>
</template>

<script>
import SideMenu from "../components/index/SideMenu";
import { openURL } from "quasar";

export default {
  name: "LyricsManager",
  components: { SideMenu },
  mounted() {
    if (this.licenseExpired === true) {
      this.$router.push({ path: "/RenewLicense" });
    }
    if (
      this.user.licenseType === "personal" &&
      this.user.startModule !== "LyricsHome"
    ) {
      this.$router.push({ path: "/" + this.user.startModule });
    }

    if (this.user.networkEnabled === "true") {
      this.nerworkEnabled = true;
    } else {
      this.nerworkEnabled = false;
    }

    if (this.loggedIn === "false" || this.loggedIn === false) {
      this.$router.push({ path: "/Login" });
    }
  },
  data() {
    return {
      nerworkEnabled: true,
      fullscreen: true,
      leftDrawerOpen: false,
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
        email: this.$store.getters["defaultModule/getEmail"],
        licenseType: this.$store.getters["defaultModule/getLicenseType"],
        startModule: this.$store.getters["defaultModule/getStartModule"],
        networkEnabled: this.$store.getters["defaultModule/getNetworkEnabled"]
      };
    },
    loggedIn() {
      return this.$store.getters["defaultModule/getLoggedIn"];
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
.pageTitle {
  font-family: "damion";
  font-weight: bold;
}
</style>

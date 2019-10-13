<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round aria-label="Menu" @click="$router.push({path:'/Mobile'})">
          <q-icon name="fas fa-chevron-left" />
        </q-btn>

        <q-toolbar-title>
          <strong>Worship</strong>Studio
          <span class="pageTitle">Mobile</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from "quasar";
import SideMenu from "../components/index/SideMenu";
export default {
  name: "Mobile",
  components: { SideMenu },
  mounted() {
    if(this.mobileFirstConfig === false || this.mobileFirstConfig==="false"){
       this.$router.push({ path: "/Mobile/Settings" });
    }
 

    if (this.user.networkEnabled === "true") {
      this.nerworkEnabled = true;
    } else {
      this.nerworkEnabled = false;
    }
    if (this.user.loggedIn === "false") {
      this.$router.push({ path: "/Login" });
    }
  },

  data() {
    return {
      fullscreen: true,
      leftDrawerOpen: false,
      alert: false,
      nerworkEnabled: true,
      version: "1.0.0",
      songs: [],
      playlist: []
    };
  },
  methods: {
    openURL
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
    mobileFirstConfig() {
      return this.$store.getters["defaultModule/getMobileFirstConfig"];
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

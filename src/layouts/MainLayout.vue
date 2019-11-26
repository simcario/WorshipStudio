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
        <q-btn flat icon @click="$root.$emit('open-template-editor')"  v-if="this.$route.path==='/Slides'">
          <q-icon name="fas fa-columns"></q-icon>
          <q-tooltip>New Template</q-tooltip>
        </q-btn>
        <q-btn flat icon @click="$root.$emit('new-song')" v-if="this.$route.path==='/Chords'">
          <q-icon name="fas fa-music"></q-icon>
          <q-tooltip>New Song</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
     
      <router-view />
      <RegisterDialog :open="registerDialog" />
    </q-page-container>
    <q-footer>
      <q-bar dense class="bg-grey glossy">
        <q-btn flat icon @click="$router.push({path:'/Chords'})"  v-if="this.$route.path==='/Slides'">
          <q-icon name="fas fa-guitar"></q-icon>
        </q-btn>
        <q-btn flat icon @click="$router.push({path:'/Slides'})" v-if="this.$route.path==='/Chords'">
          <q-icon name="slideshow"></q-icon>
        </q-btn>
        <q-btn flat icon @click="$ws.loadAllSongs()">
          <q-icon name="fas fa-sync-alt"></q-icon>
        </q-btn>
        <q-btn flat @click="$ws.clearStorage().then(()=>$router.push('/FirstConfig'))"></q-btn>
        <q-space />
        <q-btn flat icon="fas fa-key" @click="registerDialog=true"></q-btn>
        <q-badge :color=" user.licenseType==='Demo' ? 'negative' : 'primary'">{{user.licenseType}}</q-badge>
        <q-badge :text-color="status.textColor||'white'"    :color="status.color||'grey'">{{status.message||''}}</q-badge>
      </q-bar>
    </q-footer>
  </q-layout>
</template>

<script>
import RegisterDialog from '../components/dialogs/RegisterDialog'
export default {
  name: "WorshipStudio",
  components: {RegisterDialog},
  mounted() {
    this.$router.push({ path: "/" + this.user.startModule });
    /*
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
    /*
    if (this.user.loggedIn === "false" || this.user.loggedIn === false) {
      this.$router.push({ path: "/Login" });s
    }
    */
     this.$root.$on('close-register-dialog',()=>this.registerDialog=false)
    this.$root.$on("page", page => {
      this.page = page;
    });
    this.$bus.$on("status", status => {
      this.status = status;
    });
  },
  data() {
    return {
      registerDialog:false,
      status: {},
      page:null
  
    };
  },
  computed:{
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
      let validUntil= this.$moment(this.$store.getters["defaultModule/getValidUntil"]);
      let today = this.$moment()
    
    
      return validUntil.diff(today,'days')
    },
  }
  
};
</script>

<style>
body {
  font-family: montserrat;
  overflow: hidden;
}
.main-bg{
  background-color: #2C2C2C !important;
}
.toolbar-bg{
  background: linear-gradient(to bottom, rgba(107,107,107,1) 0%,rgba(67,67,67,1) 100%);
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
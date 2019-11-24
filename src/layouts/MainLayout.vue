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
    </q-page-container>
    <q-footer>
      <q-bar dense class="bg-grey glossy">
        <q-btn flat icon @click="$router.push({path:'/Chords'})">
          <q-icon name="fas fa-guitar"></q-icon>
        </q-btn>
        <q-btn flat icon @click="$router.push({path:'/Slides'})">
          <q-icon name="slideshow"></q-icon>
        </q-btn>
        <q-btn flat icon @click="$ws.loadAllSongs()">
          <q-icon name="fas fa-sync-alt"></q-icon>
        </q-btn>
        <q-space />
        <q-badge :color="status.color||'grey'">{{status.message||''}}</q-badge>
      </q-bar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "WorshipStudio",
  mounted() {
    
    this.$root.$on("page", page => {
      this.page = page;
    });
    this.$bus.$on("status", status => {
      this.status = status;
    });
  },
  data() {
    return {
      status: {},
      page:null
  
    };
  },
  
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
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
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer>
        <q-bar dense class="bg-grey glossy">
          <q-btn flat icon @click="$router.push({path:'/Chords'})"><q-icon name="fas fa-guitar"></q-icon></q-btn>
          <q-btn flat icon @click="$router.push({path:'/Slides'})"><q-icon name="slideshow"></q-icon></q-btn>
          <q-btn flat icon @click="$ws.loadAllSongs()"><q-icon name="fas fa-sync-alt"></q-icon></q-btn>
        <q-space />
          <q-badge :color="status.color||'grey'">{{status.message||''}}</q-badge>
      </q-bar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "WorshipStudio",
  mounted(){
    this.$bus.$on("status",(status)=>{
      this.status = status
    })
  },
  data(){
    return{
      status:{}
    }
  }
};
</script>

<style>
  body{
    font-family: montserrat
  }
</style>
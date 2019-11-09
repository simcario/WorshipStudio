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
        <q-space />
          <q-btn flat icon @click="$router.push({path:'/ChordsHome'})"><q-icon name="fas fa-guitar"></q-icon></q-btn>
      </q-bar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "WorshipStudio"
};
</script>

<style>
  body{
    font-family: montserrat
  }
</style>
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
      <div class="fixed-center text-center">
        <p class="text-faded">ERROR</p>
        <q-btn
          color="secondary"
          style="width:200px;"
          @click="$router.push('/Chords')"
        >Go BAck</q-btn>
      </div>
    </q-page-container>
    <q-footer>
      <q-bar dense class="bg-grey glossy">
      </q-bar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "Error404"
};
</script>



<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container></q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from "quasar";
export default {
  name: "FirstConfig",
  mounted() {
  
      this.$ws.getPreferences().then(pref=>{
    
          this.$router.push({ path: "/" + pref.data.startModule });
      })
    
  },
  sockets: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    openURL
  },
  watch: {}
};
</script>

<style>
</style>

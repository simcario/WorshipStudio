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
  
        this.$router.push({ path: "/" + this.$store.state.defaultModule.startModule });
    
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

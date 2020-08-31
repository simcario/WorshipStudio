<template>
  <q-layout view="lHh Lpr lFf">
    <q-dialog v-model="updateAlert">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t("new_version_available")}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ $t("new_version")}}
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list>
            <q-item v-for="(item, index) in newFeatures" :key="index" dense>
              <q-item-section avatar>
                <q-icon name="fas fa-caret-right" />
              </q-item-section>
              <q-item-section>{{ item.feature }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('cancel')" color="primary" @click="gotoApp()" />
          <q-btn
            flat
            label="DOWNLOAD"
            color="primary"
            @click="downloadUpdate()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-container></q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from "quasar";

export default {
  name: "FirstConfig",
  mounted() {
   
      this.$ws.checkUpdate().then(data=>{
        console.log('UPDATE', data)
        if(data.update === true){
          this.updateAlert = true
          this.newFeatures = data.features
        } else {
          this.gotoApp()
        }
    })
    
  },
  sockets: {},
  data() {
    return {
      updateAlert: false,
      newVersion: null,
      newFeatures: []
    };
  },
  computed: {},
  methods: {
    openURL,
      downloadUpdate(){
      this.$renderer.send("open-download-link")
    },
    gotoApp(){
      this.$ws.getPreferences().then(pref => {
      this.$router.push({ path: "/" + pref.data.startModule });
    });
    }
  },
  watch: {}
};
</script>

<style></style>

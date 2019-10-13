<template>
  <q-page class="flex">
    <q-card class="full-width">
      <q-toolbar class="bg-primary glossy text-white">
        <q-btn flat round dense icon="fas fa-cog" class="q-mr-sm" />
        <q-toolbar-title>
          <strong>Worship</strong>Studio
          <span class="pageTitle">Settings</span>
        </q-toolbar-title>
      </q-toolbar>
      <div class="row">
        <div class="col-4" style=" padding-right:5px;">
          <div class="row">
            <div class="col-12 q-pa-md">
              <q-input label="Computer Name" v-model="txtComputerName" />
            </div>
           
            <div class="col-12 q-pa-md">
              Start Module
              <br />
              <q-btn-toggle
                v-model="txtStartModule"
                push
                glossy
                toggle-color="primary"
                :options="[
                      {label: 'Chords', value: 'ChordsHome'},
                      {label: 'Lyrics', value: 'LyricsHome'},
                      {label: 'Slides', value: 'SlidesHome'}
                    ]"
              />
            </div>
             <div class="col-12 q-pa-md">
                <q-toggle
                  v-model="moduleChords.showChords"
                  color="green"
                  label="Show Chords"
                />

            </div>
            <q-card-section v-if="error !== null">
              <q-banner inline-actions class="text-white bg-red">{{error}}</q-banner>
            </q-card-section>
          </div>
        </div>
        <div class="col-4">
          <div class="row">
            <div class="col-12 q-pa-md">
              <q-input
                filled
                v-model="txtOrganizationName"
                dense
                disable
                label="Organizzation Name"
              />
            </div>
            <div class="col-12 q-pa-md">
              <q-input filled v-model="txtUserName" dense disable label="User Name" />
            </div>
            <div class="col-12 q-pa-md">
              <q-input
                filled
                type="textarea"
                v-model="txtLicenseKey"
                dense
                disable
                label="License Key"
              />
            </div>
          </div>
        </div>
        <div class="col-4 q-pa-md">
          <h5>Need to restart applicatio to apply new settings</h5>
        </div>
      </div>
      <q-card-actions>
        <q-space></q-space>
        <q-btn flat @click="save" text-color="positive">SAVE</q-btn>
        <q-btn flat @click="$router.go(-1)" text-color="negative">Cancel</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script>
import { setServers } from "dns";
export default {
  name: "Preferences",
  mounted() {
    this.getPreferences();
   
  },

  data() {
    return {
      myIP: null,
      txtComputerName: null,
      txtStartModule: null,
      txtOrganizationName: "",
      txtLicenseKey: "",
      txtUserName: "",
      moduleChords:{
        showChords:true
      },
      error: null
    };
  },
  methods: {
    save() {
   
      this.$store
        .dispatch("defaultModule/savePreferences", {
          computerName: this.txtComputerName,
          startModule: this.txtStartModule,
          moduleChords: JSON.stringify(this.moduleChords)
        })
        .then(() => {
        //  this.$renderer.send("restart-app");
        this.$router.go(-1)
        });
    },
    getPreferences() {
      this.txtStartModule = this.startModule;
      this.txtComputerName = this.computerName;
      this.txtOrganizationName = this.organizationName;
      this.txtUserName = this.displayName;
      this.txtLicenseKey = this.licenseKey;
      this.moduleChords = this.moduleChordsSettings
      
    }
  },
  computed: {
    startModule() {
      let startModule = this.$store.getters["defaultModule/getStartModule"];

      return startModule;
    },
    serverUrl() {
      let serverUrl = this.$store.getters["defaultModule/getServerUrl"];

      return serverUrl;
    },
    computerType() {
      let computerType = this.$store.getters["defaultModule/getComputerType"];

      return computerType;
    },
    computerName() {
      let computerName = this.$store.getters["defaultModule/getComputerName"];

      return computerName;
    },
    organizationName() {
      let organizationName = this.$store.getters[
        "defaultModule/getOrganizationName"
      ];
      return organizationName;
    },
    displayName() {
      let displayName = this.$store.getters["defaultModule/getDisplayName"];
      return displayName;
    },
    licenseKey() {
      let licenseKey = this.$store.getters["defaultModule/getLicenseKey"];
      return licenseKey;
    },
     moduleChordsSettings(){
      return this.$store.getters['defaultModule/getModuleChords']
    }
  }
};
</script>
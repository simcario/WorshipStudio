<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div class="q-pa-md">
        <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated>
          <q-step
            :name="1"
            title="License Information"
            icon="settings"
            :done="step > 1"
            :header-nav="step > 1"
          >
            Enter the license key contained in the activation email
            <q-input v-model="txtLicenseKey" filled type="textarea" />
            <div v-if="decrypted[0]==='Invalid'">
              <span class="negative">License Key is Invalid</span>
            </div>
            <div v-else>
              <span class="positive">Valid license Key</span>
              <br />
              <span class="info">
                Licensed to :
                <strong>{{decrypted[1]}}</strong>
                <br />Email:
                <strong>{{decrypted[2]}}</strong>
                <br />License Type:
                <strong>{{decrypted[3]}}</strong>
                <br />Default Module:
                <strong>{{decrypted[4]}}</strong>
                <br />Valid Until:
                <strong>{{decrypted[5]}}</strong>
                <br />
              </span>
            </div>
            <q-stepper-navigation>
              <q-btn
                @click="nextStep"
                color="primary"
                :label="decrypted[3] === 'personal' ? 'Start App':'Next'"
                :disabled="decrypted[0]==='Invalid'"
              />
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="2"
            title="First Settings"
            icon="fas fa-cogs"
            :done="step > 2"
            :header-nav="step > 2"
          >
            <q-card flat style="background-color:#EEEEEE">
              <q-card-section>
                <div class="row justify-around">
                  <div class="col-4">
                    <q-card flat>
                      <q-card-section>
                        <q-select
                          filled
                          v-model="serverAddress"
                          :options="computers"
                          option-value="ip"
                          option-label="label"
                          label="Server Address"
                        />
                      </q-card-section>
                      <q-card-section>
                        <q-input label="Computer Name" v-model="txtComputerName" />
                      </q-card-section>
                    </q-card>
                  </div>

                  <div class="col-4">
                    Start Module
                    <br />
                    <q-btn-toggle
                      v-model="startModule"
                      push
                      glossy
                      toggle-color="primary"
                      size="sm"
                      :options="[
                      {label: 'Chords', value: 'ChordsHome'},
                      {label: 'Lyrics', value: 'LyricsHome'},
                      {label: 'Slides', value: 'SlidesHome'}
                    ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-stepper-navigation>
              <q-btn
                @click="save()"
                color="primary"
                label="Save"
                :disabled="decrypted[0]==='Invalid'"
              />
              <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from "quasar";
import SimpleCrypto from "simple-crypto-js";

export default {
  name: "FirstConfig",
  mounted() {
    this.txtComputerName = "PC-"+this.$localIP; 
    this.$renderer.send("sendMeComputers");
    this.$renderer.on("listenComputers", (event, data) => {
      let servers = [{label:'Local Host', ip:'localhost'}];
      data.forEach(element => {
        if (element.ip === this.$localIP) {
          servers.push({
            label: "This Computer",
            ip: element.ip
          });
        } else {
          servers.push({
            label: "Remote " + element.ip,
            ip: element.ip
          });
        }
      });

      this.computers = servers;
    });
    if (this.user.loggedIn === "false" || this.user.loggedIn === false) {
      this.$router.push({ path: "/Login" });
    }
    this.txtLicenseKey = this.$store.getters["defaultModule/getLicenseKey"];
    this.$ws.checkLicense(this.txtLicenseKey).then(decrypted => {
      this.decrypted = decrypted;
      this.startModule = decrypted[4];
    });
  },
  sockets: {
    listenComputers: function(data) {
      this.computers = data;
    }
  },
  data() {
    return {
      step: 1,
      txtLicenseKey: "",
      txtComputerName:null,
      decrypted: ["Invalid"],
      computerType: "server",
      computers: [],
      serverAddress: {label:'Local Host', ip:'localhost'},
      startModule: "ChordsHome",

      moduleChords:{
        showChords:true
      }
    };
  },
  computed: {
    user() {
      return {
        loggedIn: this.$store.getters["defaultModule/getLoggedIn"]
      };
    }
  },
  methods: {
    openURL,
    nextStep() {
      if (this.decrypted[3] === "personal") {
        this.save();
        this.$router.push({ path: "/" + this.decrypted[4] });
      } else {
        this.step = 2;
      }
    },
    checkLicense() {
      const _secretKey = "W0rsh1pstudi0";

      const simpleCrypto = new SimpleCrypto(_secretKey);

      const decryptedKey = simpleCrypto.decrypt(this.licenseKey);
      console.log(decryptedKey);
      if (decryptedKey.substring(0, 5) !== "valid") {
        this.decrypted = ["Invalid"];
      } else {
        this.decrypted = decryptedKey.split("|");
      }
    },
    save() {
      if (this.serverAddress === null) {
        this.$q.notify({
          message: "Please select Server Url",
          color: "negative",
          icon: "fas fa-exclamation-triangle",
          textColor: "white",
          position: "center",
          actions: [
            {
              label: "Dismiss",
              color: "white",
              handler: () => console.log("dismiss")
            }
          ]
        });
        return;
      }
      let ServerAddress = "http://" + this.serverAddress.ip;
      console.log(ServerAddress);
      this.$store
        .dispatch("defaultModule/firstConfig", {
          licenseName: this.decrypted[1],
          licenseEmail: this.decrypted[2],
          licenseType: this.decrypted[3],
          startModule: this.startModule,
          validUntil: this.decrypted[5],
          computerType: this.computerType,
          computerName: this.txtComputerName,
          moduleChords:JSON.stringify(this.moduleChords)
        })
        .then(() => {
          this.$router.push({ path: "/" + this.startModule });
        });

      //  this.$router.push({ path: "/" + this.startModule });
    }
  },
  watch: {
    txtLicenseKey() {
      this.$ws.checkLicense(this.txtLicenseKey).then(decrypted => {
        this.decrypted = decrypted;
      });
    }
  }
};
</script>

<style>
.negative {
  color: red;
}
.positive {
  color: green;
}
</style>

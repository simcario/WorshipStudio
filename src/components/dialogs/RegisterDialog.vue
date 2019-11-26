<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-9" style="width:450px;padding:0px">
      <q-bar dark class="bg-black text-white">Register Software</q-bar>
      <q-tabs
        dense
        v-model="selectedTab"
        cinline-label
        align="left"
        class="bg-grey-9 shadow-2 glossy text-white"
      >
        <q-tab name="account" icon="fas fa-user" label="Account" />
        <q-tab name="key" icon="fas fa-key" label="Key" />
      </q-tabs>
      <q-tab-panels v-model="selectedTab">
        <q-tab-panel name="account" style="padding:0px">
          <q-card dark class="bg-grey-9" square>
            <q-card-section class="row items-center">
              <div class="col">
                <q-input v-model="email" filled dark label="Email"></q-input>
              </div>
            </q-card-section>
            <q-card-section class="row items-center">
              <div class="col">
                <q-input v-model="password" type="password" filled dark label="Password"></q-input>
              </div>
            </q-card-section>
            <q-card-section class="bg-negative row items-center" v-if="error!==null">
              <div class="col">{{this.error}}</div>
            </q-card-section>
            <q-card-actions>
              <q-btn flat label="Cancel" @click="$root.$emit('close-register-dialog')" />

              <q-space />
              <q-btn flat label="Login and register" @click="login()" />
            </q-card-actions>
          </q-card>
        </q-tab-panel>
        <q-tab-panel name="key" style="padding:0px">
          <q-card dark class="bg-grey-9" square>
            <q-card-section class="row items-center">
              <div class="col">
                <q-input v-model="licenseEmail" filled dark label="License Email"></q-input>
              </div>
            </q-card-section>
            <q-card-section class="row items-center">
              <div class="col">
                <q-input v-model="userName" filled dark label="Your Name"></q-input>
              </div>
            </q-card-section>
            <q-card-section class="row items-center">
              <div class="col">
                <q-input v-model="userEmail" filled dark label="Your Email"></q-input>
              </div>
            </q-card-section>
            <q-card-section class="row items-center">
              <div class="col">
                <q-input type="textarea" v-model="licenseKey" filled dark label="License Key"></q-input>
              </div>
            </q-card-section>
            <q-card-section class="bg-negative row items-center" v-if="error!==null">
              <div class="col">{{this.error}}</div>
            </q-card-section>
            <q-card-actions>

              <q-btn flat dark label="Cancel" @click="$root.$emit('close-register-dialog')" />
              <q-space />
              <q-btn flat dark label="Check License" @click="checkLicense()" />

            </q-card-actions>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    open: {
      required: true
    }
  },
  name: "RegisterDialog",
  data() {
    return {
      selectedTab: "account",
      email: null,
      password: null,
      error: null,
      licenseEmail:null,
      userEmail:null,
      licenseKey:null,
      userName:null
    };
  },
  methods: {
    login() {
      this.$ws.login(this.email, this.password).then(data => {
       
        if (data.auth === true) {
          this.error = null;
          this.email = null;
          this.password = null;
          this.$root.$emit("close-register-dialog");
        } else {
          this.error = data.error;
        }
      });
    },
    checkLicense(){
     this.$store.dispatch("defaultModule/registerSoftware", {
                        displayName: this.userName,
                        email: this.licenseEmail,
                        licenseKey: this.licenseKey,
                        displayName: this.userName,
                        userEmail:this.userEmail
                      }).then(data=>{
                        this.$root.$emit("close-register-dialog");
                      }).catch((err)=>{
                        console.log(err)
                        this.error = "Invalid Data!"
                      })
    }
  }
};
</script>

<style>
</style>
<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-9" style="width:450px;padding:0px">
      <q-bar dark class="bg-black text-white">{{
        $t("register_software")
      }}</q-bar>
      <q-tabs
        dense
        v-model="selectedTab"
        cinline-label
        align="left"
        class="bg-grey-9 shadow-2 glossy text-white"
      >
        <!--   <q-tab name="account" icon="fas fa-user" label="Account" /> -->
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
                <q-input
                  v-model="password"
                  type="password"
                  filled
                  dark
                  label="Password"
                ></q-input>
              </div>
            </q-card-section>
            <q-card-section
              class="bg-negative row items-center"
              v-if="error !== null"
            >
              <div class="col">{{ this.error }}</div>
            </q-card-section>
            <q-card-actions>
              <q-btn
                flat
                :label="$t('cancel')"
                @click="$root.$emit('close-register-dialog')"
              />

              <q-space />
              <q-btn flat :label="$t('login_and_register')" @click="login()" />
            </q-card-actions>
          </q-card>
        </q-tab-panel>
        <q-tab-panel name="key" style="padding:0px">
          <q-card dark class="bg-grey-9" square>
            <q-card-section class="row items-center">
              <div class="col">
                <q-input
                  v-model="licenseEmail"
                  filled
                  dark
                  label="License Email"
                ></q-input>
              </div>
            </q-card-section>
            <!--
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
            -->
            <q-card-section class="row items-center">
              <div class="col">
                <q-input
                  type="textarea"
                  v-model="licenseKey"
                  filled
                  dark
                  label="License Key"
                ></q-input>
                <q-btn
                  icon="fas fa-paste"
                  flat
                  :label="$t('paste')"
                  @click="incolla()"
                />
              </div>
            </q-card-section>
            <q-card-section
              class="bg-negative row items-center"
              v-if="error !== null"
            >
              <div class="col">{{ this.error }}</div>
            </q-card-section>
            <q-card-actions>
              <q-btn
                flat
                dark
                :label="$t('cancel')"
                @click="$root.$emit('close-register-dialog')"
              />
              <q-space />
              <q-btn
                flat
                dark
                :label="$t('check_license')"
                @click="checkLicense()"
              />
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
      selectedTab: "key",
      email: null,
      password: null,
      error: null,
      licenseEmail: null,
      userEmail: null,
      licenseKey: null,
      userName: null
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
          this.$router.push({ path: "/" });
        } else {
          this.error = data.error;
        }
      });
    },
    checkLicense() {
      this.$ws.checkLicense(this.licenseKey, this.licenseEmail).then(data => {
        this.$pouchApp
          .find({
            selector: {
              objectType: "licenseInfo"
            }
          })
          .then(docs => {
            if (docs.docs.length === 0) {
              this.$pouchApp.post({
                objectType: "licenseInfo",
                data: data
              });
            } else {
              let doc = docs.docs[0];
              doc.data = data;
              this.$pouchApp.put(doc);
            }
            this.$root.$emit("close-register-dialog");
          });
      });
    },
    incolla() {
      navigator.clipboard
        .readText()
        .then(text => {
         this.licenseKey = text.trim()
        })
        .catch(err => {
          console.error("Failed to read clipboard contents: ", err);
        });
    }
  }
};
</script>

<style></style>

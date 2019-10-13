<template>
  <q-page class="flex flex-center">
    <div class="row">
      <div class="col-auto" style="min-width:400px">
        <q-toolbar class="bg-primary glossy text-white">
          <q-btn flat round dense icon="menu" class="q-mr-sm" />
          <q-toolbar-title>
            <strong>Worship</strong>Studio
            <span class="pageTitle">Login</span>
          </q-toolbar-title>
        </q-toolbar>
        <q-card>
          <q-card-section>
            <q-input filled v-model="username" label="Username" />
          </q-card-section>
          <q-card-section>
            <q-input filled type="password" v-model="password" label="Password" />
          </q-card-section>
          <q-card-section v-if="error !== null">
            <q-banner inline-actions class="text-white bg-red">{{error}}</q-banner>
          </q-card-section>
          <q-card-actions>
            <q-space></q-space>
            <q-btn flat @click="login">Login</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  data() {
    return {
      username: null,
      password: null,
      error: null
    };
  },
  methods: {
    login() {
      this.$store
        .dispatch("defaultModule/login", {
          username: this.username,
          password: this.password
        })
        .then((data) => {
      
          this.$ws.checkLicenseExpiration().then(expireDays => {
            this.$store
              .dispatch("defaultModule/licenseExpired", expireDays)
              .then(() => {
                if (data.firstConfig === "true") {
            
                  this.$router.push({ path: "/" + data.startModule });
                } else {
                 
                  this.$router.push({ path: "/FirstConfig" });
                }
              });
          });
        })
        .catch(err => {
          this.error = err.error;
        });
    }
  },
  computed: {
    startModule() {
      return (
        this.$store.getters["defaultModule/getStartModule"] || "FirstConfig"
      );
    },
    firstConfig() {
      return this.$store.getters["defaultModule/getFirstConfig"] || false;
    }
  }
};
</script>
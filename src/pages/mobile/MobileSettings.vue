<template>
  <div class="q-pa-md text-center">
    <q-card>
      <q-card-section>
        <q-input label="Server Address" v-model="txtServer"></q-input>
      </q-card-section>
      <q-card-section>
        <q-btn color="primary" @click="save()">Save</q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
export default {
  name: "MobileSettings",
  mounted() {
    this.txtServer = this.$store.getters["defaultModule/getServerUrl"];
  },
  data() {
    return {
      txtServer: null
    };
  },
  methods: {
    save() {
      this.$store
        .dispatch("defaultModule/saveMobilePreferences", {
          serverAddress: this.txtServer
        })
        .then(() => {
          this.$router.push({ path: "/Mobile" });
        });
    }
  }
};
</script>
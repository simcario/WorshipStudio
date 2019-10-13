<template>
  <q-dialog persistent v-model="qrcode">
    <q-card class="text-center">
      <q-card-section>
        <div class="text-h6">SCAN TO ENABLE REMOTE CONTROL ON THIS PC</div>
      </q-card-section>

      <q-card-section>
        <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
      </q-card-section>

      <q-card-section>
        <span style="color:green"><strong>IP: <span style="font-style:italic; text-decoration:underline">{{$localIP}}</span></strong></span> - 
        <span style="color:red"><strong>PC NAME: <span style="font-style:italic; text-decoration:underline">{{computerName}}</span></strong></span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" @click="$root.$emit('closeQCode')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import QrcodeVue from "qrcode.vue";
export default {
  name: "QCode",
  components: {QrcodeVue},
  props:{
      qrcode:{
          required:true
      }
  },
  mounted() {
    this.value = "wscode|"+this.$localIP+"|"+this.computerName;
  },
  data() {
    return {
      value: null,
      size: 300
    };
  },
  computed: {
    computerName() {
      return this.$store.getters["defaultModule/getComputerName"]
    }
  },
};
</script>
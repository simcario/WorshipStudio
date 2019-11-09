<template>
  <q-dialog v-model="updateDialog" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card class="bg-primary text-white">
      <q-bar>
        New Version available {{data.version}}
        <q-space />

        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip
            content-class="bg-white text-primary"
            @click=" this.$root.$emit('close-update-dialog')"
          >Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="text-h6">A New Worship Studio update is available for download.</div>
      </q-card-section>

      <q-card-section>
        <div class="row" v-if="data.bug_fixes !== null && data.bug_fixes.length>0">
          <div class="col-12">
            <span>Bug Fixes</span>
            <ul>
              <li v-for="(bugs, index) in data.bug_fixes" :key="index">{{bug.bug}}</li>
            </ul>
          </div>
        </div>
        <div class="row" v-if="data.new_features !== null && data.new_features.length>0">
          <div class="col-12">
            <span>New Features</span>
            <ul>
              <li
                v-for="(newFeatures, index) in data.new_features"
                :key="index"
              >{{newFeatures.feature}}</li>
            </ul>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="white" @click="$root.$emit('close-update-dialog')" />
        <q-btn
          flat
          label="Download Update"
          color="white"
        @click="$renderer.send('open-download-link')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: "UpdateDialog",
  props: {
    updateDialog: {
      required: true
    },
    data: {
      required: true
    }
  },
  data() {
    return {};
  }
};
</script>
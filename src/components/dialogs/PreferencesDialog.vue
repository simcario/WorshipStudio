<template>
  <q-dialog v-model="open">
    <q-card dark class="bg-grey-9" style="width:400px">
      <q-bar class="glossy">
        Preferences
        <q-space />
        <q-btn dense flat icon="fas fa-times"  @click="$root.$emit('close-preferences')" />
      </q-bar>
      <q-card-section>
        <q-banner inline-actions class="bg-yellow text-black">
             <template v-slot:avatar>
        <q-icon name="fas fa-exclamation-triangle" />
      </template>
          Require Restart App.
         
        </q-banner>
      </q-card-section>
      <q-card-section>
        <q-input dark filled label="Computer Name" v-model="computerName" />
      </q-card-section>
       <q-card-section>
         <q-btn-toggle
        v-model="startModule"
        push
        glossy
        toggle-color="primary"
        :options="[
          {label: 'Chords', value: 'Chords'},
          {label: 'Slides', value: 'Slides'},
        ]"
      />
      </q-card-section>
      <q-card-section>
        <q-toggle v-model="showChords" left-label label="Show Chords" />
      </q-card-section>
      <q-card-actions>
        <q-btn flat dense label="OK" @click="save()" />
        <q-space />
        <q-btn
          flat
          dense
          :label="$t('cancel')"
          @click="$root.$emit('close-preferences')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "PreferencesDialog",
  props: {
    open: {
      default: false
    }
  },
  mounted() {
    this.$ws.getPreferences().then(pref => {
      this.computerName = pref.data.computerName;
      this.showChords = pref.data.showChords;
      this.startModule = pref.data.startModule;
      this.id = pref._id;
    });
  },
  data() {
    return {
      computerName: null,
      showChords: true,
      startModule:'Chords',
      id: null,
      modules:['Chords','Slides']
    };
  },
  methods: {
    save() {
      this.$pouchApp.get(this.id).then(doc => {
        doc.data = {
          computerName: this.computerName,
          showChords: this.showChords,
          startModule: this.startModule
        };
        this.$pouchApp.put(doc);
        this.$root.$emit("close-preferences");
      });
    }
  }
};
</script>

<style></style>

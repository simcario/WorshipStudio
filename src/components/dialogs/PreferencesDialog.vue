<template>
  <q-dialog v-model="open">
    <q-card dark class="bg-grey-9" style="width:400px">
      <q-bar class="glossy">
        Preferences
        <q-space />
        <q-btn
          dense
          flat
          icon="fas fa-times"
          @click="$root.$emit('close-preferences')"
        />
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
      <q-card-section class="text-center">
        <div class="row justify-center">
          <div class="col-6">
            Start Module <br />
            <q-btn-toggle
              v-model="startModule"
              push
              glossy
              toggle-color="primary"
              :options="[
                { label: 'Chords', value: 'Chords' },
                { label: 'Slides', value: 'Slides' }
              ]"
            />
          </div>
          <div class="col-6 ">
            Chords <br />
            <q-btn-toggle
              v-model="showChords"
              push
              glossy
              toggle-color="primary"
              :options="[
                { label: 'Show', value: true },
                { label: 'Hide', value: false }
              ]"
            />
          </div>
        </div>
        <div class="row justify-center">
          <div class="col-6">
            Notation <br />
            <q-btn-toggle
              v-model="notation"
              push
              glossy
              toggle-color="primary"
              :options="[
                { label: 'Anglo', value: 'anglo' },
                { label: 'Latin', value: 'latin' }
              ]"
            />
          </div>
          <div class="col-6">
            Language<br>

            <q-btn-dropdown glossy="" color="primary" :label="language" >
              <q-list>
                <q-item v-for="(lang,i) in cmbLanguage" :key="i" clickable v-close-popup @click="language = lang.value">
                  <q-item-label>
                    <q-item-label>{{lang.label}}</q-item-label>
                  </q-item-label>
                </q-item>
              </q-list>
            
            </q-btn-dropdown>
          </div>
        </div>
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
      this.notation = pref.data.notation;
      this.language = pref.data.language;
      this.id = pref._id;
    });
  },
  data() {
    return {
      computerName: null,
      showChords: true,
      startModule: "Chords",
      notation: "anglo",
      language: "en",
      id: null,
      modules: ["Chords", "Slides"],
      cmbLanguage: [
        { label: "English", value: "en" },
        { label: "Italian", value: "it" }
      ]
    };
  },
  methods: {
    save() {
      this.$pouchApp.get(this.id).then(doc => {
        this.$i18n.locale = this.language
        doc.data = {
          computerName: this.computerName,
          showChords: this.showChords,
          startModule: this.startModule,
          notation: this.notation,
          language: this.language
        };
        this.$pouchApp.put(doc);
        this.$root.$emit("close-preferences");
      });
    }
  }
};
</script>

<style></style>

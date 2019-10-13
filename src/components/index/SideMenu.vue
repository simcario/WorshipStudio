<template>
  <q-list padding>
    <q-item
      v-for="link in links1"
      :key="link.text"
      v-ripple
      clickable
      @click="$router.push({ path: link.path })"
    >
      <q-item-section avatar>
        <q-icon color="grey" :name="link.icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ link.text }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-my-md" />
    <div v-if="licenseType !== 'personal'">
      <q-item
        v-for="link in links2"
        :key="link.text"
        v-ripple
        clickable
        @click="$router.push({ path: link.path })"
      >
        <q-item-section avatar>
          <q-icon color="grey" :name="link.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ link.text }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator class="q-my-md" />
    </div>
    <q-item
      v-for="link in links3"
      :key="link.text"
      v-ripple
      clickable
      @click="$router.push({ path: link.path })"
    >
      <q-item-section avatar>
        <q-icon color="grey" :name="link.icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ link.text }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script>
export default {
  name: "SideMenu",
  data() {
    return {
      leftDrawerOpen: false,
      search: "",
      links1: [{ icon: "home", text: "Home", path: "/" }],
      links2: [
        { icon: "fas fa-guitar", text: "Chords", path: "/ChordsHome" },
        { icon: "fas fa-font", text: "Lyrics", path: "/LyricsHome" },
        { icon: "slideshow", text: "Slides", path: "/SlidesHome" },
      ],
      links3: [
        { icon: "fas fa-cog", text: "Preferences", path: "/Preferences" }
      ]
    };
  },
  computed: {
    licenseType() {
      return this.$store.getters["defaultModule/getLicenseType"];
    }
  }
};
</script>
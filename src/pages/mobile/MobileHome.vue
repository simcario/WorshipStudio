<template>
  <div >
    <div class="row text-center">
      <div class="col-6 ">
        <q-card @click="$router.push({path:'/Mobile/Playlist'})"
        style="background-color:#FFD400"
        >
          <q-card-section>
    
            <q-icon name="fas fa-play" size="60px" color="primary"></q-icon>
          </q-card-section>
          <q-card-section>
            <span class="label">PLAYLIST</span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6">
        <q-card @click="$router.push({path:'/Mobile/Songlist'})"
        style="background-color:#FF3A9C"
        >
          <q-card-section>
            <q-icon name="fas fa-music" size="60px" color="primary"></q-icon>
          </q-card-section>
          <q-card-section>
            <span class="label">SONGS</span>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6"
      >
        <q-card @click="$router.push({path:'/Mobile/Settings'})"
        style="background-color:#31D8C5"
        >
          <q-card-section>
      
            <q-icon name="fas fa-cogs" size="60px" color="primary"></q-icon>
          </q-card-section>
          <q-card-section>
            <span class="label">PREFERENCES</span>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
<style scoped>
.label {
  font-size: 15px;
  font-weight: bold;
}
</style>
<script>
export default {
  name: "MobileHome",
  data() {
    return {};
  }
};
</script>
<template>
  <div class="map-container">
    <div id="google-map"></div>
  </div>
</template>

<script>
import google from 'google'
export default {
  mounted() {
    console.log(google)
    this.ptcenter = {
      lat: 38.281616,
      lng: 175.026542
    },
    this.map = new window.google.maps.Map(document.getElementById('google-map'), {
      center: this.ptcenter,
      zoom: 3
      // mapTypeId: google.maps.MapTypeId.ROADMAP
    })
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
  width: 100vw;
  height: 100vh;

  #google-map {
    width: 100%;
    height: 100%;
  }
}
</style>

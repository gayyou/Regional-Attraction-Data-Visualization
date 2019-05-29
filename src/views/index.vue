<template>
  <div class="main" @mousemove="closePanel">
    <div class="maps-bottom">
      <googleMap 
      v-for="item in $store.state.mapList"
      :id="item.id"
      :key="item.id"
      :heatData="heatData"
      :isOpenHeat="isOpenHeat"
      ></googleMap>
    </div>
    <leftFirstPanel class="first-panel"></leftFirstPanel>
    <leftSecPanel class="second-panel"
      :heatData="heatData"
      @updateHeatData="updateHeatData"
      @isOpenHeat="updateOpenHeat"
    ></leftSecPanel>
    <div class="mouse-hover-area"
      @mousemove="openFirstPanel"
    ></div>
  </div>
</template>

<script>
import googleMap from '../components/map/map.vue'
import leftFirstPanel from '../components/panel/leftFirPanel/leftFirPanel.vue';
import leftSecPanel from '../components/panel/leftSecPanel/leftSecPanel.vue';

export default {
  components: { 
    googleMap,
    leftFirstPanel,
    leftSecPanel
  },
  data() {
    return {
      heatData: null,
      isOpenHeat: false,
    }
  },
  mounted() {
    console.log('index', this)
  },
  methods: {
    updateHeatData(data) {
      this.$data.heatData = data;
      console.log(data)
    },
    updateOpenHeat(data) {
      this.$data.isOpenHeat = data;
    },
    openFirstPanel(event) {
      event.stopPropagation();
      this.$store.state.panel.leftFirActive = true;
    },
    closePanel(event) {
      this.$store.state.panel.leftFirActive = false;
      // $("#google-map .gm-style-cc").hide();
      // $("#google-map [title='Open this area in Google Maps (opens a new window)']").hide(); 
    }
  },
  watch: {
    isOpenHeat(newVal) {
      console.log(newVal)
    }
  }
}
</script>

<style lang="scss">
.maps-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
.first-panel {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
}
.second-panel {
  position: absolute;
  z-index: 11;
  left: 0;
  top: 0;
}
.mouse-hover-area {
  position: absolute;
  z-index: 9;
  width: 1.3rem;
  height: 100vh;
  top: 0;
  left: 0;
}
</style>

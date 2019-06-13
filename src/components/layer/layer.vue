<template>
  <div class="float-layer" 
    :class="($store.state.showConfirm || $store.state.showMessage || $store.state.showCharts) ? 'layer-active' : 'layer-normal'"
  >
    <confirm-layer v-if="$store.state.showConfirm"></confirm-layer>
    <message v-if="$store.state.showMessage" ></message>
    <charts class="chart-posi" v-if="$store.state.showCharts"></charts>
  </div>  
</template>

<script>
import confirmLayer from "./confirm/confirm.vue";
import message from './message/message.vue';
import charts from './charts/charts.vue'
export default {
  data() {
    return {
      message: ''
    }
  },
  components: {
    'confirm-layer': confirmLayer,
    message,
    charts
  }
}
</script>

<style lang="scss" scoped>
%flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.float-layer {
  @extend %flex-center;

  position: fixed;
  width: 100vw;
  height: 100vh;

  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .3);
}
.layer-active {
  z-index: 99999;
}
.layer-normal {
  z-index: -10;
}
.chart-posi {
  position: absolute;
  top: 1.5rem;
  transform: translateX(-50%);
  left: 50%;
}
</style>

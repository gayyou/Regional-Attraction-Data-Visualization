<template>
  <div class="left-first-panel"
    :class="$store.state.panel.leftFirActive ? 'left-fitst-active' : ''"
    @mousemove="openPanel"
  >
    <span @click="openSecPanel" data-mode="1">View regional heat</span>
    <span @click="openSecPanel" data-mode="2">View taxi flow</span>
    <span @click="openSecPanel" data-mode="3">Contrast view</span>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    openPanel(event) {
      event.stopPropagation();
      this.$store.state.panel.leftFirActive = true;
    },
    openSecPanel(event) {
      let mode = parseInt(event.target.getAttribute('data-mode'));
      this.$store.state.panel.secPanMode = mode;
      if (mode == 3) {
        this.$store.state.mapList.push({
          id: 'map2'
        })
      } else {
        this.$store.state.panel.leftSecActive = true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.left-first-panel {
  width: 3.2rem;
  height: 100vh;
  background-color: rgba($color: #373f53, $alpha: .9);
  transition: transform .75s ease;
  display: flex;
  transform: translateX(-3.2rem);
  flex-direction: column;
  justify-content: center;

  span {
    cursor: pointer;
    display: block;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    height: 50px;
    line-height: 50px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: #fff;
    font-size: 0.3rem;
  }

  span:hover {
    background-color: rgba($color: #ffffff, $alpha: 0.3);
  }
}

.left-fitst-active {
  transform: translateX(0);
}
</style>

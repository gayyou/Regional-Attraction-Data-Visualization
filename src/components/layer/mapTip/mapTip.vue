<template>
  <div class="map-tip-contianer">
    <div class="map-tip-img">
      <img src="../../../assets/icons/close.png" alt="">
    </div>
    <div class="map-tip-name">
      <span>区域名字:{{name}}</span>
    </div>
    <div class="map-tip-value">
      <span>权值:{{value}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['name', 'value']
}
</script>

<style lang="scss" scoped>
.map-tip-contianer {
  position: absolute;
  width: 2rem;
  height: 1.2rem;
  border-radius: 12px;
  background-color: #fff;

  .map-tip-img {
    position: absolute;
    width: 25px;
    height: 25px;
    right: 10px;
    top: 10px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .map-tip-name {

  }

  .map-tip-value {

  }
}
</style>

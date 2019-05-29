<template>
  <div class="rank">
    <div class="switch-button">
      <span>Rank</span>
      <img 
        :src="isOpen ? require('../../../assets/icons/arrow_right_large.png') : require('../../../assets/icons/arrow_left_large.png')" alt="">
    </div>
    <div class="rank-main">
      <span class="rank-title">Attraction ranking</span>
      <div class="rank-container">
        <div class="rank-list"
          v-for="(item, index) in rankList"
          :key="index + 1"
        >
          <span class="rank-count">{{ index + 1 }}</span>
          <span class="rank-name">{{ item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: true,
      rankList: [
        'SHIWEITANGCUN',
        'SANYUANLI',
        'BAIYUNQU'
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
$fontColor: #0060e6;

.rank {
  width: 3.6rem;
  background-color: rgba($color: #373f53, $alpha: .9);
  border-bottom-left-radius: 4px;
  padding-bottom: 0.34rem;

  .switch-button {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.2rem;
    height: 0.6rem;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    left: -1.2rem;
    background-color: rgba($color: #373f53, $alpha: .9);

    span {
      font-size: 0.24rem;
      color: $fontColor;
    }

    img {
      display: block;
      width: 0.16rem;
      height: 0.3rem;
      margin-left: 10px;
    }
  }

  .rank-main {
    position: relative;
    width: 100%;
    height: 100%;

    .rank-title {
      display: block;
      margin-top: 20px;
      color: #fff;
      font-size: 0.3rem;
      text-align: center;
    }

    .rank-container {
      position: relative;
      width: 100%;
    }
    
    .rank-container::after,
    .rank-list::after {
      content: "";
      display: block;
      clear: both;
    }

    .rank-list {
      display: block;
      margin-top: 10px;
      margin-bottom: 10px;
      width: 100%;

      .rank-count {
        float: left;
        display: block;
        border-radius: 50%;
        color: $fontColor;
        background-color: #1f1f1f;
        width: 0.36rem;
        height: 0.36rem;
        font-size: 0.24rem;
        line-height: 0.36rem;
        margin-left: 0.5rem;
      }
      
      .rank-name {
        display: block;
        float: left;
        color: #fff;
        font-size: 0.24rem;
        margin-left: 0.24rem;
      }
    }
  }
}

.rank::after {
  content: "";
  display: block;
  clear: both;
}
</style>

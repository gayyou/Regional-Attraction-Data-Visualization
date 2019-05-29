<template>
  <div class="value-sample-container">
    <span class="sample-title">Value Rank</span>
    <div class="sample-list"
      v-for="item in sampleList"
      :key="item.color"
    >
      <div class="sample-color" :style="'background-color: ' + item.color"></div>
      <span class="sample-interval">{{ item.value }}</span>
    </div>
  </div>
</template>

<script>
import { colorModel } from '../../../utils/shared/model.js'
export default {
  data() {
    return {
      sampleList: [

      ]
    }
  },
  watch: {
    '$store.state.rankSample.rankUnit'(newVal) {
      this.$data.sampleList = [];
      let num = 1;
      for (let item of colorModel) {
        this.$data.sampleList.push({
          value: newVal * (num - 1) + '-' + (newVal * num - 1),
          color: item
        });
        num++;
      }
      let last = this.$data.sampleList.pop();
      last.value = (newVal * (num - 2)) + '以上';
      this.$data.sampleList.push(last);
    }
  }
}
</script>

<style lang="scss" scoped>
.value-sample-container {
  background-color: #fff;
  width: 2rem;

  .sample-title {
    font-size: 0.28rem;
    color: #1f1f1f;
  }

  .sample-list {
    position: relative;
    width: 100%;
    margin: 10px 0;

    .sample-color {
      float: left;
      width: 0.35rem;
      height: 0.2rem;
      border: 0.5px solid rgba($color: #000000, $alpha: .3);
      margin-left: 20px;
    }

    .sample-interval {
      float: left;
      display: block;
      font-size: 0.14rem;
      color: #1f1f1f;
      margin-left: 20px;
      line-height: 0.2rem;
    }
  }
}

.value-sample-container::after,
.sample-list::after {
  content: "";
  clear: both;
  display: block;
}
</style>

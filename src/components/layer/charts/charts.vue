<template>
  <div class="charts-container">
    <!-- <div class="info-container">
      <span class="title">Title</span>
    </div>    -->
    <img class="close-chart" src="../../../assets/icons/close.png" alt=""
      @click="closeChart"
    >
    <div class="data-show" id="chart"></div>
  </div>
</template>

<script>
import PubSub from 'pubsub-js'
export default {
  mounted() {
    this.mychart = this.$echarts.init($('#chart')[0]);
    this.option = {
      title: {
        text: 'Title',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{a} <br/>{b} : {c}',
        axisPointer: {
          type: 'cross',
          // animation: false,
          // label: {
          //   backgroundColor: '#505765'
          // }
        }
      },
      xAxis: {
          type: 'category',
          axisTick: {
              alignWithLabel: true
          },
          data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
      },
      yAxis: {
        type: 'value',
      },
      dataZoom: [{
        type: 'slider'
      }],
      series: []
    };
    this.mychart.setOption(this.option);

    PubSub.subscribe('getDataCharts', (event, data) => {
      console.log('data')
      if (data.status == 200) {
        console.log(data)
        // this.$store.state.showCharts = true;
        let series = this.getAllData(data.flowLines);
        this.mychart.setOption({
          series,
          title: {
            text: 'namesss',
            left: 'center'
          },
        })
      } else {
        this.store.state.showMessage = true;
        this.store.state.message = data.meg;
      }
    })
  },
  methods: {
    closeChart() {
      this.$store.state.showCharts = false;
    },
    getItemData(item) {
      let arr = [];
      let keys = Object.keys(item);
      for (let i = 0; i < keys.length; i++) {
        arr.push(item[keys[i]]);
      }

      return arr;
    },
    getMax(list) {

    },
    getAllData(list) {
      let seriesArr = [];
      for (let i = 0; i < list.length; i++) {
        seriesArr.push({
          name: i,
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: this.getItemData(list[i].timeMap)
        })
      }
      return seriesArr;
    }
  }
}
</script>

<style lang="scss" scoped>
%clearBoth::after {
  content: "";
  display: block;
  clear: both;
}
.charts-container {
  width: 10rem;
  height: 6rem;
  background-color: #fff;
  border-radius: 12px;

  .close-chart {
    position: absolute;
    display: block;
    right: 10px;
    top: 5px;
    width: 50px;
    height: 50px;
    cursor: pointer;
    z-index: 111;
  }

  .info-container {
    @extend %clearBoth;
    width: 100%;

    >span {
      font-size: 18px;
      display: block;
    }

    .title {
      text-align: center;
    }
  }
  
  .data-show {
    width: 100%;
    height: 5.5rem;
    margin: .25rem auto;
  }
}
</style>
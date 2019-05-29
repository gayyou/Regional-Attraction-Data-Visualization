<template>
  <div class="map-container">
    <div :id="id" class="google-map"></div>
    <rank class="rank"></rank>
    <valueSample class="rank-sample"></valueSample>
  </div>
</template>

<script>
import rank from '../panel/rank/rank.vue';
import { colorModel } from '../../utils/shared/model.js'
import { getFlyLine, renderPath, createOverlayHandle } from '../../utils/shared/line.js'
import { data } from '../../utils/data3.js'
import valueSample from '../panel/valueSample/valueSample.vue'

export default {
  components: {
    rank,
    valueSample,
  },
  data() {
    return {
      example: {
        type: 'LineString',
        cor: [
          [91.1865,30.1465],
          [116.4551,40.2539]
        ]
      },
      map: null
    }
  },
  props: ['id', 'heatData', 'isOpenHeat'],
  mounted() {
    // console.log(getFlyLine(this.$data.example))
    this.ptcenter = {
      lat: 23.33,
      lng: 113.5
    };

    this.map = new window.google.maps.Map($('#' + this.id)[0], {
      center: this.ptcenter,
      zoom: 10,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      clickableIcons: false,
      fullscreenControl: false,
      zoomControl: false, 
      scaleControl: false,
      streetViewControl: false,
      mapTypeControl: false,
    });
    
    // let rankUnit = this.dealRankDis(data);
    // for (let i = 0; i < data.length; i++) {
    //   let flightPath = this.getPolygon(data[i], rankUnit);
    //   flightPath.setMap(this.map);
    // }
    // let overlayView = new window.google.maps.OverlayView();
    // overlayView.onAdd = () => {
    //   console.log('加载完毕')
    // }
    // overlayView.setMap(this.map)
    
    // this.$nextTick(() => {
    //   let data = this.$data.example;
    //   createOverlayHandle(data, this);
    // });
  },
  methods: {
    getPolygon(item, rankUnit) {
      let arr = [];
      for (let i = 0; i < item.lnglat.length; i++) {
        let temp = new window.google.maps.LatLng(parseFloat(item.lnglat[i][1]), parseFloat(item.lnglat[i][0]));
        arr.push(temp);
      }

      let color = this.getValeColor(item.value, rankUnit);

      let flightPath = new window.google.maps.Polygon({
        path: arr,
        strokeColor: '#000',
        strokeOpacity: 0.5,
        strokeWeight: 1,
        strokeWidth: 1,
        fillColor: color,
        fillOpacity: 0.8
      });

      return flightPath;
    },
    getValeColor(value, rankUnit) {
      value = parseFloat(value);
      let level = Math.floor(value / rankUnit);

      return level < 6 ? colorModel[level] 
                        : colorModel[6]; 
    },
    getLevel(max) {
      let digit = 0;
      max = parseInt(max);
      while (max != 0) {
        digit++;
        max = max / 10;
        max = parseInt(max);
      }
      
      return digit;
    },
    getMaxValue(list) {
      let max = 0;
      for (let i = 0; i < list.length; i++) {
        if (max < parseFloat(list[i].value)) {
          max = parseFloat(list[i].value)
        }
      }

      return max;
    },
    dealRankDis(list) {
      let max = this.getMaxValue(list),
          level = this.getLevel(max),
          num = 1;
      
      for (let i = 1; i < level; i++) {
        num *= 10;
      }

      let times = Math.floor((max / num) / 1.4);

      let rankUnit = 1.4 * num * times / 7;
      
      this.$store.state.rankSample.rankUnit = rankUnit;
      
      return rankUnit;
    }
  },
  watch: {
    isOpenHeat(newVal) {
      if (newVal == false) {
        return ;
      }
      let rankUnit = this.dealRankDis(this.heatData);
      for (let i = 0; i < this.heatData.length; i++) {
        let flightPath = this.getPolygon(this.heatData[i], rankUnit);
        flightPath.setMap(this.map);
      }
      // rankUnit = this.dealRankDis(data);
      // for (let i = 0; i < data.length; i++) {
      //   let flightPath = this.getPolygon(data[i], rankUnit);
      //   flightPath.setMap(this.map);
      // }
      // console.log('123', this.heatData, data);
    }
  }
  
}
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;

  .google-map {
    width: 100%;
    height: 100%;
  }

  .rank {
    position: absolute;
    top: 0.6rem;
    right: 0;
    z-index: 11;
  }

  .rank-sample {
    position: absolute;
    right: 0;
    bottom: 1.5rem;
  }
}
</style>

<template>
  <div class='map-container'>
    <div :id='id' class='google-map'></div>
    <rank class='rank' ></rank>
    <valueSample class='rank-sample' :rankUnit='$data.rankUnit'
      v-if='$store.state.rankSample[this.id].rankUnit != 0'
    ></valueSample>
  </div>
</template>

<script>
import rank from '../panel/rank/rank.vue';
import { colorModel } from '../../utils/shared/model.js';
import { getFlyLine } from '../../utils/shared/line.js';
import { getGCJ } from '../../utils/shared/gcj.js';
import valueSample from '../panel/valueSample/valueSample.vue';
import PubSub from 'pubsub-js'

export default {
  components: {
    rank,
    valueSample
  },
  data() {
    return {
      example: {
        type: 'LineString',
        cor: [[91.1865, 30.1465], [116.4551, 40.2539]]
      },
      map: null,
      rankUnit: 0
    };
  },
  props: ['id', 'heatData', 'isOpenHeat'],
  mounted() {
    // this.$store.state.showCharts = true;
              // this.$store.state.message = '请求超时，请检查您的网络是否正常'
    
    // this.mychart = this.$echarts.init($('#' + this.id)[0]);
    // this.mychart.setOption({
    //   amap: {
    //     //  maxPitch: 60,
    //     //  pitch: 10, //45 俯仰角
    //     //  viewMode: '3D',
    //     zoom: 10,
    //     //  expandZoomRange: true,
    //     zooms: [3, 20],
    //     mapStyle: 'amap://styles/darkblue', //地图主题
    //     center: [113.25, 23.1], //中心点
    //     lang: 'en',
    //     //  rotation: 0,  //顺时针旋转角度
    //     resizeEnable: true
    //   },
    //   // dataRange: {
    //   //   zIndex: 999,
    //   //   min: 0,
    //   //   max: 100,
    //   //   calculable: true,
    //   //   color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
    //   //   textStyle: {
    //   //     color: '#fff'
    //   //   }
    //   // },
    //   animation: false,
    //   series: []
    // });
    // let google = window.google;
    
    this.map = new google.maps.Map(document.getElementById(this.id), {
      zoom: 8,
      center: {
        lat: 23.1,
        lng: 113.25
      },
      disableDefaultUI: true,               //取消默认的试图
      navigationControl: false,              //true表示显示控件
      mapTypeControl: false,                //false表示不显示控件
      scaleControl: false
    });
    this.$data.map = this.map;
    

    PubSub.subscribe('renewPoly' , (event, data) => {
      if (data.id != this.id && data.id) {
        return ;
      }

      let arr = data.data;

      let rankUnit = this.dealRankDis(arr);
    
      data = getGCJ(data);

      let flightPathArr = []
      for (let i = 0; i < arr.length; i++) {
        let temp = this.getPolygon(arr[i], rankUnit)
        temp.setMap(this.$data.map)
        // this.$data.map.add(temp)
        flightPathArr.push(temp);
        // temp.setMap(this.map);
      }
      this.$store.state.flightPath[this.id] = flightPathArr;
      this.$store.state.maps[this.id] = this.$data.map;
      this.$store.state.panel.leftSecActive = false;
      this.$store.state.rankSample[this.id].rankUnit = rankUnit;
      this.$nextTick(() => {
        this.$data.rankUnit = rankUnit;
      })
    });
    PubSub.subscribe('renewFlyline' , (event, data) => {
      if (data.id != this.id && data.id) {
        return ;
      }

      let flylineSeries = [],
          lineData = data.data,
          rankUnit = this.dealRankDis(lineData);
      let max = this.getMaxValue(lineData);
      var overlay = new google.maps.OverlayView();
      data = lineData
    const that = this;
    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayLayer).append('svg')
            .attr('class', 'fly-layer');

        let defs = layer.append('defs');
        defs.append('marker')
          .attr('id', 'markerArrow')
          .attr('markerWidth', '13')
          .attr('markerHeight', '13')
          .attr('refX', '2')
          .attr('refY', '6')
          .attr('orient', 'auto')
          .append('path')
          .attr('d', 'M2,2 L2,11 L10,6 L2,2')
          .attr('fill', '#00ff00');

        console.log('data', data)

        layer.selectAll('.flyLine').data(data, (d) => d.id).enter().append('path').attr('class', 'flyLines')
        var projection = this.getProjection();
        overlay.draw = function() {
          console.log(layer)
          
          let bounds = this.map.getBounds();
          let nw = bounds.getNorthEast(),
              sw = bounds.getSouthWest(),
              center = bounds.getCenter();
          

          layer.selectAll('.flyLines')
            .data(data)
            .each(transform)

          function getCosFromTan(value, len) {
            let rad = Math.atan(value);
            let length = len;

            return {
              x: length * Math.cos(rad),
              y: length * Math.sin(rad)
            };
          }

          function transform(flyObj) {
            console.log(flyObj)
            let d = new google.maps.LatLng(flyObj.fromLnglat[1], flyObj.fromLnglat[0]);
            let d2 = new google.maps.LatLng(flyObj.toLnglat[1], flyObj.toLnglat[0]);
            let bash = new google.maps.LatLng(nw.lat(), nw.lng())
            let bash2 = new google.maps.LatLng(sw.lat(), sw.lng())
            d = projection.fromLatLngToDivPixel(d);
            d2 = projection.fromLatLngToDivPixel(d2);
            let bashX = projection.fromLatLngToDivPixel(bash).x;
            let bashY = projection.fromLatLngToDivPixel(bash2).y;
            let value = (d2.y - d.y) / (d2.x - d.x);
            let len = Math.pow(Math.pow(d2.y - d.y, 2) + Math.pow(d2.x - d.x, 2), 1 / 2);
            let res = getCosFromTan(value, len);
            res.x = bashX + (d2.x + d.x) / 2;
            res.y = bashY - 40 + (d2.y + d.y) / 2;

            return d3.select(this)
                    .attr('d', 'M ' + (bashX + d.x) + ',' + (bashY + d.y) + ' Q ' + res.x + ',' + res.y + ' ' + (bashX + d2.x) + ',' + (bashY + d2.y))
                    .attr('stroke', '#000')
                    .attr('fill', 'none')
                    .attr('marker-end', 'url(#markerArrow)')
          }
        };


        
    };
    overlay.setMap(this.map);
      // for (let i = 0; i < lineData.length; i++) {
      //   flylineSeries = [...flylineSeries, ...this.getLine(lineData[i], rankUnit)];
      // }

      // let dataRange = {
      //   zIndex: 2,
      //   min: 0,
      //   max: max,
      //   x: 'right',
      //   y: 'bottom',
      //   calculable: true,
      //   color: ['#3794C4', '#65ABBC', '#A1CDB2', '#DDE9A4', '#EFBC7A', '#F05435', '#EE2123'],
      //   textStyle: {
      //     color: '#000'
      //   },
      //   text:[0, max],
      // }
      // this.mychart.setOption({
      //   series: flylineSeries,
      //   dataRange
      // })
      // this.layer.render = () => {
      //   this.mychart.setOption({
      //     series: flylineSeries,
      //     dataRange
      //   });
      // };
      // this.$store.state.flightPath[this.id] = flightPathArr;
      // this.$store.state.maps[this.id] = this.$data.map;
      // this.$store.state.panel.leftSecActive = false;
      // this.$data.rankUnit = rankUnit;
    });
  },
  methods: {
    getLine(item, rankUnit) {
      let color = this.getValeColor(item.value, rankUnit);

      return getFlyLine({
        name: '测试',
        value: 96,
        lineColor: color,
        symbolColor: color,
        fromName: color,
        toName: color,
        fromLngLat: item.fromLnglat,
        toLngLat: item.toLnglat
      })
    },
    getPolygon(item, rankUnit) {
      let arr = [];
      for (let i = 0; i < item.lnglat.length; i++) {
        let temp = new google.maps.LatLng(
          parseFloat(item.lnglat[i][1]),
          parseFloat(item.lnglat[i][0]),
        );
        arr.push(temp);
      };

      let color = this.getValeColor(item.value, rankUnit);

      let flightPath = new google.maps.Polygon({
        paths: arr,
        strokeColor: '#000',
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillColor: color,
        fillOpacity: 0.8
      });

      // let poly = new Amap.maps.Polygon({
      //             paths: arr,
      //             strokeColor: '#000',
      //             strokeOpacity: 0.5,
      //             strokeWeight: 1,
      //             fillColor: color,
      //             fillOpacity: 0.8
      //            });

      flightPath.value = item.value;
      flightPath.id = item.id;
      
      window.google.maps.event.addDomListener(flightPath, 'click', (event) => {
        if (this.coordInfoWindow) {
          this.coordInfoWindow.close()
        }
        let lat = event.latLng.lat();
        let lng = event.latLng.lng();
        this.coordInfoWindow = new google.maps.InfoWindow();
        this.coordInfoWindow.setContent(['id:' + flightPath.id,
                                    'value:' + flightPath.value].join('<br>'));
        this.coordInfoWindow.setPosition(new google.maps.LatLng(lat, lng));
        this.coordInfoWindow.open(this.map);
        this.$store.state.showConfirm = true;
        this.$store.state.confirmMes = 'Are you sure to display a two-month flow lines chart for the selected area?'
        let token = PubSub.subscribe('confirmChart', (event, data) => {
          PubSub.unsubscribe(token);
          if (data.confirm) {
            let id = flightPath.id;
            this.$http
              .get('/flyIntoSky/queryflow?id=' + id)
              .then((res) => {
                let data = res.data;
                this.$store.state.showCharts = true;
                this.$nextTick(() => {
                  PubSub.publish('getDataCharts', data)
                })
                
              })
            
          }
        })
        
      })
      // flightPath.on('click', (event) => {
      //   console.log(event)
      // })

      // flightPath.on('click', (event) => {
      //   let infoWindow = new AMap.InfoWindow({
      //     anchor: 'top-center',
      //     content: 'id: ' + event.target.id + 'value: ' + event.target.value,
      //   });
      //
      //   infoWindow.open(this.$data.map, [event.lnglat.lng ,event.lnglat.lat]);
      //   PubSub.publish('getFlowData', {
      //     id: this.id
      //   });
      // });

      return flightPath;
    },
    getValeColor(value, rankUnit) {
      value = parseFloat(value);
      let level = Math.floor(value / rankUnit);

      return level < 6 ? colorModel[level] : colorModel[6];
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
          max = parseFloat(list[i].value);
        }
      }

      return max;
    },
    dealRankDis(list) {
      let max = this.getMaxValue(list);

      let rankUnit = max / 7;
      // let max = this.getMaxValue(list),
      //   level = this.getLevel(max),
      //   num = 1;

      // for (let i = 1; i < level; i++) {
      //   num *= 10;
      // }

      // let times = Math.floor(max / num / 1.4);

      // let rankUnit = (1.4 * num * times) / 7;
      console.log(rankUnit)
      return rankUnit.toFixed(1);
    }
  },
  watch: {
    isOpenHeat(newVal) {
      if (newVal == false) {
        return;
      }
      
      
      
      // rankUnit = this.dealRankDis(data);
      // for (let i = 0; i < data.length; i++) {
      //   let flightPath = this.getPolygon(data[i], rankUnit);
      //   flightPath.setMap(this.$data.map);
      // }
      // console.log('123', this.heatData, data);
    }
  }
};
</script>

<style lang='scss'>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

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
    bottom: 2.2rem;
  }
}
.fly-layer {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: -50vh;
  left: -50%;
}
</style>

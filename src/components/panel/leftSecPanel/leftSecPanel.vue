<template>
  <div class="left-second-panel" :class="$store.state.panel.leftSecActive ? 'left-second-active' : ''">
    <div class="arrow-container"
      @click="switchPanel"
    >
      <img :src="$store.state.panel.leftSecActive ? 
      require('../../../assets/icons/arrow_left_large.png') : require('../../../assets/icons/arrow_right_large.png')" alt="">
    </div>
    <div class="attraction-container"
      v-if="$store.state.panel.secPanMode == 1 && !$store.state.isContract"
    >
      <span class="attract-title">Regional attraction</span>
      <div class="choice-mode-container">
        <span>Mode</span>
        <el-select v-model="mode" placeholder="Choice time mode">
          <el-option
            class="select-mode"
            v-for="item in timeMode"
            :key="item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="choice-time-container">
        <span>Time</span>
        <el-cascader
          :options="dateChoice"
          v-model="date"
        >
        </el-cascader>
        <!-- <el-date-picker
          class="select-time"
          v-model="date"
          :type="'month'"
          placeholder="Choice date">
        </el-date-picker> -->
      </div>
      <div class="button-container">
        <el-button class="comfirm-search" type="primary"
          @click="getData"
          :loading="isLoading"
        >Comfirm</el-button>
      </div>
    </div>

    <!-- 下面是比较时候的选择 -->
    <div class="attraction-container"
      v-if="$store.state.panel.secPanMode == 1 && $store.state.isContract"
    >
      <span class="attract-title">Regional attraction</span>
      <div class="choice-mode-container">
        <span>Mode</span>
        <el-select v-model="mode" placeholder="Choice time mode">
          <el-option
            class="select-mode"
            v-for="item in timeMode"
            :key="item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <span class="time-to-map">Left Map:</span>
      <div class="choice-time-container">
        <span>Time</span>
        <el-cascader
          :options="dateChoice"
          v-model="firstDate"
        >
        </el-cascader>
      </div>
      <span class="time-to-map">Right Map:</span>
      <div class="choice-time-container">
        <span>Time</span>
        <el-cascader
          :options="dateChoice"
          v-model="secondDate"
        >
        </el-cascader>
      </div>
      <div class="button-container">
        <el-button class="comfirm-search" type="primary"
          @click="getDoubleData"
          :loading="isLoading"
        >Comfirm</el-button>
      </div>
    </div>

    <!-- 以下是飞线请求数据 -->
    <div class="attraction-container"
      v-if="$store.state.panel.secPanMode == 2"
    >
      <span class="attract-title">FlyLine Views</span>
      <div class="choice-time-container">
        <span>Time</span>
        <el-cascader
          :options="flyChoice"
          v-model="flyDate"
        >
        </el-cascader>
      </div>
      <div class="button-container">
        <el-button class="comfirm-search" type="primary"
          @click="getFlyData"
          :loading="isLoading"
        >Comfirm</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import PubSub from 'pubsub-js'
import { data } from '../../../../public/data4.js'
export default {
  props: ['heatData'],
  data() {
    return {
      isLoading: false,
      date: null,
      mode: '',
      firstDate: null,
      secondDate: null,
      flyDate: null,
      flyFirstDate: null,
      flySecondDate: null,
      timeMode: [
        {
          label: 'By hour',
          value: 'hour'
        },
        {
          label: 'By date',
          value: 'date'
        },
        {
          label: 'By six hours',
          value: 'six'
        }
      ],
      dateChoice: [
        {
          value: '2',
          label: 'February',
          children: null,
        },
        {
          value: '3',
          label: 'March',
          children: null,
        }
      ],
      flyChoice: [
        {
          value: '2',
          label: 'February',
          children: null,
        },
        {
          value: '3',
          label: 'March',
          children: null,
        }
      ]
    }
  },
  mounted() {
    this.$data.mode = 'hour';
    this.renewFlyChoice()
  },
  methods: {
    getFlyData() {
      let postObj = {
        'month': this.$data.flyDate[0],
        'day': this.$data.flyDate[1],
        'hour': this.$data.flyDate[2]
      };
      
      this.$data.isLoading = true;
      
      this.$http
        .get('/flyIntoSky/update?auth=linxu')
        .then(res => {
          this.$http
            .post('/flyIntoSky/route', postObj)
            .then((res) => {
              let data = res.data;

              this.$data.isLoading = false;

              let flyRes = {
                id: 'map1',
                data: this.fromateFlyData(data)
              }
              

              PubSub.publish('renewFlyline', flyRes);
            })
            .catch((err) => {
              console.log(err);
            })
        })
    },
    // getDoubleFlyData() {
    //   let postObj1 = {
    //     'month': this.$data.flyFirstDate[0],
    //     'day': this.$data.flyFirstDate[1],
    //     'hour': this.$data.flyFirstDate[2]
    //   };
    //   let postObj2 = {
    //     'month': this.$data.flySecondDate[0],
    //     'day': this.$data.flySecondDate[1],
    //     'hour': this.$data.flySecondDate[2]
    //   };

    //   this.$data.isLoading = true;

    //   this.$http
    //     .get('/flyIntoSky/update?auth=linxu')
    //     .then(res => {
    //       this.$http
    //         .post('/flyIntoSky/route', postObj)
    //         .then((res) => {
    //           let data = res.data;

    //           this.$data.isLoading = false;

    //           let flyRes = {
    //             id: 'map1',
    //             data: this.fromateFlyData(data)
    //           }
              

    //           PubSub.publish('renewFlyline', flyRes);
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //         })
    //   });
    //   this.$http
    //     .get('/flyIntoSky/update?auth=linxu')
    //     .then(res => {
    //       this.$http
    //         .post('/flyIntoSky/route', postObj)
    //         .then((res) => {
    //           let data = res.data;

    //           this.$data.isLoading = false;

    //           let flyRes = {
    //             id: 'map2',
    //             data: this.fromateFlyData(data)
    //           }
              

    //           PubSub.publish('renewFlyline', flyRes);
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //         })
    //     })
    // },
    fromateFlyData(data) {
      let resultArr = [];

      for (let i = 0; i < data.routeList.length; i++) {
        resultArr.push({
          id: data.routeList[i].id,
          value: data.routeList[i].weight,
          fromLnglat: [data.routeList[i].fromCentreLon, data.routeList[i].fromCentreLat],
          toLnglat: [data.routeList[i].toCentreLon, data.routeList[i].toCentreLat],
        });
      }

      return resultArr;
    },
    renewFlyChoice() {
      this.$data.flyChoice[0].children = [];
      this.$data.flyChoice[1].children = [];
      let children1 = [], children2 = [];
      let timeArr = []
      for (let i = 0; i < 24; i++) {
        timeArr.push({
          value: i,
          label: i
        })
      }
      for (let i = 1; i <= 28; i++) {
        children1.push({
          label: i,
          value: i,
          children: timeArr
        });
        children2.push({
          label: i,
          value: i,
          children: timeArr
        });
      }
      for (let j = 29; j <= 31; j++) {
        children2.push({
          label: j,
          value: j,
          children: timeArr
        });
      }
      
      this.$data.flyChoice[0].children = children1;
      this.$data.flyChoice[1].children = children2;
    },
    switchPanel() {
      this.$store.state.panel.leftSecActive = false;
    },
    getData() {
      let mode = this.$data.mode,
          time = this.$data.date,
          requestObj = null;

      if (!time) {
        return ;
      }

      switch(mode) {
        case 'hour': {
          requestObj = {
            month: this.$data.date[0].toString(),
            day: this.$data.date[1].toString(),
            hour: this.$data.date[2].toString()
          }
          
          break;
        }

        case 'date': {
          requestObj = {
            month: this.$data.date[0].toString(),
            day: this.$data.date[1].toString(),
            hour: '25'
          }
          break;
        }

        case 'six': {
          requestObj = {
            month: this.$data.date[0].toString(),
            day: this.$data.date[1].toString(),
            hour: (this.$data.date[2] + 26).toString()
          }
          break;
        }
        
        default: return;
      }
      

      if (this.$store.state.flightPath.map1) {
        if (this.$store.state.flightPath.map1.length) {
          for (let i = 0; i < this.$store.state.flightPath.map1.length; i++) {
            // this.$store.state.maps.map1.remove(this.$store.state.flightPath.map1[i]);
            this.$store.state.flightPath.map1[i].setMap(null);
            console.log('clearing')
          }
        }
      }

      if (this.$store.state.flightPath.map2) {
        if (this.$store.state.flightPath.map2.length) {
          for (let i = 0; i < this.$store.state.flightPath.map2.length; i++) {
            // this.$store.state.maps.map2.remove(this.$store.state.flightPath.map1[i]);
            this.$store.state.flightPath.map2[i].setMap(null)
          }
        }
      }
      
      this.$data.isLoading = true;

      // if (mode == 'six') {
      //   let promiseArr = []
      //   for (let i = 0; i < 6; i++) {
      //     promiseArr.push(new Promise((resolve, reject) => {
      //       let reqObj = JSON.parse(JSON.stringify(requestObj));
      //       reqObj.hour = (parseInt(reqObj.hour) + i).toString();
      //       this.sixHoursGetData(reqObj, (res) => {
      //         let data = res.data;
      //         let formateData = this.getAllCircle(data.circles);
      //         console.log('123')
      //         resolve(formateData);
      //       })
      //     }))
      //   }
      //   Promise.all(promiseArr).then((results) => {
      //     console.log(results)
      //     let data = [...results[0], ...results[1], ...results[2], ...results[3], ...results[4], ...results[5]];
      //     PubSub.publish('renewPoly', data);
      //     this.$data.isLoading = false;
      //   }).catch(err => {
      //     console.log('出错了')
      //   }) 
      // } else {
        // console.log(data)
        this.$nextTick(() => {
          this.$http
            .post('/flyIntoSky/circle', requestObj)
            .then((res) => {
              let data = res.data;
              console.log(data)
              let formateData = this.getAllCircle(data.circles);
              console.log('for,a', formateData)
              let obj = {
                id: 'map1',
                data: formateData
              }
              // this.$emit('updateHeatData', formateData);
              PubSub.publish('renewPoly', obj);

              this.$data.isLoading = false;
            })
            .catch((err) => {
              console.log(err);
            })
        });
      // }
    },
    getCircleLatLng(pointList) {
      let returnArr = [];
      for (let i = 0; i < pointList.length; i++) {
        returnArr.push([pointList[i].longitude, pointList[i].latitude]);
      }
      return returnArr;
    },
    getAllCircle(circles) {
      let returnArr = [];
      for (let i = 0; i < circles.length; i++) {
        returnArr.push({
          id: circles[i].id,
          value: circles[i].weight,
          lnglat: this.getCircleLatLng(circles[i].pointList)
        });
      }
      console.log(returnArr)
      return returnArr;
    },
    getDoubleData() {
      let mode = this.$data.mode,
          time1 = this.$data.firstDate,
          time2 = this.$data.secondDate,
          requestObjMap1 = null,
          requestObjMap2 = null;

      if (!time1 || !time2) {
        return ;
      }

      switch(mode) {
        case 'hour': {
          requestObjMap1 = {
            month: this.$data.firstDate[0].toString(),
            day: this.$data.firstDate[1].toString(),
            hour: this.$data.firstDate[2].toString()
          }
          requestObjMap2 = {
            month: this.$data.secondDate[0].toString(),
            day: this.$data.secondDate[1].toString(),
            hour: this.$data.secondDate[2].toString()
          }
          break;
        }

        case 'date': {
          requestObjMap1 = {
            month: this.$data.firstDate[0].toString(),
            day: this.$data.firstDate[1].toString(),
            hour: '25'
          }
          requestObjMap2 = {
            month: this.$data.secondDate[0].toString(),
            day: this.$data.secondDate[1].toString(),
            hour: '25'
          }
          break;
        }

        case 'six': {
          requestObjMap1 = {
            month: this.$data.firstDate[0].toString(),
            day: this.$data.firstDate[1].toString(),
            hour: (this.$data.firstDate[2] + 26).toString()
          }
          requestObjMap2 = {
            month: this.$data.secondDate[0].toString(),
            day: this.$data.secondDate[1].toString(),
            hour: (this.$data.secondDate[2] + 26).toString()
          }
          break;
        }
        
        default: return;
      }

      if (this.$store.state.flightPath.map1) {
        if (this.$store.state.flightPath.map1.length) {
          for (let i = 0; i < this.$store.state.flightPath.map1.length; i++) {
            // this.$store.state.maps.map1.remove(this.$store.state.flightPath.map1[i]);
            this.$store.state.flightPath.map1[i].setMap(null);
          }
        }
      }

      if (this.$store.state.flightPath.map2) {
        if (this.$store.state.flightPath.map2.length) {
          for (let i = 0; i < this.$store.state.flightPath.map2.length; i++) {
            // this.$store.state.maps.map2.remove(this.$store.state.flightPath.map1[i]);
            this.$store.state.flightPath.map2[i].setMap(null)
          }
        }
      }
      
      this.$data.isLoading = true;

      this.$nextTick(() => {
          this.$http
            .post('/flyIntoSky/circle', requestObjMap1)
            .then((res) => {
              let data = res.data;
              let formateData = this.getAllCircle(data.circles);

              let resData = {
                id: 'map1',
                data: formateData
              }

              // this.$emit('updateHeatData', formateData);
              PubSub.publish('renewPoly', resData);

              this.$data.isLoading = false;
            })
            .catch((err) => {
              console.log(err);
            })
          this.$http
            .post('/flyIntoSky/circle', requestObjMap2)
            .then((res) => {
              let data = res.data;
              let formateData = this.getAllCircle(data.circles);

              let resData = {
                id: 'map2',
                data: formateData
              }

              // this.$emit('updateHeatData', formateData);
              PubSub.publish('renewPoly', resData);

              this.$data.isLoading = false;
            })
            .catch((err) => {
              console.log(err);
            })
      });
    }
  },
  watch: {
    mode(mode) {
      // this.$data.date = null;
      // this.$data.firstDate = null;
      // this.$data.secondDate = null;
      switch(mode) {
        case 'six': {
          this.$data.dateChoice[0].children = [];
          this.$data.dateChoice[1].children = [];
          let children1 = [], children2 = [];
          let timeArr = []
          for (let i = 0; i < 24; i += 4) {
            timeArr.push({
              value: i,
              label: i + '-' + (i + 3)
            })
          }
          for (let i = 1; i <= 28; i++) {
            children1.push({
              label: i,
              value: i,
              children: timeArr
            });
            children2.push({
              label: i,
              value: i,
              children: timeArr
            });
          }
          for (let j = 29; j <= 31; j++) {
            children2.push({
              label: j,
              value: j,
              children: timeArr
            });
          }
          
          this.$data.dateChoice[0].children = children1;
          this.$data.dateChoice[1].children = children2;
          break;
        }

        case 'date': {
          this.$data.dateChoice[0].children = [];
          this.$data.dateChoice[1].children = [];
          let children1 = [], children2 = [];
          for (let i = 1; i <= 28; i++) {
            children1.push({
              label: i,
              value: i
            });
            children2.push({
              label: i,
              value: i
            });
          }
          for (let j = 29; j <= 31; j++) {
            children2.push({
              label: j,
              value: j
            });
          }
          this.$data.dateChoice[0].children = children1;
          this.$data.dateChoice[1].children = children2;
          break;
        }

        case 'hour': {
          this.$data.dateChoice[0].children = [];
          this.$data.dateChoice[1].children = [];
          let children1 = [], children2 = [];
          let timeArr = []
          for (let i = 0; i < 24; i++) {
            timeArr.push({
              value: i,
              label: i
            })
          }
          for (let i = 1; i <= 28; i++) {
            children1.push({
              label: i,
              value: i,
              children: timeArr
            });
            children2.push({
              label: i,
              value: i,
              children: timeArr
            });
          }
          for (let j = 29; j <= 31; j++) {
            children2.push({
              label: j,
              value: j,
              children: timeArr
            });
          }
          
          this.$data.dateChoice[0].children = children1;
          this.$data.dateChoice[1].children = children2;
          break;
        }
      }
    },
    // date(date) {
    //   console.log(date)

    //   this.$data.date = newDate;
    //   console.log(newDate)
    // }
  }
}
</script>

<style lang="scss">
%clearFloat::after {
  content: "";
  display: block;
  clear: both;
  visibility: hidden;
}
%center {
  display: flex;
  justify-content: center;
}

.left-second-panel {
  width: 5rem;
  height: 100vh;
  background-color: rgba($color: #373f53, $alpha: .9);
  transition: transform .5s ease;
  transform: translateX(-5.6rem);
  // box-shadow: 0 0 1px 2px #373f53;

  .arrow-container {
    cursor: pointer;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    right: -0.6rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0.6rem;
    height: 1.2rem;
    background-color: rgba($color: #373f53, $alpha: .9);
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;

    img {
      width: 0.24rem;
      height: 0.45rem;
    }
  }

  .attraction-container {
    @extend %clearFloat;

    width: 100%;
    margin-top: 1rem;

    .attract-title {
      margin-bottom: 0.2rem;
      display: block;
      color: #fff;
      font-size: 0.3rem;
    }

    .time-to-map {
      float: left;
      display: block;
      color: #fff;
      margin-top: 0.25rem;
      margin-bottom: 0.25rem;
      font-size: 0.24rem;
      line-height: 0.48rem;
      margin-left: 0.56rem;
    }

    .choice-mode-container {
      @extend %clearFloat;
      @extend %center; 

      width: 100%;
      margin-top: 0.4rem;

      >span {
        float: left;
        display: block;
        color: #fff;
        font-size: 0.24rem;
        line-height: 0.48rem;
      }

      .select-mode {
        display: block;
        float: left;
      }

      .el-select {
        width: 2rem;
        margin-left: 0.45rem;
        margin-right: 0.8rem;
        overflow: hidden;
      }
    }

    .choice-time-container {
      @extend %clearFloat;
      @extend %center;

      width: 100%;
      margin-top: 0.4rem;

      >span {
        float: left;
        display: block;
        color: #fff;
        font-size: 0.24rem;
        line-height: 0.48rem;
      }

      .el-cascader {
        margin-left: 0.5rem;
      }
    }

    .button-container {
      @extend %clearFloat;
      @extend %center;

      width: 100%;
      margin-top: 0.4rem;
    }

    .comfirm-search {
      width: 2rem;
      font-size: 0.24rem;
    }
  }
}

.left-second-active {
  transform: translateX(0);
}

// .popper__arrow::after {
//   left: 70px!important;
// }
.popper__arrow {
  left: 70px!important;
}
// .el-cascader {
//   left: 75px!important;
//   width: 2.5rem;
// }
</style>

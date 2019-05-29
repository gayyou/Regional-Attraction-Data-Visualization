<template>
  <div class="left-second-panel" :class="$store.state.panel.leftSecActive ? 'left-second-active' : ''">
    <div class="arrow-container"
      @click="switchPanel"
    >
      <img :src="$store.state.panel.leftSecActive ? 
      require('../../../assets/icons/arrow_left_large.png') : require('../../../assets/icons/arrow_right_large.png')" alt="">
    </div>
    <div class="attraction-container"
      v-if="$store.state.panel.secPanMode == 1"
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
  </div>
</template>

<script>
export default {
  props: ['heatData'],
  data() {
    return {
      isLoading: false,
      date: null,
      mode: '',
      timeMode: [
        {
          label: 'By hour',
          value: 'hour'
        },
        {
          label: 'By date',
          value: 'date'
        }
        // {
        //   label: 'By month',
        //   value: 'month'
        // }
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
      ]
    }
  },
  mounted() {
    this.$data.mode = 'hour'
  },
  methods: {
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

        case 'month': {
          requestObj = {
            month: this.$data.date[0].toString(),
            day: this.$data.date[1].toString(),
            hour: this.$data.date[2].toString()
          }
          break;
        }
        
        default: return;
      }
      this.$data.isLoading = true;

      this.$http
          .post('/flyIntoSky/circle', requestObj)
          .then((res) => {
            let data = res.data;
            let formateData = this.getAllCircle(data.circles);
            this.$emit('updateHeatData', formateData);
            
            this.$nextTick(() => {
              setTimeout(() => {
                this.$emit('isOpenHeat', true);
              }, 0);
            })
            this.$data.isLoading = false;
          })
          .catch((err) => {
            console.log(err);
          })
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
      return returnArr;
    },
    resetTime() {
      
    }
  },
  watch: {
    mode(mode) {
      switch(mode) {
        case 'month': {
          for (let i = 0; i < this.$data.dateChoice.length; i++) {
            this.$data.dateChoice[i].children = null;
          }
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

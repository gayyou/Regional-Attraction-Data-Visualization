import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/**
 * @rule 使用的时候，要用一个属性分开，比如我这个store是login的account，那么路径是login.account
 */
export default new Vuex.Store({
  state: {
    // 下面是左边侧栏的显示与否控制
    panel: {
      leftFirActive: false,
      leftSecActive: false,
      secPanMode: 0   // 0是区域热度模式，1是出租车流动模式，2是查看区别模式
    },
    // 下面是排行榜的单位控制
    rankSample: {
      rankUnit: 0
    },
    // 以下是地图存储
    mapList: [
      {
        id: 'map1'
      }
    ]
  },
  mutations: {

  },
  actions: {

  }
})

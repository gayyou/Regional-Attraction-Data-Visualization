import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';

Vue.use(ElementUI);

console.log(process.env.NODE_ENV)

axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

if (process.env.NODE_ENV === 'development') {
  // 测试环境
  axios.defaults.baseURL = 'http://www.benhefoodstuff.com:24567';
} else {
  // 生产环境
  axios.defaults.baseURL = 'http://www.benhefoodstuff.com:24567';
}

Vue.prototype.$http = axios;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

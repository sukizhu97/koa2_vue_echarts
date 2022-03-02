import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// 请求基准路径的配置
axios.defaults.baseURL = 'http://127.0.0.1:8081/api/'

// axios 挂载到Vue的原型对象上
Vue.prototype.$http = axios
// 全局echarts挂载到Vue原型对象上
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

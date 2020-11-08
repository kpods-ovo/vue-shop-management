import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import './plugins/element.js'
// 引入全局样式表
import './assets/css/global.css'
// 全局引入axios并挂载到Vue原型链上
import axios from 'axios'
Vue.prototype.$http = axios
// 配置数据接口的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios拦截器加入token,如若不加入token值，则后台无法返回相应数据
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

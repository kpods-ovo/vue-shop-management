import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
// 按需引入element ui组件
import './plugins/element.js'
// 按需引入echarts组件
import './plugins/echarts.js'
// 引入全局样式表
import './assets/css/global.css'
// 全局引入axios并挂载到Vue原型链上
import axios from 'axios'
// 全局引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.prototype.$http = axios
Vue.use(VueQuillEditor)
// 配置数据接口的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios拦截器加入token,如若不加入token值，则后台无法返回相应数据
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 定义时间格式化过滤器
Vue.filter('dateFormat', function (dateStr, format = 'yyyy-mm-dd hh:mm:ss') {
  const date = new Date(dateStr * 1000)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  if (format.toLowerCase() === 'yyyy-mm-dd hh:mm:ss') {
    return `${year}-${month}-${day} ${hour}:${min}:${sec}`
  } else {
    return `${year}-${month}-${day}`
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

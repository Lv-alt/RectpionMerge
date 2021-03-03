// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//引入图片放大的那个
/*import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})*/

import Viewer from 'v-viewer'

import 'viewerjs/dist/viewer.css'

Vue.use(Viewer)

Viewer.setDefaults({

  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }

})

Vue.use(Element)

Vue.config.productionTip = false

// 把axios变量绑定到Vue对象的原型链上
Vue.prototype.$http = axios

// 配置默认请求前缀
axios.defaults.baseURL = 'http://localhost:9999/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  //在请求 After 做些什么
  //获取存储的token 然后在请求之前添加进请求头中
  let token = sessionStorage.getItem("token");
  //判断是否存在
  if(token){
    config.headers.common['Lv'] = token;
  }
  return config;
},function (error) {
  return Promise.reject(error);
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

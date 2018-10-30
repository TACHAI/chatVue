// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import PCApp from './PCApp'
import App from './App'
import router from './router'
import device from 'current-device'

Vue.use(VueResource)
Vue.config.productionTip = false
window.eventBus = new Vue()

console.log(device.mobile())

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App, PCApp },
  template: device.mobile() ? '<App/>' : '<PCApp/>'
})

import Vue from 'vue'
import Router from 'vue-router'
import QandA from '@/components/QandA'
import QandAPC from '@/components/QandAPC'
import device from 'current-device'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'QandA',
      component: device.mobile() ? QandA : QandAPC
    }
  ]
})

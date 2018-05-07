import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
//  按需加载
const _import = file => () => import('@/views/' + file + '.vue')

export default new Router({
  routes: [
    {
      path: '/',
      name: 'delivery-log',
      component: _import('delivery-log')
    }
  ]
})

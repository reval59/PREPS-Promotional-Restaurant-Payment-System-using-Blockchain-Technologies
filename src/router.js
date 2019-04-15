import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


export default new Router({
  mode: process.env.CORDOVA_PLATFORM ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "about" */ './views/login.vue')
    },
    {
      path: '/login',
      name: 'login',
      component:() => import('./views/login.vue')
    },
    {
      path: '/restaurant', component:() => import('./views/restaurant/layout.vue'),
      children: [
        {
          path: 'register',
          component:() => import('./views/restaurant/register.vue')
        },
        {
          path: 'dashboard',
          component:() => import('./views/restaurant/dashboard.vue')
        },
        {
          path: 'kitchen',
          component:() => import('./views/restaurant/kitchen.vue')
        },
        {
          path: 'table',
          component:() => import('./views/restaurant/table.vue')
        },
        {
          path: 'history',
          component:() => import('./views/restaurant/history.vue')
        },
        {
          path: 'form-partnership',
          component:() => import('./views/restaurant/formPartnership.vue')
        },
        {
          path: 'partnership-management',
          component:() => import('./views/restaurant/partnershipManagement.vue')
        }
      ]
    },
    {
      path: '/customer', component:() => import('./views/customer/layout.vue'),
      children: [
        {
          path: 'search',
          component:() => import('./views/customer/search.vue')
        },
        {
          path: 'place-order/restaurant/:address/table/:no',
          component:() => import('./views/customer/placeOrder.vue')
        },
        {
          path: 'current-orders',
          component:() => import('./views/customer/currentOrders.vue')
        },
        {
          path: 'history',
          component:() => import('./views/customer/history.vue')
        },
        {
          path: 'membership/:no',
          component:() => import('./views/customer/membership.vue')
        },
        {
          path: 'comment',
          component:() => import('./views/customer/comment.vue')
        }
      ]
    }
  ]
})

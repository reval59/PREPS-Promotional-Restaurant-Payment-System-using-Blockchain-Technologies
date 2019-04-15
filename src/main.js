import Vue from 'vue'
import './plugins/vuetify'
// import './plugins/axios'
import middleware from './plugins/middleware'
import utility from './plugins/utility'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vuetify/dist/vuetify.min.css'


router.beforeEach((to, from, next) =>{
  if(to.name!=='login'){
    // console.log(store.state)
    if(!store.state.user.account || !store.state.user.account.address){
      store.dispatch('error',{error:"Please sign in"})
      next('/login')
    }
  }
  next()
})

Vue.use(middleware, {

})

Vue.use(utility, {

})

// Vue.axios.interceptors.response.use(null, function(err) {
//   console.log(err.response)
//   return Promise.reject(err.response);
// });
Vue.config.errorHandler = function (err, vm, info) {
    if(err.name !='TypeError'){
        console.log("[Vue]",err)
    }
}
const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

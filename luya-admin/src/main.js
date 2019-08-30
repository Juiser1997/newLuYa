import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vuex from 'vuex'
import store from './store/store'
import VueCropper from 'vue-cropper'


Vue.config.productionTip = false

Vue.use(Vuex);
Vue.use(ElementUI)
Vue.use(VueCropper)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
// import Vue from 'vue'
// import App from './App'
// import router from './router'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

// Vue.config.productionTip = false

// Vue.use(ElementUI)
// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>',
// })


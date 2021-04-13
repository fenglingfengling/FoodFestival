import Vue from 'vue'
import App from './App.vue'
import store from './store/'
import router from './router/index.js'
import ElementUI from 'element-ui';
import axios from 'axios';
import 'element-ui/lib/theme-chalk/index.css';
import "./assets/css/index.styl";
import "./assets/css/over-write.styl";
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app')

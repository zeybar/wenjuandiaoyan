import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/main.scss'
import { Input } from 'element-ui';

Vue.use(Input)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
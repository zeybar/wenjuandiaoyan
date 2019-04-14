import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/main.scss'
import { 
  Autocomplete,
  Button,
  Checkbox,
  CheckboxGroup,
  Form,
  FormItem,
  Input,
  Dialog,
  Radio,
  RadioGroup,
  Select,
  Option,
  Message,
} from 'element-ui';

Vue.use(Autocomplete)
Vue.use(Button)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(Message)

Vue.prototype.$message = Message;

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
//this is the vue app entrypoint!
import Vue from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { Table, ConfigProgrammatic } from "buefy";
import "buefy/dist/buefy.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProgressPlugin } from "bootstrap-vue";
import axios from "axios";
import VueHtmlToPaper from "vue-html-to-paper";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import App from './App.vue'

axios.defaults.baseURL = process.env.VUE_APP_API_URL;


const options = {
  name: "_blank",
  styles: [
    "https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css",
    "https://unpkg.com/kidlat-css/css/kidlat.css",
    "http://localhost:8080/printStyles.css"
  ]
};
Vue.use(VueHtmlToPaper, options);

Vue.component("v-select", vSelect);
Vue.component("faIcon", FontAwesomeIcon);
Vue.use(Table);
Vue.use(ProgressPlugin);

ConfigProgrammatic.setOptions({
  defaultIconPack: "fas",
  defaultIconComponent: "faIcon"
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app')
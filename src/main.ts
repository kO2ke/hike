import Vue from 'vue'
import App from './App.vue'
import router from './router'

import firebase from 'firebase'
import {firebaseConfig} from "@/firebaseConfig"

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

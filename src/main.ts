import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyD27oOeYmlETOihnptxrEsBLRkr_LIQCwI",
  authDomain: "hike-92be7.firebaseapp.com",
  databaseURL: "https://hike-92be7.firebaseio.com",
  projectId: "hike-92be7",
  storageBucket: "hike-92be7.appspot.com",
  messagingSenderId: "1006997583157",
  appId: "1:1006997583157:web:132ce72eaae788c731087c",
  measurementId: "G-42427P8DS3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

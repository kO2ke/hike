import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import firebase from "firebase"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import Home from '../views/Home.vue'
import Signin from '../views/Signin.vue'
import Signup from '../views/Signup.vue'
import Mypage from '../views/Mypage.vue'
import Ranking from '../views/Ranking.vue'


// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin,
    meta: { requiresNotAuth: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: { requiresNotAuth: true }
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: Mypage,
    meta: { requiresAuth: true }
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: Ranking
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth    = to.matched.some(record => record.meta.requiresAuth)
  const requiresNotAuth = to.matched.some(record => record.meta.requiresNotAuth)
  const isLogin = firebase.auth().currentUser
  if (requiresAuth && !isLogin) {
    next({
      path: '/',
    })
    return
  }
  if (requiresNotAuth && isLogin){
    next({
      path: '/',
    })
    return
  }
  next()
})

export default router

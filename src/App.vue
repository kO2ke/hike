<template>
  <div id="app">
    <div class="header py-2 text-center border-bottom">
      <span>Hike.com</span>
      <b-button v-if="!auth.currentUser" href="/signin"  class="right-menu">
        <b-icon icon="door-closed" class="rounded-circle"></b-icon>
      </b-button>
      <b-dropdown v-if="auth.currentUser" class="right-menu" no-caret>
        <template v-slot:button-content>
          <b-icon icon="person-circle"></b-icon>
        </template>
        <b-dropdown-item @click="$router.push('/mypage')">{{auth.currentUser.displayName}}</b-dropdown-item>
        <b-dropdown-item ><b-button @click="signout">SignOut</b-button></b-dropdown-item>
      </b-dropdown>
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/ranking">Ranking</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>

import firebase from 'firebase'
import router from '@/router'
import Component from 'vue-class-component'
import {Auth} from '@/user/auth'

export default {
  name: "App",

  data: function () {
    return {
      auth: Auth.getInstance()
    }
  },

  methods: {
    signout: function() {
      console.log(this.auth.currentUser)
      this.auth.signOut().then(()=>{
        this.$router.push("/signin")
      })
    },
  }
}
</script>

<style>

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  margin-top: 50px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.header {
  position: fixed;
  font-size: 30px;
  top: 0;
  left:0;
  width:100vw;
  background-color:rgb(255, 255, 255, 0.8);
  z-index: 100;
}

body{
  font-family:'Yu Mincho','YuMincho'!important;
  background-image: url("~@/assets/background.jpg");
  background-color:rgba(255,255,255,0.6);
  background-blend-mode:lighten;
}

button{
  border-radius: 5px;
  border-style: none;
}

.spring{
    background-color: rgba(209, 175, 183, 0.2)!important;
}

.summer{
    background-color: rgba(208, 233, 233, 0.2)!important;
}

.autumn{
    background-color: rgba(175, 135, 100, 0.2)!important;
}

.winter{
    background-color: rgba(63, 83, 79, 0.2)!important;
}

.right-menu{
    position: absolute;
    top: 10px;
    right: 20px; 
    z-index: 101;
}

</style>

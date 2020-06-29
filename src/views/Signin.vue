<template>
  <div class="signin">
    <h2>Sign in</h2>
    <input type="text" placeholder="Username" v-model="username">
    <input type="password" placeholder="Password" v-model="password">
    <b-button @click="signin">Signin</b-button>
    <b-button class="m-2" @click="signupWithGoogle">Use Google Account</b-button>
    <p>You don't have an account? 
      <router-link to="/signup">create account now!!</router-link>
    </p>
  </div>
</template>

<script lang="ts">

import firebase from 'firebase'
import router from '../router'
import { Component, Vue} from 'vue-property-decorator';

export default class Signin extends Vue{
  username = ''
  password = ''

  private SignupWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider()

      firebase.auth().signInWithPopup(provider).then(result => {
        console.log(result.user)
        router.push('/')
      }).catch(error => {
        console.log(error)
      })
  }

  private signIn() {
      firebase.auth().signInWithEmailAndPassword(this.username, this.password).then(
        user => {
          this.$router.push('/')
        }
      ).catch(error => {
        console.log(error)
      })
    }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.signin {
  margin-top: 20px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center
}
input {
  margin: 10px 0;
  padding: 10px;
}
</style>
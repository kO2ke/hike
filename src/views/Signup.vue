<template>
  <div class="signup">
    <h2>Sign up</h2>
    <input type="text" placeholder="Username" v-model="username">
    <input type="password" placeholder="Password" v-model="password">
    <b-button @click="signup">Register</b-button>
    <b-button class="m-2" @click="signupWithGoogle">Use Google Account</b-button>
    <p>Do you have an account? 
      <router-link to="/signin">sign in now!!</router-link>
    </p>
  </div>
</template>


<script lang="ts">

import firebase from 'firebase'
import router from '../router'
import {Vue, Component} from 'vue-property-decorator';

@Component
export default class Signin extends Vue{
  username = ""
  password = ""

  mounted(){
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          this.$router.push("/")
      }
    })
  }

  private signupWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider).then(result => {
        router.push('/')
      }).catch(error => {
        console.log(error)
      })
  }

  private signup() {
      firebase.auth().createUserWithEmailAndPassword(this.username, this.password)
        .then(user => {
          this.$router.push('/')
        })
        .catch(error => {
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
.signup {
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
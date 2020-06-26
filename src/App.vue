<template>
  <div id="app">
    <div class="header py-2 text-center">
      Hike.com
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

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
  font-family: 'Yu Mincho'!important;
}

button{
  border-radius: 5px;
  border-style: none;
}

.spring{
    background-color: rgb(255, 242, 245)!important;
}

.summer{
    background-color: #f1faff!important;
}

.autumn{
    background-color: rgb(255, 242, 231)!important;
}

.winter{
    background-color: rgb(170, 190, 190)!important;
}
</style>

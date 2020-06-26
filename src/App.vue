<template>
  <div id="app">
    <div class="header my-2 text-center">
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
@import url("https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css");

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
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
}

#app{
  font-family: 'Yu Mincho';
}

button{
  border-radius: 5px;
  border-style: none;
}

.spring{
    background-color: rgb(255, 242, 245);
}

.summer{
    background-color: #f1faff;
}

.autumn{
    background-color: rgb(255, 242, 231);
}

.winter{
    background-color: rgb(209, 214, 221);
}
</style>

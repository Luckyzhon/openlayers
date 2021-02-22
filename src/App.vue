<template>
  <div id="app">
    <div id="nav">
      <Header></Header>
      <Siderbar></Siderbar>
      <router-view/>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue'; 
import Siderbar from './components/Siderbar.vue'; 
export default {
  components:{
    Siderbar,
    Header,


  }
  
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  // padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

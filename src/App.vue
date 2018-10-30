<template>
  <div id="mobile-app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
}

#mobile-app {
  width: 100%;
  min-height: 100%;
  background-color: #f7f7f7;
}
</style>

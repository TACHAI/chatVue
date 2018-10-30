<template>
  <div
    id="app"
    :class="{
      'show-hot': showHot
    }"
    :style="{
      width: winWidth * 0.7 + 'px',
      height: winHeight * 0.9 + 'px'
    }">
    <router-view/>

    <hot-topic v-show="showHot"/>
  </div>
</template>

<script>
import HotTopic from './components/HotTopic'

export default {
  name: 'App',
  components: {
    HotTopic
  },

  data () {
    return {
      showHot: true,
      winWidth: window.innerWidth,
      winHeight: window.innerHeight
    }
  },

  mounted () {
    window.eventBus.$on('on-showhot', val => {
      this.showHot = val
    })
  }
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
}

body {
  background-color: #898E99;
  padding-top: 30px;/*no*/
  box-sizing: border-box;
}

#app {
  width: 924px;/*no*/
  height: 684px;/*no*/
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 6px;
  background-color: #f7f7f7;
  margin: 0 auto;
  position: relative;
}

.show-hot {
  padding-right: 256px;/*no*/
}

/*@media screen and (min-width: 1400px) and (max-width: 1599px) {
  #app {
    width: 924px;
    height: 684px;
  }
}

@media screen and (min-width: 1400px) and (max-width: 1600px) {
  #app {
    width: 924px;
    height: 684px;
  }
}

@media screen and (min-width: 1601px) {
  #app {
    width: 1201px;
    height: 789px;
  }
}*/
</style>

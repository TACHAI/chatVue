<template>
    <div>
        <dl v-html="cacheAnswer" v-if="showType">
            {{ cacheAnswer }}
        </dl>
        <div class="shrink-count" v-else>
            <dl v-html="cacheAnswer">
                {{ cacheAnswer }}
            </dl>
            <p class="shrink" v-if="openShrink" @click="drawBack">收缩</p>
            <p class="shrink" @click="drawBack" v-else>展开</p>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      maxValue: 70, // 最大展示数字
      showType: false,
      openShrink: false, // 收缩展开显示
      cacheAnswer: '' // 缓存答案
    }
  },
  created () {
    this.showAnswer()
  },
  methods: {
    showAnswer () {
      this.cacheAnswer = this.answer
      if (this.answer.indexOf('</a>') !== -1 || this.answer.length <= 70) {
        this.showType = true
      } else {
        this.showType = false
        this.cacheAnswer = this.cacheAnswer.substr(0,this.maxValue) + '...'
      }
    },
    drawBack () {
      if (this.openShrink) {
        let otherAnswer = this.answer
        this.cacheAnswer = otherAnswer.substr(0, this.maxValue) + '...'
      } else {
        this.cacheAnswer = this.answer
      };
      this.openShrink = !this.openShrink
    }
  },
  props: ['answer']
}
</script>
<style scoped>
.shrink-count{
    height:auto;
    transition:all,.5s;
}
.shrink{
    text-align:right;
    margin-top:10px;
    color:red;
    cursor:pointer;
}
</style>

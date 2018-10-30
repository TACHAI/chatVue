<template>
  <div class="feedback">
    你对以上问答是否满意？
    <img
      :src="hasLiked ? likedIcon : likeIcon"
      class="like"
      @click="onLike">
    <img
      :src="hasDisliked ? likedIcon : likeIcon"
      class="dislike"
      @click="onDislike">
  </div>
</template>

<script>
export default {
  data () {
    return {
      hasLiked: false,
      hasDisliked: false,
      likeIcon: require('../assets/like.png'),
      likedIcon: require('../assets/liked.png')
    }
  },

  methods: {
    onLike () {
      this.hasLiked = !this.hasLiked
      setTimeout(() => {
        // alert('感谢反馈！')
        // 发送请求到后台
        this.$emit('on-like')
      }, 100)
    },

    onDislike () {
      // this.hasDisliked = !this.hasDisliked
      this.$emit('on-dislike')
    }
  }
}
</script>

<style scoped>
.feedback {
  margin-top: 17px;
  color: #9a9a9f;
  font-size: 12px;/*no*/
  line-height: 17px;/*no*/
  text-align: center;
  padding-left: 80px;
}

.advice {
  margin-top: 17px;
}

.dislike {
  transform: rotate(180deg);
}

.feedback img {
  width: 18px;
  margin-left: 21px;
}
</style>

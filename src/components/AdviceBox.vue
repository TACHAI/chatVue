<template>
  <div class="container">
    <img src="../assets/close.png" alt="" class="close" @click="onClose">

    <h2>意见反馈</h2>

    <span
      class="advice-tag"
      v-for="(item, index) in adviceList"
      :class="{
        'selected': selectedAdvice === index
      }"
      :key="index"
      @click="onSelectAdvice(item, index)">{{ item }}</span>

    <div class="input-advice">
      <textarea
        type="text"
        class="advice-input"
        row="10"
        placeholder="请输入您的建议"
        style="resize:none;"
        v-model="content"></textarea>
    </div>

    <div class="submit">
      <button @click="onSubmit">提交</button>
    </div>
  </div>
</template>

<script>
import eventBus from '../common/eventBus.js'
export default {
  data () {
    return {
      adviceList: ['和过去或最新政策不一样', '答案模糊、不清楚', '没有正面回答问题'],
      selectedAdvice: -1,
      content: '',
      msgid: ''
    }
  },
  mounted () {
    this.getEventDatas()
  },

  methods: {
    getEventDatas () {
      const that = this
      eventBus.$on('qandAPC', function (val) {
        that.msgid = val
      })
    },
    onSubmit () {
      if (!this.content.length) {
        alert('请输入意见')
        return false
      }
      // alert('意见已提交')
      this.selectedAdvice = -1
      var suggest = this.content
      this.content = ''
      var msgid = this.msgid
      this.$http.post('http://webbot.xzfwzx.xuhui.gov.cn/admin/wechatroutine/csr.do',
        {'msgid': msgid, 'csr': 1, 'suggestion': suggest},
        {emulateJSON: true}
      ).then(function (res) {
        console.log(msgid +'-----'+suggest+ 'dislike上传返回' + res.data)
      })
      this.msgid = ''
      this.$emit('on-submit')
    },

    onSelectAdvice (item, index) {
      this.selectedAdvice = index
      this.content = item
    },

    onClose () {
      this.$emit('on-close')
    }
  }
}
</script>

<style scoped>
.container {
  width: 355px;/*no*/
  margin-left: 70px;/*no*/
  margin-top: 16px;/*no*/
  padding: 20px 36px;/*no*/
  background-color: #fff;
  border-radius: 15px;/*no*/
  position: absolute;
  top: 100px;/*no*/
  left: 100px;/*no*/
  height: auto;
}

h2 {
  color: rgb(51, 51, 51);
}

.advice-tag {
  color: rgb(51, 51, 51);
  padding: 8px 12px;/*no*/
  border-radius: 99px;
  border: 1px solid rgb(234, 234, 234);
  display: inline-block;
  margin-right: 10px;/*no*/
  margin-top: 14px;/*no*/
  cursor: pointer;
}

.selected {
  color: #fff;
  border: 1px solid transparent;
  background-color: rgb(89, 207, 139);
}

.input-advice {
  padding-top: 16px;/*no*/
  padding-bottom: 12px;/*no*/
}

.input-advice textarea {
  width: 100%;
  height: 136px;/*no*/
  box-sizing: border-box;
  outline: none;
  background-color: rgb(249, 249, 249);
  border: none;
  padding: 12px;/*no*/
  border-radius: 2px;/*no*/
}

.submit {
  text-align: right;
}

.submit button {
  background-color: rgb(89, 207, 139);
  color: #fff;
  border-radius: 99px;
  border: none;
  font-size: 12px;/*no*/
  text-align: center;
  cursor: pointer;
  width: 70px;/*no*/
  height: 30px;/*no*/
}

.close {
  position: absolute;
  right: 10px;/*no*/
  top: 10px;/*no*/
  width: 20px;/*no*/
  cursor: pointer;
}
</style>

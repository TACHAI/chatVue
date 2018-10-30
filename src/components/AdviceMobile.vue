<template>
  <div class="container">
    <img src="../assets/close.png" alt="" class="close" @click="onClose">

    <h2>意见反馈</h2>

    <div
      class="advice-tag"
      v-for="(item, index) in adviceList"
      :class="{
        'selected': selectedAdvice === index
      }"
      :key="index"
      @click="onSelectAdvice(item, index)">{{ item }}</div>

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

    <div class="mask"></div>
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
      eventBus.$on('qandA', function (val) {
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
      this.content = ''
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
  margin-left: 58px;
  margin-right: 48px;
  background-color: #fff;
  padding: 13px 19px 11px 25px;
  box-shadow: 0 0 6px 0 rgba(0,0,0,0.10);
  border-radius: 10px;
  position: absolute;
  width: 60%;
  top: 100px;
  z-index: 999;
}

.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
}

h2 {
  font-size: 13px;/*no*/
}

.advice-tag {
  margin: 10px 0;
  text-align: left;
  color: rgb(51, 51, 51);
  padding: 8px 12px;
  font-size: 12px;/*no*/
  border: 1px solid rgb(234, 234, 234);
  border-radius: 3px;
  box-sizing: border-box;
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

.selected {
  color: #fff;
  border: 1px solid transparent;
  background-color: rgb(89, 207, 139);
}

.submit button {
  background-color: rgb(89, 207, 139);
  color: #fff;
  border-radius: 99px;
  border: none;
  font-size: 12px;/*no*/
  text-align: center;
  cursor: pointer;
  width: 100%;/*no*/
  height: 30px;/*no*/
}

.close {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 20px;
  cursor: pointer;
}
</style>

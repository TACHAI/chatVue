<template>
  <div class="container" ref="container">
    <div class="header">
      <span class="tab ai" :class="{
                'selected': selectedTab === 0
              }" @click="selectedTab = 0">
              徐汇区行政服务中心智能咨询客服
            </span>
      <!--<span-->
      <!--class="tab"-->
      <!--:class="{-->
      <!--'selected': selectedTab === 1-->
      <!--}"-->
      <!--@click="selectedTab = 1">-->
      <!--人工客服-->
      <!--</span>-->
    </div>

    <div class="chat-content" ref="chatContent">
      <div>
        <div class="answer">
          <div class="avatar"></div>
          <div class="answer-content">
            <div class="triangle"></div>
            <dl v-html="greetings.gretter">
              {{ greetings.gretter }}
            </dl>
          </div>
        </div>
        <!-- <div class="feedback">
                    你对以上问答是否满意？
                    <img :src="hasLiked ? likedIcon : likeIcon" class="like" @click="onLike">
                    <img :src="hasDisliked ? likedIcon : likeIcon" class="dislike" @click="onDislike">
                  </div> -->
        <div>
          <feedback-mobile v-show="!feedBackList.includes(gretterIndex)" @on-like="onLike(gretterIndex)" @on-dislike="onDislike(gretterIndex)" />
        </div>
        <div class="feedback" v-show="feedBackList.includes(gretterIndex)">
          谢谢您的反馈
        </div>
      </div>
      <!-- 热门问答 -->
      <div>
        <div class="answer">
          <div class="avatar"></div>
          <div class="answer-content content-width">
            <div class="hotAnswerHeader">
              <p>热门问答<img src="../assets/fire.png" alt=""></p>
              <p class="color-blue" @click="anthorBatch">换一批<img class="batchImage" src="../assets/batch.png" alt=""></p>
            </div>
            <div class="hotSwiper">
              <swiper :options="swaperOptions" ref="mySwiper" v-if="greetings.hotAnswer.length > 0">
                <swiperSlide v-for="(value,index) in greetings.hotAnswer" :key="index">
                  <div class="slider-innfor">
                    <p v-bind:data-title="value.question">{{ value.question }}</p>
                    <p v-bind:data-title="value.question">{{ value.answer }}</p>
                  </div>
                </swiperSlide>
              </swiper>
            </div>
          </div>
        </div>
      </div>
      <div class="q-a" v-for="(item, index) in questionList" :key="index">
        <!--<div class="time">-->
        <!--<span>4:30PM</span>-->
        <!--</div>-->
        <div v-if="item.question!=null">
          <div class="question-box">
            <p class="question-content">
              {{item.question}}
            </p>
          </div>
        </div>
        <div v-if="item.answer!=null">
          <div class="answer">
            <div class="avatar"></div>
            <div class="answer-content">
              <div class="triangle"></div>
              <contral-shink :answer="item.answer"></contral-shink>
            </div>
          </div>
          <!-- <div class="feedback">
                    你对以上问答是否满意？
                    <img :src="hasLiked ? likedIcon : likeIcon" class="like" @click="onLike">
                    <img :src="hasDisliked ? likedIcon : likeIcon" class="dislike" @click="onDislike">
                  </div> -->
          <div>
            <feedback-mobile v-show="!feedBackList.includes(index)" @on-like="onLike(index)" @on-dislike="onDislike(index)" />
          </div>
          <div class="feedback" v-show="feedBackList.includes(index)">
            谢谢您的反馈
          </div>
        </div>
      </div>

    </div>

    <div class="input-box" @click="onClickInput" ref="inputBox">
      <form @submit="sendQuestion">
        <input type="text" placeholder="简单输入，我来为你解答…" v-model="input" ref="input" maxlength="89" @focus="questionFocus">
      </form>
      <!--发送文字-->
      <div class="send" @click="sendQuestion"></div>
      <!--上传图片-->
      <div class="addPicture">
        <input type="file" name="image" accept="image/*" multiple style="" @change="uploadPic">
      </div>
      <!--<span class="count">{{ count }}</span>-->
    </div>

    <div class="advice" v-show="showAdvice">
      <advice-mobile @on-submit="onSubmit" @on-close="onClose" />
    </div>
  </div>
</template>

<script>
  import AdviceMobile from './AdviceMobile'
  import FeedbackMobile from './FeedbackMobile'
  import global_ from '../common/Global'
  import 'swiper/dist/css/swiper.css'
  import contralShink from './contralShink'
  import eventBus from '../common/eventBus.js'

  import {
    swiper,
    swiperSlide
  } from 'vue-awesome-swiper'
  export default {
    data() {
      return {
        input: '',
        selectedTab: 0,
        gretterIndex: 'getter',
        greetings: {
          gretter: '您好，欢迎使用徐汇区行政服务中心智能咨询客服，我可以为您提供行政服务中心可办事项的咨询与引导。请问您有什么问题要咨询吗？',
          hotAnswer: [{
                question: '办理劳务派遣许可证的条件',
                answer: '经营劳务派遣业务应当具备下列...'
            }, {
                question: '数字证书丢失了怎么办',
                answer: '请携带好有效证件（证件需求参...'
            }, {
                question: '怎么查询退工登记备案的结果',
                answer: '窗口办理退工登记备案的去徐汇...'
            }, {
                question: '临时占用城市道路许可审批结果是什么',
                answer: '《上海市路政管理行政许可证》哦~ '
            }
          ]
        },
        questionList: [],
        feedBackList: [],
        word: '',
        showAdvice: false,
        hasLiked: false,
        hasDisliked: false,
        likeIcon: require('../assets/like.png'),
        likedIcon: require('../assets/liked.png'),
        swaperOptions: {
          direction: 'vertical',
          autoplay: true,
          slidesPerView: 3,
          spaceBetween: 5,
          loop: true,
          on:{
            click:(e) => {
              let realyTitle = e.target.dataset.title;
              this.chooseHotAnswer(realyTitle);
            }
          }
        }
      }
    },
    // 页面刷新有一个缓存在存在以前的值
    created(){
        this.questionList = JSON.parse(sessionStorage.getItem('qusetList') || '[]');
        this.questionFocus();
    },
    computed: {
      count() {
        return 89 - this.input.length
      }
    },
    components: {
      AdviceMobile,
      FeedbackMobile,
      swiper,
      swiperSlide,
      contralShink
    },
    mounted() {
      window.setShi = (word) => {
        this.word = word
        console.log('查看是否替换' + word)
        this.questionList.push({
          question: this.word
        })
        this.$refs.chatContent.scrollTop = 99999
        this.$http.post('http://webbot.xzfwzx.xuhui.gov.cn/admin/wechatroutine//webWord.do', {
            'word': this.word,
            'sessionId': global_.sessionId
          }, {
            emulateJSON: true
          })
          .then((res) => {
            //  把返回值给到
            var result = res.data.data
            console.log(res.data.data)
            var reg = /[a-zA-z]+:\/\/[^\s]*.pdf/g
            var reg1 = /[a-zA-z]+:\/\/[^\s]*/g
            var url
            // 替换pdf预览
            while ((url = reg.exec(result)) != null) {
              console.log('222' + url)
              result = result
                .replace(url,
                  "<a href='" + url + "' target='_blank'><font color='blue'>请点这里哦~</font></a>")
            }

            var reg3 = /([\u4e00-\u9fa5]{1})|(.pdf)/g
            var url2
            while ((url2 = reg1.exec(result)) != null) {
              if (reg3.exec(url2) != null) {
                console.log('223' + url2)
              } else {
                console.log('123' + url2)
                result = result
                  .replace(url2,
                    "<a href='" + url2 + "' target='_blank'><font color='blue'>请点这里哦~</font></a>")
              }
            }
            // 这里的reg就是上面的正则表达式
            result = result.replace(/\\r\\n/g, '<br/>')
            console.log(result.replace(/\\r\\n/g, '<br/>'))
            result = result.replace(/\\n/g, '<br/>')
            result = result.replace(/void0/g, ';')
            result = result.replace(/\\"\s/g, '"')
            result = result.replace(/\\"/g, '"')
            let data = {
              answer: result,
              msgid: res.data.msg
            }
            this.questionList.push(data)
            this.word = ''
            this.input = ''
            // this.responseResoult = ''
            setTimeout(() => {
              this.$refs.chatContent.scrollTop = 99999
            }, 50)
          })
      }

      if (/Android/gi.test(navigator.userAgent)) {
        window.addEventListener('resize', function() {
          if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            window.setTimeout(function() {
              document.activeElement.scrollIntoViewIfNeeded()
              document.activeElement.scrollIntoView()
            }, 0)
          }
        })
      }
    },
    methods: {
      // 换一批
      anthorBatch() {
        this.greetings.hotAnswer = [];
        setTimeout(() => {
          this.greetings.hotAnswer = [
            {
              question: '特种设备安全管理人员作业人员资格认定办理材料有那些',
              answer: '1.特种设备作业人员考试申请表'
            },
            {
              question: '第二类医疗器械经营备案表有没有模板',
              answer: '有的，请登录上海市食品药品监督管理局...'
            },
            {
              question: '国内人才引进依据什么条例办理',
              answer: '依据以下条例哦~'
            },
          ];
          if (this.greetings.hotAnswer.length < 4) {
            this.swaperOptions.autoplay = false;
            this.swaperOptions.loop = false;
          }
        }, 1);
      },
      // 获取焦点事件
      questionFocus() {
        setTimeout(() => {
          this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
        }, 500);
      },
      // 选择热门问答
      chooseHotAnswer(value) {
        this.word = value;
        this.commonSend();
      },
      onChangeInput(e) {
        // this.input = e.target.value.slice(0, 89)
        this.input = e.target.value
        // this.$refs.input.value = e.target.value.slice(0, 89)
        this.$refs.input.value = e.target.value
        this.count = 89 - this.input.length
      },

      sendQuestion(e) {
        e.preventDefault();
        this.getList()
      },

      onClickInput() {
        this.questionFocus();
        // setTimeout(() => {
        //   this.$refs.inputBox.scrollIntoViewIfNeeded()
        // }, 300)
      },

      onLike(index) {
        console.log(index)
        this.feedBackList.push(index)
        var obj = this.questionList[index]
        console.log('onLike msgid++++++++++++++' + obj.msgid)
        // var data = {"msgid":obj.msgid,"csr":0,"suggestion":""}
        // var str = JSON.stringify(data,null,4)
        this.$http.post('http://webbot.xzfwzx.xuhui.gov.cn/admin/wechatroutine/csr.do',
          {"msgid":obj.msgid,"csr":0,"suggestion":""},
          {emulateJSON:true}
        ).then(function (res) {
          console.log(res.data)
        })
      },

      onDislike (index) {
        console.log(index)
        this.dislikeIndex = index
        this.showAdvice = true
        var obj = this.questionList[index]
        console.log('onDislike msgid++++++++++++++' + obj.msgid)
        // 传值给 弹框组件
        eventBus.$emit('qandA', obj.msgid)
      },

      onSubmit() {
        this.showAdvice = false
        this.feedBackList.push(this.dislikeIndex)
      },

      onClose () {
        this.showAdvice = false
      },
      uploadPic (e) {
        // if(this.input.length==0){
        //   return false;
        // }

        var files = e.target.files || e.dataTransfer.files
        if (!files.length) {
          return
        }

        if (files.length > 1) {
          alert('只能上传一张图片，请重新选择')
          return
        }
        this.questionList.push({
          question: '图片已上传'
        })
        this.$refs.chatContent.scrollTop = 99999
        this.word = this.input
        this.input = ''

        // 通过formdata上传
        var formData = new FormData()
        formData.append('userId', global_.sessionId)
        formData.append('file', files[0])
        this.$http.post('http://webbot.xzfwzx.xuhui.gov.cn/admin/wechatroutine/picture.do', formData, {
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(function(res) {
          console.log(111)
          console.log(res.data)
          let data = {
            answer: res.data['data'],
            msgid: res.data['msg']
          }
          this.questionList.push(data);
          this.momory();
          this.word = ''
          this.input = ''
          setTimeout(() => {
            this.$refs.chatContent.scrollTop = 99999
          }, 50)
        }).catch(function(error) {
          console.log(222)
          console.log(error)
        })
        // console.log(files[0])
      },
      getList: function () {
        if (this.input.length === 0) {
          return false
        };
        this.word = this.input;
        this.input = '';
        this.commonSend();
      },
      commonSend () {
        this.questionList.push({
          question: this.word
        })
        this.$refs.chatContent.scrollTop = 99999
        this.$http.post('http://webbot.xzfwzx.xuhui.gov.cn/admin/wechatroutine//webWord.do', {
            'word': this.word,
            'sessionId': global_.sessionId
          }, {
            emulateJSON: true
          })
          .then((res) => {
            //  把返回值给到
            var result = res.data.data
            console.log(res.data.data)
            var reg = /[a-zA-z]+:\/\/[^\s]*.pdf/g
            var reg1 = /[a-zA-z]+:\/\/[^\s]*/g
            var url
            // 替换pdf预览
            while ((url = reg.exec(result)) != null) {
              console.log('222' + url)
              result = result
                .replace(url,
                  "<a href='" + url + "' target='_blank'><font color='blue'>请点这里哦~</font></a>")
            }

            var reg3 = /([\u4e00-\u9fa5]{1})|(.pdf)/g
            var url2
            while ((url2 = reg1.exec(result)) != null) {
              if (reg3.exec(url2) != null) {
                console.log('223' + url2)
              } else {
                console.log('123' + url2)
                result = result
                  .replace(url2,
                    "<a href='" + url2 + "' target='_blank'><font color='blue'>请点这里哦~</font></a>")
              }
            }
            // 这里的reg就是上面的正则表达式
            result = result.replace(/\\r\\n/g, '<br/>')
            console.log(result.replace(/\\r\\n/g, '<br/>'))
            result = result.replace(/\\n/g, '<br/>')
            result = result.replace(/void0/g, ';')
            result = result.replace(/\\"\s/g, '"')
            result = result.replace(/\\"/g, '"')
            let data = {
              answer: result,
              msgid: res.data.msg
            }
            this.questionList.push(data);
            this.momory();
            this.word = ''
            // this.input = ''
            // this.responseResoult = ''
            setTimeout(() => {
              this.$refs.chatContent.scrollTop = 99999
            }, 50)
          })
        // axios.post('https://can.xmduruo.com:4000/wechatroutine//byWord.do', word)
        //   .then(function (resonse) {
        //     this.responseResoult = resonse.data
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   })
      },
      momory () {
          sessionStorage.setItem('qusetList',JSON.stringify(this.questionList));
      }
    }
  }
</script>

<style scoped>
  .header {
    height: 52px;
    /*no*/
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-image: linear-gradient(-128deg, #62D983 0%, #41BF76 100%);
    z-index: 99;
  }

  .tab {
    display: inline-block;
    line-height: 52px;
    /*no*/
    color: #f2f2f2;
    font-size: 16px;
    /*no*/
    position: relative;
  }

  .selected {
    font-weight: bold;
  }


  /*.selected::after {*/


  /*content: '';*/


  /*position: absolute;*/


  /*height: 3px;*/


  /*width: 24px;*/


  /*border-radius: 99px;*/


  /*bottom: 2px;*/


  /*!*background-color: #fff;*!*/


  /*right: 50%;*/


  /*transform: translateX(50%);*/


  /*}*/

  .tab.ai {
    margin-right: 23px;
  }

  .chat-content {
    padding-top: 44px;
    /*取消底部留白*/
    /*padding-bottom: 150px;*/
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 90px;
    overflow-y: scroll;
  }

  .avatar {
    width: 33px;
    height: 33px;
    border-radius: 33px;
    background-color: #41BF76;
    background-image: url('../assets/bot.png');
    background-size: 20px;
    background-position: center;
    background-repeat: no-repeat;
    margin-left: 16px;
    position: absolute;
  }

  .time {
    text-align: center;
    margin-top: 16px;
  }

  .time span {
    display: inline-block;
    color: #fff;
    font-size: 12px;
    /*no*/
    padding: 3px 7px;
    background: #E3E3E3;
    border-radius: 100px;
  }

  .question-box {
    text-align: right;
    margin-top: 13px;
    margin-right: 28px;
    margin-left: 50px;
  }

  .question-content {
    display: inline-block;
    background-color: #41BF76;
    padding: 12px 18px;
    color: #fff;
    font-size: 14px;
    /*no*/
    border-radius: 10px;
    max-width: 80%;
    overflow: hidden;
    word-break: break-all;
  }

  .answer {
    position: relative;
    margin-top: 20px;
  }

  .more {
    text-align: right;
    color: #59CF8B;
    font-size: 14px;
    /*no*/
  }

  .answer-content {
    display: inline-block;
    font-size: 15px;
    /*no*/
    background-color: #fff;
    padding: 13px 19px 11px 25px;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.10);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    margin-left: 58px;
    margin-right: 28px;
    position: relative;
  }

  .answer-content.content-width {
    min-width: 50%;
  }

  .answer-content::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 0;
    width: 0;
    height: 0;
    border-top: 20px solid #fff;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 20px solid transparent;
  }

  .answer-content h1 {
    color: #252526;
    font-size: 16px;
    /*no*/
  }

  .answer-content h1 span {
    color: #41BF76;
  }

  .answer-content h2 {
    color: #252526;
    font-size: 16px;
    /*no*/
    margin-top: 21px;
  }

  .answer-content li {
    margin: 9px 0;
    font-size: 16px;
    /*no*/
    line-height: 20px;
    /*no*/
    color: #252526;
  }

  .answer-content .tag {
    font-size: 14px;
    /*no*/
    line-height: 20px;
    /*no*/
    display: inline-block;
    padding: 0 8px;
    border-radius: 3px;
    color: #fff;
  }

  .tag1 {
    background-color: #FCB474;
  }

  .tag2 {
    background-color: #97C0FC;
  }

  .feedback {
    margin-top: 17px;
    color: #9a9a9f;
    font-size: 12px;
    /*no*/
    line-height: 17px;
    /*no*/
    text-align: left;
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

  .input-box {
    position: fixed;
    bottom: 15px;
    left: 12px;
    right: 12px;
    z-index: 99999;
    /*height: 58px;*/
    border-radius: 99px;
    background-color: #fff;
    border: 1px solid #D6D6D6;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.10);
    padding: 9px 19px;
    display: flex;
    align-items: center;
  }

  .input-box form,.input-box input {
    flex: 1;
    padding-right: 10px;
    font-size: 14px;
    /*no*/
    border: none;
    outline: none;
  }

  .input-box input::-webkit-input-placeholder {
    color: #D2D2D6;
  }

  .addPicture {
    width: 39px;
    height: 39px;
    border-radius: 99px;
    background-color: #41BF76;
    background-image: url('../assets/pluse.png');
    background-size: 50%;
    background-repeat: no-repeat;
    background-position: center;
  }

  .addPicture input {
    width: 38px;
    height: 38px;
    z-index: 99;
    opacity: 0.01;
  }

  .send {
    width: 39px;
    height: 39px;
    border-radius: 99px;
    background-color: #41BF76;
    background-image: url('../assets/ss.png');
    background-size: 50%;
    background-repeat: no-repeat;
    background-position: center;
  }

  .count {
    display: inline-block;
    position: absolute;
    font-size: 12px;
    /*no*/
    color: #9a9a9f;
    bottom: 18px;
    right: 100px;
  }

  .hotAnswerHeader {
    display: flex;
    justify-content: space-between;
    line-height: 35px;
    border-bottom: solid 1px #ccc;
  }

  .hotSwiper {
    height: 188px;
    overflow:hidden;
  }
  .swiper-container{
     height:100%;
   }
  .swiper-container .swiper-slide {
    width: 240px;
    height:56px;
    padding: 5px;
    box-sizing: border-box;
  }

  .swiper-container .swiper-slide .slider-innfor {
    background: rgba(0, 0, 0, .1);
    border-radius: 4px;
  }

  .swiper-container .swiper-slide p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 28px;
    padding:0 5px;
  }

  .color-blue {
    color: rgb(0, 0, 204);
  }
  .hotAnswerHeader img{
    width:12px;
    height:16px;
    vertical-align: middle;
    margin-left:5px;
  }
  .hotAnswerHeader img.batchImage{
    height:12px;
  }
</style>

<template>
  <div class="container">
    <div class="header">
      <p>热门问答<img src="../assets/fire.png" alt=""></p>
      <!--<p class="authorBatch" @click="anthorQuestionList">换一批<img class="batchImage" src="../assets/batch.png" alt=""></p>-->
    </div>
    <div class="nwwest-roll" id="nwwest-roll">
      <ul id="roll-ul" class="list" ref="rollScroll">
        <li v-for="(item, index) in questionList" :key="index" ref="rollul"
            :class="{selected:selectedQuestion == item.question}" @click="emitToB(item.question)">
          <h2 style="font-size:12px;">{{ item.question }}</h2>
          <p>{{ item.answer }}</p>
        </li>
      </ul>
    </div>
    <!-- <ul class="list">
                  <li
                    v-for="(item, index) in questionList"
                    :class="{
                      'selected': selectedQuestion === index
                    }"
                    :key="index"
                    @click="emitToB(item.question,index)">
                    <h2 >{{ item.question }}</h2>
                    <p>{{ item.answer }}</p>
                  </li>
                </ul> -->
  </div>
</template>

<script>
  import eventBus from '../common/eventBus.js'

  export default {
    data() {
      return {
        // questionList: [
        //   {
        //   question: '办理劳务派遣许可证的条件',
        //   answer: '经营劳务派遣业务应当具备下列...'
        // }, {
        //   question: '数字证书丢失了怎么办',
        //   answer: '请携带好有效证件（证件需求参...'
        // }, {
        //   question: '怎么查询退工登记备案的结果',
        //   answer: '窗口办理退工登记备案的去徐汇...'
        // }, {
        //   question: '临时占用城市道路许可审批结果是什么',
        //   answer: '《上海市路政管理行政许可证》哦~ '
        // }, {
        //   question: '技术合同分为几类',
        //   answer: '分为四类：1.技术开发合同，2技...'
        // }, {
        //   question: '上海市劳务派遣行政许可申请平台的网址是什么？',
        //   answer: '上海市劳务派遣行政许可申请平...'
        // }],
        questionList:[],
        selectedQuestion: '',
        timerKey: ''
      }
    },
    created() {
      this.startSxroll();
    },
    mounted(){
      var that = this;
      this.$http.get('http://40.73.102.21/hotquestion/reportlist.do')
        .then((res) => {
          // todo 把热门问答放到这里来
          console.info("------------------"+res.data.total)
          var result = res.data.rows;
          // console.info("------------------"+result.data.total)
          result.forEach(function (p) {
            let data = {
              question: p.question,
              answer: p.answer
            }
            that.questionList.push(data)
          })
        })
    },
    methods: {
      // 换一批
      anthorQuestionList() {
        this.questionList = [
          {
            question: '临时占用城市道路许可审批结果是什么',
            answer: '《上海市路政管理行政许可证》哦~ '
          }, {
            question: '技术合同分为几类',
            answer: '分为四类：1.技术开发合同，2技...'
          }, {
            question: '上海市劳务派遣行政许可申请平台的网址是什么？',
            answer: '上海市劳务派遣行政许可申请平...'
          }
        ];
        if (this.questionList.length < 6) {
          clearInterval(this.timerKey);
        } else {
          this.startSxroll();
        }
        ;
      },
      // 发送信息
      emitToB(val) {
        this.selectedQuestion = val;
        eventBus.$emit('hotTopic', val)
      },
      // 开始滚动
      startSxroll() {
        this.timerKey = setInterval(this.scroll, 5000);
      },
      scroll() {
        let scrollUl = this.$refs.rollScroll;
        this.questionList.push(this.questionList[0]);
        scrollUl.style.transition = 'all 0.5s';
        scrollUl.style.top = '-65px';
        setTimeout(() => {
          this.questionList.shift();
          scrollUl.style.transition = 'none';
          scrollUl.style.top = '0';
        }, 500);
      }
    }
  }
</script>

<style scoped>
  .container {
    position: absolute;
    right: 0;
    width: 256px;
    /*no*/
    height: 100%;
    top: 0;
    background-color: #F5FFF9;
    box-shadow: -2px 0 9px 0 rgba(0, 0, 0, 0.08);
  }

  .header {
    height: 57px;
    /*no*/
    line-height: 57px;
    /*no*/
    padding: 0 33px;
    /*no*/
    color: #555966;
    font-size: 14px;
    /*no*/
    border-bottom: 1px solid #E4F2EA;
    /*no*/
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .authorBatch {
    cursor: pointer;
    color: rgb(0, 0, 204);
  }

  .header img {
    width: 12px;
    /*no*/
    height: 16px;
    /*no*/
    margin-left: 7px;
    /*no*/
  }

  li {
    padding: 12px 15px;
    /*no*/
    background-color: #fff;
    margin: 10px;
    /*no*/
    border-radius: 4px;
    /*no*/
    border: 1px solid #F0F0F0;
    /*no*/
    cursor: pointer;
    font-size: 12px;
  }

  li.selected {
    background-color: #41BF76;
  }

  li.selected h2 {
    color: #fff;
  }

  li.selected p {
    color: #FFFFFF;
    opacity: 0.8;
  }

  .list h2 {
    color: #555966;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /*no*/
  }

  .list p {
    color: #898794;
    font-size: 12px;
    /*no*/
    margin-top: 7px;
    /*no*/
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .nwwest-roll {
    overflow: hidden;
    transition: all 0.5s;
  }

  #roll-ul {
    /* transition: all 0.5s; */
    position: relative;
    top: 0;
  }

  .header .batchImage {
    width: 10px;
    height: 10px;
    vertical-align: middle;
  }
</style>

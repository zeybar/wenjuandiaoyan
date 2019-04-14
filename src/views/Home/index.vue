<template>
  <div :class="mobileClass" class="wenjuan">
    <el-dialog
      :visible.sync="dialogVisible"
      :fullscreen="isDialogFullScreen"
      :show-close="false"
      width="400px"
      class="home-dialog" center>
      <p slot="title" class="title">法治体检调查</p>
      <div class="content">
        <el-autocomplete
          clearable
          v-model="company"
          :fetch-suggestions="querySearchAsync"
          :trigger-on-focus="false"
          placeholder="选择你的企业"
          class="select-company-input"
          @select="handleSelectCompany"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-autocomplete>
         <el-select
          clearable
          v-model="trade"
          placeholder="请选择公司所处行业"
          class="select-trade-select"
          >
          <el-option
            v-for="item in tradeList"
            :key="item.value"
            :label="item.label"
            :value="item.label">
          </el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="start-btn" @click="handleStartWenjuan">开始</el-button>
        <p>@****律师事务所·****律师团队提供服务</p>
      </div>
    </el-dialog>
    <el-dialog 
      :visible.sync="phoneDialogVisilbe"
      :fullscreen="isDialogFullScreen"
      :show-close="false"
      width="400px"
      class="phone-dialog" center>
      <h4 slot="title">联系方式</h4>
      <div class="content">
        <p>请添加您的手机号码</p>
        <el-input v-model="phoneNum" maxlength="11" placeholder="请输入你的手机号码" clearable></el-input>
      </div>
      <div slot="footer" class="footer">
        <el-button @click="phoneDialogVisilbe = false">取消</el-button>
        <el-button type="primary" @click="submitData">提交</el-button>
      </div>
    </el-dialog>
    <template v-if="!updateSuccess">
      <div class="header">
        <div class="header-text-wrapper">
          <h1>法治体检调查问卷</h1>
          <p v-if="isMobile">{{ steps[activeStep - 1] }}</p>
        </div>
        <div v-if="isMobile" class="mobile-step">
          <span :style="{width: activeStep * 25 + '%'}"></span>
        </div>
      </div>
      <p class="intro">
        本法治体检调查问卷系为了解贵司基本情况从而发现、评估和分析法律风险而制作，希望得到贵司的理解、配合和支持。请贵司如实填写，以便准确了解情况、有效评估。我们承诺所有信息仅用于为贵司提供法治体检服务之目的，且将被严格保密。
      </p>
      <div v-if="!isMobile" class="step-box">
        <div v-for="(item, index) in steps" :key="item" :class="{active: activeStep === (index + 1)}"><span>{{ item }}</span></div>
      </div>
      <div v-if="activeQuestionList.length" class="question-list">
        <el-form ref="myForm" :model="myform" :show-message="false" class="q-form">
          <el-form-item v-for="(question, index) in activeQuestionList" :key="index" :prop="`${activeStep}-${question.id}`" :rules="[{ required: true}]">
            <h3>{{ index + 1 }}. {{ question.question }}</h3>
            <el-checkbox-group v-if="question.isMulti" v-model="myform[`${activeStep}-${question.id}`]">
              <el-checkbox v-for="(item, i) in question.answer" :key="i" :label="item" :name="`${activeStep}-${question.id}`">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
            <el-radio-group v-else v-model="myform[`${activeStep}-${question.id}`]" required>
              <el-radio v-for="(item, i) in question.answer" :key="i" :label="item" :name="`${activeStep}-${question.id}`">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <div class="button-wrapper">
              <el-button v-show="activeStep !== 1" @click="toPreStep">上一步</el-button>
              <el-button type="primary" @click="submitForm">{{ activeStep === questionList.length ? '提交' : '下一步' }}</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <div v-else class="success">
      <p><i class="el-icon-circle-check-outline"></i></p>
      <p>您的法治体检已提交<br />请耐心等待</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      dialogVisible: true,
      phoneDialogVisilbe: false,
      isDialogFullScreen: false,
      tradeList: [],
      company: '',
      trade: '',
      activeStep: 1,
      steps: ['公司治理', '公司经营风险', '劳动人事', '知识产权'],
      questionList: [],
      activeQuestionList: [],
      myform: {},
      rules: {},
      phoneNum: '',
      updateSuccess: false,
    }
  },
  async created() {
    this.isDialogFullScreen = this.isMobile;
    const { data } = await axios.get('https://icounsel.alphalawyer.cn/risk/api/office/v2/examination/base/trade');
    if (data.isSuccess) {
      const dataArr = data.data.length ? data.data.map((item) => ({label: item.tradeName, value: item.id})) : []
      this.tradeList = dataArr;
    }

    const result = await axios.get('https://icounsel.alphalawyer.cn/risk/api/office/v2/examination/questionnaireTemplate');
    if (result.data.isSuccess) {
      this.questionList = result.data.data;
      this.activeQuestionList = result.data.data[this.activeStep - 1].examinationQuestionnaireTemplateVOS;
      this.caculateFromData();
    }
  },
  watch: {
    activeStep(step, oldStep) {
      if (step !== oldStep) {
        this.activeQuestionList = this.questionList[step - 1].examinationQuestionnaireTemplateVOS;
        console.log(this.activeStep, step, this.activeQuestionList, '22');
        this.caculateFromData();
        setTimeout(() => {
          document.documentElement.scrollTop = 0;
        }, 100)
      }
    }
  },
  computed: {
    isMobile() {
      return /(iPhone|iPad|iPod|iOS|Android|SymbianOS)/i.test(navigator.userAgent);
    },
    mobileClass() {
      return this.isMobile ? 'is-mobile' : '';
    }
  },
  methods: {
    // vue的坑，下次记住了，当有些响应对象是后创建时直接赋值是不会产生响应的，需要使用实例的$set方法
    // https://cn.vuejs.org/v2/guide/list.html#%E5%AF%B9%E8%B1%A1%E6%9B%B4%E6%94%B9%E6%A3%80%E6%B5%8B%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9
    caculateFromData() {
      for (const ques of this.activeQuestionList) {
        if (!this.myform.hasOwnProperty(`${this.activeStep}-${ques.id}`)) {
          this.$set(this.myform, `${this.activeStep}-${ques.id}`, ques.isMulti ? [] : '');
        }
      }
    },
    async querySearchAsync(queryString, cb) {
      if (!queryString) return;
      const { data } = await axios.get('https://icounsel.alphalawyer.cn/risk/api/office/v2/examination/base/company?companyName=' + queryString);
      if (data.isSuccess) {
        const dataArr = data.data.length ? data.data.map((item) => ({value: item.name})) : []
        cb(dataArr);
      }
    },
    handleSelectCompany(item) {
      this.company = item.value;
    },
    handleStartWenjuan() {
      console.log(this.company, this.trade);
      if (!this.company) {
        this.$message.error('请选择并关联所在企业');
        this.$message({
          customClass: `${this.isMobile ? 'mobile-msg' : ''}`,
          message: '请选择并关联所在企业',
          type: 'error'
        });
        return;
      }
      if (!this.trade) {
        this.$message({
          customClass: `${this.isMobile ? 'mobile-msg' : ''}`,
          message: '请选择当前行业',
          type: 'error'
        });
        return;
      }

      this.dialogVisible = false;
    },
    toPreStep() {
      console.log(this.myform)
      this.activeStep--;
    },
    submitForm() {
      console.log('提交', this.myform);
      this.$refs['myForm'].validate((valid) => {
        if (valid) {
          console.log('下一步');
          
          if (this.activeStep === this.questionList.length) {
            console.log('最后一步', this.myform, JSON.stringify(this.myform));
            this.phoneDialogVisilbe = true;
            return;
          } 
          this.activeStep++;
        } else {
          this.$message({
            customClass: `${this.isMobile ? 'mobile-msg' : ''}`,
            message: '请填写全部题目',
            type: 'error'
          });
          return false;
        }
      });
    },
    async submitData() {
      console.log('提交内容到服务器');
      const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!phoneReg.test(this.phoneNum)) {
        this.$message({
          customClass: `${this.isMobile ? 'mobile-msg' : ''}`,
          message: '手机号格式错误',
          type: 'error'
        });
        return;
      }
      // const result = await axios.post('http://localhost:3300/api/postuseranswer', {data: this.myform});
      this.phoneDialogVisilbe = false;
      this.updateSuccess = true;
      // console.log(result);
    }
  }
}
</script>

<style lang="scss" scoped>
.wenjuan {
  position: relative;
  min-height: 100vh;
  margin-top: 40px;
  width: 820px;
  padding: 35px;
  margin: 0 auto;
  background: #fff;

  .head-padding {
    height: 40px;
    background: #f7f7f7;
  }

  .home-dialog {
    .title {
      font-size: 18px;
      font-weight: 600;
      line-height: 24px;
      text-align: center;
      color: #4a4a4a;
    }
    .select-trade-select,
    .select-company-input {
      width: 95%;
    }
    .select-trade-select {
      margin-top: 40px;
    }

    .dialog-footer {
      text-align: center;

      > p {
        margin-top: 10px;
        font-size: 12px;
        color: #a7a7a7;
      }
    }

    .start-btn:focus,
    .start-btn:hover {
      background: hsl(0, 0%, 45%);
      border-color: hsl(0, 0%, 45%);
      color: hsl(0, 0%, 100%);
    }
    .start-btn {
      color: hsl(0, 0%, 100%);
      background-color: hsl(0, 0%, 31%);
      border-color: hsl(0, 0%, 31%);
    }
  }

  .phone-dialog {
    h4 {
      font-size: 18px;
      line-height: 24px;
      color: #4a4a4a;
      font-weight: 600;
      text-align: left;
    }
    .content {
      > p {
        margin-bottom: 14px;
      }
    }
    .footer {
      text-align: right;
    }
  }
  .header {
    position: relative;
    background: url('../../assets/header.png') no-repeat center top / 100% 100%;

    .header-text-wrapper {
      width: 100%;
      height: 198px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      color: #fff;
    }
  }

  .mobile-step {
    position: relative;
    height: 3px;
    background: #ddd;
    span {
      position: absolute;
      height: 100%;
      background: #ed6c00;
    }
  }

  .step-box {
    display: flex;
    > div {
      position: relative;
      flex: 1;
      height: 12px;
      background: #dedede;

      &:not(:last-of-type) {
        margin-right: 15px;
      }

      span {
        position: absolute;
        bottom: -22px;
        width: 100%;
        text-align: center;
        font-weight: 600;
        font-size: 12px;
        line-height: 16px;
      }

      &.active {
        color: #ed6c00;
        background: #ed6c00;
      }
    }
  }
  .intro {
    margin-bottom: 28px;
    line-height: 22px;
    letter-spacing: -.4px;
    margin-top: 30px;
    color: #a7a7a7;
    font-family: PingFangSC-Regular;
  }

  .question-list {
    padding-top: 50px;

    h3 {
      margin-left: -16px;
      font-size: 16px;
      line-height: 26px;
    }

    /deep/ .el-checkbox:not(:first-of-type) {
      margin: 16px 0 0;
    }

    .el-form-item__content .el-checkbox-group {
      display: flex;
      flex-direction: column;
    }
    .el-form-item__content .el-checkbox-group,
    .el-form-item__content .el-radio-group {
      margin: 35px 0 80px;
    }

    .button-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .success {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 820px;
    height: calc(100vh - 45px);
    margin: 0 auto;
    background-color: hsl(0, 0%, 100%);

    p {
      &:first-of-type {
        font-size: 86px;
        color: #67c23a;
      }

      &:last-of-type {
        font-size: 16px;
        font-weight: 600;
        line-height: 30px;
        text-align: center;
      }
    }
  }

  &.is-mobile {
    width: 100%;
    padding: 0;
    .home-dialog {
      .content {
        text-align: center;
      }
    }

    .header {
      .header-text-wrapper {
        height: 122px;
        h1 {
          font-size: 20px;
          margin-bottom: 5px;
          letter-spacing: -.6px;
        }

        p {
          line-height: 22px;
          letter-spacing: -.4px;
        }
      }
    }
    .intro {
      margin-bottom: 0;
      padding: 0 16px;
      font-size: 12px;
    }

    .question-list {
      padding: 35px 30px;

      .el-form-item__content .el-checkbox-group,
      .el-form-item__content .el-radio-group {
        margin: 35px 0;
      }

      .el-form-item__content .el-radio-group {
        display: flex;
        flex-direction: column;
      }
      /deep/ .el-radio {
        margin: 16px 0 0;
      }
    }
    .success {
      width: 100%;
      height: 100vh;
    }
  }
}
</style>
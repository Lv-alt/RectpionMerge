<template>
    <center>
    <div id="app">
      <br><br>
      <div style="margin-top: 10px;margin-left: -200px;">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      请选择班级：<el-select v-model="classModelValue" placeholder="请选择">
      <el-option
        v-for="item in classes"
        :key="item.c_id"
        :label="item.c_name"
        :value="item.c_id">
      </el-option>
    </el-select>
      <br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <br><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      限定时间：<el-input v-model="limitDate" placeholder="单位分钟" size="mini" style="width: 220px;"
    @blur="checkDate" @focus="emptylimitDateCheckContent()">
    </el-input>
      <span style="font-size: 18px;color: red;position: absolute;margin-left: 10px;
                  ">
        {{limitDateCheckContent}}</span>
      <br><br><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      测试名称：<el-input size="mini" v-model="subjectName" style="width: 220px;" placeholder="请输入内容"
    @blur="checkTestNameNull" @focus="emptytestNameContent"></el-input>
      <span style="font-size: 18px;color: red;position: absolute;margin-left: 10px;">
        {{testNameContent}}
      </span>
      <br><br><br>
      <el-button @click="generateSubject" size="max" type="primary" style="margin-left: 251px;" :disabled="generateButton">
        生成课前测</el-button>

    </div>
    </div>
  </center>
</template>

<script>
  export default {
    name: 'GenerateTest',
    data() {
      return {
        classes:[],
        classModelValue:1,
        subjectTypes:[],
        limitDate:'',
        subjectName:'',
        generateButton:true,
        limitDateCheckContent:'',
        testNameContent:''
      }
    },
    methods: {
      generateSubject(){
        //添加校验
        /*this.$message({
          showClose: true,
          message: '生成成功',
          type: 'success'
        });*/
        //发送ajax请求，添加题目
        this.$http.post("/Teacher/generateSubject",{
          classId:this.classModelValue,
          subjectTypeId:1,
          limitDate:this.limitDate,
          s_subjectName:this.subjectName
        }).then(response=>{
          console.info(response)
          if(response.data.code){
            this.$message({
              showClose: true,
              message: '生成成功',
              type: 'success'
            });
          }
        })
      },
      //校验时间是否为空
      checkDate(){
        var r = /^\+?[1-9][0-9]*$/;

        /*let limitDateInt = parseInt(this.limitDate);*/
        if(!r.test(this.limitDate)){
          this.limitDateCheckContent = '只能输入数字哦！';
          this.generateButton = true;
        }
      },
      emptylimitDateCheckContent(){
        this.limitDateCheckContent = '';
      },
      checkTestNameNull(){
        if(this.subjectName.length == 0){
          this.testNameContent = '！测试名称不可为空呢';
          this.generateButton = true;
        };
        if(this.testNameContent.length == 0 && this.limitDateCheckContent == 0 && this.limitDate.length > 0){
          this.generateButton = false;
        }
      },
      emptytestNameContent(){
        this.testNameContent = '';
      }
    },
    //页面加载事件，
    mounted () {
      //查询出该老师所带的班级
      this.$http.post("/Class/getClassByUser").then(response=>{
        if(response.data.data){
          this.classModelValue = response.data.data[0].c_id;
          this.classes = response.data.data;
        }
      })
    }
  }
</script>

<style scoped>

</style>
                             

<template>
    <center>
    <div id="app">
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
      限定时间：<el-input v-model="limitDate" placeholder="单位分钟" size="mini" style="width: 220px;"></el-input>
      <br><br><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      测试名称：<el-input size="mini" v-model="subjectName" style="width: 220px;" placeholder="请输入内容"></el-input>
      <br><br><br>
      <el-button @click="generateSubject" type="primary" style="margin-left: 251px;">生成课前测</el-button>
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
        subjectName:''
      }
    },
    methods: {
      generateSubject(){
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

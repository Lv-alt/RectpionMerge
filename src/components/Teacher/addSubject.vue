<template>
    <div id="app">
      <br><br>
      <div style="margin-left: 100px;">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      请选择班级：<el-select size="small" v-model="classModelValue" placeholder="请选择" @change="changeClass">
      <el-option
        v-for="item in classes"
        :key="item.c_id"
        :label="item.c_name"
        :value="item.c_id">
      </el-option>
    </el-select>
      <br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <br><br><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      限定时间：<el-input v-model="limitDate" placeholder="单位分钟" size="mini" style="width: 210px;"
                     @blur="checkDate" @focus="emptylimitDateCheckContent()"></el-input>
      <span style="font-size: 18px;color: red;position: absolute;margin-left: 10px;
                  ">
        {{limitDateCheckContentTwo}}</span>
      <br><br><br>
      <el-upload
        class="upload-demo"
        action="http://localhost:9999/Subject/uploadSubject"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :auto-upload="true"
        :on-success="uploadSuccess"
        :headers="myHeaders"
      >
        <span style="font-size: 13px; position: absolute;
        margin-left: 290px;margin-top: -13px;color: #409eff"
              id="file"><i class="el-icon-upload" />上传题目</span>

      </el-upload>
      <el-button size="small" @click="generateSubject" type="primary"
                 style="margin-left: 200px;top:275px;position:absolute;"
      :disabled="addSubjectBotton" id="addSubjectButton">
        添加作业</el-button>

    </div>
    </div>
</template>

<script>
  //文件上传请求前添加token
  let token = sessionStorage.getItem("token");
  let subjectId = 0;
  export default {
    name: 'addSubject',
    data() {
      return {
        classes:[],
        classModelValue:1,
        subjectTypes:[],
        limitDate:'',
        fileList:[],
        myHeaders:{Lv:token},
        addSubjectBotton:true,
        limitDateCheckContentTwo:''
      }
    },
    methods: {
      generateSubject(){
        this.$http.post("/Teacher/generateSubject",{
          classId:this.classModelValue,
          subjectTypeId:3,
          limitDate:this.limitDate,
          subjectId:subjectId
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
          this.limitDateCheckContentTwo = '只能输入数字哦！';
          this.addSubjectBotton = true;
        }else{
          this.addSubjectBotton = false;
        }
      },
      emptylimitDateCheckContent(){
        this.limitDateCheckContentTwo = '';
      },
      handleRemove(file, fileList) {
      },
      //文件上传成功的勾子
      uploadSuccess(response, file, fileList){
        //文件上传成功了之后把生成那一条记录的id带到后台
        subjectId = response.data;
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      //选择的班级发生了改变
      changeClass(classId){
        this.$http.post("/Subject/getSubjectByClassAndDate",{classId:classId}).then(res => {
          if(res.data.data != undefined){
            this.$message.error('今天这个班已经布置过作业了哦！');
            $("#file").css('display','none');
            $("#addSubjectButton").css('display','none');
          }else{
            $("#file").css('display','block');
            $("#addSubjectButton").css('display','block');
          }
        })
       //根据班级查询出该班级在当天是否已经布置过作业
      }
    },
    //页面加载事件，
    mounted () {
      //查询出该老师所带的班级
      this.$http.post("/Class/getClassByUser").then(response=>{
        if(response.data.data){
          this.classModelValue = response.data.data[0].c_id;
          this.classes = response.data.data;
          this.$http.post("/Subject/getSubjectByClassAndDate",{classId:response.data.data[0].c_id}).then(res => {
            if(res.data.data != undefined){
              this.$message.error('今天这个班已经布置过作业了哦！');
              $("#file").css('display','none');
              $("#addSubjectButton").css('display','none');
            }else{
              $("#file").css('display','block');
              $("#addSubjectButton").css('display','block');
            }
          })
        }
      });


    }
  }
</script>
                                              

<template>
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
      <br><br><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      限定时间：<el-input v-model="limitDate" placeholder="单位分钟" size="mini" style="width: 220px;"></el-input>
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
        <el-button size="small" type="primary">选取文件</el-button>
      </el-upload>
      <el-button size="small" @click="generateSubject" type="primary" style="position: absolute;left:750px;top:282px;">添加作业</el-button>
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
        myHeaders:{Lv:token}
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
      handleRemove(file, fileList) {
        console.log(file, fileList);
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

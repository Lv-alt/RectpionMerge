<template>
  <div id="app" style="margin-top: 100px;">
    <div>
      <div class="block" style="position: absolute;left: 500px;top: 100px;">
        <span class="demonstration">选择日期：</span>
        <el-date-picker
          v-model="DateValue"
          size="mini"
          type="date"
          placeholder="选择日期"
          style="width: 170px;"
          @change="dateChange"
          format="yyyy 年 MM 月 dd 日"
        >
        </el-date-picker>
      </div>
    </div>
    <div style="position: absolute;left: 300px;top: 100px;">
      <i class="el-icon-discover"></i>&nbsp;&nbsp;剩余时间：<el-input
      v-model="dateString"
      style="width:80px;"
      size="mini"
      :disabled="true">
    </el-input>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 863px;margin-top: 50px;"
      size="medium">
      <el-table-column
        prop="u_username"
        label="姓名"
        width="90">
      </el-table-column>
      <el-table-column
        prop="limitDateString"
        label="限定时间"
        width="110">
      </el-table-column>
      <el-table-column
        prop="state_name"
        label="状态"
        width="110">
      </el-table-column>
      <el-table-column
        prop="st_name"
        label="类型名称"
        width="110">
      </el-table-column>
      <el-table-column
        prop="teacherName"
        label="出题人"
        width="110">
      </el-table-column>
      <el-table-column
        prop="s_generateDateFormat"
        label="生成日期"
        width="160">
      </el-table-column>
      <el-table-column label="操作">
<!--        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="download(scope.$index, scope.row)">下载</el-button>
          <el-button
            size="mini"
            @click="uoload(scope.$index, scope.row)">上传</el-button>
        </template>-->
        <template slot-scope="scope">
          <div v-if="tableData[scope.$index].ssm_fkstate == 1">
            <el-button
              size="mini"
              @click="download(scope.$index, scope.row)">下载</el-button>
            <el-button
              size="mini"
              :disabled="flag"
              @click="upload(scope.$index, scope.row)">上传</el-button>
          </div>
          <div v-if="tableData[scope.$index].ssm_fkstate == 2">
            等待批改
          </div>
          <div v-if="tableData[scope.$index].ssm_fkstate == 3">
            恭喜你通过啦
          </div>
          <div v-if="tableData[scope.$index].ssm_fkstate == 4">
            没通过
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="提交作业"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-upload
        class="upload-demo"
        drag
        action="http://localhost:9999/Student/studentUploadSubject"
        :multiple="true"
        :headers="myToken"
        :on-success="mySuccess"
        :data="{subjectId:this.rowDate.subjectId,u_id:this.rowDate.u_id}"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <br><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      备注：<el-input v-model="remarksValue" size="mini" style="width: 280px;" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <!-- 点击确定， -->
    <el-button size="mini" type="primary" @click="uploadRemarks">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  let beginDate = null;
  let endDate = null;
  let myTimer = null;
  //文件上传请求前添加token
  let token = sessionStorage.getItem("token");
  export default {
    name: 'ShowSubject',
    data() {
      return {
        tableData: [],
        DateValue:'',
        dateString:'00:00:00',
        flag:false,
        rowDate:'',
        dialogVisible: false,
        remarksValue:'',
        myToken:{Lv:token}
      }
    },
    //页面加载事件，查询出数据
    mounted () {
      this.$http.post("/Student/getStudentInfoByStudentId",{subjectTypeId:3}).then(response=>{
          this.tableData = response.data.data;
          //给表格赋值完毕之后开始计算剩余时间
          //直接调用方法，开始计时 如果当天有作业的话，再开始计时
          if(response.data.data[0] != undefined){
            this.$http.post("/Subject/beginTimer",{u_id:response.data.data[0].u_id,subjectId:response.data.data[0].subjectId}).then(response =>{
              console.info(response);
            });
            myTimer =setInterval(this.getTimerDate,1000);
          }
      });

    },
    methods: {
      //日期框值更改事件
      dateChange(value){
        if(value != null){
          //根据日期框中选择的时间，拼接时间
          beginDate = (this.DateValue.getFullYear()+"-"+(this.DateValue.getMonth()+1 < 10?"0"+(this.DateValue.getMonth()+1):this.DateValue.getMonth()+1)+"-"+(this.DateValue.getDate()<10?"0"+(this.DateValue.getDate()):this.DateValue.getDate()))+" 00:00:00";
          endDate = (this.DateValue.getFullYear()+"-"+(this.DateValue.getMonth()+1 < 10?"0"+(this.DateValue.getMonth()+1):this.DateValue.getMonth()+1)+"-"+(this.DateValue.getDate()<10?"0"+(this.DateValue.getDate()+1):this.DateValue.getDate()+1))+" 00:00:00";
          //发送请求更新数据
          this.$http.post("/Student/getStudentInfoByStudentId",
            {beginDate:beginDate,endDate:endDate,subjectTypeId:3}).then(response=>{
            this.tableData = response.data.data;
            //给表格赋值完毕之后开始计算剩余时间
            //直接调用方法，开始计时 如果当天有作业的话，再开始计时
            if(response.data.data[0] != undefined){
              this.$http.post("/Subject/beginTimer",{u_id:response.data.data[0].u_id,subjectId:response.data.data[0].subjectId}).then(response =>{
                console.info(response);
              });
              myTimer =setInterval(this.getTimerDate,1000);
            }
          })
        }else{
          beginDate = null;
          endDate = null;
          //发送请求更新数据
          this.$http.post("/Student/getStudentInfoByStudentId",
            {beginDate:beginDate,endDate:endDate,subjectTypeId:3}).then(response=>{
            this.tableData = response.data.data;
            //给表格赋值完毕之后开始计算剩余时间
            //直接调用方法，开始计时 如果当天有作业的话，再开始计时
            if(response.data.data[0] != undefined){
              this.$http.post("/Subject/beginTimer",{u_id:response.data.data[0].u_id,subjectId:response.data.data[0].subjectId}).then(response =>{
                console.info(response);
              });
              myTimer =setInterval(this.getTimerDate,1000);

            }
          })
        }
      },
      download(index,row){
        console.info(row)
        //发送ajax请求进行下载
        this.$http.post("/Subject/fileDownload", {s_subjectUploadPath:row.s_subjectUploadPath,s_subjectName:row.s_subjectName,responseType:'blob'}).then(res=>{
          console.info(res)
/* //设置文件名，我这里用不到 就注掉
var headers = res.headers;
          var content = headers["content-disposition"];
          let fileName =content.substring(content.indexOf("filename=")+10,content.length-1);
          console.info(fileName)
          //解决乱码问题
          fileName = decodeURI(escape(fileName))
          console.info("文件名:",fileName);*/

          const blob = new Blob([res.data], {
            type: 'application/octet-stream'
          })
          //为内存中blob对象 创建一个链接 ，能够下载blob中的东西
          let url = window.URL.createObjectURL(blob);

          //创建超链接对象
          let link = document.createElement('a');
          link.href = url
          link.download = row.s_subjectName ;//下载后文件名
          document.body.appendChild(link);
          link.click();//点击下载
          link.remove();//下载完成移除元素
          window.URL.revokeObjectURL(link.href);
        })
      },
      getTimerDate(){
        this.$http.post("/Subject/getSurplusDate",{u_id:this.tableData[0].u_id,subjectId:this.tableData[0].subjectId}).then(response =>{
          this.dateString = response.data.data;

          //如果没有剩余时间了，结束定时任务
          if(this.dateString == "00:00:00"){

            //禁用上传按钮
            this.flag = true;
            clearInterval(myTimer);
          }else{
            this.flag = false;
          }
        })
      },
      //是否确认关闭
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      //点击上传
      upload(index,row){
        this.rowDate = row;
        this.dialogVisible = true;
        console.info(this.rowDate)
      },
      //上传成功的方法
      mySuccess(response, file, fileList){
        console.info(response)
      },
      //点击确定，上传备注
      uploadRemarks(){
        this.$http.post("/Student/uploadRemarks",{subjectId:this.rowDate.subjectId,u_id:this.rowDate.u_id,studentUploadRemarks:this.remarksValue}).then(response=>{
          if(response.data.code){
            this.dialogVisible = false;
            this.$notify({
              title: '成功',
              message: '不错呦，(ง •_•)ง',
              type: 'success'
            });
            //刷新数据
            this.$http.post("/Student/getStudentInfoByStudentId",{subjectTypeId:3}).then(response=>{
              this.tableData = response.data.data;
              //给表格赋值完毕之后开始计算剩余时间
              //直接调用方法，开始计时 如果当天有作业的话，再开始计时
              if(response.data.data[0] != undefined){
                this.$http.post("/Subject/beginTimer",{u_id:response.data.data[0].u_id,subjectId:response.data.data[0].subjectId}).then(response =>{
                  console.info(response);
                });
                myTimer =setInterval(this.getTimerDate,1000);
              }
            });
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>

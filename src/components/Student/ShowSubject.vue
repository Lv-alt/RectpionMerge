<template>
  <div id="app">
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
    <el-table
      :data="tableData"
      border
      style="width: 863px;margin-top: 50px;"
      size="medium">
      <el-table-column
        prop="u_username"
        label="姓名"
        width="110">
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
              @click="uoload(scope.$index, scope.row)">上传</el-button>
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
  </div>
</template>

<script>
  let beginDate = null;
  let endDate = null;
  export default {
    name: 'ShowSubject',
    data() {
      return {
        tableData: [],
        DateValue:''
      }
    },
    //页面加载事件，查询出题目类型
    mounted () {
      this.$http.post("/Student/getStudentInfoByStudentId",{subjectTypeId:3}).then(response=>{
        this.tableData = response.data.data;
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
          })
        }else{
          beginDate = null;
          endDate = null;
          //发送请求更新数据
          this.$http.post("/Student/getStudentInfoByStudentId",
            {beginDate:beginDate,endDate:endDate,subjectTypeId:2}).then(response=>{
            this.tableData = response.data.data;
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
      uoload(){

      }
    }
  }
</script>

<style scoped>

</style>

<template>
  <div id="app">
    <div>
      <div class="block" style="position: absolute;left: 500px;top: 120px;">
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
    <br><br>
    <el-table
      :data="tableData"
      border
      style="width: 883px;margin-top: 50px;"
      size="medium">
      <el-table-column
        prop="s_subjectName"
        label="题目"
        width="97">
      </el-table-column>
      <el-table-column
        prop="u_username"
        label="姓名"
        width="97">
      </el-table-column>
      <el-table-column
        prop="limitDateString"
        label="限定时间"
        width="97">
      </el-table-column>
      <el-table-column
        prop="state_name"
        label="状态"
        width="97"
      >
      </el-table-column>
      <el-table-column
        prop="st_name"
        label="类型名称"
        width="97">
      </el-table-column>
      <el-table-column
        prop="teacherName"
        label="出题人"
        width="97">
      </el-table-column>
      <el-table-column
        prop="s_generateDateFormat"
        label="生成日期"
        width="180">
      </el-table-column>
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <!--<el-button
            size="small"
            style="margin-left:10px;"
            :disabled="flag"
            @click="mySuccess(scope.$index, scope.row)">完成</el-button>-->
          <div v-if="tableData[scope.$index].ssm_fkstate == 1">
            <el-popover
              placement="top"
            width="160" >
            <p>谨慎哦！一旦提交就不能更改啦~~~///(^v^)\\\~~~</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                style="margin-left:10px;"
                @click="mySuccess(scope.$index, scope.row)">提交</el-button>
            </div>
            <el-button slot="reference" size="mini" :disabled="flag">完成</el-button>
            </el-popover>
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
    name: 'ShowSubjectSituation',
    data() {
      return {
        tableData: [],
        DateValue:'',
        smsState:''
      }
    },
    //页面加载事件，查询出数据
    mounted () {
      this.$http.post("/Student/getStudentInfoByStudentId",{subjectTypeId:1}).then(response=>{
        this.tableData = response.data.data;
        this.smsState = response.data.data[0].ssm_fkstate;
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
            {beginDate:beginDate,endDate:endDate,subjectTypeId:1}).then(response=>{
            this.tableData = response.data.data;
            this.smsState = response.data.data[0].ssm_fkstate;
          })
        }else{
          beginDate = null;
          endDate = null;
          //发送请求更新数据
          this.$http.post("/Student/getStudentInfoByStudentId",
            {beginDate:beginDate,endDate:endDate,subjectTypeId:1}).then(response=>{
            this.tableData = response.data.data;
            this.smsState = response.data.data[0].ssm_fkstate;
          })
        }
      },
      //点击完成
      mySuccess(index,row){
        this.$http.post("/Student/updateSubjectStateByStudent",{subjectId:row.subjectId}).then(response=>{
            if(response.data.code){
              this.$notify({
                title: '成功',
                message: '不错呦，(ง •_•)ง',
                type: 'success'
              });
              //提交完之后再刷新一下数据
              this.$http.post("/Student/getStudentInfoByStudentId",{subjectTypeId:1}).then(response=>{
                this.tableData = response.data.data;
                this.smsState = response.data.data[0].ssm_fkstate;
              });
            }
        })
      }
    }
  }
</script>

<style scoped>

</style>

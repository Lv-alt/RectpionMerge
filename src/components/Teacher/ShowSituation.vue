<template>
    <div id="app">
      <div style="position: absolute;left: 350px;top: 70px;">
        选择班级：<el-select v-model="ClassValue" placeholder="请选择" size="mini" style="width: 160px;" @change="classChange">
        <el-option
          v-for="item in ClassOptions"
          :key="item.c_id"
          :label="item.c_name"
          :value="item.c_id">
        </el-option>
      </el-select>
      </div>
      <div style="position: absolute;left: 670px;top: 70px;">
        状态查询：<el-select v-model="stateValue" placeholder="请选择" size="mini" style="width: 160px;" @change="stateChange">
        <el-option
          v-for="item in stateOptions"
          :key="item.state_id"
          :label="item.state_name"
          :value="item.state_id">
        </el-option>
      </el-select>
      </div>
      <div>
        <div class="block" style="position: absolute;left: 251px;top: 120px;">
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
      <div style="position: absolute;left:530px;top: 120px;">
      选择类型：<el-select v-model="typeValue" placeholder="请选择" size="mini" style="width: 160px;" @change="subjectTypeChange">
        <el-option
          v-for="item in TypeOptions"
          :key="item.st_id"
          :label="item.st_name"
          :value="item.st_id">
        </el-option>
      </el-select>
      </div>
      <div style="position: absolute;left:800px;top: 120px;">
      模糊查询：  <el-input
      size="mini"
      placeholder="请输入内容"
      suffix-icon="el-icon-date"
      v-model="TextValue"
      style="width: 150px;"
      @input="inputChange">
    </el-input>
      </div><br>
      <el-table
        :data="tableData"
        border
        style="width: 863px;margin-top: 50px;"
        size="medium"

      >
        <el-table-column
          prop="s_subjectName"
          label="题目"
          width="130">
        </el-table-column>
        <el-table-column
          prop="u_username"
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="limitDateString"
          label="限定时间"
          width="100">
        </el-table-column>
        <el-table-column
          prop="state_name"
          label="状态"
          width="100">
        </el-table-column>
        <el-table-column
          prop="st_name"
          label="类型名称"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="s_generateDateFormat"
          label="生成日期"
          width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div v-if="tableData[scope.$index].state_id == 1">
              等待答题
            </div>
            <div v-if="tableData[scope.$index].state_id == 2">
              <el-button type="text" size="mini" @click="YesOrNoClick(scope.row,3)">Yes</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button type="text" size="mini" @click="YesOrNoClick(scope.row,4)">No</el-button>
            </div>
            <div v-if="tableData[scope.$index].state_id == 3">
              已通过
            </div>
            <div v-if="tableData[scope.$index].state_id == 4">
              没通过
            </div>

          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :small="flag"
          layout="prev, pager, next"
          :total="pageSum"
          @current-change="pageChange"
          :page-size="pageSize">
        </el-pagination>
      </div>
    </div>
</template>

<script>
  //页面加载事件，我要把
  let beginDate = null;
  let endDate = null;
  export default {
    name: 'ShowSituation',
    data() {
      return {
        flag:true,
        tableData: [],
        TypeOptions: [],
        typeValue:'',
        TextValue:'',
        DateValue:'',
        ClassOptions: [],
        ClassValue:'',
        pageSum:0,
        pageSize:5,
        stateOptions:[],
        stateValue:'',
        subjectState:''
      }
    },
    //页面加载事件，查询出该老师带的所有班级
    mounted () {
      this.$http.post("/Class/getClassByUser").then(response=>{
        this.ClassOptions = response.data.data;
      })
    },
    methods: {
      //班级下拉框更改事件。查fdaf询出所有的题目类型
      classChange(classValueTwo){
        this.$http.post("/SubjectType/getSubjectTypes").then(response=>{
          this.TypeOptions = response.data.data;
          this.typeValue = 1;
        });
        //查询出该班级下所有的学生并映射到表格中
        this.$http.post("/User/getUserByClassAndSubject",{classId:classValueTwo,beginDate:beginDate,endDate:endDate,likeName:'%'+this.TextValue+'%',subjectTypeId:this.typeValue}).then(response=>{
          this.tableData = response.data.data.list;
          this.pageSum = response.data.data.total;
        });
        //查询出所有的状态类型
        this.$http.post("/SubjectState/getSubjectStates").then(response=>{
          this.stateOptions = response.data.data;
        });
      },
      //点击上一页下一页的事件
      pageChange(pageNum){
        //发送请求更新数据
        this.$http.post("/User/getUserByClassAndSubject",
          {classId:this.ClassValue,pageNum:pageNum,subjectTypeId:this.typeValue,likeName:'%'+this.TextValue+'%',beginDate:beginDate,endDate:endDate,state_id:this.stateValue}).then(response=>{
          this.tableData = response.data.data.list;
          this.pageSum = response.data.data.total;
        })
      },
      //题目类型更改事件，发送请求更新数据
      subjectTypeChange(subjectTypeIdTwo){
        this.typeValue = subjectTypeIdTwo;
        console.info(this.typeValue)
        //发送请求更新数据
        this.$http.post("/User/getUserByClassAndSubject",
          {classId:this.ClassValue,subjectTypeId:subjectTypeIdTwo,likeName:'%'+this.TextValue+'%',beginDate:beginDate,endDate:endDate,state_id:this.stateValue}).then(response=>{
          this.tableData = response.data.data.list;
          this.pageSum = response.data.data.total;
        })
      },
      //模糊查询框值修改事件，发送请求更新数据
      inputChange(value){
        //发送请求更新数据
        this.$http.post("/User/getUserByClassAndSubject",
          {classId:this.ClassValue,subjectTypeId:this.typeValue,likeName:'%'+this.TextValue+'%',beginDate:beginDate,endDate:endDate,state_id:this.stateValue}).then(response=>{
          this.tableData = response.data.data.list;
          this.pageSum = response.data.data.total;
        })
      },
      //日期框值更改事件
      dateChange(value){
        if(value != null){
          //根据日期框中选择的时间，拼接时间
          beginDate = (this.DateValue.getFullYear()+"-"+(this.DateValue.getMonth()+1 < 10?"0"+(this.DateValue.getMonth()+1):this.DateValue.getMonth()+1)+"-"+(this.DateValue.getDate()<10?"0"+(this.DateValue.getDate()):this.DateValue.getDate()))+" 00:00:00";
          endDate = (this.DateValue.getFullYear()+"-"+(this.DateValue.getMonth()+1 < 10?"0"+(this.DateValue.getMonth()+1):this.DateValue.getMonth()+1)+"-"+(this.DateValue.getDate()<10?"0"+(this.DateValue.getDate()+1):this.DateValue.getDate()+1))+" 00:00:00";
          //发送请求更新数据
          this.$http.post("/User/getUserByClassAndSubject",
            {classId:this.ClassValue,subjectTypeId:this.typeValue,likeName:'%'+this.TextValue+'%',beginDate:beginDate,endDate:endDate,state_id:this.stateValue}).then(response=>{
            this.tableData = response.data.data.list;
            this.pageSum = response.data.data.total;
          })
        }else{
          beginDate = null;
          endDate = null;
          //发送请求更新数据
          this.$http.post("/User/getUserByClassAndSubject",
            {classId:this.ClassValue,subjectTypeId:this.typeValue,likeName:'%'+this.TextValue+'%',beginDate:beginDate,endDate:endDate,state_id:this.stateValue}).then(response=>{
            this.tableData = response.data.data.list;
            this.pageSum = response.data.data.total;
          })
        }
      },
      //题目状态值更改事件
      stateChange(value){
        //发送请求更新数据
        this.$http.post("/User/getUserByClassAndSubject",
          {classId:this.ClassValue,subjectTypeId:this.typeValue,likeName:'%'+this.TextValue+'%',beginDate:beginDate,endDate:endDate,state_id:value}).then(response=>{
          this.tableData = response.data.data.list;
          this.pageSum = response.data.data.total;
        })
      },
      //点击yes
      YesOrNoClick(row,ssm_state){
        //点击yes，修改该题目对应的该学生的状态为已通过
        this.$http.post("/Subject/updateStudentAndSubjectState",{u_id:row.u_id,s_id:row.s_id,ssm_fkstate:ssm_state}).then(response=>{
          if(response.data.code){
            if(ssm_state == 3){
              this.$notify({
                title: '成功',
                message: 'success',
                type: 'success'
              });
            }else if(ssm_state == 4){
              this.$notify.error({
                title: '错误',
                message: 'Failed'
              });
            }

          }
          //发送请求更新数据
          this.$http.post("/User/getUserByClassAndSubject",
            {classId:this.ClassValue,subjectTypeId:this.typeValue,likeName:'%'+this.TextValue+'%',beginDate:beginDate,endDate:endDate,state_id:this.stateValue}).then(response=>{
            this.tableData = response.data.data.list;
            this.pageSum = response.data.data.total;
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>

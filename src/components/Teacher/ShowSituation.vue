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
        style="width: 863px;margin-top: 15px;position: absolute; top: 170px"
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
            <div v-if="tableData[scope.$index].state_id == 2 && tableData[scope.$index].st_name == '作业' ">
              <el-button type="text" size="mini" @click="ShowStudentUploadSubject(scope.index,scope.row)">查看</el-button>
              <el-button type="text" size="mini" @click="YesOrNoClick(scope.row,3)">通过</el-button>
              <el-button type="text" size="mini" @click="YesOrNoClick(scope.row,4)">不通过</el-button>
            </div>
            <div v-if="tableData[scope.$index].state_id == 2 && tableData[scope.$index].st_name != '作业'">
              <el-button type="text" size="mini" @click="YesOrNoClick(scope.row,3)">通过</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button type="text" size="mini" @click="YesOrNoClick(scope.row,4)">不通过</el-button>
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

      <div class="block" style="position: absolute;top: 460px;left:600px">
        <el-pagination
          :small="flag"
          layout="prev, pager, next"
          :total="pageSum"
          @current-change="pageChange"
          :page-size="pageSize">
        </el-pagination>
      </div>
      <el-dialog
        title="查看作业"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
        备注：<el-input
        placeholder="请输入内容"
        v-model="remarks"
        size="mini"
        style="width: 200px;"
        :disabled="true">
        </el-input>
        <br><br>

        <div style="margin-left: -230px;">
          <!--<viewer>
            <img v-for="item in imagesPath" style="width:70px;height: 80px;margin-left: 10px;" :src="item"/>
          </viewer>-->
          <el-popover placement="top-start" title="" trigger="hover" v-for="item in imagesPath" style="width:70px;height: 80px;margin-left: 30px;" >
            <img style="width:800px;height: 400px;" :src="item"/>
            <img  slot="reference" :src="item" style="width:70px;height: 80px;margin-left: -10px;">
          </el-popover>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini"  type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
      </el-dialog>
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
        subjectState:'',
        dialogVisible: false,
        remarks:'我是备注',
        imagesPath:[],

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
      },
      //查看学生上传的作业
      ShowStudentUploadSubject(index,row){
        this.dialogVisible = true;
        //查询出该学生下的所有图片，
        this.$http.post("/Student/getSubjectByStudent",{subjectId:row.s_id,u_id:row.u_id }).then(response=>{
          this.imagesPath = response.data.data.imagePaths;
          console.info(response.data.data)
          this.remarks = response.data.data.studentUploadRemarks;
        })
      },
      //是否确认关闭对话框
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    }
  }
</script>

<style scoped>

</style>

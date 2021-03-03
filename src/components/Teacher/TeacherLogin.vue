<template>
  <div id="app" style="margin-top: 50px;height: 450px;">
    <el-form ref="loginForm"  label-width="80px" class="login-box"
             style="margin-top: 10px;">
      <h3 class="login-title">欢迎登录</h3>
      <el-form-item label="账号" prop="username">
        <el-input type="text" placeholder="请输入账号"       @blur="UserNameBlur"
                  @focus="UserNameFoces" v-model="username"/>
        &nbsp;&nbsp;
        <span style="position: absolute;margin-left:-80px;margin-top: 10px;color: red">
        {{usernameFlag}}</span>
      </el-form-item>
      <el-form-item label="学号" prop="password">
        <el-input type="password"     @blur="checkStudentNum"
                  @focus="PasswordFoces" placeholder="请输入学号" v-model="password"/>
        &nbsp;&nbsp;
        <span style="position: absolute;margin-left: -80px;margin-top: 10px;color: red">
        {{passwordFlag}}</span>
      </el-form-item>
      <el-form-item>
        <el-button :plain="true" @click="submit" :disabled="button">登陆</el-button>
      </el-form-item>
    </el-form>
 <!--   <br><br><br><br><br>
    <el-form :inline="true" class="demo-form-inline">
    姓名：<el-input
    type="text"
    size="medium"
    placeholder="请输入内容"
    suffix-icon="el-icon-date"
    v-model="username"
    @blur="UserNameBlur"
    @focus="UserNameFoces">
  </el-input>
    <span style="position: absolute;margin-left: 20px;margin-top: 10px;color: red">
        {{usernameFlag}}
    </span>
    <br><br><br>
    学号：<el-input
    type="text"
    size="medium"
    placeholder="请输入内容"
    suffix-icon="el-icon-date"
    v-model="password"
    @blur="checkStudentNum"
    @focus="PasswordFoces">
  </el-input>
      <span style="position: absolute;margin-left: 20px;margin-top: 10px;color: red">
        {{passwordFlag}}</span>
      <br><br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <el-button :plain="true" @click="submit" :disabled="button">登陆</el-button>
    </el-form>-->
  </div>
</template>

<script>
  export default {
    name: 'TeacherLogin',
    data() {
      return {
        username:"李东亮",
        password:"1234",
        usernameFlag:'',
        button:false,
        passwordFlag:''
      }
    },
    methods: {
      submit(){
        this.$http.post("/login",{username:this.username,password:this.password}).then((response)=>{
          if(response.data.code != 500){
            sessionStorage.setItem("token",response.data.data.token);
            sessionStorage.setItem("username",response.data.data.username);
            this.$router.push("/Main");
          }else{
            alert("账号密码错误")
          }
        })
      },
      UserNameBlur(){
        var regTextChar = /[^\w\u4e00-\u9fa5\/\-]/gi;
        if(regTextChar.test(this.username) || this.username.length == 0){
          this.usernameFlag = '用户名为空 or 用户名不合法 !'
          this.button = true;
        }else{
          if(this.passwordFlag == ''){
            this.button = false;
          }
        }
      },
      UserNameFoces(){
        this.usernameFlag = '';
      },
      checkStudentNum(){
        var regTextChar = /[^\w\u4e00-\u9fa5\/\-]/gi;
        if(this.password.length == 0 || regTextChar.test(this.password)){
          this.passwordFlag = '学号为空 or 学号不合法';
          this.button = true;
        }else{
          if(this.usernameFlag == ''){
            this.button = false;
          }
        }
      },
      PasswordFoces(){
        this.passwordFlag = ''
      }
    }

  }
</script>

<style scoped>

  .login-box {
    border: 1px solid #DCDFE6;
    width: 350px;
    margin: 180px auto;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
  }

  .login-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #303133;
  }
</style>

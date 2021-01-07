<template>
  <div id="app">
    <br><br><br><br><br>
    姓名：<el-input
    type="text"
    size="medium"
    placeholder="请输入内容"
    suffix-icon="el-icon-date"
    v-model="username">
  </el-input><br><br><br>
    学号：<el-input
    type="text"
    size="medium"
    placeholder="请输入内容"
    suffix-icon="el-icon-date"
    v-model="password">
  </el-input><br><br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <el-button :plain="true" @click="submit">登陆</el-button>
  </div>
</template>

<script>
  export default {
    name: 'TeacherLogin',
    data() {
      return {
        username:"李东亮",
        password:"1234"
      }
    },
    methods: {
      submit(){
        this.$http.post("/login",{username:this.username,password:this.password}).then((response)=>{
            sessionStorage.setItem("token",response.data.data.token);
          sessionStorage.setItem("username",response.data.data.username);
            this.$router.push("/Main");
        })
      },
    }
  }
</script>

<style scoped>
  .el-input {
    width: 160px;
  }
</style>

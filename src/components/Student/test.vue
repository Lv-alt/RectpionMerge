<template>
  <el-form ref="loginForm" :model="form" :rules="rules" label-width="80px" class="login-box">
    <h3 class="login-title">欢迎登录</h3>
    <el-form-item label="账号" prop="username">
      <el-input type="text" placeholder="请输入账号" v-model="form.username"/>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" placeholder="请输入密码" v-model="form.password"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" v-on:click="onSubmit('loginForm')">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'test',
    data() {

      return{
        form: {
          username: '',
          password: ''
        },

      }
    },
    mounted () {
    },
    methods:{
      onSubmit(formName) {
        // 为表单绑定验证功能
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
            this.$router.push("/main");
          } else {
            this.dialogVisible = true;
            return false;
          }
        });
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

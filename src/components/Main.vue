<template>
  <el-container>
    <el-header class="homeHeader">
      <div class="title">
        <i class="el-icon-school"/>年少不知AAA香
      </div>
      <!--<span style="font-size: 23px;position: relative;left: -470px;">
              <i class="el-icon-school"/>年少不知AAA香
            </span>-->
      <div>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <span style="font-size: 20px;">{{username}}</span>
        <span style="cursor: pointer;color: hotpink" @click="outUser">退出</span>
      </div>
    </el-header>
    <el-container style="height: 440px;">
      <el-aside width="200px">
        <el-menu >
          <el-submenu :index="item.m_id+''" :key="item.m_id" v-for="item in OneData">
            <template slot="title"><i class="el-icon-message"></i>{{item.m_name}}</template>
            <el-menu-item :index="twoItem.m_id+''" :key="twoItem.m_id" v-for="(twoItem,index) in item.modulars"><router-link :to="twoItem.m_url"><i class="el-icon-ship"/>&nbsp; {{twoItem.m_name}}</router-link></el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

  let path = '';
  export default {
    name: 'Main',
    data() {
      return {
        OneData: [],
        username:''
      }
    },
    methods: {
      outUser(){
        //退出登陆
        this.$http.post("/logout").then(res => {
          console.info(path)
          this.$router.push(path);
        })
      }
    },
    //页面加载事件
    mounted () {
      this.username = sessionStorage.getItem("username");
      this.$http.post("/Menu/getMenusByUser").then(response=>{
        this.OneData = response.data.data;
      });
      this.$http.post("/User/getUserByUserId").then(res => {
        console.info(res)
        if(res.data.data.role.r_id == 4){
          path = "/StudentLogin"
        }else{
          path = "/TeacherLogin"
        }
      })
    }
  }
</script>

<style>
  .homeHeader{
    background: #409eff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    box-sizing: border-box;
  }
  .homeHeader .title{
    font-size: 30px;
    font-family: 华文楷体;
    color: white;
  }
  a{
    text-decoration: none;
  }
</style>

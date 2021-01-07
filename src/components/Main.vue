<template>
  <div id="app" style="margin-top: -60px;">
    <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '3']">
          <el-submenu index="1" v-for="item in OneData">
            <template slot="title"><i class="el-icon-message"></i>{{item.m_name}}</template>
            <el-menu-item index="index+'-2'" v-for="(twoItem,index) in item.modulars"><router-link :to="twoItem.m_url">{{twoItem.m_name}}</router-link></el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
            <i class="el-icon-setting" style="margin-right: 15px"></i>
          <span>{{username}}</span>
        </el-header>
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>

  export default {
    name: 'Main',
    data() {
      return {
        OneData: [],
        username:''
      }
    },
    methods: {

    },
    //页面加载事件
    mounted () {
      this.username = sessionStorage.getItem("username");
      this.$http.post("/Menu/getMenusByUser").then(response=>{
        this.OneData = response.data.data;
      })
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
  a {
    text-decoration : none
  }
</style>

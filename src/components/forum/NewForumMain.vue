<template>
  <div id="app" style="margin-top: 0px;margin-left: 30px;">
    <span style="position: fixed;left: 900px;color: #409EFF;cursor: pointer;font-size:20px;"
    @click="dialogVisible = true">
      <i class="el-icon-circle-plus-outline"/>&nbsp;发表
    </span>
    <div style="height: 70px;width: 60px;margin-top:30px;cursor: pointer" @click="showMyPage">
      <img :src="userHeadUrl" style="height:70px;width:60px;border-radius:10px;"/>
    </div>
    <div style="font-size: 13px;color:blue;cursor: pointer;position:relative;left:-310px;top:-60px;">
      <el-upload
        :headers="myToken"
        :on-success="myUserHeadUploadSuccess"
        action="http://localhost:9999/User/userHeadUpload">
        <el-button size="mini" style="border:0px;
        background-color: white;
        color:blue;
        position: absolute; left: 370px" type="primary">上传头像</el-button>
      </el-upload>
    </div>
    <hr>
    <div style="width:1000px;height: 200px;border-bottom: 1px solid #d9d9d9;" v-for="item in posts">
      <div style="width:500px;text-align: left;">
        <h3 class="ov">
          {{item.p_postTitle}}</h3>
      </div>
      <div id="middle" v-if="item.p_contentPath != null && item.p_contentPath != undefined">
        <div style="width:155px;">
          <el-popover placement="top-start" v-if="item.p_contentPath != null" trigger="hover" >
            <img style="width:700px;height: 600px;" :src="item.p_contentPath"/>
            <img slot="reference" style="height:130px;width:150px;"  :src="item.p_contentPath"/>
          </el-popover>
<!--          <img :src="item.p_contentPath"
               style="height:130px;width:150px;"
          />-->
        </div>
        <span class="ov"
          style="width:804px;height:140px;float: right;
          margin-top: -150px;text-align: left;">
          <span style="font-size: 13px;color: #8c939d">
            发布人:{{item.user.u_username}}&nbsp;&nbsp;&nbsp; 发布日期：{{item.formatDate}}
          </span>
          <br><br>
          {{item.p_content}}
          <p style="font-size:13px;color: blue;cursor:pointer;width: 100px;" @click="clickComment(item.p_id)">阅读全文</p>
          <span style="cursor: pointer;color: #409EFF" @click="addFabulous(item.p_id)">
  <i class="el-icon-thumb"/>&nbsp;{{item.p_fabulousCount}}点赞</span>&nbsp;&nbsp;&nbsp;
 <span style="cursor: pointer;color: #409EFF" @click="clickComment(item.p_id)"> <i class="el-icon-s-comment"/>&nbsp; {{item.commentTables.length}}条评论</span>
          <br><br>

        </span>
    </div>
    <div v-else style="margin-left: -100px;">
      <span class="ov"
          style="width:504px;height:140px;float: left;text-align: left;margin-left: 105px;
          ">
          <span style="font-size: 13px;color: #8c939d">
            发布人:{{item.user.u_username}}&nbsp;&nbsp;&nbsp; 发布日期：{{item.formatDate}}
          </span>

          <br><br>
          {{item.p_content}}<p style="font-size:13px;color: blue;cursor:pointer;width: 100px;" @click="clickComment(item.p_id)">阅读全文</p>

<span style="cursor: pointer;color: #409EFF" @click="addFabulous(item.p_id)">
  <i class="el-icon-thumb"/>&nbsp;{{item.p_fabulousCount}}点赞 </span>&nbsp;&nbsp;&nbsp;
 <span style="cursor: pointer;color: #409EFF" @click="clickComment(item.p_id)"> <i class="el-icon-s-comment"/>&nbsp; {{item.commentTables.length}}条评论</span>
          <br><br><br>
      </span>
    </div>
    </div>
    <el-dialog
      title="帖子详情"
      :visible.sync="centerDialogVisible"
      width="80%"
      @close="closeCommentDetails"
    center>
      <div style="height: 70px;width: 60px;margin-top:30px;cursor: pointer" @click="showMyPage">
        <img :src="myPost.user.u_headUrl" style="height:70px;width:60px;"/>
      </div>
      <span style="position:absolute;left:95px;top:105px;font-size:23px;">{{myPost.user.u_username}}</span>
      <span style="position:absolute;left:95px;top:150px;font-size:17px;color: #8c939d">该帖子收到了&nbsp;{{myPost.p_fabulousCount}}&nbsp;赞</span>
      <h3>{{myPost.p_postTitle}}</h3>
      <span style="font-size: 13px;color: #8c939d">
      发布日期：{{myPost.formatDate}}</span><br><br>
      <img  v-if="myPost.postImages != undefined && myPost.postImages != null"
           v-for="img in myPost.postImages" :src="img"
           style="height: 500px;width: 700px;"/>
      <br>
      <span style="font-size: 18px;">&nbsp;{{myPost.p_content}}&nbsp;</span>
      <hr/>
      <h3>精彩评论</h3>
      <br>
      <div style="margin-left: 30px;">

        <div v-for="comment in myPost.commentTables">
          <span style="font-size: 20px;" v-if="comment.formateReply != null">

            {{comment.formateReply}}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span style="color: cornflowerblue;cursor: pointer" @click="blockReplyInput('#'+comment.c_id)"><i class="el-icon-back" />&nbsp;回复</span>
            <!-- 回复评论的框 -->
            <div style="display: none;margin-top:20px;" :id="comment.c_id">
              <el-input size="small" style="width: 400px;" v-model="replyContent" placeholder="请输入内容"></el-input>
              <el-button size="small" type="primary" @click="addReply(comment)">发布</el-button>
            </div>
            <br><br>
          </span>
          <span v-else style="font-size: 20px;">
            <div style="width: 60px;">
               <img :src="comment.user.u_headUrl" style="height:70px;width:60px;position: absolute"/>
              <div style="margin-left: 70px;width:500px;">
                <span style="font-size: 14px; color: #8c939d">{{comment.user.u_username}}</span>
                <br>
                <span style="font-size: 14px;">{{comment.c_content}}</span>
                <br>
                <span style="font-size: 13px;color: #8c939d">{{comment.generateDateFormat}}</span>
                <span style="font-size: 13px;color: #8c939d;cursor: pointer" @click="blockReplyInput('#'+comment.c_id+'A')">回复</span>
                <br><br>
                <div style="width:500px;">
                  <div v-for="twoComment in comment.twoCommentTables">
                    <img :src="twoComment.user.u_headUrl" style="height:50px;width:30px;position: absolute"/>
                    <div style="margin-left: 40px;margin-top:10px;width:500px;">
                      <span style="font-size: 13px;"><b>{{twoComment.user.u_username}}</b>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                        <span v-if="twoComment.formateReply == null">{{twoComment.c_content}}</span>
                        <span v-else>{{twoComment.formateReply}}</span>
                      </span>
                      <br>
                      <span style="font-size: 13px;color: #8c939d">
                        {{twoComment.generateDateFormat}}
                      </span>
                      &nbsp;&nbsp;
                      <span style="font-size: 13px;color: #8c939d;cursor: pointer" @click="showReplyTwoComment(twoComment.user,comment.c_id)">
                        回复
                      </span>
                    </div>
                  </div>
                  <br>
                  <div style="display: none" :id="comment.c_id">
                    <el-input v-model="TwoCommentContent" size="small" :placeholder="myTest" style="width: 300px;"/>
                    <el-button size="small" type="primary" @click="submitTwoComment(comment)">发布</el-button>
                  </div>
                </div>
                <br>
              </div>

            </div>
            <!-- 回复评论的框 -->
            <div style="display: none;margin-top:20px;" :id="comment.c_id+'A'">
              <el-input size="small" style="width: 400px;" v-model="replyContent" placeholder="请输入内容"></el-input>
              <el-button size="small" type="primary" @click="addReply(comment)">发布</el-button>
            </div>
            <br><br>
          </span>
          <hr>
        </div>


      </div>
      <div style="margin-left: 30px;">
        <el-input v-model="input" style="width: 500px;" size="mini" placeholder="请输入内容"></el-input>
        &nbsp;&nbsp;<button @click="addComment">回复</button>
      </div>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
    <el-dialog
      title="发布帖子"
      :visible.sync="dialogVisible"
      width="65%">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      标题：<el-input v-model="myTitle" size="small"
                   style="width: 260px;" placeholder="请输入内容"
            @blur="chechTitleIsNull"
            @focus="emptyCheckPostTitleContent"></el-input>
        <span style="font-size: 18px;color: red;position: absolute;margin-left: 20px;">
          {{checkPostTitleContent}}</span>
        <br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span style="margin-top: -50px;">内容：</span>
        <el-input
          type="textarea"
          style="width: 260px;margin-top: 20px;"
          :rows="2"
          placeholder="请输入内容"
          v-model="myPostContent"
          @blur="chechContentIsNull"
          @focus="emptyCheckPostContent"
        >
        </el-input>

        <span style="font-size: 18px;color: red;position: absolute;margin-left: 20px;margin-top: 20px;">
          {{checkPostContent}}</span>
        <br><br><br>
      <el-upload
        style="margin-left: 280px;"
        action="http://localhost:9999/PostTable/uploadPostImgage"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :headers="myToken"
        :on-success="mySuccess"
        :data="generatePostId"
        :on-remove="handleRemove"
        :limit="6"
        :on-exceed="handleExceed">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisibleImg">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
    <el-button type="primary" @click="addPost" size="mini"
    :disabled="addPostButton">发布</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  //文件上传请求前添加token
  let token = sessionStorage.getItem("token");
  export default {
    name: 'NewForumMain',
    data() {
      return {
        posts:[],
        centerDialogVisible: false,
        myPost:{user:{u_username:'AA'},commentTables:[{user:{u_username:'AA'},c_content:''}],
          formatDate:'AA',p_content:'AA',p_contentPath:'AA',p_title:'AA'},
        input:'',
        p_id:'',
        dialogVisible: false,
        myTitle:'',
        myPostContent:'',
        dialogImageUrl: '',
        dialogVisibleImg: false,
        myToken:{Lv:token},
        generatePostId:{},
        replyContent:'',
        userHeadUrl:'',
        myTest:'',
        TwoCommentContent:'',
        TwoUser:'',
        addPostButton:true,
        checkPostTitleContent:'',
        checkPostContent:''
      }
    },
    //页面加载是事件，查询出所有帖子
    mounted () {
      this.$http.post("/PostTable/getPostTables").then(response => {
        this.posts = response.data.data.postTables;
        this.userHeadUrl = response.data.data.user.u_headUrl;
      })
    },
    methods: {
      //点击评论，展开页面刷新评论
      clickComment(p_id){
        this.p_id = p_id;
        this.$http.post("/PostTable/getPostTableByPostId",{
          p_id:p_id
        }).then(res => {
          this.myPost = res.data.data;
          this.centerDialogVisible = true;
          console.info(this.myPost)
        })
      },
      //添加评论
      addComment(){
        //发送请求，添加评论
        this.$http.post("/Comment/addComment",{
          p_id:this.p_id,c_content:this.input
        }).then(res => {
          //成功了之后，重新刷新评论
          this.$http.post("/PostTable/getPostTableByPostId",{
            p_id:this.p_id
          }).then(res => {
            this.myPost = res.data.data;
            this.input = '';
          })
        })
      },
      closeCommentDetails(){
        this.$http.post("/PostTable/getPostTables").then(response => {
          this.posts = response.data.data.postTables;
        });
        this.input=''
      },
      handleRemove(file, fileList) {
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisibleImg = true;
      },
      //图片上传成功的回调
      mySuccess(response, file, fileList){
        this.generatePostId = {p_id:response.data};
      },
      //点击发布帖子
      addPost(){
        console.info(this.generatePostId)
        this.$http.post("/PostTable/updatePostContent",{
          p_postTitle:this.myTitle,p_content:this.myPostContent,p_id:this.generatePostId.p_id
        }).then(res => {
          this.dialogVisible = false;
          this.$notify({
            title: '成功',
            message: '这是一条成功的提示消息',
            type: 'success'
          });
          //刷新帖子
          this.$http.post("/PostTable/getPostTables").then(response => {
            this.posts = response.data.data;
          });
          this.input='';
          this.myTitle = "";
          this.myPostContent = "";
        })
      },
      blockReplyInput(id){
        if($(id).css("display") == 'none'){
          $(id).css('display','block');
        }else{
          $(id).css('display','none');
        }
      },
      //添加帖子赞
      addFabulous(p_id){
        this.$http.post("/PostTable/addFabulousCount",{
          p_id:p_id
        }).then(res => {
          this.$http.post("/PostTable/getPostTables").then(response => {
            this.posts = response.data.data.postTables;
          })
        })
      },
      //跳转到显示我的页面
      showMyPage(){
        this.$router.push('/myPage');
      },
      //用户头像上传成功的勾子
      myUserHeadUploadSuccess(){
        this.$http.post("/PostTable/getPostTables").then(response => {
          this.posts = response.data.data.postTables;
          this.userHeadUrl = response.data.data.user.u_headUrl;
        })
      },
      showReplyTwoComment(user,c_id){
        this.TwoUser = user;
        this.myTest = '回复 '+user.u_username+" ：";
        if($('#'+c_id).css('display') == 'none'){
          $('#'+c_id).css('display','block');
        }else{
          $('#'+c_id).css('display','none');
          this.myTest = '';
        }
      },
      //提交二级评论
      submitTwoComment(oneComment){
        this.$http.post("/Comment/addTwoReply",{
          c_content:this.TwoCommentContent,
          p_id:this.p_id,
          c_replyPerson:this.TwoUser.u_id,
          c_pid:oneComment.c_id
        }).then(res => {
          //成功了之后，重新刷新评论
          this.$http.post("/PostTable/getPostTableByPostId",{
            p_id:this.p_id
          }).then(res => {
            this.myPost = res.data.data;
            this.input = '';
          });
          this.replyContent = '';
          $('#'+oneComment.c_id).css('display','none');
        })
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 6 图片，本次选择了 ${files.length} 图片，共选择了 ${files.length + fileList.length} 图片`);
      },
      addReply(comment){
        console.info("我最帅")
        this.$http.post("/Comment/addReply",
          {p_id:this.p_id,c_content:this.replyContent,c_replyPerson:comment.user.u_id,c_pid:comment.c_id}).then(res => {
          //成功了之后，重新刷新评论
          this.$http.post("/PostTable/getPostTableByPostId",{
            p_id:this.p_id
          }).then(res => {
            this.myPost = res.data.data;
            this.input = '';
          });
          this.replyContent = '';
          $('#'+comment.c_id+'A').css('display','none');
        })
      },
      chechTitleIsNull(){
        if(this.myTitle.length == 0){
          this.checkPostTitleContent = '！帖子标题不可为空'
          this.addPostButton = true;
        }
      },
      emptyCheckPostTitleContent(){
        this.checkPostTitleContent = '';
      },
      chechContentIsNull(){
        if(this.myPostContent.length == 0 || this.myPostContent == ''){
          this.checkPostContent = '！帖子内容不可为空';
          this.addPostButton = true;
        }else{
          if(this.checkPostContent.length == 0 && this.checkPostTitleContent.length == 0 && this.myTitle.length > 0){
            this.addPostButton = false;
          }
        }
      },
      emptyCheckPostContent(){
        this.checkPostContent = '';
      }
    }
  }
</script>

<style scoped>
  .ov{
/*    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;*/
    width:180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    course:hand;
  }
</style>

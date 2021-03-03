<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="我的评论" name="first">
      <div style="margin-left: -750px;" >
        <b style="font-size: 20px;position: absolute;left:0px;">我的评论</b><br>
        <hr/>
        <div v-for="comment in comments">
          <img style="height:60px;width:50px;border-radius:10px;
               margin-left: 755px;"
               :src="comment.user.u_headUrl"/>
          <b style="position: relative;left: 10px;top: -40px;">{{comment.user.u_username}}</b>
          <el-popconfirm
            title="你确定要删除该评论吗？"
            @confirm="deleteComment(comment.c_id)"
          >
            <i class="el-icon-delete"
               style="position: relative;left: 695px;top: -40px;cursor: pointer"
            slot="reference"></i>
          </el-popconfirm>

          <span style="color: #8c939d;font-size: 13px;position: relative;left: -60px;
                top:-10px;">{{comment.generateDateFormat}}</span>
          <br>
          <div style="position: relative;width: 830px;left: 756px;
          text-align: left;" v-if="comment.formateReply == null">{{comment.c_content}}</div>
          <div style="position: relative;width: 830px;left: 756px;
          text-align: left;" v-else>{{comment.formateReply}}</div>
          <div class="ov" @click="clickComment(comment.postTable.p_id,'我的评论')"
            style="margin-top:10px;margin-left:754px;
            cursor: pointer;
            height: 60px;line-height: 60px;width: 830px;
            background-color: #d9d9d9;font-size: 14px;color: #8c939d;
            border-radius:5px 5px 5px 5px;text-align: left"
               v-if="comment.postTable != null && comment.twoCommentReplyOneComment == null
                    && comment.formateReply == null && comment.c_state == 0">
            <img
              style="height: 50px;width:40px;position: relative;
              top:5px;left: 4px;border-radius:10px;"
              :src="comment.postTable.p_contentPath"/>
              <span style="position: relative;left: 16px;top: -24px;font-size:13px;">{{comment.postTable.p_postTitle }}</span>
              <span
                style="font-size: 13px;
                width:500px;
                height:20px;
                position: absolute;
                margin-top: 12px;
                left:63px;
                ">
                {{comment.postTable.p_content}}</span>
          </div>
          <div class="ov" @click="clickComment(comment.postTable.p_id,'我的评论')"
               style="margin-top:10px;margin-left:754px;
               cursor: pointer;
               text-align: center;
            height: 60px;line-height: 60px;width: 830px;
            background-color: #d9d9d9;font-size: 14px;color: #8c939d;
            border-radius:5px 5px 5px 5px;" v-else-if="comment.twoCommentReplyOneComment != null && comment.postTable != null">
            {{comment.twoCommentReplyOneComment.user.u_username}} :
            {{comment.twoCommentReplyOneComment.c_content}}
          </div>
          <div class="ov"
               style="margin-top:10px;margin-left:754px;
            height: 60px;line-height: 60px;width: 830px;
            text-align: center;
            background-color: #d9d9d9;font-size: 14px;color: #8c939d;
            border-radius:5px 5px 5px 5px;" v-else-if="comment.twoCommentReplyOneComment == null && comment.c_state == 1">
            该评论已被删除
          </div>
          <div class="ov"
               style="margin-top:10px;margin-left:754px;
               text-align: center;
            height: 60px;line-height: 60px;width: 830px;
            background-color: #d9d9d9;font-size: 14px;color: #8c939d;
            border-radius:5px 5px 5px 5px;" v-else-if="comment.postTable == null">
              该帖子已被删除
          </div>

          <div class="ov" @click="clickComment(comment.postTable.p_id,'我的评论')"
               style="margin-top:10px;margin-left:754px;
               cursor: pointer;
               text-align: center;
            height: 60px;line-height: 60px;width: 830px;
            background-color: #d9d9d9;font-size: 14px;color: #8c939d;
            border-radius:5px 5px 5px 5px;" v-else-if="comment.formateReply != null && comment.postTable != null &&comment.twoCommentReplyOneComment != null">
            {{comment.twoCommentReplyOneComment.user.u_username}} :
            {{comment.twoCommentReplyOneComment.c_content}}
          </div>
          <div class="ov"
               style="margin-top:10px;margin-left:754px;
            height: 60px;line-height: 60px;width: 830px;
            text-align: center;
            background-color: #d9d9d9;font-size: 14px;color: #8c939d;
            border-radius:5px 5px 5px 5px;" v-else-if="comment.formateReply != null && comment.postTable != null &&comment.twoCommentReplyOneComment == null">
            该评论已被删除
          </div>
          <hr/>
        </div>

      </div>
      <el-dialog
        title="帖子详情"
        :visible.sync="CommentDialog"
        width="80%"
        @close="closeCommentDetails"
        center>
        <div style="height: 70px;width: 60px;margin-top:30px">
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
                    <el-button size="small" type="primary" @click="submitTwoComment(comment)">发你妈</el-button>
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
    </el-tab-pane>
    <el-tab-pane label="我的帖子" name="second">
      <div style="margin-left: 0px;">
        <b style="font-size: 20px;">我的帖子</b>
        <hr/>
        <div style="margin-left: 0px;height: 80px;" v-for="post in posts">
          <b :style="myStyle" @mouseover="" @click="clickComment(post.p_id,'A')">{{post.p_postTitle}}</b>
          <br><br>
          <span style="margin-left: 0px;color: #8c939d">
            {{post.formatDate}}&nbsp;&nbsp;·&nbsp;&nbsp;
            {{post.p_fabulousCount}}点赞&nbsp;&nbsp;·&nbsp;&nbsp;
            <span v-if="post.commentTables != null">{{post.commentTables.length}}回复</span>
            <span v-else>0 回复</span>
            &nbsp;&nbsp;·&nbsp;&nbsp;
            <el-popconfirm
              title="这是一段内容确定删除吗？"
              @confirm="deletePost(post.p_id)">
              <span style="cursor:pointer" slot="reference"><i class="el-icon-delete"/>删除</span>
            </el-popconfirm>
          </span>
          <hr/>
        </div>
      </div>
      <el-dialog
        title="帖子详情"
        :visible.sync="centerDialogVisible"
        width="80%"
        @close="closeCommentDetails"
        center>
        <div style="height: 70px;width: 60px;margin-top:30px">
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
                    <el-button size="small" type="primary" @click="submitTwoComment(comment)">发你妈</el-button>
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
    </el-tab-pane>
  </el-tabs>

</template>

<script>
  //文件上传请求前添加token
  let token = sessionStorage.getItem("token");
  export default {
    name: 'myPage',
    data() {
      return{
        activeName: 'second',
        posts:'',
        myStyle:'font-size: 20px;cursor:pointer',
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
        comments:'',
        CommentDialog:false
      }
    },
    methods: {
      handleClick(tab, event) {
        if(tab.label == '我的评论'){
          this.$http.post("/Comment/getCommentByUser").then(res => {
            this.comments = res.data.data;
          })
        }

      },
/*      changeStyle(){
        this.myStyle = 'font-size: 20px;cursor:pointer;color:blue;'
      }*/
//点击评论，展开页面刷新评论
      clickComment(p_id,flag){
        if(flag == '我的评论'){
          this.p_id = p_id;
          this.$http.post("/PostTable/getPostTableByPostId",{
            p_id:p_id
          }).then(res => {
            this.myPost = res.data.data;
            this.CommentDialog = true;
            console.info(this.myPost)
          })
        }else{
          this.p_id = p_id;
          this.$http.post("/PostTable/getPostTableByPostId",{
            p_id:p_id
          }).then(res => {
            this.myPost = res.data.data;
            this.centerDialogVisible = true;
            console.info(this.myPost)
          })
        }

      },
      closeCommentDetails(){
        this.$http.post("/PostTable/getPostByUser").then(res => {
          this.posts = res.data.data;
        })
        this.input=''
      },
      blockReplyInput(id){
        if($(id).css("display") == 'none'){
          $(id).css('display','block');
        }else{
          $(id).css('display','none');
        }
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
      deletePost(p_id){
        //删除帖子（修改帖子状态）
        this.$http.post("/PostTable/deletePostByPostId",{p_id:p_id}).then(res => {
          this.$http.post("/PostTable/getPostByUser").then(res => {
            this.posts = res.data.data;
          })
        })
      },
      //删除评论（修改评论状态）
      deleteComment(c_id){
        this.$http.post("/Comment/deleteComment",{
          c_id:c_id
        }).then(res => {
          this.$http.post("/Comment/getCommentByUser").then(res => {
            this.comments = res.data.data;
          })
        })
      }
    },
    //页面加载事件查询出某用户发布过的所有帖子
    mounted () {
      this.$http.post("/PostTable/getPostByUser").then(res => {
        this.posts = res.data.data;
      })
    }
  }
</script>

<style scoped>
  .ov{
    /*    white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;*/
    width:10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    course:hand;
  }
</style>

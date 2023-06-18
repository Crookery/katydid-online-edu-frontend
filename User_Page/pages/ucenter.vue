<template>
  <div>
    <el-card style="margin-left: 150px;margin-right: 150px;margin-top:20px;margin-bottom:20px" shadow="hover">
      <el-form label-width="80px" size="small">

        <el-upload
            class="avatar-uploader"
            :action='"http://localhost:9999/eduOss/fileOss/upload"'
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
        >
          <img v-if="user.avatar" :src="user.avatar" class="avatar"/>
          <img v-else class="el-icon-plus avatar-uploader-icon" />
          点击修改头像
        </el-upload> 

        <el-form-item label="邮箱" style="margin-left: 200px; margin-top: -150px">
          <el-input v-if="user.email" v-model="user.email" disabled autocomplete="off" style="width: 400px"></el-input>
          <el-input v-else disabled autocomplete="off" style="width: 400px" value="未绑定"></el-input>
          <el-button v-if="!user.email" style="left-margin:40px" type="primary" icon="el-icon-edit" circle @click="openDialog">绑定</el-button>
        </el-form-item>

        <el-form-item label="昵称" style="margin-left: 200px;margin-right:20px">
          <el-input v-model="user.nickname" autocomplete="off" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="性别" style="margin-left: 200px">
          <el-select v-model="user.sex" placeholder="请选择您的性别" style="width: 400px">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" style="margin-left: 200px">
          <el-input v-model="user.age" autocomplete="off" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="签名" style="margin-left: 200px">
          <el-input v-model="user.sign" autocomplete="off" style="width: 400px"></el-input>
        </el-form-item>

        <el-form-item style="text-align:center">
          <el-button type="primary" @click="save">保 存</el-button>
          <el-button type="primary" @click="returnIndex">返回主页</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--  -->
    <el-dialog
        :visible.sync="dialogVideoVisible"
        :before-close="handleClose"
        title="绑定邮箱和密码"
    >
      <el-form label-width="120px">
        <el-form-item label="QQ邮件" prop="email">
          <el-input v-model="params.email"/>
        </el-form-item>
        <el-form-item label="密码" prop="pad">
          <el-input type="password" v-model="params.password"/>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input v-model="params.code" style="width:200px"/>
          <el-button type="primary" @click="sendCode">发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveEmail">保 存</el-button>
        </el-form-item>
      </el-form>
  </el-dialog>

  </div>
</template>
 
<script>
import ucenterAPI from '@/api/login.js';
import cookie from "js-cookie";
import registerApi from '@/api/register.js';

export default {
    data() {
        return {
            user:{
                avatar:'',
                email:'',
                nickname:'',
                sex:'',         // 用于接收，后端传输过来的是性别值（1女，2男）
                age:'',
                sign:''
            },
            dialogVideoVisible:false,   // 邮箱绑定对话框
            // 性别选择框
            options:[
              {
                value:'1',
                label:'女'
              },
              {
                value:'2',
                label:'男'
              }
            ],
            showNum: false, // 是否显示倒计时
            wait_time: 0,  //倒计时间
            // 用于添加邮箱
            params:{
              email:"",
              code:"",
              password:""
            }
        }
    },
    mounted(){
        this.initUser();
    },
    methods:{
        initUser(){
            ucenterAPI.getUserInfo().then(response => {
                this.user = response.data.data.loginInfo
                if(this.user.sex){
                  this.user.sex = this.user.sex==2?'男':'女'
                }
            })
        },
        save(){
          // 昵称非空
          if(!this.user.nickname){
            this.$message({
              message: '昵称不能为空',
              type: 'warning'
            })
            return;
          }
          // 判断年龄是否符合标准
          var REG_age = /^\d+$/
          if(REG_age.test(this.user.age)){
            if(this.user.age>150 || this.user.age<0){
              this.$message({
                message: '年龄范围(0~150)',
                type: 'warning'
              })
              return;
            }
          }else if(this.user.age){
            this.$message({
              message: '【年龄】请输入数字',
              type: 'warning'
            })
            return;
          }
          // 判断签名长度
          if(this.user.sign && this.user.sign.length>1024){
            console.log(this.user.sign.length)
            this.$message({
                message: '签名过长，最多1024个字符',
                type: 'error'
              })
              return
          }
          // 性别不为空且非数字
          if(this.user.sex && !REG_age.test(this.user.sex)){
            this.user.sex = this.user.sex=='男'?2:1;
          }
          // 调用API          
          ucenterAPI.updateUser(this.user).then(response=>{
            if(response.data.code === 2000){
              this.initUser();
              // 想要 default.vue 生效，需要改变cookie-"katy_userInfo"
              // (1)重新查
            ucenterAPI.getUserInfo().then((response) => {
              if(response.data.code === 2000){
                this.loginInfo = response.data.data.loginInfo;
                // (2)设置cookie
                cookie.set("katy_userInfo", JSON.stringify(this.loginInfo),{ domain: "localhost" })
                // (3)跳转/
                window.location.href='/'
              }
            });
              this.$message({
                message: response.data.message,
                type: 'success'
              })
            }
          })
        },
        // 返回首页
        returnIndex(){
            this.$router.push("/")
        },
// ============================================模态框============================================     
        // 检查邮件格式
        checkEmail() {
          return (/^[1-9]\d{7,10}@qq\.com$/.test(this.params.email)) 
        },
        // 发送验证码
        sendCode(){
            // 验证格式
            let flag = this.checkEmail()
            if(!flag){
              this.$message({
                message: 'QQ邮箱格式不对',
                type: 'error'
              })
              return;
            }
            // 发送验证码  
            registerApi.sendCode(this.params.email).then(response=>{
              if(response.data.code === 2000){
                this.$message({
                  message: '发送成功',
                  type: 'success'
                })
              }
            })
        },

        // 模态框绑定邮件
        saveEmail(){
            let REG = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d@$!%*#?&+]{6,}$/
            if(!REG.test(this.params.password)){
              this.$message({
                message: '密码格式不对，至少6位，且至少含一个数字、字母和特殊字符[@$!%*#?&+]',
                type: 'error'
              })
              return;
            }
            if(!this.params.code){
              this.$message({
                message: '验证码不能为空',
                type: 'error'
              })
              return;
            }
            registerApi.confirmEmail(this.params).then(response=>{
                if(response.data.code === 2000){
                    this.$message({
                      message: '绑定成功',
                      type: 'success'
                    })
                    this.dialogVideoVisible = false;
                    this.clearData();
                    window.location.href="/ucenter"   // 会刷新页面
                    // this.$router.push("/ucenter")  // 不会调用mounted生命周期
                }else{
                    this.$message({
                      message: response.data.message,
                      type: 'info'
                    })
                    // 清空邮箱
                    this.params.email=''
                    this.params.code =''
                    return;
                }
            })
        },
        // 打开对话框
        openDialog(){
          this.dialogVideoVisible = true
        },
        // 模态框的关闭处理
        handleClose(done){
            this.$confirm("是否关闭").then((_) => {
              done();
              this.clearData();
            });
        },
        // 清理数据
        clearData(){
          this.params = {
              email:'',
              code:'',
              password:''
          }
        },
// ============================================头像上传============================================
        // 上传前
        beforeAvatarUpload(file){
            const isJpgPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
            const isLt5M = file.size / 1024 / 1024 < 90

            if(!isLt5M){
                this.$message.error('图片大小需要< 90 MB')
            }

            if(!isJpgPng){
                this.$message.error('图片格式错误')
            }
            return isLt5M && isJpgPng
        },
        // 上传成功
        handleAvatarSuccess(res, file){
            //回调response
            this.user.avatar = res.data.path
        }
        
    }
}
</script>
 
<style>
.avatar-uploader {
  text-align: left;
  padding-bottom: 10px;
}
.avatar-uploader .el-upload {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 138px;
  height: 138px;
  line-height: 138px;
  text-align: center;
}
.avatar {
  width: 160px;
  height: 160px;
  display: block;
  border:dotted lightgreen;
  margin:4px
}

.btn_number {
  width: 154px;
  height: 44px;
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid rgba(76, 175, 80, 1);
  line-height: 16px;
  outline: none;
}
.span_number {
  color: rgba(76, 175, 80, 1);
}
.btn_number.gray {
  background: rgba(242, 244, 245, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.span_number.gray_span {
  color: #9a9c9a;
}
.num_green.num {
  color: rgba(76, 175, 80, 1);
}
</style>
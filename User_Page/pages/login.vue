<template>
  <div class="main">
    <div class="title">
      <a class="active" href="/login">登录</a>
      <span>·</span>
      <a href="/register">注册</a>
    </div>
    <div class="sign-up-container">
      <el-form ref="userForm" :model="user">
        <el-form-item
          class="input-prepend restyle"
          prop="email"
          :rules="[
            {
              required: true,
              message: '请输入邮箱号码',
              trigger: 'blur',
            },
            { validator: checkEmail, trigger: 'blur' },
          ]"
        >
          <div>
            <el-input type="text" placeholder="邮箱号" v-model="user.email" />
            <i class="el-icon-message" />
          </div>
        </el-form-item>
        <el-form-item
          class="input-prepend"
          prop="password"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <div>
            <el-input
              type="password"
              placeholder="密码"
              v-model="user.password"
            />
            <i class="iconfont icon-password" />
          </div>
        </el-form-item>
        <div class="btn">
          <input
            type="button"
            class="sign-in-button"
            value="登录"
            @click="login()"
          />
        </div>
        <div class="btn">
          <input
            type="button"
            class="sign-in-button"
            value="返回首页"
            @click="backPage()"
          />
        </div>
      </el-form>
      <!-- 更多登录方式 -->
      <div class="more-sign">
        <h6>社交帐号直接登录</h6>
        <ul>
          <li>
            <a
              id="weixin"
              class="weixin"
              target="_self"
              href="http://localhost:8160/api/ucenter/wx/login"
              ><i class="iconfont icon-weixin"
            /></a>
          </li>
          <li>
            <a id="qq" class="qq" target="_blank" href="#"
              ><i class="iconfont icon-qq"
            /></a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import "~/assets/css/sign.css";
import "~/assets/css/iconfont.css";
import cookie from "js-cookie";
import loginApi from "@/api/login";

export default {
  layout: "sign",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      loginInfo: {},
    };
  },
  methods: {
    /**
     * 流程：
     *  1、调用接口登录返回token字符串
     *  2、返回token字符串，放到cookie里面
     *  3、创建前端拦截器，判断cookie里面是否有token字符串；如果有,把token字符串放到header(请求头)
     *  4、根据token值，调用接口，根据token获取用户信息，并放入cookie
     *  5、从第4步的cookie获取用户信息
     */
    login() {
      loginApi.submitLogin(this.user).then((response) => {
        let r = response.data;
        //判断是否登录成功
        if (r.data.fail_code === 500 || r.code === 5000) {
          this.$message.info("用户名或密码错误");
          return;
        } else {
        //成功，token=>cookie，拿着token查userInfo
          let token = r.data.token;
        //给cookie设置值
          cookie.set("katy_token", token, { domain: "localhost" }); //参数key,value,作用范围
          loginApi.getUserInfo().then((response) => {
            if(response.data.code === 2000){
              this.loginInfo = response.data.data.loginInfo;
              cookie.set("katy_userInfo", JSON.stringify(this.loginInfo),{ domain: "localhost" })
              //跳转
              window.location.href='/'
            }
          });
        }
      });
    },

    checkEmail(rule, value, callback) {
      //debugger
      if (!/^[1-9]\d{7,10}@qq\.com$/.test(value)) {
        return callback(new Error("QQ邮件格式不正确"));
      }
      return callback();
    },
    backPage(){
      window.location.href='/'
    }
  },
};
</script>
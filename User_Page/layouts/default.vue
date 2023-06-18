<template>
  <div class="in-wrap">
    <!-- 公共头引入 -->
    <header id="header">
      <section class="container">
        <h1 id="logo">
          <a href="#" title="蝈蝈学院">
            <img src="~/assets/img/logo.png" width="85%" alt="蝈蝈学院" />
          </a>
        </h1>
        <div class="h-r-nsl">
          <!-- nav -->
          <ul class="nav">
            <router-link to="/" tag="li" active-class="current" exact>
              <a>首页</a>
            </router-link>
            <router-link to="/course" tag="li" active-class="current">
              <a>课程</a>
            </router-link>
            <router-link to="/teacher" tag="li" active-class="current">
              <a>名师</a>
            </router-link>
            <router-link to="/order" tag="li" active-class="current">
              <a>订单</a>
            </router-link>
          </ul>
          <!-- / nav -->
          <ul class="h-r-login">
            <li v-if="!loginInfo.id" id="no-login">
              <a href="/login" title="登录">
                <em class="icon18 login-icon">&nbsp;</em>
                <span class="vam ml5">登录</span>
              </a>
              <a href="/register" title="注册">
                <span class="vam ml5">注册</span>
              </a>
            </li>
            <li v-if="loginInfo.id" id="is-login-one" class="mr10">
              <a id="headerMsgCountId" href="#" title="消息">
                <em class="icon18 news-icon">&nbsp;</em>
              </a>
              <q class="red-point" style="display: none">&nbsp;</q>
            </li>
            <li v-if="loginInfo.id" id="is-login-two" class="h-r-user">
              <a href="/ucenter" title>
                <img
                  :src="loginInfo.avatar"
                  width="30"
                  height="30"
                  class="vam picImg"
                  alt
                />
                <span id="userName" class="vam disIb">{{
                  loginInfo.nickname
                }}</span>
              </a>
              <a
                href="javascript:void(0);"
                title="退出"
                @click="logout()"
                class="ml5"
                >退 出</a
              >
            </li>
            <!-- /未登录显示第1 li；登录后显示第2，3 li -->
          </ul>
          <aside class="h-r-search">
            <form action="#" method="post">
              <label class="h-r-s-box">
                <input
                  type="text"
                  placeholder="输入你想学的课程"
                  name="queryCourse.courseName"
                  value
                />
                <button type="submit" class="s-btn">
                  <em class="icon18">&nbsp;</em>
                </button>
              </label>
            </form>
          </aside>
        </div>
        <aside class="mw-nav-btn">
          <div class="mw-nav-icon"></div>
        </aside>
        <div class="clear"></div>
      </section>
    </header>
    <!-- /公共头引入 -->
    <nuxt />
    <!-- 公共底引入 -->
    <footer id="footer">
      <section class="container">
        <div class>
          <h4 class="hLh30">
            <span class="fsize18 f-fM c-999">友情链接</span>
          </h4>
          <ul class="of flink-list">
            <li>
              <a href="https://github.com/Crookery" title="Katydid">Katydid</a>
            </li>
          </ul>
          <div class="clear"></div>
        </div>
        <div class="b-foot">
          <section class="fl col-7">
            <section class="mr20">
              <section class="b-f-link">
                <a href="#" title="关于我们" target="_blank">关于我们</a>|
                <a href="#" title="联系我们" target="_blank">联系我们</a>|
                <a href="#" title="帮助中心" target="_blank">帮助中心</a>|
                <a href="#" title="资源下载" target="_blank">资源下载</a>|
                <span>客服热线</span>
                <span>Email：crookery@163.com</span>
              </section>
              <section class="b-f-link mt10">
                <span>©2023课程版权均归蝈蝈学院所有 京ICP备xxxxxxxx号</span>
              </section>
            </section>
          </section>
          <aside class="fl col-3 tac mt15">
            <section class="gf-tx">
              <span>
                <img src="~/assets/img/wx-icon.png" alt />
              </span>
            </section>
            <section class="gf-tx">
              <span>
                <img src="~/assets/img/wb-icon.png" alt />
              </span>
            </section>
          </aside>
          <div class="clear"></div>
        </div>
      </section>
    </footer>
    <!-- /公共底引入 -->
  </div>
</template>

<script>
import '~/assets/css/reset.css'
import '~/assets/css/theme.css'
import '~/assets/css/global.css'
import '~/assets/css/web.css'
import '~/assets/css/base.css'
import '~/assets/css/activity_tab.css'
import '~/assets/css/bottom_rec.css'
import '~/assets/css/nice_select.css'
import '~/assets/css/order.css'
import '~/assets/css/swiper-3.3.1.min.css'
import "~/assets/css/pages-weixinpay.css"
import "~/assets/css/web.css";

import cookie from 'js-cookie'
import loginAPI from "@/api/login";

export default {
  data() {
    return {
      token: "",
      loginInfo: {
        id: "",
        age: "",
        avatar: "",
        email: "",
        nickname: "",
        sex: "",
      }
    };
  },
  created(){
    // vx登录处理：后端是拼接token到地址，先获取信息，再放cookie中
    this.token = this.$route.query.token
    if(this.token){
      this.vxLogin()
    }
    this.showInfo()
  },
  methods: {
    //0x01获取用户登录信息
    showInfo() {
      //从cookie中获取值（为JSON字符串）
      let ucenter = cookie.get('katy_userInfo');
      //字符串转为json对象
      if (ucenter) {
        this.loginInfo = JSON.parse(ucenter);
      }
    },
    //0x02微信登录
    vxLogin(){
      if(this.token == ''){
        return
      }
      console.log("删除了cookie");
      cookie.set('katy_token',this.token,{domain:'localhost'})
      cookie.set('katy_userInfo','',{domain:'localhost'})
      loginAPI.getUserInfo().then(response=>{
        this.loginInfo = response.data.data.loginInfo
        cookie.set('katy_userInfo',JSON.stringify(this.loginInfo),{domain:'localhost'})
      })
    },
    //0x03注销登录
    logout() {
      this.token = ''
      cookie.remove('katy_token')
      cookie.remove('katy_userInfo')
      window.location.href = '/'
    },
  },
};
</script>
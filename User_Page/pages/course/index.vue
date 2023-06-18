<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- /课程列表 开始 -->
    <section class="container">
      <header class="comm-title">
        <h2 class="fl tac">
          <span class="c-333">全部课程</span>
        </h2>
      </header>
      <section class="c-sort-box">
        <section class="c-s-dl">
          <dl>
            <dt>
              <span class="c-999 fsize14">课程类别</span>
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li>
                  <a title="全部" href="#" :class="{active:allIndex==0}" @click="allInfo()">全部</a>
                </li>
                <li v-for="(one, index) in treeSubject" :key="index" :class="{active:oneIndex==index}">
                  <a :title="one.label" href="#" @click="oneBelongs(one.id,index)">{{ one.label }}</a>
                </li>
              </ul>
            </dd>
          </dl>
          <dl>
            <dt>
              <span class="c-999 fsize14"></span>
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li v-for="(two, index) in twosubject" :key="index" :class="{active:twoIndex==index}">
                  <a :title="two.label" href="#" @click="twoBelongs(two.id,index)">{{two.label}}</a>
                </li>
              </ul>
            </dd>
          </dl>
          <div class="clear"></div>
        </section>
        <div class="js-wrap">
          <section class="fr">
            <span class="c-ccc">
              <i class="c-master f-fM">1</i>/
              <i class="c-666 f-fM">1</i>
            </span>
          </section>
          <section class="fl">
            <ol class="js-tap clearfix">
             <li :class="{'current bg-orange':buyCountSort!=''}">
                <a title="销量" href="javascript:void(0);" @click="searchBuyCount()">销量
                <span :class="{hide:buyCountSort==''}">↓</span>
                </a>
              </li>
              <li :class="{'current bg-orange':gmtCreateSort!=''}">
                <a title="最新" href="javascript:void(0);" @click="searchGmtCreate()">最新
                <span :class="{hide:gmtCreateSort==''}">↓</span>
                </a>
              </li>
              <li :class="{'current bg-orange':priceSort!=''}">
                <a title="价格" href="javascript:void(0);" @click="searchPrice()">价格&nbsp;
                  <span :class="{hide:priceSort==''}">↓</span>
                </a>
              </li>
            </ol>
          </section>
        </div>
        <div class="mt40">
          <!-- /无数据提示 开始-->
          <section class="no-data-wrap" v-if="data.total <= 0">
            <em class="icon30 no-data-ico">&nbsp;</em>
            <span class="c-666 fsize14 ml10 vam"
              >没有相关数据，小编正在努力整理中...</span
            >
          </section>
          <!-- /无数据提示 结束-->
          <article class="comm-course-list">
            <ul class="of" id="bna">
              <li v-for="course in data.items" :key="course.id">
                <div class="cc-l-wrap">
                  <section class="course-img">
                    <img
                      :src="course.cover"
                      class="img-responsive"
                      :alt="data.title"
                    />
                    <div class="cc-mask">
                      <a
                        :href="'/course/' + course.id"
                        title="开始学习"
                        class="comm-btn c-btn-1"
                        >开始学习</a
                      >
                    </div>
                  </section>
                  <h3 class="hLh30 txtOf mt10">
                    <a
                      :href="'/course/' + course.id"
                      :title="course.title"
                      class="course-title fsize18 c-333"
                      >{{ course.title }}</a
                    >
                  </h3>
                  <section class="mt10 hLh20 of">
                    <span
                      class="fr jgTag bg-green"
                      v-if="Number(course.price) === 0"
                    >
                      <i class="c-fff fsize12 f-fA">免费</i>
                    </span>
                    <span class="fl jgAttr c-ccc f-fA">
                      <i class="c-999 f-fA">{{ course.buyCount }}人学习</i>
                      <i class="c-999 f-fA">{{ course.viewCount }}评论</i>
                    </span>
                  </section>
                </div>
              </li>
            </ul>
            <div class="clear"></div>
          </article>
        </div>
        <!-- 公共分页 开始 -->
        <div>
          <div class="paging">
            <!-- undisable这个class是否存在，取决于数据属性hasPrevious -->
            <a
              :class="{ undisable: !data.hasPrevious }"
              href="#"
              title="首页"
              @click.prevent="toPage(1)"
              >首</a
            >
            <a
              :class="{ undisable: !data.hasPrevious }"
              href="#"
              title="前一页"
              @click.prevent="toPage(data.current - 1)"
              >&lt;</a
            >
            <a
              v-for="page in data.pages"
              :key="page"
              :class="{
                current: data.current == page,
                undisable: data.current == page,
              }"
              :title="'第' + page + '页'"
              href="#"
              @click.prevent="toPage(page)"
              >{{ page }}</a
            >
            <a
              :class="{ undisable: !data.hasNext }"
              href="#"
              title="后一页"
              @click.prevent="toPage(data.current + 1)"
              >&gt;</a
            >
            <a
              :class="{ undisable: !data.hasNext }"
              href="#"
              title="末页"
              @click.prevent="toPage(data.pages)"
              >末</a
            >
            <div class="clear" />
          </div>
        </div>
        <!-- 公共分页 结束 -->
      </section>
    </section>
    <!-- /课程列表 结束 -->
  </div>
</template>
<script>
import courseAPI from "@/api/course";

export default {
  data() {
    return {
      page: 1, //当前页面
      data: {}, //课程列表
      treeSubject: [], //树形课程分类

      twosubject:[],

      searchVo: {}, //查询对象

      allIndex: 0,
      oneIndex: -1,
      twoIndex: -1,
      //排序查询
      buyCountSort: "",
      gmtCreateSort: "",
      priceSort: "",
    };
  },
  created() {
    this.initCourseFront();
    this.getTreeSubject();
  },
  methods: {
    //0x01初始化
    initCourseFront() {
      courseAPI.getFrontCourseList(1, 8, this.searchVo).then((response) => {
        this.data = response.data.data.courseMap;
      });
    },
    //0x02查询一级课程分类
    getTreeSubject() {
      courseAPI.getTreeSubject().then((response) => {
        this.treeSubject = response.data.data.tree;
      });
    },
    //0x03点击一级分类，查询处二级分类条，并跳转到一级分类的第一页
    oneBelongs(id,index){
      //显示操作
      this.oneIndex = index
      this.twoIndex = -1
      this.allIndex = -1
      this.searchVo.subjectId=''
      this.twosubject = []
      //先跳转第一页
      this.searchVo.subjectParentId = id
      this.toPage(this.page)
      
      //显示二级分类条
      for(let i=0;i<this.treeSubject.length;i++){
        var oneSubject = this.treeSubject[i]
        if(id == oneSubject.id){
          this.twosubject = oneSubject.children          
          return;
        }
      }
      this.$message.info("❌数据错误❌")
    },
    //0x04点击二级分类，显示二级分类课程信息
    twoBelongs(id,index){
      //显示课程和选中背景色
      this.twoIndex = index
      this.searchVo.subjectId = id
      this.toPage(this.page)
    },
    //0x05切换分页
    toPage(page) {
      courseAPI.getFrontCourseList(page, 8, this.searchVo).then((response) => {
        this.data = response.data.data.courseMap;
      });
    },
//==============================================排序选择==============================================
    //0x06根据销量排序
    searchBuyCount(){
      //双击取消
      if(this.buyCountSort!=""){
        this.buyCountSort=""
      }else{
        this.buyCountSort = "1"
      }
      this.gmtCreateSort = ""
      this.priceSort = ""

      //把值赋值到searchVo
      this.searchVo.buyCountSort = this.buyCountSort
      this.searchVo.gmtCreateSort = this.gmtCreateSort;
      this.searchVo.priceSort = this.priceSort;

      //调用方法查询
      this.toPage(this.page)

    },
    //时间排序
    searchGmtCreate(){
      if(this.gmtCreateSort!=""){
        this.gmtCreateSort=""
      }else{
        this.gmtCreateSort = "1"
      }
      this.buyCountSort = ""
      this.priceSort = ""

      //把值赋值到searchVo
      this.searchVo.buyCountSort = this.buyCountSort
      this.searchVo.gmtCreateSort = this.gmtCreateSort;
      this.searchVo.priceSort = this.priceSort;

      //调用方法查询
      this.toPage(this.page)
    },
    //价格排序
    searchPrice(){
      if(this.priceSort!=""){
        this.priceSort=""
      }else{
        this.priceSort = "1"
      }
      //不为空即可
      this.buyCountSort = ""
      this.gmtCreateSort = ""

      //把值赋值到searchVo
      this.searchVo.buyCountSort = this.buyCountSort
      this.searchVo.gmtCreateSort = this.gmtCreateSort;
      this.searchVo.priceSort = this.priceSort;

      //调用方法查询
      this.toPage(this.page)
    },
    //全部按钮
    allInfo(){
      this.allIndex = 0
      this.oneIndex= -1,
      this.twoIndex= -1,
      this.twosubject = []
      this.buyCountSort = ""
      this.gmtCreateSort = ""
      this.priceSort = ""
      this.searchVo = {}
      this.toPage(this.page)
    }
  }
};
</script>

<style scoped>
  .active {
    background: #62e2a0;
  }
  .hide {
    display: none;
  }
  .show {
    display: block;
  }
</style>
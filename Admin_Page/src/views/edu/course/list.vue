<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select v-model="courseQuery.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged">

        <el-option v-for="subject in oneList" 
          :key="subject.id"
          :label="subject.title"
          :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseQuery.subjectId" placeholder="请选择">
          <el-option
          v-for="subject in twoList"
          :key="subject.id"
          :label="subject.title"
          :value="subject.id"/>
        </el-select>
        </el-form-item>
        <!-- 标题 -->
        <el-form-item>
          <el-input v-model="courseQuery.title" placeholder="课程标题"/>
        </el-form-item>
        <!-- 讲师 -->
        <el-form-item>
          <el-select
          v-model="courseQuery.teacherId"
          placeholder="请选择讲师">
          <el-option
          v-for="teacher in teacherList"
          :key="teacher.id"
          :label="teacher.name"
          :value="teacher.id"/>
          </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="list"
      border
      fit
      element-loading-text="数据加载中"
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="80" />

      <el-table-column label="课程状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status==='Normal'?'已发布':'未发布' }}
        </template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="课时数" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="viewCount" label="浏览数量" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲息</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除课程信息</el-button>
        </template>
      </el-table-column>
    </el-table>

  <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />

  </div>
</template>
<script>
import courseAPI from '@/api/edu/course.js'

export default {
    data() { //定义变量和初始值
        return {
          list:[],  //查询之后接口返回集合
          page:1,     //当前页
          limit:10,   //每页记录数
          total:0,    //总记录数

          courseQuery:{ //条件封装对象
            subjectParentId:'', //一级分类ID
            subjectId: '',      //二级分类课程ID
          }, 

          oneList:[],   //一级课程分类数据
          twoList:[],   //二级课程分类数据
          teacherList:[]  //讲师列表

        }
    },
    created() { //页面渲染之前执行，一般调用methods定义的方法
        //调用
        this.getList() 
        this.initOnesubject()
        this.initTeacherList()
    },
    methods:{
        getList() {
            courseAPI.page(this.page,this.limit)
                .then(response =>{//请求成功
                    //response接口返回的数据
                    this.list = response.data.page.records
                    this.total = response.data.page.total
                }) 
        },
        resetData() {//清空的方法
            //表单输入项数据清空
            this.courseQuery = {}
            //查询所有讲师数据
            this.getList()
        },
        //删除课程
        removeDataById(courseID){
          this.$confirm('是否删除 该课程?', '危险', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
              courseAPI.delCourse(courseID).then(response=>{
                if(response.code == 2000){
                  this.$message.success('删除成功')
                  this.getList()
                }
              })
            })
        },
        //一级分类改动事件
        subjectLevelOneChanged(){
          if(this.courseQuery.subjectParentId && this.courseQuery.subjectParentId != ''){
                this.initTwosubject(this.courseQuery.subjectParentId)
                //清空上次保留的值
                this.courseQuery.subjectId = ''
            }
        },
        //获取一级分类列表
        initOnesubject(){
          courseAPI.getOneSubject().then(response=>{
            this.oneList = response.data.one
          })
        },
        //获取二级分类数据(在一级分类改动事件中使用)
        initTwosubject(id){
            courseAPI.getTwoSubject(id).then(response=>{
              this.twoList = response.data.two
          })
        },
        //初始化讲师列表
        initTeacherList(){
          courseAPI.getAllTeacher().then(response=>{
            this.teacherList = response.data.list
          })
        },
        //查询
        fetchData(){
          courseAPI.pageCondition(this.page,this.limit,this.courseQuery)
          .then(response=>{
            this.list = response.data.page.records
          })
        }
    }
}
</script>

<style scoped>
.myClassList .info {
width: 450px;
overflow: hidden;
}
.myClassList .info .pic {
width: 150px;
height: 90px;
overflow: hidden;
float: left;
}
.myClassList .info .pic a {
display: block;
width: 100%;
height: 100%;
margin: 0;
padding: 0;
}
.myClassList .info .pic img {
display: block;
width: 100%;
}
.myClassList td .info .title {
width: 280px;
float: right;
height: 90px;
}
.myClassList td .info .title a {
display: block;
height: 48px;
line-height: 24px;
overflow: hidden;
color: #00baf2;
margin-bottom: 12px;
}
.myClassList td .info .title p {
line-height: 20px;
margin-top: 5px;
color: #818181;
}
</style>

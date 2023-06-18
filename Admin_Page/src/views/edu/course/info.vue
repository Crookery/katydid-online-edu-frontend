<template>
    <div class="app-container">
        <h2 style="text-align: center;">发布新课程</h2>

        <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
            <el-step title="填写课程基本信息"/>
            <el-step title="创建课程大纲"/>
            <el-step title="最终发布"/>
        </el-steps>

        <el-form label-width="120px">
            <el-form-item label="课程标题">
                <el-input v-model="courseInfo.title" placeholder="示例：java:从入门到入土" />
            </el-form-item>

            <!-- 所属分类-->
            <el-form-item label="课程类别">
                <!-- 一级分类 -->
                <el-select v-model="courseInfo.subjectParentId" filterable placeholder="一级分类" @change="subjectLevelOneChanged">
                    <el-option
                    v-for="one in oneSubjectList"
                    :key="one.id"
                    :label="one.title"
                    :value="one.id"/>
                </el-select>
                <!-- 二级分类 -->
                <el-select v-model="courseInfo.subjectId" filterable placeholder="二级分类">
                    <el-option
                        v-for="two in twoSubjectList"
                        :key="two.id"
                        :label="two.title"
                        :value="two.id"/>
                </el-select>
            </el-form-item>

            <!-- 课程讲师-->
            <el-form-item label="讲师">
                <el-select v-model="courseInfo.teacherId" filterable placeholder="请选择">
                    <el-option
                        v-for="teacher in teacherList"
                        :key="teacher.id"
                        :label="teacher.name"
                        :value="teacher.id">
                    </el-option>
                </el-select>
            </el-form-item>
        
            <el-form-item label="总课时">
                <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right"/>
            </el-form-item>

            <!-- 课程简介-->
            <el-form-item label="课程简介">
                <el-input v-model="courseInfo.description" placeholder=" "/>
            </el-form-item>

            <el-form-item class="cover" label="(点击更换)封面">
                <el-upload
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :action="BASE_API+'/eduOss/fileOss/upload'"
                    width:100px
                    height:100px
                    class="avatar-uploader">
                    <img :src="courseInfo.cover">
                </el-upload>
            </el-form-item>

            <el-form-item label="课程价格">
                <el-input-number :min="0" v-model="courseInfo.price" controls-position="right"/>
            </el-form-item>
            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="svaeOrUpdate">保存并下一步</el-button>
                </el-form-item>
        </el-form>            
    </div>
</template>

<script>
import courseAPI from '@/api/edu/course.js'

export default {
    data(){
        return{
            saveBtnDisabled:false,
            courseInfo:{
                title: '',
                subjectParentId:'', //一级分类ID
                subjectId: '',      //二级分类课程ID
                teacherId: '',
                lessonNum: 0,
                description: '',
                cover: 'https://katydid-online.oss-cn-beijing.aliyuncs.com/defaultCoveer.png',
                price: 0,
            },
            teacherList:[],     //教师数组，用于显示教师

            oneSubjectList:[],  //一级分类
            twoSubjectList:[],   //二级分类

            BASE_API: process.env.BASE_API, // 接口API地址

            courseID:''     //路径中的课程ID
        }
    },
    
    created(){
        this.init()
    },

    methods:{
        //init
        init(){
            //获取路径中ID值
            if(this.$route.params && this.$route.params.id){
                this.courseID = this.$route.params.id
                this.getInfo(this.courseID)              //初始化课程Info
            }else{
            //路径中没有ID值，表添加，防止刷新保留路径ID值，做清空处理（watch调用）
                this.courseInfo={
                    title: '',
                    subjectParentId:'', //一级分类ID
                    subjectId: '',      //二级分类课程ID
                    teacherId: '',
                    lessonNum: 0,
                    description: '',
                    cover: 'https://katydid-online.oss-cn-beijing.aliyuncs.com/defaultcover.jpg',
                    price: 0,
                }
            }
            this.initTeacherList()      //初始化讲师
            this.initOneSubjectList()   //初始化一级项目
        },
        //1.保存按钮
        svaeOrUpdate(){
            if(this.courseInfo.title == '' || this.courseInfo.subjectParentId == '' || this.courseInfo.subjectId == '' || this.courseInfo.teacherId == ''||this.courseInfo.description == ''){
                this.$message.error('标题、分类、教师、简介信息不能为空')
                return
            }
            if(!this.courseInfo.lessonNum>0){
                this.$message.info('课时数需大于0')
                return
            }
            if(this.courseID != ''){
                this.update()
            }else{
                this.save()
            }
            
        },
        //1.1保存
        save(){
            courseAPI.addCourseInfo(this.courseInfo).then(response=>{
                this.$message({
                    type:"success",
                    message:"保存成功"
                })
                this.$router.push({path:'/course/chapter/'+response.data.courseID})
            })
        },
        //1.2添加
        update(){
            courseAPI.updateCourseInfo(this.courseInfo).then(response=>{
                this.$message({
                    type:"success",
                    message:"保存成功"
                })
                this.$router.push({path:'/course/chapter/'+this.courseID})
            })
        },
        //2.初始化教师列表方法
        initTeacherList(){
            courseAPI.getAllTeacher().then(response=>{
                this.teacherList = response.data.list
            })
        },
        //3.初始化一级学科分类方法
        initOneSubjectList(){
            courseAPI.getOneSubject().then(response=>{
                this.oneSubjectList = response.data.one
            })
        },
        //4.一级学科分类修改
        subjectLevelOneChanged(){
            if(this.courseInfo.subjectParentId && this.courseInfo.subjectParentId != ''){
                this.getTwoSubject(this.courseInfo.subjectParentId)
                //清空上次保留的值
                this.courseInfo.subjectId=''
            }
        },
        //5.获取某一级学科分类下的二级学科分类
        getTwoSubject(oneSubjectID){
            courseAPI.getTwoSubject(oneSubjectID).then(response=>{
                this.twoSubjectList = response.data.two
            })
        },
        //6.上传之前
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
        //7.上传成功
        handleAvatarSuccess(res, file){
            //回调response
            this.courseInfo.cover = res.data.path
        },
        //8.获取courseInfo信息，用于回显
        getInfo(courseID){
            courseAPI.getCouseInfo(courseID).then(response=>{
                this.courseInfo = response.data.courseInfo
                this.getTwoSubject(this.courseInfo.subjectParentId)
            })
        }
    },
    watch:{
        $route(to,from){
            this.init()
        }
    }
}
</script>
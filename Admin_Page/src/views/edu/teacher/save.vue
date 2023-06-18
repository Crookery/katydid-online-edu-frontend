<template>
    <div class="app-container">
        <el-form label-width="120px">
            <el-form-item id="t_name" label="讲师名称">
                <el-input v-model="teacher.name"/>
            </el-form-item>

            <el-form-item label="讲师排序">
                <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
            </el-form-item>

            <el-form-item label="讲师头衔">
                <el-select v-model="teacher.level" clearable placeholder="请选择">
                    <!--
                    数据类型一定要和取出的json中的一致，否则没法回填
                    因此，这里value使用动态绑定的值，保证其数据类型是number
                    -->
                    <el-option :value="1" label="高级讲师"/>
                    <el-option :value="2" label="首席讲师"/>
                </el-select>
            </el-form-item>

            <el-form-item label="讲师资历">
                <el-input v-model="teacher.career"/>
            </el-form-item>

            <el-form-item label="讲师简介">
                <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
            </el-form-item>

            <!-- 讲师头像 -->
            <el-form-item label="讲师头像">
                <!-- 头衔缩略图 -->
                <pan-thumb :image="String(teacher.avatar)"/>
                <!-- 文件上传按钮 -->
                <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
                </el-button>
                <image-cropper
                        v-show="imagecropperShow"
                        :width="80"
                        :height="80"
                        :key="imagecropperKey"
                        :url="BASE_API+'/eduOss/fileOss/upload'"
                        field="file"
                        @close="close"
                        @crop-upload-success="cropSuccess"/>
            </el-form-item>

            <!-- 保存按钮——提交 -->
            <el-form-item>
                <el-button :disabled="buttonAble" type="primary" @click="saveOrUpdate">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import t from '@/api/edu/teacher.js'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
    components: { ImageCropper, PanThumb },
    data(){
        return{
            buttonAble:false,
            teacher:{
                name: '',
                sort: 1,
                level: 1,
                career: '',
                intro: '',
                avatar: 'https://katydid-online.oss-cn-beijing.aliyuncs.com/default.gif'
            },
            
            imagecropperShow:false,         //上传弹框组件是否显示
            imagecropperKey:0,              //上传组件key值
            BASE_API:process.env.BASE_API,  //获取dev.env.js里面地址
        }
    },
    created(){
        this.init()
    },
    methods:{
        //关闭上传弹框方法
        close(){
            this.imagecropperShow=false
            //上传组件初始化
            this.imagecropperKey = this.imagecropperKey+1
        },
        //上传成功方法
        cropSuccess(data){
            this.imagecropperShow=false
            //上传之后接口返回图片地址
            this.teacher.avatar = data.path
            this.imagecropperKey = this.imagecropperKey+1
        },
        init(){
            if(this.$route.params && this.$route.params.id){
                const id = this.$route.params.id
                this.embodyInfo(id)
            }else{
                this.teacher = {
                    name: '',
                    sort: 0,
                    level: 1,
                    career: '',
                    intro: '',
                    avatar: 'https://katydid-online.oss-cn-beijing.aliyuncs.com/default.gif'
                }
            }
        },
        //1.保存——按钮事件
        saveOrUpdate(){
            this.teacher.id?this.updateCommit():this.saveCommit()
        },
        //2.用于修改页面回显数据
        embodyInfo(id){
            t.getTeacherInfo(id).then(response=>{
                this.teacher = response.data.teacher
            })
        },
        //3.提交修改
        updateCommit(){
            t.updateTeacherInfo(this.teacher)
            .then(response=>{
                this.$message({
                    type:'info',
                    message:'修改成功'
                })
                this.$router.push({path:'/teacher/table'})
            })
        },
        //4.提交保存
        saveCommit(){
            if(this.teacher.name == ''){
                this.$message({
                    type:'error',
                    message:'讲师姓名不能为空'
                })
            }else if(this.teacher.career == ''){
                this.$message({
                    type:'error',
                    message:'讲师资历不能为空'
                })
            }else if(this.teacher.inreo == ''){
                this.$message({
                    type:'error',
                    message:'讲师简介不能为空'
                })
            }else{
                t.save(this.teacher)
                .then(response =>{      //添加成功
                    this.$message({
                        type:'success',
                        message:'添加成功'
                    })
                this.$router.push({path:'/teacher/table'})
                })
            }
        }
    },
    //监听：解决路由变化，created()只执行一次
    watch:{
        $route(to,from){
            this.init()
        }
    }
}
</script>
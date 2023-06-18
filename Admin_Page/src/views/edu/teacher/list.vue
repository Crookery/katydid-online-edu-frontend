<template>
    
<div>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
            <el-input v-model="conditional.name" placeholder="讲师名"/>
        </el-form-item>
        <el-form-item>
            <el-select v-model="conditional.level" clearable placeholder="讲师头衔">
                <el-option :value="1" label="高级讲师"/>
                <el-option :value="2" label="首席讲师"/>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-date-picker v-model="conditional.begin" type="datetime" placeholder="选择开始时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00"
            />
        </el-form-item>
        <el-form-item>
            <el-date-picker v-model="conditional.end" type="datetime" placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
        />
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table :data="list" border fit highlight-current-row>
        <el-table-column
            label="序号"
            width="70"
            align="center">
            <template slot-scope="scope">
                {{ (page - 1) * limit + scope.$index + 1 }}
            </template>
        </el-table-column>

        <el-table-column prop="name" label="名称" width="80" />

        <el-table-column label="头衔" width="80">
            <template slot-scope="scope">
                {{ scope.row.level===1?'高级讲师':'首席讲师' }}
            </template>
        </el-table-column>

        <el-table-column prop="intro" label="资历" />
        <el-table-column prop="gmtCreate" label="添加时间" width="160"/>
        <el-table-column prop="sort" label="排序" width="60" />

        <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
                <!-- 先跳转到路由，路由再跳转到相应页面 -->
                <router-link :to="'/teacher/edit/'+scope.row.id">
                    <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
                </router-link>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分页条 -->
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
import t from '@/api/edu/teacher'

export default {
    //核心代码位置，不需要写new Vue(相当于有)
    data(){
        //定义变量和设置初始值
        return{
            list:null,  
            page:1,
            limit:8,
            total:0,
            conditional:{}
        }
    },
    created(){
        this.getList()
    },
    //定义方法：利用api/edu中的封装方法，发送Ajax请求，获取到服务器端回传的JSON数据
    methods:{
        //1.显示教师列表(带条件查询)
        getList(page=1){
            this.page = page
            t.getTeacherListByConditionPage(this.page,this.limit,this.conditional)
            .then(response=>{       //接口返回的数据
                this.list = response.data.page.records
                this.total = response.data.page.total
            })     //请求成功
            .catch(error => {
                console.log(error)
            })    //请求失败
        },

        //2.清空按钮
        resetData(){
            this.conditional = {}
            this.getList()
        },

        //3.删除讲师
        removeDataById(id){
            this.$alert('该操作将会永久删除此讲师', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
            }).then(()=>{
                return t.deleteTeacherById(id)
            }).then(()=>{
                this.getList()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
            }).catch((response)=>{
                if(response === 'cancel'){
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                }else{
                    this.$message({
                        type: 'error',
                        message: '删除失败'
                    })
                }
            })
        }
    }
}
</script>
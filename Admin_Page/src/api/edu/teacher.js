import request from '@/utils/request'

//相当于ajax请求
export default{
    //讲师列表
    getTeacherListByConditionPage(current,limit,teacherQuery){
        return request({
            url:`/edu/teacher/pageTeacherByCondition/${current}/${limit}`,
            method: 'post',
            //teacherQuery条件对象，后端使用的是RequestBody，前端需要传JSON
            //data能将参数变成JSON格式
            data:teacherQuery
        })
    },
    //删除讲师
    deleteTeacherById(id){
        return request({
            url:`/edu/teacher/${id}`,
            method:'delete',
        })
    },
    //保存讲师
    save(addTeacher){
        return request({
            url:`/edu/teacher/addTeacher`,
            method:'post',
            data:addTeacher
        })
    },
    //查询讲师
    getTeacherInfo(id){
        return request({
            url:`/edu/teacher/getTeacherById/${id}`,
            method:'get'
        })
    },
    //更新讲师
    updateTeacherInfo(teacherInfo){
        return request({
            url:`/edu/teacher/updateTeacher`,
            method:'post',
            data:teacherInfo
        })
    }
}
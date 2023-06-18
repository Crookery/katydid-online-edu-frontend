import request from '@/utils/request'

export default{
    getFrontTeacherList(page,limit){
        return request({
            url:`/edu/frontTeacher/getTeacherList/${page}/${limit}`,
            method:'get'  
        })
    },
    getTeacherInfo(id){
        return request({
            url:`/edu/frontTeacher/getTeacherInfo/${id}`,
            method:'get' 
        })
    }
}
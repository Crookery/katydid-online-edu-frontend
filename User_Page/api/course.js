import request from '@/utils/request'

export default{
    //按条件查询课程分页
    getFrontCourseList(page,limit,searchVo){
        return request({
            url:`/edu/frontCourse/getFrontCourseList/${page}/${limit}`,
            method:'post',
            data:searchVo
        })
    },
    //查询所有分类
    getTreeSubject(){
        return request({
            url:`/edu/subject/getAllTreeSubject`,
            method:'get'
        })
    },
    //单个课程详细信息
    getCourseDetail(courseId){
        return request({
            url:`/edu/frontCourse/getCourseDetail/${courseId}`,
            method:'get'
        })
    }
    
}
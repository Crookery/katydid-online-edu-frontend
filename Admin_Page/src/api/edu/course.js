import request from '@/utils/request'

export default{
    //1.添加课程信息
    addCourseInfo(courseInfo){
        return request({
            url:'/edu/course/addCourseInfo',
            method:'post',
            data:courseInfo
        })
    },

    //2.获取所有讲师
    getAllTeacher(){
        return request({
            url:'/edu/teacher/list',
            method:'get'
        })
    },

    //3.获取一级学科分类信息
    getOneSubject(){
        return request({
            url:'/edu/subject/getOneSubject',
            method:'get'
        })
    },

    //4.获取某一级学科分类下的二级学科分类
    getTwoSubject(oneSubjectID){
        return request({
            url:`/edu/subject/getTwoSubject/${oneSubjectID}`,
            method:'get'
        })
    },

    //5.根据ID获取课程信息
    getCouseInfo(courseID){
        return request({
            url:`/edu/course/getCourseInfo/${courseID}`,
            method:'get'
        })
    },

    //6.修改信息
    updateCourseInfo(courseInfo){
        return request({
            url:`/edu/course/updateCourseInfo`,
            method:'post',
            data:courseInfo
        })
    },

    //7.获取最终发布信息
    getPublishCourseInfo(id){
        return request({
            url:`/edu/course/publishCourseInfo/${id}`,
            method:'get',
        })
    },

    //8.最终发布信息
    publish(id){
        return request({
            url:`/edu/course/publishCourse/${id}`,
            method:'put'
        })
    },

    //9.分页查询
    page(current,limit){
        return request({
            url:`/edu/course/pageCourse/${current}/${limit}`,
            method:'get'
        })
    },

    //10.条件分页
    pageCondition(current,limit,courseQuery){
        return request({
            url:`/edu/course/pageCourseByCondition/${current}/${limit}`,
            method:'post',
            data:courseQuery
        })
    },

    //11.删除课程
    delCourse(courseId){
        return request({
            url:`/edu/course/delCourse/${courseId}`,
            method:'delete'
        })
    }
}


import request from '@/utils/request'

//相当于ajax请求
export default{
    //1.获取分类数据
    getAllTreeSubject(){
        return request({
            url:`/edu/subject/getAllTreeSubject`,
            method: 'get'
        })
    }
}
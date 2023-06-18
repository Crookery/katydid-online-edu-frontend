import request from '@/utils/request'

export default{
    submitLogin(loginVo){
        return request({
            url:'/ucenter/member/login',
            method:'post',
            data:loginVo
        })
    },
    // 获取登录用户信息
    getUserInfo(){
        return request({
            url:'/ucenter/member/getUserInfo',
            method:'get'
        })
    },
    updateUser(user){
        return request({
            url:'/ucenter/member/updateUser',
            method:'post',
            data:user
        })
    }
}
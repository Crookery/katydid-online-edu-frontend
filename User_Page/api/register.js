import request from '@/utils/request'

export default{
    sendCode(email){
        return request({
            url:`/eduEms/verify/send/${email}`,
            method:'post',
        })
    },
    submitRegister(registerVo){
        return request({
            url:`/ucenter/member/register`,
            method:'post',
            data:registerVo
        })
    },
    confirmEmail(params){
        return request({
            url:`/ucenter/member/confirmEmail`,
            method:'post',
            data:params
        })
    }
}
import request from '@/utils/request'

export default{
    //获取播放凭证
    getPlayAuth(id){
        return request({
            url:`/eduVod/video/getPlayAuth/${id}`,
            method:'get'
        })
    }
}
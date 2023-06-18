import request from '@/utils/request'

export default{
    //添加小节信息
    addVideo(video){
        return request({
            url:`/edu/video/addVideo`,
            method:'post',
            data:video
        })
    },
    //删除小节信息
    delVideo(videoID){
        return request({
            url:`/edu/video/delVideo/${videoID}`,
            method:'delete'
        })
    },
    //根据id，删除阿里云中的视频
    delAliVideo(videoID){
        return request({
            url:`/eduVod/video/deleteVideo/${videoID}`,
            method:'delete'
        })
    },
    //根据小节id，获取小节信息
    getVideo(videoID){
        return request({
            url:`/edu/video/getVideo/${videoID}`,
            method:'get'
        })
    },
    updateVideo(video){
        return request({
            url:`/edu/video/updateVideo`,
            method:'post',
            data:video
        })
    }

}
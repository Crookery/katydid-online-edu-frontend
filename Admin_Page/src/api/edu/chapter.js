import request from '@/utils/request'

export default{
    //1.获取章节和小节信息
    getChapterVideo(courseID){
        return request({
            url:`/edu/chapter/getChapterVideo/${courseID}`,
            method:'get'
        })
    },
    //2.获取章节信息
    getChapter(courseID){
        return request({
            url:`/edu/chapter/getChapter/${courseID}`,
            method:'get'
        })
    },
    //3.获取章节和小节信息
    addChapter(chapter){
        return request({
            url:`/edu/chapter/addChapter`,
            method:'post',
            data:chapter
        })
    },
    //4.通过id修改章节信息
    updateChapter(chapterID,chapter){
        return request({
            url:`/edu/chapter/updateChapter/${chapterID}`,
            method:'post',
            data:chapter
        })
    },
    //5.删除章节（含）
    delChapter(chapterID){
        return request({
            url:`/edu/chapter/deleteChapter/${chapterID}`,
            method:'delete'
        })
    }

}
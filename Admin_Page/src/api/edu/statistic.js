import request from '@/utils/request'

export default{
    //1.生成统计数据
    createStatistic(day){
        return request({
            url:`/statistics/daily/registerCount/${day}`,
            method:'post',
        })
    },

    //2.获取生成表格的数据
    showData(searchObj){
        return request({
            url:`/statistics/daily/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
            method:'get'
        })
    }
}
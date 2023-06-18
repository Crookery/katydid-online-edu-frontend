import request from '@/utils/request'

export default{
    
    //获取热门数据（讲师和课程）
    getHotData(){
        return request({
            url:'/edu/index/hotData',
            method:"get"
        })
    },

    //获取轮播图
    getBannerList(){
        return request({
            url:'/cms/bannerFront/getAllBanner',
            method:"get"
        })
    }
}
import axios from 'axios'
import cookie from 'js-cookie';

// 创建axios实例
const service = axios.create({
    baseURL: "http://127.0.0.1:9999", // api 的 base_url
    timeout: 20000 // 请求超时时间
})

//针对request(登录)的拦截器
service.interceptors.request.use(
    config => {
        if (cookie.get('katy_token')) {
            //设置响应体
            config.headers['token'] = cookie.get('katy_token')
        }
        return config
    },
    error => {
        return Promise.reject(error.response) // 返回接口返回的错误信息
    }
)

//针对response的拦截器
service.interceptors.response.use(
    response => {
        if (response.data.code == 28004) {
            console.log("未进行登录")
            // 返回 错误代码-1 清除ticket信息并跳转到登录页面
            window.location.href = "/login"
            return
        } else {
            if (response.data.code !== 2000 || response.data.code === 5000) {
                //25000：订单支付中，不做任何提示
                if (response.data.code != 25000) {
                    console.log(response)
                    
                    Message({
                        message: response.data.message || 'error',
                        type: 'error',
                        duration: 5 * 1000
                    })
                }
            } else {
                return response;
            }
        }
    },
    error => {
        return Promise.reject(error.response) // 返回接口返回的错误信息
    }
);

export default service
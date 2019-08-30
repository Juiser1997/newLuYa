let re = /^[0-9]+$/;
export function ajax(url,params,type){
    // 正常处理请求情况
    return new Promise((resolve,reject)=>{
        let token_ = wx.getStorageSync('token_');
        let check_code = wx.getStorageSync('check_code');
        if(re.test(token_) && re.test(check_code)){
            params.token_ = token_;
            params.check_code = check_code;
            wx.request({
                url: url,
                data: params,
                header:{
                    'content-type': 'application/json; charset=utf-8', // 默认值
                    'Cache-Control': 'max-age=60', //60秒
                },
                method: type,
                dataType: 'json',
                success: res=>{
                    switch(res.data.code){
                        case '200':
                            wx.setStorageSync('token_', res.data.token_);
                            wx.setStorageSync('check_code', res.data.check_code);
                            resolve(res.data);
                            break;
                        case '300':
                            wx.clearStorageSync('token_');
                            wx.clearStorageSync('check_code');
                            wx.navigateTo({url: '../login/login',});
                        case '400':
                            wx.setStorageSync('token_', res.data.token_);
                            wx.setStorageSync('check_code', res.data.check_code);
                            wx.showModal({
                                content: res.data.msg,
                                showCancel:false,
                            })
                            break;
                        case '500':
                            wx.setStorageSync('token_', res.data.token_);
                            wx.setStorageSync('check_code', res.data.check_code);
                            console.log('系统异常');
                            break;
                        default :
                            wx.clearStorageSync('token_');
                            wx.clearStorageSync('check_code');
                            wx.clearStorageSync('openid');
                            wx.clearStorageSync('check_code');
                            wx.clearStorageSync('communityId');
                            wx.clearStorageSync('communityName');
                            wx.clearStorageSync('roleId');
                            wx.clearStorageSync('userInfo');
                            wx.navigateTo({ url: '/pages/login/login', })
                    }
                },
                fail: (e)=>{
                    reject(e);
                    console.log('请求错误')
                },
            });
        }else{
            //没有登录的评论 跳转登录页
            wx.navigateTo({url: '../login/login',});
        }
    })

}
export function http(url,params,type){
    // 正常处理请求情况
    return new Promise((resolve,reject)=>{
        wx.request({
            url: url,
            data: params,
            header:{
                'content-type': 'application/json; charset=utf-8', // 默认值
                'Cache-Control': 'max-age=60', //60秒
            },
            method: type,
            dataType: 'json',
            success: res=>{
                switch(res.data.code){
                    case '200':
                        resolve(res.data);
                        break;
                    case '400':
                        wx.showModal({
                            content: res.data.msg,
                            showCancel:false,
                        })
                        break;
                    case '500':
                        console.log('系统异常');
                        break;
                    default :
                        console.log('请求错误')
                }
            },
            fail: (e)=>{
                reject(e);
                console.log('请求错误')
            },
        });
    })
}
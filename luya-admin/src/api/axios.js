import axios from 'axios';
import qs from 'qs';
import router from '../router';
import { Message } from 'element-ui'

//重定向回登录页
const toLogin = ()=>{
    router.replace({
        path:'/',
        query:{
            redirect:router.currentRoute.fullPath
        }
    });
}
//设置cookie
export function setCookie(cname,cvalue,exdays){
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires +";Path=/";
}
//获取cookie

export function getCookie(name){    
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
    else
    return null;
}
//删除cookie
export function delCookie(name){
    setCookie(name, '', -1);
}
// axios.defaults.baseURL = 'http://192.168.3.189:8080';//本地地址
axios.defaults.baseURL = 'http://luyabang.com/lyb';//线上地址
// axios.defaults.baseURL = 'http://192.168.3.191:8080';//本地地址


axios.defaults.timeout = 10000;//请求超时时间

let re = /^[0-9]+$/;
export function get(url,params){
    return new Promise((resolve,reject)=>{
        let token_ = getCookie('token_');
        let check_code = getCookie('check_code');
        // token和check_code必须为数字
        if( re.test(token_) && re.test(check_code)){
            params.token_ = token_;
            params.check_code = check_code;
            axios.get(url,{params:params}).then(res=>{
                if(res.data.code){
                    switch(res.data.code){
                        //正确无异常的请求状态
                        case '200': 
                            setCookie('token_',res.data.token_,7);
                            setCookie('check_code',res.data.check_code,7);
                            resolve(res.data);
                            break;
                        // 参数传递错误
                        case '400':
                            setCookie('token_',res.data.token_,7);
                            setCookie('check_code',res.data.check_code,7);
                            Message.warning('参数传递错误');
                            break;
                        //异常但不终止服务
                        case '500':
                            setCookie('token_',res.data.token_,7);
                            setCookie('check_code',res.data.check_code,7);
                            Message.warning('系统异常，请联系管理员');
                            break;
                        //终止服务 token_ 和check_code 错误 和未登录
                        default :
                            delCookie("check_code");
                            delCookie("token_");
                            delCookie("infodata");
                            delCookie("routerList");
                            delCookie("systemId");
                            Message.warning(res.data.msg)
                            setTimeout(()=>{toLogin();},1500);
                    }
                }
            }).catch(err=>{
                reject(err)
            })
        }else{
            Message.warning('网络异常，即将重新登陆')
            setTimeout(()=>{toLogin();},1500);
        }
    })
}
export function post(url,params){
    return new Promise((resolve,reject)=>{
        let token_ = getCookie('token_');
        let check_code = getCookie('check_code');
        // token和check_code必须为数字
        if( re.test(token_) && re.test(check_code)){
            params.token_ = token_;
            params.check_code = check_code;
            axios.post(url,qs.stringify(params)).then(res=>{
                if(res.data.code){
                    switch(res.data.code){
                        //正确无异常的请求状态
                        case '200': 
                            setCookie('token_',res.data.token_,7);
                            setCookie('check_code',res.data.check_code,7);
                            resolve(res.data);
                            break;
                        // 参数传递错误
                        case '400':
                            setCookie('token_',res.data.token_,7);
                            setCookie('check_code',res.data.check_code,7);
                            Message.warning(res.data.msg);
                            break;
                        //异常但不终止服务
                        case '500':
                            setCookie('token_',res.data.token_,7);
                            setCookie('check_code',res.data.check_code,7);
                            Message.warning('系统异常，请联系管理员');
                            break;
                        //终止服务 token_ 和check_code 错误 和未登录
                        default :
                            delCookie("check_code");
                            delCookie("token_");
                            delCookie("infodata");
                            delCookie("routerList");
                            delCookie("systemId");
                            Message.warning('网络异常或未登录，即将重新登录')
                            setTimeout(()=>{toLogin();},1500);
                    }
                }
            }).catch(err=>{
                reject(err)
            })
        }else{
            Message.warning('网络异常，即将重新登陆')
            setTimeout(()=>{toLogin();},1500);
        }
    })
}

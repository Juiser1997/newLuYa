
let {ajax,http} = require('./http');
let api = require('./api');
//从微信服务器获取需解密数据
export function getFromWxData(){
    return new Promise((resolve,reject)=>{
      wx.login({
        success:function(res){
          if(res.code){
            let code = res.code;
            wx.getUserInfo({
              success:data=>{
                let wxdata = {
                  code:code,
                  data:data,
                }
                resolve(wxdata)
              },
              fail:err=>{
                reject(err);
              }
            })
          }
        },
        fail:function(e){
          reject(e)
        }
      })
    })
}
//登录服务器
export function Login(wxData){
    let cdata = {
      data:wxData.data.encryptedData,
      iv:wxData.data.iv,
      code:wxData.code,
    }
    return new Promise((resolve,reject)=>{
        wx.request({
          url: api.login,
          dataType: 'json',
          method: "POST",
          data: cdata,
          success: res => {
            resolve(res.data)
          },
          fail: e => {
            reject(e)
          }
        })
    })
}
//注册
export function Regist(data){
  return ajax(api.regist,data,'post')
}
//获取验证码
export function getcode(phone){
    return ajax(api.sendMsg,{phone:phone},'post')
}
//首页数据
export function indexData(data){
  return http(api.homeData,data,'get')
}
//首页二级数据
export function getNextMenuData(data){
  return http(api.nextmenu,data,'get')
}


//文章详情
export function getArticleDetail(data){
  return http(api.articledetail,data,'get')
}
//文章评论
export function CommentSave(data){
  return ajax(api.commentsave,data,'post')
}
//删除评论
export function CommentDelete(data){
  return ajax(api.commentdelete,data,'post')
}
//评论列表
export function Commentlist(data){
  return http(api.commentlist,data,'post')
}
//点赞
export function PraiseSave(data){
  return ajax(api.praisesave,data,'post')
}
// 不喜欢
export function nolike(id){
  return ajax(api.nolike,{contentId:id},'post')
}
//回复
export function Replay(data){
  return ajax(api.replaysave,data,'post')
}
//删除回复
export function ReplayDelete(data){
  return ajax(api.replaydelete,data,'post')
}
//回复列表
export function ReplayList(data){
  return http(api.replylist,data,'post')
}
//关注
export function FansSave(id){
  return ajax(api.fanssave,{userId:id},'post')
}
//举报
export function report(data){
  return ajax(api.report,data,'post')
}

//用户信息
export function userContent(data) {
  return http(api.usercontent, data, 'get')
}
//用户信息中的文章列表
export function usergetColm(data) {
  return  http(api.usergetcolm, data, 'get')
}
//我的关注
export function usemyattention(data) {
  return ajax(api.usemyattention,data, 'get')
}
//我的粉丝
export function usermyfans(data) {
  return ajax(api.usermyfans, data, 'get')
}
//用户取消关注fansdelete
export function fansdelete(id) {
  return ajax(api.fansdelete, {id:id}, 'get')
}
//我的评论
export function usermycomment(data) {
  return ajax(api.usermycomment, data, 'get')
}
//评论回复列表
export function replylist(data) {
  return ajax(api.replylist, data, 'get')
} 
export function userapplay(data) {
  return ajax(api.userapplay, data, 'get')
} 
//用户信息
export function userget() {
  return http(api.userget,{},'get')
} 
export function userupdate(data) {
  return ajax(api.userupdate, data , 'get')
}
//天高登录
export function tglogin(id) {
  return ajax(api.tglogin, { id: id }, 'get')
}
//阅读记录
export function readhistory(data){
  return ajax(api.readhistory, data, 'get')
} 
//删除阅读纪录
export function readDelete(id){
  return ajax(api.readdelete,{id:id},'get')
}
//路亚圈
export function dynamicgetall(data) {
  return ajax(api.dynamicgetall, data, 'get')
} 
//发布用户信息
export function dynamicsave(data) {
  return ajax(api.dynamicsave, data, 'get')
} 
//关注
export function dynamicatention(data) {
  return ajax(api.dynamicatention,data, 'get')
} 
//我的圈子
export function dynamiclist(data) {
  return ajax(api.dynamiclist,data, 'get')
} 
//附近的圈子
export function dynamicnearby(data) {
  return ajax(api.dynamicnearby, data, 'get')
}
//大咖列表
export function writeList(data){
  return http(api.writelist,data,'get');
}
//大咖文章列表
export function ContentList(data){
  return http(api.contentlist,data,'POST')
}
//动态详情
export function contentDetail(data){
  return ajax(api.contentdetail,data,'POST')
}
//删除动态
export function dynamicDelete(id){
  return ajax(api.dynamicdelete,{id:id},'POST')
}
//收藏文章
export function collectSave(id){
  return ajax(api.collectsave,{contentId:id},'POST')
}
//取消收藏
export function collectDel(id){
  return ajax(api.collectdelete,{id:id},'POST')
}
//收藏列表
export function collectList(data){
  return ajax(api.collectlist,data,'get')
}
//消息退送
export function msgPush(data){
  return ajax(api.msgpush,data,'get')
}
//未读消息数量
export function msgNum(){
  return ajax(api.msgnum,{},'POST')
}
// 动态消息
export function dynamicMsg(){
  return ajax(api.dynamicmsg,{},'POST')
}
//申请俱乐部
export function applyClub(data){
  return ajax(api.clubsave,data,'POST')
}
export function shopList(data){
  return http(api.shoplist,data)
} 
//推荐商家列表
export function tjshopList(data) {
  return http(api.tjshoplist, data)
}
//登录统计
export function totalip() {
  return http(api.totalip, {},"get")
}

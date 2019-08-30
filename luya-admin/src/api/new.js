import api from './api'
import {post, get} from './axios'

//栏目列表
export function columnList(){
    return get(api.columnlist,{})
}
export function columnDetails(){
    return post(api.columndetail,{})
}
//新增栏目
export function columnSave(data){
    return post(api.columnsave,data)
}
//修改栏目
export function columnUpdate(data){
    return post(api.columnupdate,data)
}
//删除栏目
export function columnDelete(id){
    return post(api.columndelete,{id:id})
}
//轮播列表
export function carouelList(data){
    return get(api.carouellist,data)
}
//取消轮播
export function deleteCarousel(id){
    return post(api.deletecarousel,{id:id})
}
//编辑轮播
export function updateCarousel(data){
    return post(api.updatecarousel,data)
}
//修改轮播
export function changecarousel(data){
    return post(api.changecarousel,data)
}
//轮播排序
export function changeSort(obj){
    return post(api.changesort,{data:obj})
}
//保存提交资讯广告
export function saveContent(data){
    return post(api.savecontent,data)
}
//资讯列表
export function contentList(data){
    return get(api.contentlist,data)
}
//发布资讯和取消发布
export function contentIssue(data){
    return post(api.contentissue,data)
}
//发布资讯和取消发布contentdelete
export function contentDelete(data){
    return get(api.contentdelete,data)
}
//大咖列表
export function userList(data){
    return get(api.auditlist,data)
}
//大咖授权
export function userUdate(data){
    return get(api.userupdate,data)
}
//设为轮播
export function contentUpdate(data){
    return get(api.contentupdate,data)
}
//设为轮播
export function contentGet(data){
    return get(api.contentget,data)
}
//普通用户列表
export function lyuserList(data){
    return post(api.lyuserlist,data)
}
//高级用户列表
export function highuserList(data){
    return post(api.highuserList,data)
}
//编辑高级用户
export function highUserEdit(data){
    return post(api.highuseredit,data)
}
// 删除高级用户delroleuser
export function delroleUser(id){
    return get(api.delroleuser,{id:id})
}
//推荐商家
export function tgbusiUser(data){
    return post(api.tgbusiuser,data)
}
//新增商家
export function addShop(data){      
    return post(api.addshop,data)
}
//商家列表
export function shopList(data){
    return post(api.shoplist,data)
}
//修改商家信息
export function updateShop(data){
    return post(api.updateshop,data)
}
//删除商家 
export function deleteShop(id){
    return get(api.deleteshop,{id:id})
}
//获取商家详情
export function getShop(id){
    return get(api.getshop,{id:id})
}
//举报管理
export function userReport(data){
    return post(api.lyuserreport,data)
}
//无效举报
export function reportNO(id){
    return post(api.reportupdate,{id:id})
}
//有效举报
export function reportSure(id){
    return post(api.reportdelete,{id:id})
}
//消息通知
export function reportMsg(){
    return post(api.redreport,{})
}
//举报列表
export function reportList(data){
    return post(api.reportlist,data)
}
//动态举报
export function dtreport(data){
    return post(api.dtreport,data)
}
//修改用户信息
export function userUpdate(data){
    return post(api.lyuserupdate,data)
}
//会员列表
export function clubList(data){
    return post(api.clublist,data)
}
//删除会员
export function clubDelete(id){
    return post(api.clubdelete,{id:id})
}
//通过会员
export function clubUpdate(data){
    return post(api.clubupdate,data)
}
//拒绝会员
export function clubNopass(data){
    return post(api.clubnopass,data)
}
//添加大咖
export function addshop(data){
    return post(api.addshop,data)
}
//评论点赞
export function total(){
    return post(api.total,{})
}
export function Dtotal(data){
    return post(api.Dtotal,data)
}
//内容标签
export function contentotal(){
    return post(api.contentotal,{})
}
export function Dcontentotal(data){
    return post(api.Dcontentotal,data)
}
//文章浏览
export function totalcontent(){
    return post(api.totalcontent,{})
}
export function Dtotalcontent(data){
    return post(api.Dtotalcontent,data)
}
//栏目访问
export function totalcl(){
    return post(api.totalcl,{})
}
export function Dtotalcl(data){
    return post(api.Dtotalcl,data)
}
//ip浏览
export function totalip(){
    return post(api.totalip,{})
}
export function Dtotalip(data){
    return post(api.Dtotalip,data)
}

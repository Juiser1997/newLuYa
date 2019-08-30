import api from './api'
import {post, get} from './axios'

//系统列表
export function systemlist(){
    return get(api.systemlist,{})
}
//系统信息修改
export function systemupdate(data){
    return post(api.systemupdate,data)
}
//删除系统
export function systemdelete(id){
    return get(api.systemdelete,{id:id})
}
//新建系统
export function systemsave(data){
    return post(api.systemsave,data)
}
//获取系统页面
export function systempage(id){
    return get(api.systemPage,{systemId:id})
}
//添加系统页面
export function savesystempage(data){
    return post(api.systemsavepage,data)
}
//减少系统页面
export function reducesystempage(id){
    return get(api.systemdeletepage,{id:id})
}
//刷新系统
export function refrush(){
    return get(api.refrush,{})
}
//系统配置列表
export function configlist(data){
    return get(api.sysconfiglist,data)
}
//新建系统配置
export function configsave(data){
    return post(api.sysconfigsave,data)
}
//修改系统配置
export function configupdate(data){
    return post(api.sysconfigupdate,data)
}
//删除系统配置
export function configdelete(id){
    return get(api.sysconfigdelete,{id:id})
}
//字段列表
export function dictionarylist(){
    return get(api.dictionarylist,{})
}
//新增字段
export function dictionarysave(data){
    return post(api.dictionarysave,data)
}
//修改字段
export function dictionaryupdate(data){
    return post(api.dictionaryupdate,data)
}
//删除字段
export function dictionarydelete(id){
    return get(api.dictionarydelete,{id:id})
}
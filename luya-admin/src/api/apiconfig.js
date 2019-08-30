import api from './api'
import {post, get} from './axios'

//接口列表
export function menuList(){
    return get(api.menuList,{})
}
//新增接口
export function menuSave(data){
    return post(api.menuSave,data)
}
//更新接口信息
export function menuUpdate(data){
    return post(api.menuUpdate,data)
}
//删除接口
export function menuDelete(id){
    return get(api.menuDelete,{id:id})
}
//分页的接口列表
export function menupagelist(data){
    return get(api.menuPagelist,data)
}
//接口参数信息列表
export function menuparamlist(id){
    return post(api.menuParamlist,{menuid:id})
}
//保存接口参数信息
export function menuparamsave(data){
    return post(api.menuParamsave,data)
}
//删除接口信息
export function menuparamdelete(id){
    return get(api.menuParamDelete,{id:id})
}
//sql列表
export function sqlList(data){
    return get(api.sqllist,data)
}
//删除sql 
export function sqldelete(id){
    return get(api.sqldelete,{id:id})
}
//修改sql
export function sqlupdate(data){
    return post(api.sqlupdate,data)
}
//保存sql
export function sqlsave(data){
    return post(api.sqlsave,data)
}
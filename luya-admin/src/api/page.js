import api from './api'
import {post, get} from './axios'

// 获取页面方法
export function getPage(data){
    return post(api.getpage,data)
}
// 获取 系统页面树
export function getPagelist(){
   return get(api.pagelist,{})
}
//新增页面节点的方法
export function savepage(data){
   return post(api.pagesave,data)
}
//删除页面
export function deletepage(id){
   return get(api.pagedelete,{id:id})
}
//更新页面节点
export function updatepage(data){
   return post(api.pageupdate,data)
}
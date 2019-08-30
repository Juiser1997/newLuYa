import api from './api'
import {post, get} from './axios'
//获取系统用户列表
export function userList(data){
    return get(api.userList,data)
}
//删除用户
export function deleteUser(id){
    return get(api.deleteUser,{id:id})
}
//修改用户信息
export function updateUser(data){
    return post(api.updateUser,data)
}
//修改用户密码 
export function updateUserPassword(data){
    return post(api.editPassword,data)
}
//新增用户
export function addUser(data){
    return post(api.addUser,data)
}
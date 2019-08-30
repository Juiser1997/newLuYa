import api from './api'
import {post, get} from './axios'

//获取角色列表
export function rolelist(){
    return get(api.rolelist,{});
}
// 新增角色
export function addrole(data){
    return post(api.addrole,data)
}
//删除角色
export function deleterole(id){
    return get(api.deleterole,{id:id})
}
//修改角色名
export function modifytole(data){
    return post(api.modifyrole,data)
}
//获取可选页面权限
export function rolegetpage(id){
    return get(api.rolegetpage,{roleId:id})
}
//获取可选接口权限
export function rolegetmenu(id){
    return get(api.rolegetmenu,{roleId:id})
}
//保存页面选中
export function saverolepage(data){
    return post(api.saverolepage,data)
}
//取消页面选中
export function deleterolepage(id){
    return get(api.deleterolepage,{id:id})
}
//保存接口权限
export function saverolemenu(data){
    return post(api.saverolemenu,data);
}
//取消接口权限
export function deleterolemenu(id){
    return get(api.deleterolemenu,{id:id})
}
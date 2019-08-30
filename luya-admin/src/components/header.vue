<template>
    <div class="header_container">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{path:'/manage'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in $route.meta.title" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="roleId == '0'" command="systemA">超级管理系统</el-dropdown-item>
                <el-dropdown-item v-if="roleId == '0'" command="systemB">运营管理系统</el-dropdown-item>
                <el-dropdown-item v-if="roleId == '0'" command="systemC">大咖管理系统</el-dropdown-item>
                <el-dropdown-item command="signout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
import axios from 'axios';
import qs from 'qs'
import {setCookie,getCookie,delCookie} from '@/api/axios';
import {signout,href} from '@/api/api';
export default {
    data(){
        return {
            username:'',
            account:'',
            roleId:''
        }
    },
    created(){
        let data = JSON.parse(getCookie("infodata"));
        this.username = data.name;
        this.account = data.account;
        this.roleId=data.roleId;
    },
    methods:{
        handleCommand(command){
            let system = getCookie('systemId');
            let data = {
                token_ : getCookie('token_'),
                check_code :getCookie('check_code'), 
            }
            if(command == 'signout'){
                axios.post(signout,qs.stringify(data)).then(res=>{
                    if(res.data.code){
                        delCookie("check_code");
                        delCookie("token_");
                        delCookie("token");
                        delCookie("infodata"); 
                        delCookie('systemId');
                        delCookie('routerList');
                        this.$router.push('/');
                    }
                })
            }else  if(command == 'systemA'){
                if(system == '1'){
                    this.$message.warning("已经处于当前系统！")
                    return;
                }
                setCookie('systemId','1',7);
                this.$router.push('/manage');
                location.reload();
            }else if(command == 'systemB'){
                if(system == '2019052113553137390'){
                    this.$message.warning("已经处于当前系统！");
                    return;
                }
                setCookie('systemId','2019052113553137390',7);
                this.$router.push('/manage');
                location.reload();
            }else if(command == 'systemC'){
                if(system == '2019052717054073780'){
                    this.$message.warning("已经处于当前系统！");
                    return;
                }
                setCookie('systemId','2019052717054073780',7);
                this.$router.push('/manage');
                location.reload();
            }
        },
    }
}
</script>
<style scoped>
	.header_container{background-color: #EFF2F7;height: 60px;display: flex;justify-content: space-between;align-items: center;padding:0 40px 0 20px;}
	.el-dropdown-menu__item{text-align: center;}
</style>

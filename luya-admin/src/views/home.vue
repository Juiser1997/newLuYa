<template>
    <div>
        <head-top></head-top>
        <div class="welcome">
            欢迎来到路亚帮小程序{{systemName}}
        </div>
        <el-row>
            <el-col :span="12" class="account" >
                <el-card class="box-card" v-if="user.roleId == 'master' ||　user.roleId == '2019080214444277130' || user.roleId == '2019080214441887640' ">
                    <div slot="header" class="clearfix">
                        <span>用户信息</span>
                        <el-tooltip class="item" effect="dark" content="初次登录，请修改您的账号信息" placement="top-end">
                            <el-button style="float: right; padding: 3px 0;margin:0;" @click="edit" type="text">修改信息</el-button>
                        </el-tooltip>
                    </div>
                    <div class="text item">用户姓名:{{user.name}}</div>
                    <div class="text item">用户账号:{{user.account}}</div>
                    <div class="text item">用户角色:
                        <span v-if="user.roleId == 'master'">大咖</span>
                        <span v-if="user.roleId == '2019080214444277130'">商家</span>
                        <span v-if="user.roleId == '2019080214441887640'">品牌商</span>
                    </div>
                    <div class="text item">用户电话:{{user.phone}}</div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="用户信息修改" :visible.sync="dialogpassVisible" width="40%" modal-append-to-body>
            <el-form :model="form">
                <el-form-item label="账号修改" :label-width="formLabelWidth">
                    <el-input v-model="form.account" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码修改" :label-width="formLabelWidth">
                    <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogpassVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitpass">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import headTop from '@/components/header';
import {setCookie,getCookie} from '@/api/axios';
import {updateUser} from '@/api/user';
import md5 from 'js-md5';
export default {
    components:{headTop}, 
    data(){
        return{
            systemName:'',
            user:{},
            form:{
                id:'',
                account:'',
                password:''
            },
            dialogpassVisible:false,
            formLabelWidth:'100px',
        }
    },
    created(){
        let data = JSON.parse(getCookie("infodata"));
        this.user = data;
        this.form.account = data.account;
        this.form.id = data.userId;
        if(data == null){
            this.$router.push('/');
            return 
        }
        let system = getCookie('systemId');
        console.log(system)
        if(system == '1'){
            this.systemName = '超级管理系统'
        }else if(system == '2019052113553137390'){
            this.systemName = '运营系统'
        }else if(system == '2019052717054073780'){
            this.systemName = '大咖系统'
        }else if(system == '2019080214590375090'){
            this.systemName = '品牌商系统'
        }else if(system == '2019080214591435420'){
            this.systemName = '商家系统'
        }
    },
    methods:{
        edit(){
            this.dialogpassVisible = true;
        },
        submitpass(){
            let data = this.form;
            data.password = md5(this.form.password);
            updateUser(data).then(res=>{
                if(res.code == 200){
                    this.$message.success('修改成功,即将退出重新登录');
                    this.dialogpassVisible = false;
                }
            })  
            setTimeout(() => { 
                this.$router.push('/')
            }, 1500);       
        },
        test(){
            this.$router.push('/test')
        }

    },
    // computed : {
    //     userInfo(){
    //         // 这里我们获取state的数据进行渲染
    //         let data = this.$store.state.userInfo;
    //         this.form.account = data.account;
    //         this.form.id = data.userId;
    //         return data;
    //     }
    // }
}
</script>
<style scoped>
    .welcome{text-align: center;font-size: 30px;padding: 50px 0;font-weight: bold;color:#20a0ff;}
    .account{margin: 25px 100px;}
    .text {font-size: 14px;}
    .item {margin-bottom: 18px;}
    .clearfix:before,.clearfix:after {display: table;content: "";}
    .clearfix:after {clear: both}
    .box-card{width: 480px;}
</style>

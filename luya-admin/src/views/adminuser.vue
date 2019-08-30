<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row>
                    <el-col :span="18" class="user-table">
                        <el-table :data="userlist" fit>
                            <el-table-column fixed prop="name" label="用户名" width="100"></el-table-column>
                            <el-table-column  label="账号权限名" width="100">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.roleId ==='0'">超级管理员</span>
                                    <span v-if="scope.row.roleId === 'master'">大咖</span>
                                    <span v-if="scope.row.roleId === '2019062611323672620'">运营</span>
                                    <span v-if="scope.row.roleId === '2019080214441887640'">品牌商</span>
                                    <span v-if="scope.row.roleId === '2019080214444277130'">商家</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="phone" label="电话号码" width="150"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button @click="addpowe(scope.row)" type="success" size="small">添加角色</el-button>
                                    <el-button @click="editPass(scope.row)" type="info" size="small">密码修改</el-button>
                                    <el-button @click="Edit(scope.row)" type="warning" size="small">修改</el-button>
                                    <el-button @click="Delete(scope.row)" type="danger" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="block">
                            <el-pagination
                                @current-change="handleUserCurrentChange"
                                background 
                                layout="total,prev,pager,next"
                                :page-size='7' 
                                :total="total">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                <el-col :span="18" class="user-form">
                    <el-form :model="User" :inline="true">
                            <el-col :span="24">
                                <el-form-item label="用户名" label-width="70px">
                                    <el-input v-model="User.name" placeholder="请输入用户名"></el-input>
                                </el-form-item>
                                <el-form-item label="用户账号" label-width="70px">
                                    <el-input v-model="User.account" placeholder="请输入账号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="密码" label-width="70px">
                                    <el-input v-model="User.password" placeholder="请输入密码"></el-input>
                                </el-form-item>
                                <el-form-item label="手机号" label-width="70px">
                                    <el-input v-model="User.phone" placeholder="请输入手机号"></el-input>
                                </el-form-item> 
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmit">新增用户</el-button>
                                </el-form-item>
                            </el-col>
                    </el-form>
                </el-col>
                </el-row>
                <el-dialog title="用户信息编辑" :visible.sync="dialogFormVisible" width="40%" modal-append-to-body>
                    <el-form :model="form">
                        <el-form-item label="用户名" :label-width="formLabelWidth">
                            <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="账号名" :label-width="formLabelWidth">
                            <el-input v-model="form.account" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="电话号码" :label-width="formLabelWidth">
                            <el-input v-model="form.phone" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submit">确 定</el-button>
                    </div>
                </el-dialog>
                <el-dialog title="用户密码修改" :visible.sync="dialogpassVisible" width="40%" modal-append-to-body>
                    <el-form :model="form">
                        <el-form-item label="密码修改" :label-width="formLabelWidth">
                            <el-input v-model="form.password" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogpassVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitpass">确 定</el-button>
                    </div>
                </el-dialog>
                <el-dialog title="角色列表" :visible.sync="dialogpowerVisible" width="60%" modal-append-to-body>
                    <el-table :data="powerlist" fit highlight-current-row @current-change="handleCurrentChange">
                        <el-table-column fixed prop="id" label="ID" width="200"></el-table-column>
                        <el-table-column prop="name" label="用户名" width="100"></el-table-column>
                        <el-table-column prop="remark" label="权限说明" width="400"></el-table-column>
                    </el-table>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogpowerVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitpass">确 定</el-button>
                    </div>
                </el-dialog>
            </el-main>
        </el-container>
    </div>

</template>

<script>
import {userList,addUser,deleteUser,updateUser,updateUserPassword} from '@/api/user';
import {rolelist} from '@/api/powe'
import {clear} from '@/util/util';
import md5 from 'js-md5';
import headTop from '@/components/header';
export default {
    components:{headTop},
    data(){
        return{
            userlist:[],
            User:{
                name:'',
                account:'',
                password:'',
                phone:''
            },
            form:{
                id:'',
                name:'',
                account:'',
                phone:'',
                password:''
            },
            formLabelWidth:'80px',
            dialogFormVisible:false,
            dialogpassVisible:false,
            dialogpowerVisible:false,
            powerlist:[],
            userid:'',
            currentPage:1,
            total:0
        }
    },
    created(){
        this.getUserlist()
    },
    methods:{
        getUserlist(){
            let data = {currentPage:this.currentPage,pageSize:7}
            userList(data).then(res=>{
                this.userlist = res.data.items;
                this.total = res.data.totalNum;
            })
        },
        handleUserCurrentChange(val){
            let data = {currentPage:val,pageSize:7}
            userList(data).then(res=>{
                this.userlist = res.data.items;
                this.currentPage = val;
                this.total = res.data.totalNum;
            })    
        },
        //新增用户
        onSubmit(){
            let data = this.User;
            data.password = md5(this.User.password)
            if(data.name == '' && data.account == '' && data.password == ''){
                return this.$message.error('请确保每一项都输入了值');
            }
            addUser(data).then(res=>{
                this.$message.success('新增用户成功');
                this.getUserlist();
                for(let k in data){//把每一项的值变成空
                    data[k] = ''
                };
                this.User = data;
            })
        },
        //删除用户
        Delete(e){
            this.$confirm("是否删除此用户？","提示",{
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                deleteUser(e.id).then(res=>{
                    this.$message.success('删除用户成功');
                    this.getUserlist();
                })
            }).catch(() => {
                return false;
            })
        },
        //修改用户信息
        Edit(e){
            this.dialogFormVisible = true;
            this.form.id = e.id
        },
        submit(){
            let data = this.form
            clear(data);
            updateUser(data).then(res=>{
                this.$message.success('修改用户信息成功');
                this.dialogFormVisible = false;
                this.getUserlist();
            })
        },
        editPass(e){
            this.dialogpassVisible = true;
            this.form.id = e.id
        },
        submitpass(){
            let data = {id:this.form.id,password:md5(this.form.password)}
            updateUserPassword(data).then(res=>{
                this.$message.success('修改用户密码成功');
                this.dialogpassVisible = false;
            })
        },
        addpowe(e){
            this.dialogpowerVisible = true;
            this.userid = e.id;
            rolelist().then(res=>{
                this.powerlist = res.data;
            })
        },
        handleCurrentChange(val){
            let data = {
                id:this.userid,
                roleId:val.id,
            }
            updateUser(data).then(res=>{
                this.$message.success('修改用户信息成功');
                this.dialogpowerVisible = false;
            })
        }   
    }
}
</script>
<style scoped>
.user-table{box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding: 15px;}
.user-form{margin-top: 45px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)}
.el-form{padding-left:25px;padding-top: 22px;}
.el-form--inline .el-form-item__label{ width: 70px;}
.user-btn>.el-form-item{float: right;}
</style>

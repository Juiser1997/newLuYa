<template>  
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row>
                    <el-col :span="20" class="sql-table">
                        <el-table :data="sqllist" style="width: 100%" class="box">
                            <el-table-column prop="remark" label="标识" width="150"></el-table-column>
                            <el-table-column prop="tableName" label="表名" width="150"></el-table-column>
                            <el-table-column label="操作" width="300">
                                <template slot-scope="scope">
                                    <el-button @click="Edit(scope.row)"  type="primary" size="small">修改</el-button>
                                    <el-button @click="Delete(scope.row)"  type="danger" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="block">
                            <el-pagination
                                @current-change="handleCurrentChange"
                                background 
                                layout="prev, pager, next"
                                :total="total">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                <el-col :span="20" class="sql-form">
                        <el-form :model="form" :inline="true">
                        <el-form-item>
                            <el-input v-model="form.remark" placeholder="输入标识"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="form.tableName" placeholder="输入表名"></el-input>
                        </el-form-item>
                            <el-form-item>
                            <el-input v-model="form.sqls" placeholder="输入sql"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">新增sql设置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                </el-row>
            </el-main>
            <!--  -->
            <el-dialog title="修改sql信息" :visible.sync="dialogpowerVisible" width="60%" modal-append-to-body>
                <el-form :model="sql">
                    <el-form-item label="用户名" :label-width="formLabelWidth">
                        <el-input v-model="sql.remark" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="表名" :label-width="formLabelWidth">
                        <el-input v-model="sql.tableName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="sql指令" :label-width="formLabelWidth">
                        <el-input v-model="sql.sqls" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogpowerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitsql">确 定</el-button>
                </div>
            </el-dialog>
        </el-container>   
    </div>
</template>
<script>
import {sqlList,sqldelete,sqlupdate,sqlsave} from '@/api/apiconfig';
import {clear} from '@/util/util';
import headTop from '@/components/header';
export default {
    components:{headTop},
    data(){
        return{
            sqllist:[],
            total:null,
            currentPage:1,
            form:{
                remark:'',
                tableName:'',
                sqlName:'list',
                sqls:''
            },
            dialogpowerVisible:false,
            formLabelWidth:'80px',
            sql:{
                id:'',
                remark:'',
                tableName:'',
                sqls:''
            }
        }

    },
    created(){
        this.getsqllist()
    },
    methods:{
        getsqllist(){
            let data = {currentPage:this.currentPage,pageSize:10}
            sqlList(data).then(res=>{
                this.sqllist = res.data.items;
                this.total = res.data.totalNum;
            })
        },
        handleCurrentChange(val){
            this.currentPage = val;
            let data = {currentPage:val,pageSize:10}
            sqlList(data).then(res=>{
                this.sqllist = res.data.items;
                this.total = res.data.totalNum;
            })
        },  
        Edit(e){
            this.dialogpowerVisible=true;
            this.sql.id = e.id;
        },
        Delete(e){
            this.$confirm('此操作将删除该条sql, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                sqldelete(e.id).then(res=>{
                    this.$message.success('删除成功');
                    this.getsqllist();
                })
            }).catch(() => {
                return false;
            });
        },
        onSubmit(){
            let data = this.form;
            for(let k in data){
                if(data[k]==''){
                   return this.$message.warning('请检查是否有空值的项');
                }
            };
            sqlsave(data).then(res=>{
                this.$message.success('保存成功');
                this.getsqllist();
            })
        },
        submitsql(){
            let data = this.sql;
            clear(data);
            sqlupdate(data).then(res=>{
                this.$message.success('修改成功');
                this.dialogpowerVisible=false;
                this.getsqllist();
            })
        }
    }
}
</script>
<style scoped>
.sql-table{box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding: 20px;}
.sql-form{margin-top: 45px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)}
.el-form{padding-left:25px;}
.el-form .el-form-item{ margin-top: 22px;}
</style>

<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row>
                    <el-col :span="24" class="sql-table">
                        <el-table :data="clist" style="width: 100%" class="box">
                            <el-table-column prop="id" label="ID" width="150"></el-table-column>
                            <el-table-column prop="value" label="值" width="450"></el-table-column>
                            <el-table-column prop="remark" label="备注" width="250"></el-table-column>
                            <el-table-column label="操作" width="150">
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
                <el-col :span="24" class="sql-form">
                        <el-form :model="form" :inline="true">
                        <el-form-item>
                            <el-input v-model="form.id" placeholder="输入id"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="form.value" placeholder="输入值"></el-input>
                        </el-form-item>
                            <el-form-item>
                            <el-input v-model="form.remark" placeholder="输入备注"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">新增系统配置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                </el-row>
            </el-main>
            <!--  -->
            <el-dialog title="修改sql信息" :visible.sync="dialogpowerVisible" width="60%" modal-append-to-body>
                <el-form :model="config">
                    <el-form-item label="值" :label-width="formLabelWidth">
                        <el-input v-model="config.value" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="formLabelWidth">
                        <el-input v-model="config.remark" autocomplete="off"></el-input>
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
import headTop from '@/components/header';
import {configlist,configsave,configupdate,configdelete} from '@/api/system';
import {clear} from '@/util/util';
export default {
    components:{headTop},
    data(){
        return{
            clist:[],
            total:null,
            currentPage:1,
            form:{
                id:'',
                value:'',
                remark:'',
            },
            dialogpowerVisible:false,
            formLabelWidth:'80px',
            config:{
                id:'',
                value:'',
                value:'',
            }
        }

    },
    created(){
        this.getconfiglist()
    },
    methods:{
        getconfiglist(){
            let data = {currentPage:this.currentPage,pageSize:7}
            configlist(data).then(res=>{
                this.clist = res.data.items;
                this.total = res.data.totalNum;
            })
        },
        handleCurrentChange(val){
            this.currentPage = val;
            let data = {currentPage:val,pageSize:7}
            configlist(data).then(res=>{
                this.clist = res.data.items;
                this.total = res.data.totalNum;
            })
        },  
        Edit(e){
            this.dialogpowerVisible=true;
            this.config.id = e.id;
        },
        Delete(e){
            this.$confirm('此操作将删除该条配置, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                configdelete(e.id).then(res=>{
                    this.$message.success('删除成功');
                    this.getconfiglist()
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
            configsave(data).then(res=>{
                this.$message.success('保存成功');
                this.getconfiglist()
            })
        },
        submitsql(){
            let data = this.config;
            clear(data);
            configupdate(data).then(res=>{
                this.$message.success('修改成功');
                this.dialogpowerVisible=false;
                this.getconfiglist()
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


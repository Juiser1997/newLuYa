<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row>
                    <el-col :span="24">
                        <el-table :data="menulist" style="width: 100%" class="box">
                            <el-table-column prop="name" label="接口功能" width="150"></el-table-column>
                            <el-table-column prop="path" label="接口路径" width="150"></el-table-column>
                            <el-table-column label="操作" width="300">
                                <template slot-scope="scope">
                                    <el-button @click="Edit(scope.row)"  type="primary" size="small" v-if="scope.row.path != ''">编辑</el-button>
                                    <el-button @click="Find(scope.row)"  type="success" size="small" v-if="scope.row.path != ''">查看</el-button>
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
            </el-main>
            <!--添加接口说明信息弹窗-->
            <el-dialog title="填写接口参数信息" :visible.sync="dialogFormVisible" width="40%" modal-append-to-body>
                <el-form :model="form">
                    <el-form-item label="名字" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off" placeholder="输入接口英文名"></el-input>
                    </el-form-item>
                    <el-form-item label="标记" :label-width="formLabelWidth">
                        <el-input v-model="form.remark" autocomplete="off" placeholder="输入接口中文标记"></el-input>
                    </el-form-item>
                    <el-form-item label="格式" :label-width="formLabelWidth">        
                        <el-select v-model="form.type" placeholder="选择接口查询的数据格式">
                            <el-option label="整形" value="Integer"></el-option>
                            <el-option label="长整形" value="Longer"></el-option>
                            <el-option label="字符串" value="String"></el-option>
                            <el-option label="日期" value="Date"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </div>
            </el-dialog>
            <!--添加接口说明信息弹窗-->
            <el-dialog v-bind:title="title+'接口的信息'" :visible.sync="dialogFindVisible" width="40%" modal-append-to-body>
                <el-table :data="paramlist" style="width: 100%" class="box">
                    <el-table-column prop="name" label="参数名" width="100"></el-table-column>
                    <el-table-column prop="remark" label="解释说明" width="150"></el-table-column>
                    <el-table-column prop="type" label="参数类型" width="100"></el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click="Delete(scope.row)"  type="danger" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFindVisible = false">取 消</el-button>
                </div>
            </el-dialog>
        </el-container>
    </div>
</template>
<script>
import headTop from '@/components/header';
import {menupagelist,menuparamlist,menuparamsave,menuparamdelete} from '@/api/apiconfig';
export default {
    components:{headTop},
    data(){
        return{
            menulist:[],
            total:null,
            currentPage:1,
            form:{
                menuId:'',
                name:'',
                remark:'',
                type:''
            },
            dialogFormVisible:false,
            dialogFindVisible:false,
            formLabelWidth:'80px',
            paramlist:[],
            title:'',
            aId:''
        }

    },
    created(){
        this.getmenulist()
    },
    methods:{
        getmenulist(){
            let data = {currentPage:this.currentPage,pageSize:10}
            menupagelist(data).then(res=>{
                this.menulist = res.data.items;
                this.total = res.data.totalNum;
            })
        },
        handleCurrentChange(val){
            this.currentPage = val;
            let data = {currentPage:val,pageSize:10}
            menupagelist(data).then(res=>{
                this.menulist = res.data.items;
                this.total = res.data.totalNum;
            })
        },
        Edit(e){
            this.dialogFormVisible = true;
            this.form.menuId = e.id;
        },
        //保存信息
        submit(){
            let data = this.form;
            for(let k in data){
                if(data[k]==''){
                    return this.$message.success('请确保每一项都输入了值');
                }
            };
            console.log(data)
            menuparamsave(data).then(res=>{
                this.$message.success('提交成功');
                this.dialogFormVisible = false;
            })
        },
        //查看信息
        Find(e){
            this.title = e.name;
            this.dialogFindVisible = true;
            this.aId = e.id;
            menuparamlist(e.id).then(res=>{
                this.paramlist = res.data.items;
            })
        },
        Delete(e){
            menuparamdelete(e.id).then(res=>{
                this.$message.success('删除成功');
                menuparamlist(this.aId).then(res=>{
                    this.paramlist = res.data.items;
                })
            })
        }
        
    }
}
</script>

<style scoped>
.box{max-height: 700px;overflow-y: auto;}
.demo-table-expand {font-size: 0;}
.demo-table-expand label {width: 90px;color: #99a9bf;}
.demo-table-expand .el-form-item {margin-right: 0;margin-bottom: 0;width: 50%;}
.icon-img{width: 165px;height: 120px;}
</style>

<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row>
                    <el-col :span="20" class="sql-table">
                        <el-table :data="systemlist" style="width: 100%" class="box">
                            <el-table-column prop="name" label="系统名" width="150"></el-table-column>
                            <el-table-column prop="id" label="系统ID" width="250"></el-table-column>
                            <el-table-column label="操作" width="300">
                                <template slot-scope="scope">
                                    <el-button @click="Setting(scope.row)"  type="primary" size="small">设置权限</el-button>
                                    <el-button @click="Edit(scope.row)"  type="warning" size="small">修改</el-button>
                                    <el-button @click="Delete(scope.row)"  type="danger" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20" class="sql-form">
                            <el-form :model="form" :inline="true">
                            <el-form-item>
                                <el-input v-model="form.name" placeholder="输入系统名"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">新增系统</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="warning" @click="reFrush">刷新系统</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>                                  
                <el-dialog title="页面权限" :visible.sync="dialogTableVisible">
                    <el-tree 
                        :data="pagedata" 
                        show-checkbox 
                        node-key="id" 
                        :default-expanded-keys="node" 
                        :default-checked-keys="checknode" 
                        :props="defaultProps" 
                        ref="tree"  
                        @check="handleCheckChange" 
                        @node-expand="handsysExpand"
                        @node-collapse="handsysCollapse"
                        :check-strictly="true">
                    </el-tree>
                </el-dialog>
            </el-main>
            <!--  -->
            <el-dialog title="修改系统名" :visible.sync="dialogpowerVisible" width="60%" modal-append-to-body>
                <el-form :model="system">
                    <el-form-item label="用户名" :label-width="formLabelWidth">
                        <el-input v-model="system.name" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogpowerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </div>
            </el-dialog>
        </el-container> 
    </div>
</template>

<script>
import headTop from '@/components/header';
import {systemlist,systemupdate,systemdelete,systemsave,systempage,savesystempage,reducesystempage,refrush} from '@/api/system';
export default {
    components:{headTop},
    data(){
        return{
            systemlist:[],
            form:{
                name:'',
            },
            dialogpowerVisible:false,
            formLabelWidth:'80px',
            system:{
                name:'',
                id:'',
            },
            pagedata:[],
            dialogTableVisible:false,
            checknode:[],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            systemid:'',
            node:['0'],
        }

    },
    created(){
        this.getsystemlist()
    },
    methods:{
        getsystemlist(){
            systemlist().then(res=>{
                this.systemlist = res.data;
            })
        },
        Setting(e){
            this.systemid = e.id;
            this.getPage(e.id)
        },
        getPage(id){
            systempage(id).then(res=>{
                let data = res.data;
                let nodecheck = [];
                for(let i in data){
                    if(data[i].checked == 'true' && i>0){
                        nodecheck.push(data[i].id)
                    }
                    data[i].children = [];
                    if(data[i].pId == 0 && data[i].pId!=''){
                        data[0].children.push(data[i])
                    }
                    for(let j in data[0].children){
                        if(data[0].children[j].id == data[i].pId){
                            data[0].children[j].children.push(data[i])
                        }
                    }
                }
                this.pagedata = [data[0]];
                this.dialogTableVisible = true;
                this.checknode = nodecheck;
            })            
        },
        // 处理展开的问题
        handsysExpand(row){
            this.node.push(row.id.toString())
        },
        handsysCollapse(row){
            let mnode = this.node;
            for(let k in mnode){
                if(row.id.toString() == mnode[k]){
                    mnode.splice(k,1)
                }
            }
            mnode = this.node;
        },
        handleCheckChange: function() {
            let selectedData = this.$refs.tree.getCheckedKeys().filter(_ => _);
            let difference = this.checknode.concat(selectedData).filter(v => !this.checknode.includes(v) || !selectedData.includes(v))
            if(selectedData.length > this.checknode.length){
                    //新增 
                    for(let key in difference ){
                        savesystempage({systemId:this.systemid,pageId:difference[key]}).then(res=>{
                            this.checknode = selectedData;
                            this.$message.success('权限设置成功,刷新页面,左侧菜单更新');
                            this.getPage(this.systemid)
                        })
                    }  
            }else{
                    for(let key in difference ){
                        let id =  this.$refs.tree.getNode(difference[key]).data.srpId;
                        if(id!=null){
                            reducesystempage(id).then(res=>{
                                this.checknode = selectedData;
                                this.$message.success('权限设置成功');
                                this.getPage(this.systemid)
                            }) 
                        }
                    } 
            }
        },
        Edit(e){
            this.dialogpowerVisible=true;
            this.system.id = e.id;
        },
        Delete(e){
            this.$confirm('此操作将删除该系统, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                systemdelete(e.id).then(res=>{
                    this.$message.success('删除成功');
                    this.getsystemlist();
                })
            }).catch(() => {
                return false;
            });
        },
        //新增系统
        onSubmit(){
            let data = this.form;
            if(data.name == ''){
                return this.$message.errot('请输入系统名');
            }
            systemsave(data).then(res=>{
                this.$message.success('保存成功');
                this.getsystemlist()
            })
        },
        //修改用户信息
        submit(){
            let data = this.system;
            if(data.name == ''){
                return this.$message.error('请输入系统名');
            }
            systemupdate(data).then(res=>{
                this.$message.success('修改成功');
                this.dialogpowerVisible=false;
                this.getsystemlist()
            })
        },
        //刷新系统
        reFrush(){
            refrush().then(res=>{
                if(res.code == 200){
                    return this.$message.success('刷新系统成功');
                }
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

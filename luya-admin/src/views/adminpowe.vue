<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row>
                    <el-col :span="18" class="powe-table">
                        <el-table :data="powelist" fit>
                            <el-table-column fixed prop="name" label="角色名" width="100"></el-table-column>
                            <el-table-column prop="remark" label="权限说明"></el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button @click="handlePage(scope.row)" type="success" size="small">页面权限</el-button>
                                    <el-button @click="handleSql(scope.row)" type="info" size="small">接口权限</el-button>
                                    <el-button @click="Edit(scope.row)" type="warning" size="small">修改</el-button>
                                    <el-button @click="Delete(scope.row)" type="danger" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-row>
                <el-col :span="18" class="powe-form">
                    <el-form :model="power" :inline="true">
                        <el-form-item label="角色名">
                            <el-input v-model="power.name" placeholder="新角色的名字"></el-input>
                        </el-form-item>
                        <el-form-item label="权限">
                            <el-input v-model="power.remark" placeholder="对角色的说明"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">新增角色</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                </el-row>
                <el-dialog title="页面权限" :visible.sync="dialogTableVisible">
                    <el-tree 
                        :data="pagedata" 
                        show-checkbox 
                        node-key="id" 
                        :default-expanded-keys="pnode" 
                        :default-checked-keys="checknode" 
                        :props="defaultProps" 
                        ref="tree"  
                        @check="handleCheckChange" 
                        @node-expand="handpageExpand"
                        @node-collapse="handpageCollapse"
                        :check-strictly="true">
                    </el-tree>
                </el-dialog>
                <el-dialog title="接口权限" :visible.sync="dialogVisible">
                    <el-tree 
                        :data="menudata" 
                        show-checkbox node-key="id" 
                        :default-expanded-keys="node" 
                        :default-checked-keys="menuchecknode" 
                        :props="defaultProps" 
                        ref="Mtree"  
                        @check="CheckChange" 
                        :check-strictly="true"
                        @node-expand="handmenuExpand"
                        @node-collapse="handmenuCollapse">
                    </el-tree>
                </el-dialog>
            </el-main>
        </el-container>  
    </div>
</template>

<script>
import headTop from '@/components/header';
import {rolelist,addrole,deleterole,modifytole,rolegetpage,rolegetmenu,saverolepage,saverolemenu,deleterolepage,deleterolemenu} from '@/api/powe'
import { setTimeout } from 'timers';
  export default {
    components:{headTop},
    data() {
      return {
        powelist:[],
        power:{
            pId:'1',
            name:'',
            remark:'',
        },
        pagedata:[],
        menudata:[],
        dialogTableVisible:false,
        dialogVisible:false,
        checknode:[],
        menuchecknode:[],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        roleid:'',
        node:['0'],
        pnode:['0'],
      }
    },    
    created(){
        this.getrolelist()
    },
    methods: {
        handlePage(row) {
            this.roleid =row.id;
            this.getPage(row.id)
        },
        handleSql(row){
            this.roleid = row.id;
            this.getMenu(row.id)
        },
        getMenu(id){
            rolegetmenu(id).then(res=>{
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
                this.menudata = [data[0]];
                this.dialogVisible = true;
                this.menuchecknode = nodecheck;
            })
        },
        getPage(id){
            rolegetpage(id).then(res=>{
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
        onSubmit(){
            let data = this.power;
            addrole(data).then(res=>{
                this.$message({type: 'success',message: '新增角色成功'});
                this.getrolelist();
            })
        },
        Edit(row){
            this.$prompt('请输入名字', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                let data = {id:row.id,name:value}
                modifytole(data).then(res=>{
                    this.$message({type: 'success',message: '修改成功'});
                    this.getrolelist();
                })
            }).catch(() => {
                this.$message({type: 'info', message: '取消输入'});       
            });
        },
        Delete(row){
            let id = row.id;
            this.$confirm('此操作将永久删除改角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleterole(id).then(res=>{
                    this.$message.success('删除成功');
                    this.getrolelist();
                }) 
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        getrolelist(){
            rolelist().then(res=>{this.powelist = res.data;}) 
        },
        // 处理展开的问题
        handmenuExpand(row){
            this.node.push(row.id.toString())
        },
        handmenuCollapse(row){
            let mnode = this.node;
            for(let k in mnode){
                if(row.id.toString() == mnode[k]){
                    mnode.splice(k,1)
                }
            }
            mnode = this.node;
        },
        handpageExpand(row){
            this.pnode.push(row.id.toString())
        },
        handpageCollapse(row){
            let pmnode = this.pnode;
            for(let k in pmnode){
                if(row.id.toString() == pmnode[k]){
                    pmnode.splice(k,1)
                }
            }
            pmnode = this.pnode;
        },
        // 接口权限的勾选取消操作
        CheckChange(row){
            let selectedData = this.$refs.Mtree.getCheckedKeys().filter(_ => _);
            let spselectedData = this.$refs.Mtree.getCheckedNodes();
            let difference = this.menuchecknode.concat(selectedData).filter(v => !this.menuchecknode.includes(v) || !selectedData.includes(v));
            if(selectedData.length > this.menuchecknode.length){
                //新增 
                for(let key in difference ){
                    saverolemenu({roleId:this.roleid,menuId:difference[key]}).then(res=>{
                        this.menuchecknode = selectedData;
                        this.$message.success('新增接口权限设置成功');
                        this.getMenu(this.roleid)
                    })
                }  
            }else{
                for(let key in difference ){
                    let id =  this.$refs.Mtree.getNode(difference[key]).data.srpId;
                    deleterolemenu(id).then(res=>{
                        this.menuchecknode = selectedData;
                        this.$message.success('取消接口权限设置成功');
                        this.getMenu(this.roleid)
                    })
                } 
           }
        },
        // 页面权限的勾选取消操作
        handleCheckChange: function() {
           let selectedData = this.$refs.tree.getCheckedKeys().filter(_ => _);
           let spselectedData = this.$refs.tree.getCheckedNodes();
           let difference = this.checknode.concat(selectedData).filter(v => !this.checknode.includes(v) || !selectedData.includes(v))
           if(selectedData.length > this.checknode.length){
                //新增 
                for(let key in difference ){
                    saverolepage({roleId:this.roleid,pageId:difference[key]}).then(res=>{
                        this.checknode = selectedData;
                        this.$message.success('新增页面权限设置成功');
                        this.getPage(this.roleid)
                    })
                }  
           }else{
                for(let key in difference ){
                    let id =  this.$refs.tree.getNode(difference[key]).data.srpId;
                    if(id!=null){
                        deleterolepage(id).then(res=>{
                            this.checknode = selectedData;
                            this.$message.success('取消页面权限设置成功');
                            this.getPage(this.roleid)
                        }) 
                    }

                } 
           }
        },
    }
  }
</script>
<style scoped>
.powe-table{box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding: 20px;}
.powe-form{margin-top: 45px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)}
.el-form{padding-left:25px;}
.el-form .el-form-item{ margin-top: 22px;}
</style>

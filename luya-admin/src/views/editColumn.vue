<template>
    <div>
        <head-top></head-top>
        <el-container >
            <el-main class="expand">
                <el-row>
                  <el-col :span="10" class="tree">
                    <div class="title">栏目编辑</div>
                    <el-tree ref="expandMenuList" class="expand-tree"
                        v-if="isLoadingTree"
                        :data="setTree"
                        node-key="id"
                        highlight-current
                        :props="defaultProps"
                        :expand-on-click-node="false"
                        :render-content="renderContent"
                        :default-expanded-keys="node"
                        @node-expand="handExpand"
                        @node-collapse="handCollapse"
                        @node-click="handleNodeClick">
                    </el-tree>
                    <!--新增事件节点分类弹窗-->
                    <el-dialog title="栏目编辑" :visible.sync="dialogFormVisible" width="40%" modal-append-to-body>
                        <el-form :model="form">
                            <el-form-item label="栏目名称" :label-width="formLabelWidth">
                                <el-input v-model="form.name" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="submitPage">确 定</el-button>
                        </div>
                    </el-dialog>
                  </el-col>
                    <el-col :span="10" :offset="2" class="tree">
                        <div class="title">栏目配置</div>
                        <el-tree 
                            :data="setTree" 
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
                    </el-col>
                </el-row>

            </el-main>
        </el-container>
    </div>
</template>

<script>
import headTop from '@/components/header';
import {columnList,columnSave,columnUpdate,columnDelete} from '@/api/new'
import TreeRender from '@/components/tree_render'
export default {
    name:'tree',
    data(){
        return {
            dialogFormVisible:false,
            // maxexpandId: api.maxexpandId,//新增节点开始id
            // non_maxexpandId: api.maxexpandId,//新增节点开始id(不更改)
            isLoadingTree: true,//是否加载节点树
            // setTree: api.treelist,//节点树数据
            setTree: [],//节点树数据
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            form:{
                name:'',//栏目名称
            },
            formLabelWidth: '80px',
            edit:'',//区分状态
            pId:'',
            checknode:[],
            menuchecknode:[],
            node:['0'],
            pnode:['0'],
        }
    },
    components:{headTop},
    methods:{
        initExpand(){
            this.setTree.map((a) => {
                this.defaultExpandKeys.push(a.id)
            });
            this.isLoadingTree = true;
        },
        handleNodeClick(d,n,s){//点击节点
            d.isEdit = false;//放弃编辑状态
        },
        renderContent(h,{node,data,store}){//加载节点
            let that = this;
            return h(TreeRender,{
                props: {
                    DATA: data,
                    NODE: node,
                    STORE: store,
                },
                on: {
                    nodeAdd: ((s,d,n) => that.handleAdd(s,d,n)),
                    nodeEdit: ((s,d,n) => that.handleEdit(s,d,n)),
                    nodeDel: ((s,d,n) => that.handleDelete(s,d,n))
                }
            });
        },
        handleAdd(s,d,n){//增加节点
            if(n.level >=3){
                this.$message.error("最多只支持三级！")
                return false;
            }
            this.dialogFormVisible = true;
            this.edit = 'add';
            this.pId = d.id;
        },
        //提交
        submitPage(){
            if(this.edit == 'add'){
                let data = {
                    pId :this.pId,
                    name : this.form.name,
                }
                columnSave(data).then(res=>{
                    this.$message.success('新增栏目成功');
                    this.dialogFormVisible = false;
                    this.form.name = '';
                    this.getpagelist()
                })
            }else{
                let data = {
                    id:this.pId,
                    name:this.form.name,
                }
                columnUpdate(data).then(res=>{
                    this.$message.success('修改栏目成功');
                    this.dialogFormVisible = false;
                    this.form.name = '';
                    this.getpagelist()
                })
            }

        },
        handleEdit(s,d,n){//编辑节点
            this.dialogFormVisible = true;
            this.edit = 'edit';
            this.pId = d.id;
        },
        handleDelete(s,d,n){//删除节点
            let that = this;
            //有子级不删除
            if(d.children && d.children.length !== 0){
                this.$message.error("此节点有子级，不可删除！")
                return false;
            }else{
                that.$confirm("是否删除此节点？","提示",{
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    columnDelete(d.id).then(res=>{
                        delNode();
                    })
                }).catch(() => {
                    return false;
                })
                let delNode = () => {
                    let list = n.parent.data.children || n.parent.data,//节点同级数据
                    _index = 99999;//要删除的index
                    list.map((c,i) => {
                        if(d.id == c.id){
                            _index = i;
                        }
                    })
                    let k = list.splice(_index,1);
                    this.$message.success("删除栏目成功！")
                }
            }
        },
        getpagelist(){//获取页面列表
            columnList().then(res=>{
                let data = res.data;
                let arr = [];
                let nodecheck = [];
                for(let i in data){
                    data[i].isEdit = false;
                    if(data[i].level<3){
                        data[i].children = [];
                    }
                    if(data[i].level === 1){
                        arr.push(data[i]);
                    }
                    if(data[i].remark === '1'){
                        nodecheck.push(data[i].id)
                    }
                }
                for(let j in arr ){
                    for(let a in data){
                        if(arr[j].id === data[a].pId){
                            arr[j].children.push(data[a])
                        }
                    }
                }
                for(let c in arr){
                    for(let i in arr[c].children){
                        for(let j in data){
                            if(arr[c].children[i].id === data[j].pId){
                                arr[c].children[i].children.push(data[j])
                            }
                        }
                    }
                }
                this.setTree = arr;
                this.checknode = nodecheck;
            })
        },
        handExpand(row){
            this.node.push(row.id.toString())
        },
        handCollapse(row){
            let mnode = this.node;
            for(let k in mnode){
                if(row.id.toString() == mnode[k]){
                    mnode.splice(k,1)
                }
            }
            mnode = this.pnode;
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
        // 页面权限的勾选取消操作
        handleCheckChange: function() {
           let selectedData = this.$refs.tree.getCheckedKeys().filter(_ => _);
           let spselectedData = this.$refs.tree.getCheckedNodes();
           let difference = this.checknode.concat(selectedData).filter(v => !this.checknode.includes(v) || !selectedData.includes(v))
           if(selectedData.length > this.checknode.length){
                //新增 
                console.log(difference)
                for(let key in difference ){
                    let data = {remark:'1',id:difference[key]}
                    columnUpdate(data).then(res=>{
                        this.checknode = selectedData;
                        this.$message.success('添加栏目成功');
                        this.getpagelist()
                    })
                }  
           }else{
                for(let key in difference ){
                        let data = {remark:'0',id:difference[key]};
                        columnUpdate(data).then(res=>{
                            this.checknode = selectedData;
                            this.$message.success('取消栏目成功');
                            this.getpagelist()
                        })
                } 
           }
        },
    },
    created(){
        this.getpagelist()
    }
}
</script>
<style scoped>
.expand{
    width:100%;
    height:80%;
    overflow:hidden;
}
.el-dialog__body{
    border-bottom:1px solid #48576a;
    border-top:1px solid #48576a;
}
.expand>div::-webkit-scrollbar-track{
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    border-radius:5px;
}
.expand>div::-webkit-scrollbar-thumb{
    background-color:rgba(50, 65, 87, 0.5);
    outline:1px solid slategrey;
    border-radius:5px;
}
.expand>div::-webkit-scrollbar{
    width:10px;
}
.expand-tree{
    border:none;
    margin-top:10px;
}
.expand-tree .el-tree-node.is-current,
.expand-tree .el-tree-node:hover{
    overflow:hidden;
}
.expand-tree .is-current>.el-tree-node__content .tree-btn,
.expand-tree .el-tree-node__content:hover .tree-btn{
    display:inline-block;
}
.expand-tree .is-current>.el-tree-node__content .tree-label{
    font-weight:600;
    white-space:normal;
}
.tree{box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding: 20px;}
.title{color: #303133;padding-bottom: 8px;}
</style>
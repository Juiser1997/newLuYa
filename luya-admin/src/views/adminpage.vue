<template>
    <div>
        <head-top></head-top>
        <el-container >
            <el-main class="expand">
                <el-tree ref="expandMenuList" class="expand-tree"
                    v-if="isLoadingTree"
                    :data="setTree"
                    node-key="id"
                    highlight-current
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    :render-content="renderContent"
                    :default-expanded-keys="['0']"
                    @node-click="handleNodeClick">
                </el-tree>
                <!--新增事件节点分类弹窗-->
                <el-dialog title="页面编辑" :visible.sync="dialogFormVisible" width="40%" modal-append-to-body>
                    <el-form :model="form">
                        <el-form-item label="页面名称" :label-width="formLabelWidth">
                            <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="页面路径" :label-width="formLabelWidth">
                            <el-input v-model="form.path" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitPage">确 定</el-button>
                    </div>
                </el-dialog>
            </el-main>
        </el-container>
        <!-- <demo :msg='msgData' :math='mathData'></demo> -->
    </div>
</template>

<script>
import headTop from '@/components/header';
import Demo from '@/components/demo';
import {getPagelist,savepage,deletepage, updatepage} from '@/api/page'
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
                name:'',
                path:'',
            },
            formLabelWidth: '80px',
            edit:'',
            pId:'',
            msgData:'我是你的爸爸',
            mathData:10,
        }
    },
    components:{headTop,Demo},
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
            // //添加数据
            // d.children.push({
            //     id: ++this.maxexpandId,
            //     name: this.form.name,
            //     pid: d.id,
            //     isEdit: false,
            //     path:this.form.path,
            //     children: []
            // });
            // //展开节点
            // if(!n.expanded){
            //     n.expanded = true;
            // }
        },
        submitPage(){
            if(this.edit == 'add'){
                let data = {
                    pId :this.pId,
                    name : this.form.name,
                    path : this.form.path,
                }
                savepage(data).then(res=>{
                    this.$message.success(res.msg);
                    this.dialogFormVisible = false;
                    this.form.name = '';
                    this.form.path = '';
                    this.getpagelist();
                })
            }else{
                let data = {
                    id:this.pId,
                    name:this.form.name,
                    path:this.form.path,
                }
                for(let key in data){
                    if(data[key]== ''){
                        delete data[key]
                    }
                }
                updatepage(data).then(res=>{
                    this.$message.success(res.msg);
                    this.dialogFormVisible = false;
                    this.form.name = '';
                    this.form.path = '';
                    this.getpagelist();
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
                    deletepage(d.id).then(res=>{
                        delNode();
                    })
                }).catch(() => {
                    return false;
                })
                let delNode = () => {
                    let list = n.parent.data.children || n.parent.data,//节点同级数据
                    _index = 99999;//要删除的index
                    /*if(!n.parent.data.children){//删除顶级节点，无children
                    list = n.parent.data
                    }*/
                    list.map((c,i) => {
                        if(d.id == c.id){
                            _index = i;
                        }
                    })
                    let k = list.splice(_index,1);
                    //console.log(_index,k)
                    this.$message.success("删除成功！")
                }
            }
        },
        getpagelist(){//获取页面列表
            getPagelist().then(res=>{
                console.log(res)
                let data = res.data;
                for(let i in data){
                    data[i].isEdit = false;
                    if(data[i].level<3){
                        data[i].children = [];
                    }
                    if(data[i].level == 2 && data[i].pId ==0 ){
                        data[0].children.push(data[i])
                    }
                    for(let j in data[0].children){
                        if(data[0].children[j].id == data[i].pId){
                            data[0].children[j].children.push(data[i])
                        }
                    }
                }
                this.setTree = [data[0]];
            })
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
</style>

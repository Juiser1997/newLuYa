<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row>
                  <el-col :span="24">
                      <el-table :data="list">
                        <el-table-column label="序号" type="index" width="50"></el-table-column>
                        <el-table-column label="作者" prop="nickName" width="100"></el-table-column>
                        <el-table-column label="发布时间" prop="createTime" width="180"></el-table-column>
                        <el-table-column label="标题" prop="title" width="250"></el-table-column>
                        <el-table-column label="被举报数" prop="report" width="100"></el-table-column>
                        <el-table-column type="expand" label="举报原因" width="100">
                            <template slot-scope="props">
                                <span v-for="(item,i) in props.row.resonList" :key="i">{{item.reason}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作"  width="250">
                            <template slot-scope="scope">
                                <span @click="find(scope.row)" class="btn">查看</span>
                                <span @click="Report(scope.row)" class="btn">有效</span>
                                <span @click="ReportNo(scope.row)" class="btn">无效</span>

                                <!-- <el-button @click="find(scope.row)"  type="infor" size="small">查看</el-button> -->
                                <!-- <el-button @click="Report(scope.row)"  type="primary" size="small">有效</el-button>
                                <el-button @click="ReportNo(scope.row)"  type="danger" size="small">无效</el-button> -->
                            </template>
                        </el-table-column>
                      </el-table>
                    <div class="block">
                        <el-pagination
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                            background
                            layout="total,prev,pager,next,sizes"
                            :page-sizes="[10, 50, 100]"
                            :page-size="10"
                            :total="total">
                        </el-pagination>
                    </div>
                  </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import headTop from "@/components/header";
import {reportList,reportNO,reportSure} from '@/api/new';
export default {
    components: { headTop },
    inject:['reload'],//注入刷新方法

    data(){
        return{
            list:[],
            currentPage:1,
            pageSize:10,
            total:0
        }
    },
    created(){
        this.getList();
    },
    methods:{
        getList(){
            let data = { currentPage: this.currentPage, pageSize: this.pageSize ,flag:2};
            reportList(data).then(res=>{
                this.total = res.data.totalNum;
                let item = res.data.items
                console.log(item);
                
                for(let i in item){
                    if(item[i].content){
                        item[i].imgs = item[i].content.split(',')
                    }
                }
                this.list = item;
            })

        },
        handleCurrentChange(val) {
            this.currentPage = val;
            let data = { currentPage: val, pageSize: this.pageSize,flag:2 };
            reportList(data).then(res=>{
                this.list = res.data.items;
                this.total = res.data.totalNum;
            })
        },
        handleSizeChange(val) {
            this.pageSize = val;
            let data = { currentPage: this.currentPage, pageSize: this.pageSize ,flag:2};
            reportList(data).then(res=>{
                this.list = res.data.items;
                this.total = res.data.totalNum;
            })
        },
        Report(e){
            this.$confirm("确定是有效举报吗？","提示",{
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                reportSure(e.commentId).then(res=>{
                    if(res.code == 200){
                        this.getList();
                        this.$message.success('确认成功');
                    }else{
                        this.$message.error('程序错误，请联系管理员');
                    }
                })                
            }).catch(() => {
                return false;
            })
        },
        ReportNo(e){
            this.$confirm("确定是无效举报吗？","提示",{
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                reportNO(e.commentId).then(res=>{
                    if(res.code == 200){
                        this.getList();
                        this.$message.success('确认成功');
                    }else{
                        this.$message.error('程序错误，请联系管理员');
                    }
                })                
            }).catch(() => {
                return false;
            })
        },
        find(e){
            // this.$router.push("/dongtai?title="+e.title+"&content="+e.content);
            this.$router.push("/dongtai?id="+e.commentId);
            this.reload();
        }
    }
}
</script>
<style scoped>
.btn{color: #409EFF;padding: 0 15px;cursor: pointer;}
</style>

<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row>
                  <el-col :span="20" :offset="1">
                        <el-table :data="list" style="width: 100%" class="box" ref="filterTable">
                            <el-table-column prop="id" label="举报编号" width="200"></el-table-column>
                            <el-table-column prop="reason" label="举报原因" width="100"></el-table-column>
                            <el-table-column prop="createTime" label="举报时间" width="200"></el-table-column>
                            <el-table-column prop="content" label="举报内容" width="300"></el-table-column>
                            <el-table-column prop="nickName" label="举报人" width="300"></el-table-column>
                            <el-table-column align="center" width="300" fixed="right">
                                <template slot-scope="scope">
                                    <el-button @click="reportTive(scope.row)"  type="primary" size="small">有效</el-button>
                                    <el-button @click="report(scope.row)"  type="danger" size="small">无效</el-button>
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
import {userReport} from '@/api/new'
export default {
    components: { headTop},
    data(){
        return{
            activeName: 'first',
            list:[],
            total:0,
            currentPage: 1,
            pageSize: 10,
            flag:'1',
            id:''
        }
    },
    created(){
        this.id = this.$route.query.uid;
        this.getList();
    },
    methods:{
        handleClick(tab, event) {
            this.activeName =tab.name;
            let name = tab.name;
            if(name === 'first'){
                this.flag = '1';
                this.getList();
            }else if(name === 'second'){
                this.flag = '2';
                this.getList();
            }
        },
        //
        getList(){
            let data = {flag:this.flag,userId:this.id,currentPage:this.currentPage,pageSize:this.pageSize};
            userReport(data).then(res=>{
                this.list = res.data.items;
                this.total = res.data.totalNum;
            })
        },
        //分页
        handleCurrentChange(val) {
            this.currentPage = val;
            let data = {flag:this.flag,userId:this.id,currentPage:this.currentPage,pageSize:this.pageSize};
            userReport(data).then(res=>{
                this.list = res.data.items;
                this.total = res.data.totalNum;
            })
        },
        handleSizeChange(val) {
            this.pageSize = val;
            let data = {flag:this.flag,userId:this.id,currentPage:this.currentPage,pageSize:this.pageSize};
            userReport(data).then(res=>{
                this.list = res.data.items;
                this.total = res.data.totalNum;
            })
        },
    }
}
</script>
<style scoped>

</style>


<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row>
                    <el-col class="searchInp" >
                        <span>品牌商：</span>
                        <el-input size="mini" v-model="search.name" class="searchInput" clearable placeholder="品牌商查询"></el-input>
                        <!-- <span>电话：</span>
                        <el-input  size="mini" v-model="search.phone" class="searchInput" clearable  placeholder="电话查询"></el-input>
                        <span>地址：</span>
                        <el-input  size="mini" v-model="search.address" class="searchInput" clearable  placeholder="地址查询"></el-input>
                        <span>时间：</span> -->
                        <el-date-picker
                            v-model="time"
                            clearable
                            size = "mini"
                            type="daterange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            class="time-pick">
                        </el-date-picker>
                        <el-button type="primary" size="small" @click="Search()">查询</el-button>
                        <el-button type="success" size="small" @click="Empty()">清空</el-button>
                        <el-button type="success" size="small" @click="Export()" style="float:right;margin-top:15px;">导出</el-button>
                    </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-table :data="shoplist" style="width: 100%" class="box" ref="filterTable">
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column prop="realName" label="姓名" width="100"></el-table-column>
                        <el-table-column prop="nickName" label="昵称" width="100"></el-table-column>
                        <el-table-column prop="wxh" label="微信号" width="100"></el-table-column>
                        <el-table-column label="头像" width="100">
                            <template slot-scope="scope">
                                <img :src="scope.row.headImg" width="40" height="40">
                            </template>
                        </el-table-column>
                        <el-table-column prop="sex" label="性别" width="100"></el-table-column>
                        <el-table-column prop="phone" label="电话" width="100"></el-table-column>
                        <el-table-column prop="address" label="地址" width="100"></el-table-column>
                        <el-table-column prop="birthday" label="生日" width="100"></el-table-column>
                        <el-table-column prop="createTime" label="申请时间" width="400"></el-table-column>
                        <el-table-column align="center" width="300" fixed="right">
                            <template slot-scope="scope">
                                <!-- <el-button @click="Edit(scope.row)"  type="primary" size="small">通过</el-button> -->
                                <el-button @click="Delete(scope.row)"  type="danger" size="small">删除</el-button>
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
import {clubList,clubDelete,clubUpdate} from "@/api/new";
import {clubexport} from "@/api/api";
import {getCookie} from "@/api/axios";

export default {
components: { headTop },
  data() {
    return {
        shoplist:[],
        time:[],//时间
        search:{
            name:'',
            phone:'',
            address:'',
        },
        currentPage: 1,
        pageSize: 10,
        total:0,
    };
  },
  methods:{
    //分页
    handleCurrentChange(val) {
      this.currentPage = val;
      let data = { currentPage: val, pageSize: this.pageSize,status:1 };
      clubList(data).then(res => {
        this.shoplist = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      let data = { currentPage: this.currentPage, pageSize: this.pageSize ,status:1};
      clubList(data).then(res => {
        this.shoplist = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    Search(){
        let data = {currentPage:1,pageSize:this.pageSize,status:1}
        if (this.search.name) {
            data.realName = this.search.name
        }
        if (this.search.phone) {
            data.phone = this.search.phone
        }
        if (this.search.address) {
            data.address = this.search.address
        }
        if( this.time && this.time.length>0){
            data.startTime = this.time[0];
            data.endTime = this.time[1];
        }  
        clubList(data).then(res => {
        this.shoplist = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    //清空
    Empty(){
        this.search = {//搜索条件
            id:'',
            nickname:'',
            status:''
        },
        this.time = [];
        let data = {currentPage:1,pageSize:this.pageSize,status:1}
        clubList(data).then(res => {
            this.shoplist = res.data.items;
            this.total = res.data.totalNum;
        });
    },
    Delete(e){
        this.$confirm("是否删除此会员？","提示",{
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            clubDelete(e.id).then(res=>{
                if(res.code==200){
                    this.$message.success('删除成功');
                    this.getList();
                }else{
                    this.$message.error('系统错误，请联系管理员');
                } 
            })
        }).catch(() => {
            return false;
        })
    },
    getList(){
        let data = {currentPage:this.currentPage,pageSize:this.pageSize,status:1}
        clubList(data).then(res=>{
            this.shoplist = res.data.items;
            this.total = res.data.totalNum;
        })
    },
    //导出
    Export(){
        let token_ = getCookie('token_');
        let check_code = getCookie('check_code');
        let downloadUrl = clubexport+'?token_='+token_+'&check_code='+check_code;
        if(this.time.length>0){
            downloadUrl += '&startTime=' + this.time[0] + '&endTime=' + this.time[1];
        }
        if(this.search.name){
            downloadUrl += '&name=' + this.search.name;
        }
        if(this.search.phone){
            downloadUrl += '&phone=' + this.search.phone;
        }
        if(this.search.address){
            downloadUrl += '&address=' + this.search.address;
        }
        window.location.href = downloadUrl;
    }
  },
  created(){
      this.getList();
  }
}
</script>
<style scoped>
.searchInp{width:100%;line-height: 70px;padding: 0 10px; }
.searchInp > span{display: inline-block;margin-left: 20px;font-size: 14px}
.searchInp > .el-button{margin-left: 30px}
.searchInput{display: inline-block;width: 180px;}
</style>

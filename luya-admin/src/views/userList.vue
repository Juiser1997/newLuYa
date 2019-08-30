<template>
  <div>
    <head-top></head-top>
    <el-container>
      <el-main>
        <el-row>
          <el-col class="searchInp" >
              <!-- <span>用户身份：</span>
              <el-select  v-model="search.roleId" placeholder="请选择" clearable class="seachcard">
                <el-option v-for="item in card" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select> -->
              <span>用户昵称：</span>
              <el-input  size="mini" v-model="search.nickName" class="searchInput" clearable  placeholder="用户名称查询"></el-input>
              <span>用户地址：</span>
              <el-input  size="mini" v-model="search.address" class="searchInput" clearable  placeholder="地址查询"></el-input>
              <span>时间：</span>
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
            <el-table
              :data="tableData"
              style="width: 100%"
              class="box"
              ref="filterTable">
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column label="用户头像" width="120" align='center'>
                <template slot-scope="scope">
                  <img :src="scope.row.headImg" width="40" height="40" class="head_pic">
                </template>
              </el-table-column>
              <el-table-column prop="nickName" label="用户昵称" width="150"  align='center'></el-table-column>
              <el-table-column prop="remark" label="个人签名" width="250" align='center'></el-table-column>
              <el-table-column prop="phone" label="电话" width="180" align='center'></el-table-column>
              <el-table-column prop="address" label="用户地址" width="250" align='center'></el-table-column>
              <el-table-column label="用户身份" width="100" align='center'>
                <template slot-scope="scope">
                  <span v-if='scope.row.roleId=== "player"'>一般用户</span>
                  <span v-if='scope.row.roleId=== "master"'>大咖</span>
                </template>
              </el-table-column>
              <el-table-column type="expand" label="其他" width="80" align='center'>
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="地址">
                        <span>{{props.row.address}}</span>
                      </el-form-item>
                      <el-form-item label="首登时间">
                        <span>{{props.row.createTime}}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
              <!-- <el-table-column prop="applayTime"  sortable label="打赏次数" width="140"></el-table-column> -->
              <!-- <el-table-column prop="praiseNumber"  sortable label="打赏金额" width="140"></el-table-column> -->
              <el-table-column prop="report" label="举报/数" width="100" align='center'></el-table-column>
              <el-table-column prop="bereported" label="被举报/数" width="100" align='center'></el-table-column>
              <!-- <el-table-column prop="bereported" label="评论/数" width="80"></el-table-column> -->
              <!-- <el-table-column prop="bereported" label="点赞/数" width="80"></el-table-column> -->
              <el-table-column align="center" label="编辑" width="250" fixed="right">
                  <!-- <template slot="header" slot-scope="scope">
                    <el-input  
                        v-model="search" 
                        size="mini" 
                        placeholder="输入用户昵称" 
                        clearable
                        @clear="reduction"
                        @keyup.enter.native="SearchSubmit"/>
                  </template> -->
                  <template slot-scope="scope">
                      <!-- <el-button @click="report(scope.row)"  type="primary" size="small">举报管理</el-button>
                      <el-button @click="comment(scope.row)"  type="primary" size="small">评论管理</el-button> -->
                      <el-button v-if="scope.row.status === 1" @click="Delete(scope.row)"  type="danger" size="small">封号</el-button>
                      <el-button v-if="scope.row.status === 0" @click="Delete(scope.row)"  type="success" size="small">解封</el-button>
                  </template>
              </el-table-column>
            </el-table>
            <div class="blockpage">
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
import { lyuserList,userUpdate} from "@/api/new";
import {userexport} from "@/api/api";
import {getCookie} from "@/api/axios";
export default {
  components: { headTop },
  data() {
    return {
      time: "",
      form: {},
      card:[{value:'player',label:'一般用户'},{value:'master',label:'大咖'}],
      multipleTable: {},
      tableData: [],
      total: null,
      currentPage: 1,
      pageSize: 10,
      search: {
        roleId:'',
        nickName:'',
        address:'',
      },
    };
  },
  created() {
    this.getContentList();
  },
  methods: {
    getContentList() {
      let data = {pageSize:10,currentPage:this.currentPage};
      lyuserList(data).then(res => {
        this.tableData = res.data.items;
        let tableData = this.tableData;
        this.total = res.data.totalNum;
      });
    },
    handleCurrentChange(val) {
      //分页
      this.currentPage = val;
      let data = { currentPage: val, pageSize: this.pageSize};
      lyuserList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      let data = { currentPage: this.currentPage, pageSize: this.pageSize};
      lyuserList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    //查询
    Search(){
        let data = {currentPage:1,pageSize:this.pageSize}
        // if (this.search.roleId) {
        //     data.roleId = this.search.roleId
        // }
        if (this.search.nickName) {
            data.nickName = this.search.nickName
        }
        if (this.search.address) {
            data.address = this.search.address
        }
        if( this.time && this.time.length>0){
            data.startTime = this.time[0];
            data.endTime = this.time[1];
        }  
        lyuserList(data).then(res=>{
          this.tableData = res.data.items;
          this.total = res.data.totalNum;
        })
    },
    //清空
    Empty(){
        this.search = {//搜索条件
            // roleId:'',
            address:'',
        },
        this.time = [];
        let data = {currentPage:1,pageSize:this.pageSize,status:1}
        lyuserList(data).then(res => {
            this.tableData = res.data.items;
            this.total = res.data.totalNum;
        });
    },
    //导出
    Export(){
        let token_ = getCookie('token_');
        let check_code = getCookie('check_code');
        let downloadUrl = userexport+'?token_='+token_+'&check_code='+check_code;
        if(this.time.length>0){
            downloadUrl += '&startTime=' + this.time[0] + '&endTime=' + this.time[1];
        }
        // if(this.search.roleId){
        //     downloadUrl += '&roleId=' + this.search.roleId;
        // }
        if(this.search.address){
            downloadUrl += '&address=' + this.search.address;
        }
        window.location.href = downloadUrl;
    },
    Delete(e){
      let status = e.status == 1 ? 0 :1;
      let data = {id:e.id,status:status};
      userUpdate(data).then(res=>{
        if(status  == 0){
          this.$message.success("封号成功");
        }else{
          this.$message.success("解封成功");
        }
        this.getContentList()
      })
    }
  }
};
</script>

<style scoped>
.block {display: flex;align-items: center;margin: 30px 0 10px 150px;}
.demonstration {margin-right: 18px;margin-left: 20px;font-size: 14px;color: #606266;line-height: 40px;}
.newlist-top {border-bottom: 1px solid #666;}
.newList {padding-left: 50px;overflow: auto;height: 100%;width: 75%;display: flex;padding-bottom: 30px;justify-content: center;align-items: flex-start;flex-direction: column;}
.in-name {width: 75%;display: flex;margin-left: 128px;}
.demo-table-expand {font-size: 0;}
.demo-table-expand label {width: 90px;color: #99a9bf;}
.demo-table-expand .el-form-item {margin-right: 0;margin-bottom: 0;width: 50%;}
.blockpage {padding: 10px 0;background-color: #fff;text-align: right}
.icon-img {width: 165px;height: 120px;}
.icon-imgs {width: 120px;height: 100px;}
.searchInp{width:100%;line-height: 70px;padding: 0 10px; }
.searchInp > span{display: inline-block;margin-left: 20px;font-size: 14px}
.searchInp > .el-button{margin-left: 30px}
.searchInput{display: inline-block;width: 180px;}
/deep/ .el-table .cell img {
  border-radius: 50%;
}
</style>

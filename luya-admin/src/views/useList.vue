<template>
  <div>
    <head-top></head-top>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24">
            <el-table
              :data="tableData"
              style="width: 100%"
              class="box"
              ref="filterTable">
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column label="用户头像" width="120">
                <template slot-scope="scope">
                  <img :src="scope.row.headImg" width="40" height="40" class="head_pic">
                </template>
              </el-table-column>
              <el-table-column prop="nickName" label="用户昵称" width="100"></el-table-column>
              <el-table-column prop="remark" label="个人签名" width="100"></el-table-column>
              <el-table-column prop="phone" label="电话" width="120"></el-table-column>
              <el-table-column label="用户身份" width="100">
                <template slot-scope="scope">
                  <span v-if='scope.row.roleId=== "player"'>一般用户</span>
                  <span v-if='scope.row.roleId=== "master"'>大咖</span>
                </template>
              </el-table-column>
              <el-table-column type="expand" label="其他" width="50">
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
              <el-table-column prop="praiseNumber"  sortable label="打赏金额" width="140"></el-table-column>
              <el-table-column prop="report" label="举报/数" width="80"></el-table-column>
              <el-table-column prop="bereported" label="被举报/数" width="80"></el-table-column>
              <el-table-column prop="bereported" label="评论/数" width="80"></el-table-column>
              <el-table-column prop="bereported" label="点赞/数" width="80"></el-table-column>
              <el-table-column align="center" width="300" fixed="right">
                  <template slot="header" slot-scope="scope">
                    <el-input  
                        v-model="search" 
                        size="mini" 
                        placeholder="输入用户昵称" 
                        clearable
                        @clear="reduction"
                        @keyup.enter.native="SearchSubmit"/>
                  </template>
                  <!-- <template slot-scope="scope">
                      <el-button @click="report(scope.row)"  type="primary" size="small">举报管理</el-button>
                      <el-button @click="comment(scope.row)"  type="primary" size="small">评论管理</el-button>
                      <el-button @click="Delete(scope.row)"  type="danger" size="small">封号</el-button>
                  </template> -->
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
import { lyuserList,} from "@/api/new";
export default {
  components: { headTop },
  data() {
    return {
      times: "",
      form: {},
      multipleTable: {},
      tableData: [],
      total: null,
      currentPage: 1,
      pageSize: 10,
      search: '',
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
      let data = { currentPage: val, pageSize: this.pageSize };
      lyuserList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      let data = { currentPage: this.currentPage, pageSize: this.pageSize };
      lyuserList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    //用户昵称
    SearchSubmit(){
        let data = {currentPage:1,pageSize:10,nickName:this.search}
        lyuserList(data).then(res=>{
          this.tableData = res.data.items;
          this.total = res.data.totalNum;
        })
    },
    reduction(){
        let data = {currentPage:1,pageSize:10}
        lyuserList(data).then(res=>{
          this.tableData = res.data.items;
          this.total = res.data.totalNum; 
        })
    },
    report(e){
      this.$router.push("/adminReport?uid=" + e.id);
    },
    comment(e){
      this.$message.success('待开发');
      // this.$router.push("/adminComment?uid=" + e.id);
    },
    Delete(){
      this.$message.success('待开发');
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
.block {padding: 20px 0;}
.icon-img {width: 165px;height: 120px;}
.icon-imgs {width: 120px;height: 100px;}
</style>

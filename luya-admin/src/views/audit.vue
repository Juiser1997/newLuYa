<template>
  <div>
    <head-top></head-top>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24">
            <div class="block">
              <span class="demonstration">申请时间</span>
              <el-date-picker
                v-model="times"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['12:00:00']"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="dateChangebirthday">
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form ref="form" :model="form" label-width="115px" class="in-name">
              <el-form-item label="用户昵称">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="真实姓名">
                <el-input v-model="form.realName"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm">立即查询</el-button>
              </el-form-item>
            </el-form> 
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table :data="tableData" style="width: 100%" class="box" ref="filterTable" >
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column label="用户头像" width="120">
                <template slot-scope="scope">
                  <img :src="scope.row.headimg" width="40" height="40" class="head_pic">
                </template>
              </el-table-column>
              <el-table-column prop="nickName" label="用户昵称" width="100"></el-table-column>
              <el-table-column prop="realName" label="真实姓名" width="100"></el-table-column>
              <el-table-column prop="phone" label="联系方式" width="130"></el-table-column>
              <el-table-column prop="remark" label="用户性质" width="100"></el-table-column>
              <el-table-column prop="cardNum" label="身份证" width="180"></el-table-column>
              <el-table-column prop="applayTime" label="申请日期" width="180"></el-table-column>
              <el-table-column
                prop="status"
                label="审核状态"
                width="220"
                :filters="[{text:'审核中',value:1},{text:'通过审核',value:0}]"
                :filter-method="filterrel"
                filter-placement="bottom-end">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status=== 0 ? 'primary' : 'success'">
                    <span v-if="scope.row.applyStatus===1">审核中</span>
                    <span v-else="scope.row.applyStatus===2">审核成功</span>
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column align="left" width="320" label="操作">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.applyStatus===1" type="success" size="small" @click="applyBy(scope.row)">通过</el-button>
                  <el-button v-if="scope.row.applyStatus===1" type="warning" size="small" @click="rejetApply(scope.row)">不通过</el-button>
                  <el-button v-if="scope.row.applyStatus===2" type="danger" size="small" @click="soldout(scope.row)">取消</el-button>
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
      <!-- 弹窗取消或不通过 -->
      <el-dialog title="取消或不通过授权" :visible.sync="dialogFormVisible" width="40%" modal-append-to-body center>
          <el-form>
              <el-form-item label="理由">
                  <el-input v-model="reason" autocomplete="off"></el-input>
              </el-form-item>
          </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitApply()">确 定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>
<script>
import headTop from "@/components/header";
import { userList, userUdate } from "@/api/new";
import axios from "axios";
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
      search: 1,
      dialogFormVisible:false,
      reason:'',//理由
      id:'',
      mark:'',
    };
  },
  created() {
    this.getContentList();
  },
  methods: {
    submitForm() {
      //查询资讯列表
      let data = {};
      data.name = this.form.name;
      data.realName = this.form.realName;
      data.beginTimes = this.times[0];
      data.finishTimes = this.times[1];
      userList(data).then(res => {
        if (res.code == 200) {}
        this.tableData = res.data.items;
      });
    },
    dateChangebirthday(val) {
      this.submitForm();
    },
    getContentList() {
      let data = {};
      data.pageSize = 10;
      data.currentPage = this.currentPage;
      userList(data).then(res => {
        this.tableData = res.data.items;
        let tableData = this.tableData;
        this.total = res.data.totalNum;
      });
    },
    handleCurrentChange(val) {
      //分页
      this.currentPage = val;
      let data = { currentPage: val, pageSize: this.pageSize };
      userList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
        this.search = val;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      let data = { currentPage: this.search, pageSize: this.pageSize };
      userList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
        this.currentPage = this.search;
      });
    },
    //筛选轮播状态
    filterTag(value, row) {
      return row.isCarousel === value;
    },
     //筛选发布状态
    filterrel(value, row) {
      return row.applyStatus === value;
    },
    //通过申请
    applyBy(e){
      let data = {id:e.id,applyStatus:2,roleId:'master',};
      userUdate(data).then(res => {
        if (res.code == 200) {
          this.$message.success("授权成功");
          this.getContentList();
        }
      });
    },
    //取消授权
    soldout(e){
      this.dialogFormVisible = true;
      this.id = e.id;
      this.mark = 'soldout'
    },
    rejetApply(e){
      this.dialogFormVisible = true;
      this.id = e.id;
      this.mark = 'rejetApply'
    },
    submitApply(){
      if(this.mark === 'rejetApply'){
        let data = {id:this.id,applyStatus:0,roleId:'player',reason:this.reason};
        userUdate(data).then(res => {
          if(res.code == 200){
            this.$message.success("已经不通过了他的申请");
            this.dialogFormVisible = true;
            this.getContentList();
          }
        });
      }else if(this.mark === 'soldout'){
        let data = {id:this.id,applyStatus:1,roleId:'player',reason:this.reason};
        userUdate(data).then(res => {
          if (res.code == 200) {
            this.$message.success("已取消授权");
            this.dialogFormVisible = true;
            this.getContentList();
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.block {
  display: flex;
  align-items: center;
  margin: 30px 0 10px 150px;
}
.demonstration {
  margin-right: 18px;
  margin-left: 20px;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
}
.newlist-top {
  border-bottom: 1px solid #666;
}
.newList {
  padding-left: 50px;
  overflow: auto;
  height: 100%;
  width: 75%;
  display: flex;
  padding-bottom: 30px;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
}
.in-name {
  width: 75%;
  display: flex;
  margin-left: 128px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.block {
  padding: 20px 0;
}
.icon-img {
  width: 165px;
  height: 120px;
}
.icon-imgs {
  width: 120px;
  height: 100px;
}
</style>

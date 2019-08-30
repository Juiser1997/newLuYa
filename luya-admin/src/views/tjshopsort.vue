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
              <el-table-column label="头像" width="120" align='center'>
                <template slot-scope="scope">
                  <img :src="scope.row.headImg" width="40" height="40" class="head_pic">
                </template>
              </el-table-column>
              <el-table-column prop="nickName" label="用户名" width="150"  align='center'></el-table-column>
              <el-table-column prop="realName" label="联系人" width="250" align='center'></el-table-column>
              <el-table-column prop="remark" label="简介" width="100" align='center'></el-table-column>
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
              <!-- 弹窗 -->
              <el-dialog title="编辑" center :visible.sync="dialogVisble" width="30%" modal-append-to-body>
                <el-col width="100%" class="form" >
                    <el-form ref="highForm" label-width="120px">
                        <el-form-item label="用户名：">
                            <el-input v-model="highForm.nickName" maxlength="6" placeholder="请输入名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="联系人：" >
                            <el-input v-model="highForm.realName" maxlength="4" placeholder="请输入联系人" clearable></el-input>
                        </el-form-item>   
                        <el-form-item label="电话：">
                            <el-input v-model="highForm.phone" maxlength="11" placeholder="请输入电话" @blur="Phone()" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="地址：">
                            <el-input v-model="highForm.address" placeholder="请输入地址" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="简介：">
                            <el-input v-model="highForm.remark" placeholder="请输入简介" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="店铺链接：" v-if="this.roleId == '2019080214444277130'">
                            <el-input v-model="highForm.tgUrl" placeholder="请输入店铺链接" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="账号头像：">
                            <el-input v-model="highForm.headImg" placeholder="请输入账号头像" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="上传图片：" style="clear:both;" >
                            <uploadBtn v-on:up-icon ="upIcon" v-on:down-icon="removeIcon" :imgs="Icon"></uploadBtn>
                        </el-form-item>
                    </el-form>
                </el-col>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisble = false">取 消</el-button>
                    <el-button type="primary" @click="sureEdit()">确 定</el-button>
                </span>
            </el-dialog>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import headTop from "@/components/header";
import uploadBtn from '@/components/uploadBtn';
import {check} from'@/util/util'
import {clear} from '@/util/util';
import { highuserList,highUserEdit,tgbusiUser} from "@/api/new";
import {highexport} from "@/api/api";
import {getCookie} from "@/api/axios";
export default {
  components: { headTop,uploadBtn},
  inject:['reload'],//注入刷新方法
  data() {
    return {
      tableData: [],
      card:[{value:'2019080214444277130',label:'商家'},{value:'master',label:'大咖'},{value:'2019080214441887640',label:'品牌商'}],
      total: null,
      currentPage: 1,
      pageSize: 10,
      search: {
        roleId:'',
        nickName:'',
      },
      roleId:'',
      dialogVisble:false,//编辑显示
      Icon:[],
      highForm:{    //编辑数据
        id:'',
        nickName:'',//用户名
        realName:'',//联系人
        phone:'',//电话
        address:'',//地址
        remark:'',//简介
        tgUrl:'',//店铺链接
        headImg:'',//用户头像
      },
    };
  },
  created() {
    this.getHighuserList();
  },
  methods: {
    getHighuserList() {
      let data = {pageSize:10,currentPage:this.currentPage,roleId: '2019080214444277130',isTg:1};
      highuserList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    handleCurrentChange(val) {
      //分页
      this.currentPage = val;
      let data = { currentPage: val, pageSize: this.pageSize };
      highuserList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      let data = { currentPage: this.currentPage, pageSize: this.pageSize };
      highuserList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    //查询
    Search(){
        let data = {currentPage:1,pageSize:this.pageSize}
        if (this.search.roleId) {
            data.roleId = this.search.roleId
        }
        if (this.search.nickName) {
            data.nickName = this.search.nickName
        }
        highuserList(data).then(res=>{
          this.tableData = res.data.items;
          this.total = res.data.totalNum;
        })
    },
    //清空
    Empty(){
        this.search = {//搜索条件
            roleId:'',
            nickName:'',
        }
        let data = {currentPage:1,pageSize:this.pageSize,status:1}
        highuserList(data).then(res => {
            this.tableData = res.data.items;
            this.total = res.data.totalNum;
        });
    },
    Phone(){
      if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.highForm.phone))){ 
        this.$message.error("请输入正确的电话号码") 
      }
    },
    //导出
    Export(){
        let token_ = getCookie('token_');
        let check_code = getCookie('check_code');
        let downloadUrl = highexport+'?token_='+token_+'&check_code='+check_code;
        if(this.search.roleId){
            downloadUrl += '&roleId=' + this.search.roleId;
        }
        if(this.search.nickName){
            downloadUrl += '&nickName=' + this.search.nickName;
        }
        console.log(downloadUrl)
        window.location.href = downloadUrl;
    },
    //编辑
    Edit(e){
      this.dialogVisble = true;
      this.highForm = {
        id:e.id,
        nickName:e.nickName,//用户名
        realName:e.realName,//联系人
        phone:e.phone,//电话
        address:e.address,//地址
        remark:e.remark,//简介
        tgUrl:e.tgUrl,//店铺链接
        headImg:e.headImg,//用户头像
      }
      this.roleId = e.roleId
    },
    //修改
    sureEdit(){
      let data = this.highForm
      data.roleId = this.roleId;
      if(!data.nickName || !data.realName || !data.phone || !data.address || !data.remark || !data.headImg){
        return this.$message.error('请输入完整');
      }
      if(this.roleId == '2019080214444277130'){
        if(!this.highForm.tgUrl){return this.$message.error('请输入商家推广链接');}
      }
      data = clear(data)
      highUserEdit(data).then(res=>{
        this.$message.success('修改成功'),
        setTimeout(()=>{
            this.reload();
        },3000)
      })
    },
    //头像处理
    upIcon(data){
        this.Icon.push(data);
        this.highForm.headImg = data.url
    },
    removeIcon(){
        this.Icon = [];
        this.highForm.headImg = '';
    },
    Setmer(e){
      let data = {id:e.id};
      tgbusiUser(data).then(res=>{
        this.$message.success("设置成功");
        this.getHighuserList()
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
</style>

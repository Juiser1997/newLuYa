<template>
  <div>
    <head-top></head-top>
    <el-container>
      <el-main>
        <el-row>
          <el-col class="searchInp" >
              <span>用户身份：</span>
              <el-select  v-model="search.roleId" placeholder="请选择" clearable class="seachcard">
                <el-option v-for="item in card" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <span>用户名：</span>
              <el-input  size="mini" v-model="search.nickName" class="searchInput" placeholder="用户名查询" clearable></el-input>
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
              <el-table-column label="账号类型" width="150"  align='center'>
                <template slot-scope="scope">
                    <span v-if="scope.row.roleId == '2019080214444277130'" style="color:#67C23A">商家</span>
                    <span v-if="scope.row.roleId == 'master'" style="color:#E6A23C">大咖</span>
                    <span v-if="scope.row.roleId == '2019080214441887640'" style="color:#409EFF">品牌商</span>
                </template>
              </el-table-column>
              <el-table-column label="头像" width="120" align='center'>
                <template slot-scope="scope">
                  <img :src="scope.row.headImg" width="40" height="40" class="head_pic">
                </template>
              </el-table-column>
              <el-table-column prop="nickName" label="用户名" width="150"  align='center'></el-table-column>
              <el-table-column prop="realName" label="联系人" width="120" align='center'></el-table-column>
              <el-table-column prop="applayPhone" label="电话" width="200" align='center'></el-table-column>
              <el-table-column prop="tgUrl" label="推广地址" width="280" align='center'></el-table-column>
              <el-table-column prop="remark" label="简介" width="250" align='center'></el-table-column>
              <el-table-column align="center" label="编辑" width="300" fixed="right">
                  <template slot-scope="scope">
                      <el-button @click="Delete(scope.row)"  type="danger" style="float:right" size="small">删除</el-button>
                      <el-button @click="Edit(scope.row)"  type="primary" style="float:right;margin-right:10px" size="small">编辑</el-button>
                      <el-button v-if="scope.row.roleId == '2019080214444277130' && scope.row.isTg == '0'" @click="Setmer(scope.row)" style="float:right" type="success" size="small">设为推荐商家</el-button>
                      <el-button v-if="scope.row.roleId == '2019080214444277130' && scope.row.isTg == '1'" @click="Setmer(scope.row)" style="float:right;" size="small">取消推荐商家</el-button>
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
              <!-- 弹窗 -->
              <el-dialog title="编辑" center :visible.sync="dialogVisble" width="40%" modal-append-to-body>
                <el-col width="100%" class="form" >
                    <el-form ref="highForm" label-width="120px">
                        <el-form-item label="用户名：">
                            <el-input v-model="highForm.nickName" maxlength="20" placeholder="请输入名称(最多20个字符)" clearable ></el-input>
                        </el-form-item>
                        <el-form-item label="联系人：" >
                            <el-input v-model="highForm.realName" maxlength="4" placeholder="请输入联系人(最多4个字符)" clearable></el-input>
                        </el-form-item>   
                        <el-form-item label="电话：">
                            <el-input v-model="highForm.applayPhone" maxlength="13" placeholder="请输入电话" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="地址：">
                            <el-input v-model="highForm.address" placeholder="请输入地址" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="简介：">
                            <el-input v-model="highForm.remark" placeholder="请输入简介(最多16个字符)"  maxlength="16" clearable></el-input>
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
import { highuserList,highUserEdit,tgbusiUser,delroleUser} from "@/api/new";
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
        applayPhone:'',//电话
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
      let data = {pageSize:10,currentPage:this.currentPage};
      highuserList(data).then(res => {
        // console.log(res.data);
        
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
    // Phone(){
    //   // if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.highForm.applayPhone))){ 
    //   //   return this.$message.error("请输入正确的电话号码") 
    //   // }
    //   if(!this.highForm.applayPhone){
    //     return this.$message.error("电话号码不能为空")
    //   }
    // },
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
        window.location.href = downloadUrl;
    },
    //编辑
    Edit(e){
      this.dialogVisble = true;
      
      this.highForm = {
        id:e.id,
        nickName:e.nickName,//用户名
        realName:e.realName,//联系人
        applayPhone:e.applayPhone,//电话
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
      if(!data.nickName || !data.realName || !data.applayPhone || !data.address || !data.remark || !data.headImg){
        return this.$message.error('请输入完整');
      }
      if(this.roleId == '2019080214444277130'){
        if(!this.highForm.tgUrl){return this.$message.error('请输入商家推广链接');}
      }
      if(!(/^[\u4e00-\u9fa5a-z]+$/gi.test(data.nickName)) ){ 
        return this.$message.error("用户名不能含有特殊字符") 
       }
       if(data.applayPhone.length<7){
        return this.$message.error("电话号码输入有误")
      }
      // if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.highForm.applayPhone))){ 
      //   return this.$message.error("请输入正确的电话号码") 
      // }
      data = clear(data)
      highUserEdit(data).then(res=>{
        this.$message.success('修改成功'),
        setTimeout(()=>{
            this.reload();
        },3000)
      })
    },
    //删除账户
    Delete(e){
      this.$confirm("该用户下的所有相关信息都将被删除，删除之后无法恢复，确认删除吗？","提示",{
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            delroleUser(e.id).then(res=>{
                if(res.code==200){
                    this.$message.success('删除成功');
                    this.getHighuserList();
                }else{
                    this.$message.error('系统错误，请联系管理员');
                } 
            })
        }).catch(() => {
            return false;
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
        if(res.data == '推荐商家不能超过三个'){
          this.$message.error(res.data)
        }else{
          this.$message.success("设置成功");
          this.getHighuserList()
        }
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

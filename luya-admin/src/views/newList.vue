<template>
  <div>
    <head-top></head-top>
      <el-container>
        <el-main>
          <el-row class="search">
            <el-col :span="24">
              <span class="label">分类：</span>
              <div class="threeLanm">
                <el-select v-model="plate" placeholder="板块栏目(必选项)" size="mini" @change="selectTrigger" class="type" clearable>
                  <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select v-model="sorts" placeholder="类别栏目(必选项)" size="mini" @change="linkageTrigger" class="type" clearable>
                  <el-option v-for="item in linkage" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select v-model="detali" placeholder="明细栏目" size="mini" @change="detaliTrigger" class="type" clearable>
                  <el-option v-for="item in detaliList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </div>
              <span class="label">时间：</span>
              <el-date-picker
                v-model="times"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
                :default-time="['12:00:00']"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="dateChangebirthday">
              </el-date-picker>
              <span class="label">大咖名：</span>
              <el-input v-model="name" size="mini" placeholder="输入大咖名" class="input-width" clearable></el-input>
              <span class="label">文章标题：</span>
              <el-input v-model="title" size="mini" placeholder="输入文章标题" class="input-width" clearable></el-input>
            </el-col>
          </el-row>
          <el-row class="searchBtn">
            <el-button type="primary" size="mini" @click="submitForm()">查询</el-button>
            <el-button type="success" size="small" @click="Empty()">清空</el-button>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table :data="tableData" style="width: 100%" class="box" ref="filterTable" >
                <el-table-column type="index" label="序号" width="50" align="center" fixed></el-table-column>
                <!-- <el-table-column type="expand" label="其他" width="50">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand" v-if="props.row.coverImg!=null">
                      <el-form-item label="图片">
                        <img :src="props.row.coverImg" class="icon-img">
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column> -->
                <el-table-column prop="colname" align="center" label="所在栏目" width="200"></el-table-column>
                <el-table-column align="center" prop="status" label="发布状态" width="150" column-key="status" :filters="[{text:'轮播文章',value:'轮播'},{text:'置顶文章',value:'置顶'},{text:'加精文章',value:'推荐'},{text:'下架文章',value:'未发布'}]" :filter-method="filterrel" filter-placement="bottom-end">
                  <template slot-scope="scope">
                    <span v-if="scope.row.islunbo  == 1"><label style="color:#FF9320"> 轮播 </label></span>
                    <span v-if="scope.row.ishot == 1"><label style="color:#60D67A"> 推荐 </label></span>
                    <span v-if="scope.row.istop == 1" style="color:#BD7DEB"> 置顶 </span>
                    <span v-if="scope.row.status == 1 && scope.row.islunbo  == 0 && scope.row.ishot == 0 && scope.row.istop == 0">已发布</span>
                    <span v-if="scope.row.status == 0 && scope.row.islunbo  == 0 && scope.row.ishot == 0 && scope.row.istop == 0">未发布</span>
                  </template>
                </el-table-column>
                <el-table-column prop="nickName" align="center" label="作者" width="150"></el-table-column>
                <el-table-column prop="title" align="center" label="标题" width="300"></el-table-column>
                <el-table-column v-if="roleId=='2019062611323672620'" align="center" prop="islunbo " label="轮播状态"  width="180"
                  :filters="[{text:'轮播资讯',value:1},{text:'普通资讯',value:0}]"
                  :filter-method="filterTag"
                  filter-placement="bottom-end">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.islunbo ==1" type="info"  size="small" @click="dialogForm(scope.row)">取消轮播</el-button>
                    <el-button v-if="scope.row.islunbo == 0"  size="small" @click="dialogForm(scope.row)">设为轮播</el-button>
                  </template>
                </el-table-column>
                  <el-table-column align="center" width="500" label="操作">
                    <template slot-scope="scope">
                      <el-button size="small" v-if="scope.row.istop=== 0 && roleId == '2019062611323672620'" @click="addtop(scope.row)">当前置顶</el-button>
                      <el-button class="ab" size="small" v-if="scope.row.istop=== 1 && roleId == '2019062611323672620'" @click="addtop(scope.row)">取消置顶</el-button>
                      <el-button size="small" v-if="scope.row.istopzx=== 0 && roleId == '2019062611323672620'" @click="addtopzx(scope.row)">置顶最新</el-button>
                      <el-button size="small" type="warning" v-if="scope.row.istopzx=== 1 && roleId == '2019062611323672620'" @click="addtopzx(scope.row)">取消最新</el-button>
                      <el-button v-if="scope.row.ishot=== 0 && roleId=='2019062611323672620' " style="width:80px" size="small" @click="addhot(scope.row)">加精</el-button>
                      <el-button v-if="scope.row.ishot=== 1 && roleId=='2019062611323672620'" style="width:80px"  type="success" size="small" @click="addhot(scope.row)">取消加精</el-button>
                      <el-button v-if="scope.row.status=== 0 && roleId == '2019062611323672620'" size="small" @click="soldout(scope.row)">上架</el-button>
                      <el-button v-if="scope.row.status=== 1 && roleId == '2019062611323672620'" size="small" type="primary" @click="soldout(scope.row)">下架</el-button>
                      <el-button type="info" @click="compile(scope.row)" size="small">编辑</el-button>
                      <el-button type="danger" @click="Delete(scope.row)" size="small">删除</el-button>
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
                  :pageSize="pageSize" 
                  :total="total" 
                  align="center">
                </el-pagination>
              </div>
            </el-col>
          </el-row>
        </el-main>
        <!-- 弹窗上传轮播图 -->
        <el-dialog title="上传轮播图片" :visible.sync="dialogFormVisible" width="40%" modal-append-to-body center>
                      <span class="label">分类：</span>
            <div style="margin-bottom:20px">
              <el-select v-model="plate" placeholder="板块栏目(必选项)" size="mini" @change="selectTrigger" class="type">
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <el-select v-model="sorts" placeholder="类别栏目(必选项)" size="mini" @change="linkageTrigger" class="type" >
                <el-option v-for="item in linkage" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>

          <div class="upload">
            <upload-Btn
              :imgs="icon"
              v-on:up-icon="upLoadImg"
              v-on:down-icon="remove">
            </upload-Btn>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
          </div>
        </el-dialog>
      </el-container>
  </div>
</template>
<script>
import headTop from "@/components/header";
import uploadBtn from "@/components/uploadBtn";
import {randomStr} from '@/util/util';
import {setCookie,getCookie} from "@/api/axios";
import {contentList,contentIssue,contentDelete,contentUpdate,columnDetails, saveContent} from "@/api/new";
import axios from "axios";
export default {
  components: { headTop,uploadBtn },
  inject:['reload'],//注入刷新方法
  data() {
    return {
      name:'',//大咖
      title:'',//文章标题
      times: "", //查询时间范围
      tableData: [], //表格数据
      total: 0, //分页
      currentPage: 1, //分页页码
      pageSize: 10, //分页数据
      dialogFormVisible: false, //弹出框
      icon: [], //上传图片
      rowdata: {}, //上传轮播图
      isCarouse: "0", //是否设为轮播图
      roleId: '0', //用户标识，大咖，运营
      islunbo : 0,
      plate: "", //板块1
      sorts: "", //二级栏目1
      detali: "", //三级栏目1
      options: [], //标题联动板块
      linkage: [], //类别选择
      detaliList: [], 
      type:1,//类型
      pid:"",//栏目Id
      contentId:"",//文章Id
      carouselImg:"",//图片地址
      id:""
    };
  },
  created(){
    let data = JSON.parse(getCookie("infodata"));
    this.roleId = data.roleId;
    this.currentPage = this.$route.query.currentPage == undefined ? 1 : parseInt(this.$route.query.currentPage)
    this.getContentList();
    this.getcoluml();
  },
  methods: {
    //三级联动数据请求
    getcoluml() {
      columnDetails().then(res => {
        this.options = res.data;
      });
    },
    //选择板块
    selectTrigger(id) {
      this.linkage = [];
      this.detaliList = [];
      this.detali = "";
      let option = this.options;
      for (let key in option) {
        if (option[key].id == id) {
          this.linkage = option[key].title2;
        }
      }
    },
    //二级栏目
    linkageTrigger(id) {
      this.detaliList = [];
      this.detali = "";
      let linkage = this.linkage;
      for (let key in linkage) {
        if (linkage[key].id == id) {
          if(linkage[key].title3){
            this.detaliList = linkage[key].title3;
          }
        }
      }
    },
    //三级栏目
    detaliTrigger(id) {
      // this.kid = id;
    },
    // 文章列表
    getContentList() {
      let data = {currentPage:this.currentPage,pageSize:10};
      contentList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    //查询资讯列表
    submitForm() {
      let data = {};
      if(this.name){data.name = this.name;}
      if(this.title){data.title = this.title;}
      if( this.times && this.times.length>0){
        data.beginTimes = this.times[0];
        data.finishTimes = this.times[1];
      } 
      if(this.sorts){ 
        if(this.detali){ 
          data.type = this.detali; 
        } else{
          data.pid = this.sorts; 
        } 
      }
      contentList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    //清空
    Empty(){
        this.title = '';
        this.plate = '';
        this.sorts = '';
        this.times = [];
        this.name = '';
        this.title = '';
        let data = {currentPage:this.currentPage,pageSize:this.pageSize}
        contentList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    dateChangebirthday(val) {
      this.submitForm();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      let data = { currentPage: val, pageSize: this.pageSize };
      if(this.name){data.name = this.name;}
      if(this.title){data.title = this.title;}
      if( this.times && this.times.length>0){
        data.beginTimes = this.times[0];
        data.finishTimes = this.times[1];
      } 
      if(this.sorts){ 
        if(this.detali){ 
          data.type = this.detali; 
        } else{
          data.pid = this.sorts; 
        } 
      }
      this.$store.commit('setpage',val)
      contentList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      let data = { currentPage: this.currentPage, pageSize: this.pageSize };
      if(this.name){data.name = this.name;}
      if(this.title){data.title = this.title;}
      if( this.times && this.times.length>0){
        data.beginTimes = this.times[0];
        data.finishTimes = this.times[1];
      } 
      if(this.sorts){ 
        if(this.detali){ 
          data.type = this.detali; 
        } else{
          data.pid = this.sorts; 
        } 
      }
      contentList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    filterTag(value, row) {
      //筛选轮播状态
      return row.islunbo  == value;
    },
    filterrel(value, row) {
      //筛选发布状态
      if(value == '未发布'){
        return row.status === 0 ;
      }
      if(value == '置顶'){
        return row.istop === 1 ;
      }
      if(value == '推荐'){
        return row.ishot === 1 ;
      }
      if(value == '轮播'){
        return row.islunbo === 1 ;
      }
    },
    soldout(e) {
      //发布资讯
      let status = e.status == 0 ? 1 : 0;
      let data = {id:e.id,status:status};
      if(e.status == 1 && e.islunbo == 1){
        this.$confirm("该文章下架,当前的轮播图也将会被删除，是否确认下架？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          contentIssue(data).then(res => {
            if (res.code == 200) {
              this.$message.success("修改发布状态成功");
              this.getContentList();
            } else {
              this.$message.error("程序错误，请联系管理员");
            }
          });
        }).catch(() => {
          return false;
        });
      }else{
        contentIssue(data).then(res => {
          if (res.code == 200) {
            this.$message.success("修改发布状态成功");
            this.getContentList();
          }
        });
      }
    },
    Delete(e) {
      //删除资讯
      this.$confirm("是否删除此资讯？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          let data = { id: e.id };
          contentDelete(data).then(res => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.getContentList();
            } else {
              this.$message.error("程序错误，请联系管理员");
            }
          });
        }).catch(() => {
          return false;
        });
    },
    upLoadImg(data) {
      this.icon.push(data)
    },
    remove(e){
      this.icon = []
    },
    dialogForm(e) {
      this.icon = [];
      this.id = e.id
      if (e.islunbo  == 0) {
        this.rowdata = e;
        this.dialogFormVisible = true;
        if(e.carouselImg){
          let imgData = { uid:123456, url: e.carouselImg };
          this.icon.push(imgData);
        }
      } else {
        let data = {carouselContentId:e.carouselContentId,}
        contentUpdate(data).then(res => {
          if (res.code == 200) {
            this.$message.success("轮播取消成功");
            this.getContentList();
          }
        });
      }
    },
    compile(e){
      let id = e.id;
      let currentPage = this.currentPage;
      this.$router.push("/compileInfo?id=" + id + "&currentPage=" + currentPage);
      this.id = id;
      console.log(this.id);
      
    },
    submit(){
      let rowdata = this.rowdata;

      // let id=this.id
      console.log(this.id);
      
      if(this.icon.length == 0||this.plate == "" || this.sorts == ""){
        this.$message.warning("请检查是否有空值项");
      }else{
        let data = {type:1,pid:this.sorts,contentId:this.id};
        if(rowdata.carouselImg !== this.icon[0].url){
          data.carouselImg = this.icon[0].url;
        }
        contentUpdate(data).then(res => {
          if (res.data == 800) {
            return this.$message.error('该栏目轮播图已有五张，请先取消该栏目下的其他轮播图');
          }
          if (res.msg == "成功") {
            this.$message.success("上传成功");
            this.getContentList();
          } 
          this.dialogFormVisible = false;
          this.reload()
        });
      }
    },
    addhot(e){
      let ishot = e.ishot == 0 ? 1 : 0;
      let data = {id:e.id,ishot:ishot}
      contentIssue(data).then(res => {
          if (res.code == 200) {
            this.$message.success("修改加精状态成功");
            this.getContentList();
          }
      });
    },
    addtop(e){
      let istop = e.istop == 0 ? 1 : 0;
      let data = {id:e.id,istop:istop}
      contentIssue(data).then(res => {
          if (res.code == 200) {
            this.$message.success("修改置顶状态成功");
            this.getContentList();
          }
      });
    },
    addtopzx(e){
      let istopzx = e.istopzx == 0 ? 1 : 0;
      let data = {id:e.id,istopzx:istopzx}
      contentIssue(data).then(res => {
          if (res.code == 200) {
            this.$message.success("修改置顶最新状态成功");
            this.getContentList();
          }
      });
    }
  }
};
</script>

<style scoped>
.search{width: 100%;line-height: 70px;}
.searchBtn{padding-bottom: 20px}
.block {display: flex;align-items: center;margin: 30px 0 10px 150px;padding: 10px 0;}
.label{width: 100px;text-align: right;padding: 0 10px;font-size: 16px}
.threeLanm{display: inline-block}
.demonstration {margin-right: 18px;margin-left: 20px;font-size: 14px;color: #606266;line-height: 40px;}
.newlist-top { border-bottom: 1px solid #666;}
.newList {padding-bottom: 30px;overflow: auto;height: 100%;width: 85%;display: flex;justify-content: center;align-items: flex-start;flex-direction: column;}
.in-name {width: 75%;display: flex;margin-left: 128px;}
.demo-table-expand {font-size: 0;}
.demo-table-expand label {width: 90px;color: #99a9bf;}
.demo-table-expand .el-form-item {margin-right: 0;margin-bottom: 0;width: 50%;}
.icon-img {width: 165px;height: 120px;}
.icon-imgs {width: 120px;height: 100px;}
.upload {width: 100%;padding-top: 20px;border-top: 1px solid #666;display: flex;padding-bottom: 20px;align-items: flex-start;border-bottom: 1px solid #666;}
.upload-span {font-size: 16px;font-weight: bold;color: #000;margin: 30px 60px;}
.upload-add {margin-top: 30px;}
.islunbo  {margin-top: 30px;}
.input-width{width: 150px;margin: 0 10px;}
.ab{background-color: #BD7DEB;color: #ffffff}
</style>

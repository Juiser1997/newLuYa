<template>
  <div>
    <head-top></head-top>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="18" :offset="3">
            <span class="label">标题：</span>
            <el-input class="title" placeholder="请输入标题(必填项)" size="mini" v-model="title" clearable></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="4">
            <span class="label content">内容：</span>
            <quill-editor
              v-model="content"
              ref="myTextEditor"
              class="edit"
              :options="editorOption"
              @change="onEditorChange($event)">
            </quill-editor>
          </el-col>
        </el-row>
        <el-row class="typebox">
          <el-col :span="18" :offset="3">
            <span class="label">分类：</span>
            <div>
              <el-select v-model="plate" placeholder="板块栏目(必选项)" size="mini" @change="selectTrigger" class="type">
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <el-select v-model="sorts" placeholder="类别栏目(必选项)" size="mini" @change="linkageTrigger" class="type" >
                <el-option v-for="item in linkage" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <el-select v-model="detali" placeholder="明细栏目" size="mini" @change="detaliTrigger" class="type">
                <el-option v-for="item in detaliList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <!-- <el-row class="origin" v-if="roleId=='2019062611323672620'">
          <el-col :span="18" :offset="3">
            <span class="label">将文章轮播图指定到：</span>
            <el-checkbox v-model="addLam">文章当前栏目</el-checkbox>
            <el-checkbox v-model="addTop">置顶到"首页-最新"</el-checkbox>
            <el-button size="mini">上传轮播图</el-button>
          </el-col>
        </el-row> -->
        <el-row class="origin" v-if="roleId=='2019062611323672620'">
          <el-col :span="18" :offset="3">
            <span class="label">将文章置顶到：</span>
            <el-checkbox v-model="addWzlam" @change="toTopLam()">文章当前栏目</el-checkbox>
            <el-checkbox v-model="addWznew" @change="toTop()">置顶到"首页-最新"</el-checkbox>
          </el-col>
        </el-row>
        <el-row class="origin" v-if="roleId=='2019062611323672620'">
          <el-col :span="18" :offset="3">
            <span class="label">加精：</span>
            <el-checkbox v-model="beHot"  @change="toHot()">将文章加精</el-checkbox>
          </el-col>
        </el-row>
        <el-row class="origin" v-if="roleId=='2019062611323672620'">
          <el-col :span="18" :offset="3">
            <span class="label">该文章内的产品属于：</span>
            <el-input class="formwhere" v-model="brand" placeholder="品牌" size="mini" clearable></el-input>
            <el-input class="formwhere" v-model="series" placeholder="系列" size="mini" clearable></el-input>
            <el-input class="formwhere" v-model="model" placeholder="型号" size="mini" clearable></el-input>
          </el-col>
        </el-row>
        <el-row class="origin">
          <el-col :span="18" :offset="3">
            <span class="label">原创声明：</span>
            <el-switch v-model="isown"></el-switch>
          </el-col>
        </el-row>
        <el-row class="covimg">
          <el-col :span="18" :offset="3">
            <span class="label">封面：</span>
            <div class="upload-add">
              <cat-down 
                  :List="icon" 
                  v-on:sub-mit="submit"
                  v-on:remove="removeIcon">
              </cat-down>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3" class="btn-group" >
            <el-button @click="onsubmit" size="mini" style="float:right;">更新</el-button>
            <el-button type="success" @click="onsutus" style="float:right; margin-right:10px;" size="mini">保存并发布</el-button>
            <el-button type="primary" @click="back" style="float:right; margin-right:10px;" size="mini">返回</el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import headTop from "@/components/header";
import catDown from '@/components/catdown'
import { quillRedefine } from "vue-quill-editor-upload";
import { columnDetails,saveContent,contentGet,contentIssue } from "@/api/new";
import { editorOptions } from "@/util/quill-config"; //自定义编辑器配置
import {randomStr} from '@/util/util';
import axios from "axios";
import {setCookie,getCookie} from "@/api/axios";
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { setTimeout } from "timers";
export default {
  inject: ["reload"], //注入刷新方法
  components: { headTop, quillEditor, quillRedefine,catDown},
  data() {
    return {
      title: "", //标题1
      content: "", //富文本编辑器内容1
      plate: "", //板块1
      sorts: "", //二级栏目1
      detali: "", //三级栏目1
      isown: false, //是否原创
      editorOption: editorOptions,
      contentid:'',//文章id
      options: [], //标题联动板块
      linkage: [], //类别选择
      detaliList: [], //明细选择联动
      icon: [], //标题图片
      status: 0,
      roleId: '0', //用户标识，大咖，运营
      addLam:'',
      addTop:'',
      addWzlam:false,
      addWznew:false,
      beHot:false,
      brand:'',
      series:'',
      model:''
    };
  },
  methods: {
    submit(e){
      this.icon.push(e)
    },
    removeIcon(e){
      this.icon = [];
    },
    //获得焦点事件
    onEditorChange({ editor, html, text }) {
      this.content = html;
    },
    //选择板块
    selectTrigger(id) {
      this.linkage = [];
      this.detaliList = [];
      this.sorts = "";
      this.detali = "";
      let option = this.options;
      for (let key in option) {
        if (option[key].id == id) {
          this.linkage = option[key].title2;
          if(option[key].id == "2019061813442417200"){
            this.linkage.splice(key,1)
          }
          if(this.roleId == '2019080214444277130'){
            if(option[key].id == "2019061813442417200"){
              let linkage = this.linkage
              for(let i in linkage){ 
                if(this.linkage[i].id == "2019061813545911220"){
                  this.linkage.push(this.linkage[i])
                  this.linkage.splice(0,this.linkage.length-1)
                }
              }
            }
          }
          if(this.roleId == 'master'){
            if(option[key].id == "2019061813442417200"){
              let linkage = this.linkage
              for(let i in linkage){ 
                if(this.linkage[i].id == "2019061813545911220"){
                  this.linkage.splice(i,1)
                }
              }
            }
          }
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
    //文章是否指定到栏目
    toTopLam(){
      this.addWzlam == false? true:false
    },
    //文章是否置顶
    toTop(){
      this.addWznew == false? true:false
    },
    //文章是否加精
    toHot(){
      this.beHot == false? true:false
    },
    onsubmit() {
      //提交
      if (this.content == '' || this.title == '' || this.icon.length == 0  || this.sorts == '') {
        this.status = 0;
         return this.$message.error("请输入必填项：板块，标题，内容，封面图片，谢谢");
      } 
      if (this.detaliList.length != 0 && this.detali == '') {
         return this.$message.error("请选择三级分类，谢谢");
      } 
      let data = {id:this.contentid};
      data.pid =  this.sorts;
      if(this.detali == ''){
        data.type =  this.sorts;
      }else{
        data.type = this.detali;
      }
      data.isown = this.isown ? 1 : 0;
      data.content = this.content;
      data.title = this.title; 
      data.coverImg = this.icon[0].url;
      // data.status = this.status;
      data.istop = this.addWzlam == true ? 1:0
      data.istopzx = this.addWznew == true ? 1:0
      data.ishot = this.beHot == true ? 1:0
      data.brand = this.brand
      data.series = this.series
      data.model = this.model
      // data.status=1
      contentIssue(data).then(res => {
        this.$message.success("提交更改成功");
        // this.setTimeout( this.$router.push("/newList"),1000)
      }).catch(error => {
        console.log(error, "错误");
      });
    },
    onsutus() {
      // this.status = 1;
            if (this.content == '' || this.title == '' || this.icon.length == 0  || this.sorts == '') {
        this.status = 0;
         return this.$message.error("请输入必填项：板块，标题，内容，封面图片，谢谢");
      } 
      if (this.detaliList.length != 0 && this.detali == '') {
         return this.$message.error("请选择三级分类，谢谢");
      } 
      let data = {id:this.contentid};
      data.pid =  this.sorts;
      if(this.detali == ''){
        data.type =  this.sorts;
      }else{
        data.type = this.detali;
      }
      data.isown = this.isown ? 1 : 0;
      data.content = this.content;
      data.title = this.title; 
      data.coverImg = this.icon[0].url;
      // data.status = this.status;
      data.istop = this.addWzlam == true ? 1:0
      data.istopzx = this.addWznew == true ? 1:0
      data.ishot = this.beHot == true ? 1:0
      data.brand = this.brand
      data.series = this.series
      data.model = this.model
      data.status=1
      contentIssue(data).then(res => {
        this.$message.success("提交更改成功");
        // this.setTimeout( this.$router.push("/newList"),1000)
      }).catch(error => {
        console.log(error, "错误");
      });

    },
    back(){
      this.$router.push("/newList?currentPage=" + this.$route.query.currentPage);
    }
  },
  created() {
      let data = JSON.parse(getCookie("infodata"));
      this.roleId = data.roleId;
      columnDetails().then(res => {
        this.options = res.data;
      }).then(()=>{
        let id = this.$route.query.id;
        this.contentid = id;
        contentGet({id:id}).then(res=>{
          let info = res.data.content;
          if(info.istop == 1){this.addWzlam = true}
          if(info.istopzx == 1){this.addWznew = true}
          if(info.ishot == 1){this.beHot = true}
          this.brand = info.brand
          this.series = info.series
          this.model = info.model
          this.title = info.title
          this.status = info.status
          this.content = info.content
          this.isown = info.isown == 0 ? false : true;
          this.icon = [{uid:123456,url:info.coverImg}]
          this.plate= res.data.pId1;
          let option = this.options;
          for (let key in option) {
            if (option[key].id == res.data.pId1) {
              this.linkage = option[key].title2;
              if(option[key].id == "2019061813442417200"){
                this.linkage.splice(key,1)
              }
              if(this.roleId == '2019080214444277130'){
                if(option[key].id == "2019061813442417200"){
                  let linkage = this.linkage
                  for(let i in linkage){ 
                    if(this.linkage[i].id == "2019061813545911220"){
                      this.linkage.push(this.linkage[i])
                      this.linkage.splice(0,this.linkage.length-1)
                    }
                  }
                }
              }
              if(this.roleId == 'master'){
                if(option[key].id == "2019061813442417200"){
                  let linkage = this.linkage
                  for(let i in linkage){ 
                    if(this.linkage[i].id == "2019061813545911220"){
                      this.linkage.splice(i,1)
                    }
                  }
                }
              }
            }
          }
          this.sorts=res.data.pId2;
          let linkage = this.linkage;
          for (let key in linkage) {
            if (linkage[key].id == res.data.pId2) {
              if(linkage[key].title3){
                this.detaliList = linkage[key].title3;
              }
            }
          }
          if(res.data.pId3){
            this.detali = res.data.pId3;
          }
        })
      });
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  }
};
</script>
<style scoped>
.label{width: 160px;text-align: right;float: left;padding-right: 20px;}
.title{width: 300px;float: left;}
.content{padding-top: 15px;}
.edit{padding: 0 0;float: left;height: 500px;margin: 20px 0;width: calc(100% - 120px);}
.typebox{margin-top:45px;}
.formwhere{width: 200px}
.upload-add{float: left;min-height: 150px;}
.type{width: 150px; margin-right: 15px;}
.origin{margin:15px 0;}
</style>

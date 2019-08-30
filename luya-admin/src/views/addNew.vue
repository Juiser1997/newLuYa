<template>
  <div>
    <head-top></head-top>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="18" :offset="3">
            <span class="label">标题</span>
            <el-input class="title" placeholder="请输入标题(必填项)" size="mini" v-model="title" maxlength="30" clearable></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <span class="label content">内容</span>
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
            <span class="label">分类</span>
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
        <el-row class="origin" v-if="proFrom">
          <el-col :span="18" :offset="3">
            <span class="label">该文章内的产品属于</span>
            <el-input class="formwhere" v-model="brand" placeholder="品牌" size="mini" clearable></el-input>
            <el-input class="formwhere" v-model="series" placeholder="系列" size="mini" clearable></el-input>
            <el-input class="formwhere" v-model="model" placeholder="型号" size="mini" clearable></el-input>
          </el-col>
        </el-row>
        <el-row class="origin">
          <el-col :span="18" :offset="3">
            <span class="label">原创声明</span>
            <el-switch v-model="isown"></el-switch>
          </el-col>
        </el-row>
        <el-row class="covimg">
          <el-col :span="18" :offset="3">
            <span class="label">封面</span>
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
            <el-button @click="onsubmit" size="mini" style="float:right;" :disabled="disabled" >保存</el-button>
            <el-button type="success" @click="onsutus" style="float:right; margin-right:10px;" size="mini">保存并发布</el-button>
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
import { columnDetails, saveContent } from "@/api/new";
import { editorOptions } from "@/util/quill-config"; //自定义编辑器配置
import { quillEditor } from 'vue-quill-editor';
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { setTimeout } from "timers";
import {setCookie,getCookie} from "@/api/axios";
export default {
  inject: ["reload"], //注入刷新方法
  components: { headTop, quillEditor, quillRedefine,catDown },
  data() {
    return {
      roleId:'0',
      editorOption: editorOptions,
      title: "", //标题1
      content: "", //富文本编辑器内容1
      plate: "", //板块1
      sorts: "", //二级栏目1
      detali: "", //三级栏目1
      icon: [], //图片1
      isown: false, //是否原创
      status: 0,
      options: [], //标题联动板块
      linkage: [], //类别选择
      detaliList: [], 
      disabled:false,
      proFrom:false,
      brand:'',
      series:'',
      model:''
    };
  },
  methods: {
    //图片上传组件化传参
    onEditorChange({ editor, html, text }) {
      this.content = html;
    },
    //三级联动数据请求
    getcoluml() {
      columnDetails().then(res => {
        this.options = res.data;
        if(this.roleId == '2019080214444277130'){
          this.options.splice(1,1)
        }
      });
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
          // if(this.roleId == 'master'){
            if(option[key].id == "2019061813442417200"){
              this.linkage.splice(key,1)
            }
          // }
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
      if(id == '2019061813524388080' || id == '2019061813545911220'){
        this.proFrom = true;
      }else{ this.proFrom = false; }
    },
    //三级栏目
    detaliTrigger(id) {
      if(id == '2019072409142501060'){
        this.proFrom = true;
      }
    },
    submit(e){
      this.icon.push(e)
    },
    removeIcon(e){
      this.icon = [];
    },
    onsubmit() {
      // 提交
      if (this.content == '' || this.title == '' || this.icon.length == 0  || this.sorts == '') {
        this.status = 0;
         return this.$message.error("请输入必填项：板块，标题，内容，封面图片，谢谢");
      } 
      if (this.detaliList.length != 0 && this.detali == '') {
         return this.$message.error("请选择三级分类，谢谢");
      } 
      let data = {};
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
      data.status = this.status;
      data.brand = this.brand
      data.series = this.series
      data.model = this.model
      saveContent(data).then(res => {
        if (res.code == 200) {
          this.$message.success("保存资讯信息成功");
          setTimeout(() => {
            this.reload();
          }, 3000);
        }
      }).catch(error => {
        console.log(error, "错误");
      });
    },
    onsutus() {
      this.status = 1;
      this.onsubmit();
    }
  },
  created() {
    this.getcoluml();
    let data = JSON.parse(getCookie("infodata"));
    this.roleId = data.roleId;
  },
};
</script>
<style scoped>
.label{width: 150px;text-align: right;float: left;padding-right: 20px;}
.title{width: 300px;float: left;}
.content{padding-top: 15px;}
.edit{padding: 0 0;float: left;height: 500px;margin: 20px 0;width: calc(100% - 150px);}
.typebox{margin-top:45px}
.upload-add{float: left;min-height: 150px;}
.type{width: 150px; margin-right: 15px;}
.origin{margin:15px 0;}
.formwhere{width: 200px}
</style>

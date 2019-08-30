<template>
  <div>
    <head-top></head-top>
    <el-container>
      <el-main>
        <el-row>
          <p v-if="this.$route.query.roleId=='master'">大咖账号</p>
          <p v-if="this.$route.query.roleId=='2019080214441887640'" style="color:#409EFF">品牌商账号</p>
          <p v-if="this.$route.query.roleId=='2019080214444277130'" style="color:#67C23A">商家账号</p>

          <el-col :span="12">
            <el-form :model="shop" label-width="150px">
              <el-form-item label="用户名">
                <el-input v-model="shop.nickName" maxlength="20" placeholder="填写用户名(最多20个字符)"></el-input>
              </el-form-item>
              <el-form-item label="联系人">
                <el-input v-model="shop.realName" maxlength="4" placeholder="填写联系人(最多4个字符)"></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="shop.applayPhone"  maxlength="13" placeholder="填写联系电话" ></el-input>
              </el-form-item>
              <el-form-item label="联系地址">
                <el-input v-model="shop.address" placeholder="填写联系地址"></el-input>
              </el-form-item>
              <el-form-item label="简介">
                <el-input v-model="shop.remark" placeholder="填写简介(最多16个字符)" maxlength="16"></el-input>
              </el-form-item>
              <el-form-item label="店铺链接"  v-if="this.$route.query.roleId=='2019080214444277130'||this.$route.query.roleId=='2019080214441887640'">
                <el-input v-model="shop.tgUrl" placeholder="填写推广链接"></el-input>
              </el-form-item>
              <el-form-item label="账号头像">
                <catcircle v-on:sub-mit="upImg" v-on:remove="removeImg" :List="headImg"></catcircle>
              </el-form-item>
              <el-form-item>
                <el-button @click="send" type="primary">生成</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import headTop from "@/components/header";
import {becomehighuser} from "@/api/api"
import { addShop } from "@/api/new";
import { check } from "@/util/util";
import catcircle from "@/components/catcircle";
import {getCookie} from "@/api/axios";

export default {
  components: { headTop, catcircle },
  inject: ["reload"], //注入刷新方法

  data() {
    return {
      shop: {
        nickName: "", //商家名称
        realName: "", //商家联系人
        applayPhone: "", //联系电话
        address: "", //地址
        remark: "" ,//商家标语
        tgUrl:""
      },
      headImg: [] //封面
      
    };
  },
  created() {
    
  },
  methods: {
    upImg(data) {
      this.headImg.push(data);
    },
    removeImg() {
      this.headImg = [];
    },
    send() {
      let data = this.shop;
      // data.icon = this.icon[0].url;
      // 
      // if(this.$route.query.roleId=='master'){
      //   data.roleId = "master";
      // }
      if(this.$route.query.roleId=='master'){
      this.$delete(this.shop,"tgUrl")
      }
      if(this.shop.applayPhone.length<7){
        return this.$message.error("电话号码输入有误")
      }
      if(data.nickName==""||
      data.realName==""||
      data.applayPhone==""||
      data.address==""||
      data.remark==""||
      data.tgUrl==""){
        return this.$message.error("不能输入空值项")
      }
      data.headImg = this.headImg[0].url;
      data.roleId = this.$route.query.roleId;
      // if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.shop.applayPhone)) ){ 
      //  return this.$message.error("请输入正确的电话号码") 
      // }
       if(!(/^[\u4e00-\u9fa5a-z]+$/gi.test(this.shop.nickName)) ){ 
        return this.$message.error("用户名不能含有特殊字符") 
       }
      addShop(data).then(res => {
        // console.log(res.data)
        if(res.data == '当前手机号已被绑定'){
          return this.$message.error(res.data)
        }else{
          this.$message.success("生成成功");
          let token_ = getCookie('token_');
          let check_code = getCookie('check_code');
          let downloadUrl = becomehighuser + '?token_='+token_+'&check_code='+check_code;
          downloadUrl += '&roleId=' + this.$route.query.roleId;
          downloadUrl += '&realName=' + this.shop.realName;
          downloadUrl += '&applayPhone=' + this.shop.applayPhone;
          downloadUrl += '&nickName=' + this.shop.nickName;

          setTimeout(() => { 
            this.reload();
          }, 3000);
          window.location.href = downloadUrl;
        }
      });
    },
    // err() {
    //   // if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.shop.applayPhone))){ 
    //   //  return this.$message.error("请输入正确的电话号码") 
    //   // }
      
    // },

  }
};
</script>
<style scoped>
p {
  margin: 50px 100px 30px 100px;
  color: #e6a23c;
}
/deep/ .el-upload-list--picture .el-upload-list__item-thumbnail{
  border-radius: 50%;
}
</style>

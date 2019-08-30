<template>
  <div>
    <head-top></head-top>
    <!--三级联动-->
    <el-card class="box-card">
      <div class="linkage">
        <div class="linkage-item">
          <span class="linkage-item-span">板块</span>
          <el-select v-model="plate" placeholder="请选择" @change="selectTrigger">
            <el-option
              v-for="item in options"
              :key="item.pId"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </div>
        <div class="linkage-item" v-if="linkage.length!=0">
          <span class="linkage-item-span">类别</span>
          <el-select v-model="sort" placeholder="请选择" @change="linkageTrigger">
            <el-option
              v-for="item in linkage"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </div>
        <div class="linkage-item" v-if="detaliList.length!=0">
          <span class="linkage-item-span">明细</span>
          <el-select v-model="detali" placeholder="请选择" @change="detaliTrigger">
            <el-option
              v-for="item in detaliList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </div>
      </div>
      <!--上传广告图-->
      <div class="upload">
        <span class="upload-span">内容</span>
        <upload @sendValueToParent="sendValueToParent"></upload>
        <!--封面标题输入框-->
        <div class="placeh">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4}"
            placeholder=" 选题，如果不填默认抓取正文前10个字"
            v-model="abstractText"
          ></el-input>
        </div>
      </div>

      <div class="upload">
        <span class="upload-span">品牌授权</span>
        <upload @sendValueToParent="uploadParent"></upload>
        <div class="grid-tag">
          <el-radio-group v-model="isown">
            <el-radio-button label="0">未声明</el-radio-button>
            <el-radio-button label="1">原创声明</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <!--保存预览发布-->
      <div class="pribtn">
        <el-row :gutter="24" :offset="24">
          <el-button @click="onsubmit">保存</el-button>
          <el-button type="primary">预览</el-button>
          <el-button type="success">保存并发布</el-button>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import headTop from "@/components/header";
import upload from "@/components/upload";
import { columnList, saveContent } from "@/api/new";
import axios from "axios";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: { headTop, upload },
  data() {
    return {
      options: [], //标题联动板块
      plate: "", //板块1
      linkage: [], //类别选择
      sort: "", //类别字段1
      detaliList: [], //明细选择联动
      detali: "", //明细字段1
      kid: "", //栏目pId
      icon: [], //广告图片
      abstractText: "", //广告词
      isown: 0 //授权声明
    };
  },
  methods: {
    sendValueToParent(val) {
      console.log(val, "1245das4d5sa4d5as");
    },
    uploadParent(val) {
      console.log(val, "as");
    },
    getcoluml() {
      //三级联动数据请求
      columnList().then(res => {
        this.options = res.data;
      });
    },
    selectTrigger(name) {
      //选择板块
      this.linkage = [];
      this.sort = "";
      this.detali = "";
      let textName = String(name);
      let option = this.options;
      for (let key in option) {
        if (option[key].name == textName) {
          this.linkage = option[key].title2;
        }
      }
    },
    linkageTrigger(name) {
      //选择类别
      this.detaliList = [];
      this.detali = "";
      let linName = String(name);
      let linkage = this.linkage;
      for (let key in linkage) {
        if (linkage[key].name == linName) {
          this.kid = linkage[key].pId;
          this.detaliList = linkage[key].title3;
        }
      }
    },
    detaliTrigger(name) {
      //选择明细
      let detaliName = String(name);
      let detaliList = this.detaliList;
      for (let key in detaliList) {
        if (detaliList[key].name == detaliName) {
          this.kid = detaliList[key].pId;
        }
      }
    },
    //
    handleRemovePic() {
      this.icon = [];
    },
    picUpload(file) {
      this.upLoadImg(file);
      //覆盖上传图片
    },
    handPic(file) {
      const isJPEG = file.name.split(".")[1] === "jpeg";
      const isJPG = file.name.split(".")[1] === "jpg";
      const isPNG = file.name.split(".")[1] === "png";
      const isLt500K = file.size / 1024 / 500 < 2;
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error("上传图片只能是 JPEG/JPG/PNG 格式!");
        return false;
      }
      if (!isLt500K) {
        this.$message.error("单张图片大小不能超过 500KB!");
        return false;
      }
    },
    upLoadImg(file) {
      let pro = new Promise((resolve, reject) => {
        axios
          .get(
            "http://pengyou1688.com/eshop/oss/gettoken?dir=eshop&bucket=pyplatform",
            {}
          )
          .then(res => {
            resolve(res.data);
            console.log(file, "999");
          });
      });
      pro.then(data => {
        let ossData = new FormData();
        let rStr = this.randomString();
        let config = {
          onUploadProgress: progressEvent => {
            this.Flag = true;
            let complete =
              (progressEvent.loaded / progressEvent.total).toFixed(2) * 100;
            this.UploadPercent = complete;
            setTimeout(() => {
              if (complete >= 100) {
                this.Flag = false;
              }
            }, 2000);
          },
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };
        ossData.append("name", file.file.name);
        ossData.append("key", "eshop/goods/" + data.expire + file.file.name);
        ossData.append("policy", data.policy);
        ossData.append("OSSAccessKeyId", data.accessid);
        ossData.append("success_action_status", 200);
        ossData.append("signature", data.signature);
        ossData.append("file", file.file, file.file.name);
        axios
          .post(data.host, ossData, config)
          .then(res => {
            if (res.status == 200) {
              let imgurl =
                "http://platform.pengyou66.com/eshop/goods/" +
                data.expire +
                file.file.name;
              //`${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}.png`;
              let imgData = { uid: file.file.uid, url: imgurl };
              this.icon.push(imgData);
              console.log(this.icon);
            }
          })
          .catch(error => {
            console.log(error, "错误");
          });
      });
    },
    //给图片加字符串
    randomString() {
      var expect = 10; //期望的字符串长度
      var str = Math.random()
        .toString(36)
        .substring(2);
      while (str.length < expect) {
        str = Math.random()
          .toString(36)
          .substring(2);
      }
      return str.substring(0, expect);
    },
    onsubmit() {
      //提交
      if (
        this.kid == "" ||
        this.content == "" ||
        this.textTitle == "" ||
        this.icon == ""
      ) {
        // this.notice = true;
        this.$message.error("请输入必填项：板块，标题，内容，封面图片，谢谢");
      } else {
        let data = {};
        data.pId = this.kid; //栏目
        data.text = this.content; //富文本框输入内容
        data.title = this.textTitle; //标题
        data.coverImg = this.icon[0].url;
        data.status = -1;
        data.isown = this.isown;
        console.log(data, "8");
        saveContent(data)
          .then(res => {
            if (res.code == 200) {
              this.$message.success("保存资讯信息成功");
              setTimeout(() => {
                this.reload();
              }, 3000);
            }
            console.log("666", res);
          })
          .catch(error => {
            console.log(error, "错误");
          });
      }
    }
  },
  created() {
    this.getcoluml();
  },

  computed: {}
};
</script>
<style scoped>
.box-card {
  width: 75%;
  padding-bottom: 30px;
  overflow: auto;
  height: 100%;
}
.linkage {
  width: 100%;
  height: 100px;
  border-top: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.linkage-item {
  padding-right: 30px;
  display: flex;
  align-items: center;
  margin-left: 100px;
}
.linkage-item-span {
  margin-right: 10px;
  color: #666;
  font-size: 20px Extra large;
}
/**/
.upload {
  width: 100%;
  padding-top: 40px;
  border-top: 1px solid #666;
  display: flex;
  padding-bottom: 20px;
  align-items: flex-start;
  border-bottom: 1px solid #666;
}
.upload-span {
  font-size: 20px;
  font-weight: bold;
  color: #000;
  margin: 30px 60px;
}
.upload-add {
  margin-top: 30px;
}
.placeh {
  width: 500px;
  margin-top: 30px;
}

.grid-content {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100px;
  border-bottom: 1px #000 solid;
}
.grid-tag {
  margin-left: 60px;
}
.grid-content-span {
  margin-left: 60px;
}
.pribtn {
  border-bottom: 1px #000 solid;
  padding: 30px;
  padding-right: 150px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>

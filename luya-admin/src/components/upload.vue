
<template>
     <div class="upload-add">
       <el-upload
            action="http://pyplatform.oss-cn-shenzhen.aliyuncs.com"
            list-type="picture-card"
            :on-remove="handleRemovePic"
            :before-upload="handPic"
            :file-list="icon"
            :http-request="picUpload"
            :limit="1"
            style="width:400px;"
          >
            <div slot="tip" class="el-upload__tip">(列表图片，图片宽高比为1.6)</div>
            <el-button size="small" type="primary">点击上传(必填项)</el-button>
          </el-upload>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      icon: []
    };
  },
  components: {},
  props: [],
  mounted() {},
  watch: {},
  methods: {
    picUpload(file) {
      this.upLoadImg(file);
      console.log(file,"5")
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
        axios.get("http://luyabang.com/lyb/oss/gettoken?dir=eshop&bucket=pyplatform",{}).then(res => {
          resolve(res.data);
        });
      });
      pro.then(data => {
        let ossData = new FormData();
        let rStr = this.randomString();
        let config = {
          onUploadProgress: progressEvent => {
            this.Flag = true;
            let complete =(progressEvent.loaded / progressEvent.total).toFixed(2) * 100;
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
        ossData.append("key", "eshop/" + data.expire + file.file.name);
        ossData.append("policy", data.policy);
        ossData.append("OSSAccessKeyId", data.accessid);
        ossData.append("success_action_status", 200);
        ossData.append("signature", data.signature);
        ossData.append("file", file.file, file.file.name);
        axios.post(data.host, ossData, config).then(res => {
            if (res.status == 200) {
              this.$message.success("上传成功");
              let imgurl ="http://pyplatform.oss-cn-shenzhen.aliyuncs.com/eshop/" +data.expire +file.file.name;
              let imgData = { uid: file.file.uid, url: imgurl };
              this.icon.push(imgData);
              this.$emit("sendValueToParent", this.icon);
            }
          })
          .catch(error => {
            this.$message.success("上传失败");
          });
      });
    },
    //给图片加字符串
    randomString() {
      var expect = 10; //期望的字符串长度
      var str = Math.random().toString(36).substring(2);
      while (str.length < expect) {
        str = Math.random().toString(36).substring(2);
      }
      return str.substring(0, expect);
    },
  },
  created() {}
};
</script> 
<style>
.upload {
  width: 100%;
  padding-top: 20px;
  border-top: 1px solid #666;
  display: flex;
  padding-bottom: 20px;
  align-items: flex-start;
  border-bottom: 1px solid #666;
}
.upload-span {
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin: 30px 60px;
}
.upload-add {
  margin-top: 30px;
}
</style>

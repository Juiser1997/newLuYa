<template>
  <div>
    <head-top></head-top>
    <el-card class="newList">
      <div class="block">
        <span class="demonstration">保存时间</span>
        <el-date-picker
          v-model="times"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="dateChangebirthday"
        ></el-date-picker>
      </div>
      <div>
        <el-form ref="form" :model="form" label-width="115px" class="in-name">
          <el-form-item label="用户昵称">
            <el-input v-model="form.name" @change="vachange(val)"></el-input>
          </el-form-item>
          <el-form-item label="内容标题">
            <el-input v-model="form.title"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm">立即查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--表格-->
      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableData"
            style="width: 100%"
            class="box"
            ref="filterTable"
            @selection-change="handleSelectionChange">
            <el-table-column type="index" label="序号" fixed></el-table-column>
            <el-table-column type="expand" label="列表图片" width="150">
              <template slot-scope="props">
                <el-form
                  label-position="left"
                  inline
                  class="demo-table-expand"
                  v-if="props.row.coverImg!=null">
                  <el-form-item label="图片">
                    <img :src="props.row.coverImg" class="icon-img">
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
            <el-table-column
              prop="status"
              label="发布状态"
              width="120"
              :filters="[{text:'发布',value:1},{text:'未发布',value:0}]"
              :filter-method="filterrel"
              filter-placement="bottom-end"
            >
              <template slot-scope="scope">
                <el-tag :type="scope.row.status=== 0 ? 'primary' : 'success'">
                  <span v-if="scope.row.status===1">已发布</span>
                  <span v-if="scope.row.status===0">未发布</span>
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="realName" label="作者" width="80"></el-table-column>
            <el-table-column prop="label" label="标签" width="80"></el-table-column>
            <el-table-column prop="title" label="标题" width="220"></el-table-column>
            <el-table-column
              v-if="useId=='0'"
              prop="isCarousel"
              label="轮播状态"
              width="180"
              :filters="[{text:'轮播资讯',value:1},{text:'普通资讯',value:0}]"
              :filter-method="filterTag"
              filter-placement="bottom-end"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.isCarousel==1"
                  type="warning"
                  size="small"
                  @click="dialogForm(scope.row)"
                >下架轮播</el-button>
                <el-button
                  v-if="scope.row.isCarousel== 0"
                  type="success"
                  size="small"
                  @click="dialogForm(scope.row)"
                >置顶轮播</el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-if="useId=='master'"
              prop="isCarousel"
              label="轮播状态"
              width="180"
              :filters="[{text:'轮播资讯',value:1},{text:'普通资讯',value:0}]"
              :filter-method="filterTag"
              filter-placement="bottom-end"
            >
              <template slot-scope="scope">
                <el-tag :type="scope.row.isCarousel=== 0 ? 'primary' : 'success'">
                  <span v-if="scope.row.isCarousel===1">轮播资讯</span>
                  <span v-if="scope.row.isCarousel===0">普通资讯</span>
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="left" width="250" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status=== 0"
                  type="success"
                  size="small"
                  @click="soldout(scope.row)"
                >发布</el-button>
                <el-button
                  v-if="scope.row.status=== 1"
                  type="warning"
                  size="small"
                  @click="soldout(scope.row)"
                >下架</el-button>
                <el-button type="danger" @click="compile(scope.row)" size="small">编辑</el-button>
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
              :page-size="10"
              :total="total"
            ></el-pagination>
          </div>
        </el-col>
        <el-dialog
          title="上传轮播图片"
          :visible.sync="dialogFormVisible"
          width="40%"
          modal-append-to-body
          center
        >
          <div class="upload">
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
                <div slot="tip" class="el-upload__tip">(列表图片，尺寸建议是460*360)</div>
                <el-button size="small" type="primary">点击上传(必填项)</el-button>
              </el-upload>
              <el-radio-group v-model="isCarouse" size="small" class="isCarousel">
                <el-radio label="0">不轮播图</el-radio>
                <el-radio label="1">设为轮播</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
          </div>
        </el-dialog>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import headTop from "@/components/header";
import {
  contentList,
  contentIssue,
  contentDelete,
  contentUpdate
} from "@/api/new";
import axios from "axios";
export default {
  components: { headTop },
  data() {
    return {
      times: "", //查询时间
      form: {}, //查询表单
      tableData: [], //表格数据
      total: null, //分页
      currentPage: 1, //分页页码
      pageSize: 10, //分页数据
      search: 1, //分页数据
      dialogFormVisible: false, //弹出框
      icon: [], //上传图片
      isData: {}, //上传轮播图
      isCarouse: "0", //是否设为轮播图
      useId: "", //用户标识，大咖，运营
      isCarousel: 0
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
      data.title = this.form.title;
      data.beginTimes = this.times[0];
      data.finishTimes = this.times[1];
      contentList(data).then(res => {
        if (res.code == 200) {
        }
        this.tableData = res.data.items;
      });
    },
    vachange(val) {
    },
    handleSelectionChange(val) {},
    dateChangebirthday(val) {
      this.submitForm();
    },
    getContentList() {
      let data = {};
      data.currentPage = this.currentPage;
      data.pageSize = 10;
      contentList(data).then(res => {
        this.tableData = res.data.items;
        let tableData = this.tableData;
        this.total = res.data.totalNum;
        this.useId = res.data.data;
      });
    },
    handleCurrentChange(val) {
      //分页
      this.currentPage = val;
      let data = { currentPage: val, pageSize: this.pageSize };
      contentList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
        this.search = val;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      let data = { currentPage: this.search, pageSize: this.pageSize };
      contentList(data).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.totalNum;
        this.currentPage = this.search;
      });
    },
    filterTag(value, row) {
      //筛选轮播状态
      return row.isCarousel == value;
    },
    filterrel(value, row) {
      //筛选发布状态
      return row.status === value;
    },
    soldout(e) {
      //发布资讯
      let data = {};
      data.id = e.id;
      let status = e.status;
      if (status == 0) {
        data.status = 1;
        contentIssue(data).then(res => {
          if (res.code == 200) {
            this.$message.success("发布成功");
            this.getContentList();
            status = 0;
            console.log("99", this.currentPage);
          }
        });
      } else {
        //取消发布
        data.status = 0;
        contentIssue(data).then(res => {
          if (res.code == 200) {
            this.$message.success("下架成功");
            this.getContentList();
            status = 1;
            console.log("1199", this.currentPage);
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
      })
        .then(() => {
          let data = { id: e.id };
          console.log(e);
          contentDelete(data).then(res => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.getContentList();
            } else {
              this.$message.error("程序错误，请联系管理员");
            }
          });
        })
        .catch(() => {
          return false;
        });
    },
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
              //`${Date.now()}-${Math.floor(Math.random(0, 1) * 100000000)}.png`;
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
    dialogForm(e) {
      //弹出的时候赋值id
      this.icon = [];
      this.isCarousel = 0;
      let data = this.isData;

      if (e.isCarousel == 0) {
        data.type = e.type;
        data.id = e.id;
        data.isCarousel = 1;
        // data.carouselContentId = e.id;
        this.dialogFormVisible = true;
      } else {
        data.carouselContentId = e.carouselContentId;
        contentUpdate(data).then(res => {
          if (res.code == 200) {
            this.$message.success("成功取消轮播");
            this.getContentList();
          }
        });
      }
    },
    submit() {
      //设为轮播
      let data = this.isData;
      if (this.icon.length == 1) {
        data.isCarousel = this.isCarouse;
        data.carouselImg = this.icon[0].url;
        contentUpdate(data).then(res => {
          if (res.msg == "成功") {
            this.$message.success("上传成功");
            this.dialogFormVisible = false;
            this.getContentList();
          } else if (res.msg == "该栏目轮播图已经达到上限") {
            this.$message.success("该栏目轮播图已经达到上限");
            this.dialogFormVisible = false;
          }
        });
      } else {
        this.$message.success("请上传轮播图片");
      }
    },
    compile(e) {
      let id = e.id;
      this.$router.push("/compileInfo?id=" + id);
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
  padding-bottom: 30px;
  overflow: auto;
  height: 100%;
  width: 85%;
  display: flex;
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
  padding: 10px 0;
}
.icon-img {
  width: 165px;
  height: 120px;
}
.icon-imgs {
  width: 120px;
  height: 100px;
}
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
.isCarousel {
  margin-top: 30px;
}
</style>

<template>
  <div>
    <head-top></head-top>
    <el-container>
      <el-main>
        <el-row>
          <el-col class="searchInp" :span="24" width="100%">
            <div class="block" style="float:left">
              <span class="demonstration">请选择日期</span>
              <el-date-picker
                v-model="day"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                @change="handelcheckday"
              ></el-date-picker>
              <el-button type="primary" size="small" @click="searchday()">查询</el-button>
            </div>
            <!-- 自定义组件 获取时间 -->
            <get-time :time="date">123</get-time>

            <el-table :data="tableData" stripe style="width: 80%;margin:0 auto" border>
              <el-table-column label="排名" width="180" align="center" type="index"></el-table-column>
              <el-table-column prop="nickName" label="作者" width="180" align="center"></el-table-column>
              <el-table-column prop="num" label="访问量" width="180" align="center"></el-table-column>
              <el-table-column prop="title" label="文章标题" align="center"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <div id="main" style="width: 1200px;height:600px;"></div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import headTop from "@/components/header";
import { quillRedefine } from "vue-quill-editor-upload";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { setTimeout } from "timers";
import { totalcontent, Dtotalcontent } from "@/api/new";
import { setCookie, getCookie } from "@/api/axios";
import echarts from "echarts";
import getTime from "@/components/toolsApi/getTime";

export default {
  inject: ["reload"], //注入刷新方法
  components: { headTop, quillRedefine, getTime },
  data() {
    return {
      day: "",
      tableData: [],
      title: "",
      date: "今日",
      saveData: ""
    };
  },
  mounted() {
    totalcontent().then(res => {
      console.log(res.data);
      this.saveData = res.data.items[0].time;
      console.log(this.saveData);

      this.tableData = res.data.items;
    });
  },
  methods: {
    searchday() {
      console.log(this.saveData);
      this.date = this.day == this.saveData ? "今日" : this.day
      console.log(this.date);
      
      if (this.day == "") {
        return this.$message.error("请选择日期");
      }
      let data = { time: this.day };

      Dtotalcontent(data).then(res => {
        if (res.data == "") {
          return this.$message.error("暂无数据");
        }
        console.log(res.data);
        this.tableData = res.data;
        // console.log(this.commentNum);
      });
    },
    handelcheckday(e) {
      // console.log(e);
      // if(!e){
      //   return this.$message.error("请选择数据");
      // }
    }
  }
};
</script>
<style scoped>
.searchInp {
  line-height: 70px;
}
.demonstration {
  margin: 0 10px;
}
.block {
  margin-left: 150px;
}
</style>
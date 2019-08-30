<template>
  <div>
    <head-top></head-top>
    <el-container>
      <el-main>
        <el-row>
          <el-col class="searchInp">
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
            <!-- <span>请选择周</span> -->
            <!-- <div class="block" style="float:left">
              <span class="demonstration">请选择周</span>
              <el-date-picker v-model="week" type="week" format="yyyy 第 WW 周" placeholder="选择周"></el-date-picker>
              <el-button type="primary" size="small" @click="searchweek()">查询</el-button>
            </div>-->
            <!-- <span>请选择月份</span> -->
            <div class="block" style="float:left">
              <span class="demonstration">请选择月份</span>
              <el-date-picker
                v-model="month"
                type="month"
                placeholder="选择月"
                value-format="yyyy-MM"
                @change="handelcheckday"
              ></el-date-picker>
            </div>
            <el-button type="primary" size="small" @click="searchmonth()">查询</el-button>
            <el-button type="primary" size="small" @click="searchall()">查询总数</el-button>
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
import { total, Dtotal } from "@/api/new";
import { setCookie, getCookie } from "@/api/axios";
import echarts from "echarts";

export default {
  inject: ["reload"], //注入刷新方法
  components: { headTop, quillRedefine },
  data() {
    return {
      list: [],
      commentNum: [],
      praiseNum: [],
      stime: [],
      replyNum: [],
      week: "",
      day: "",
      month: "",
      flag: "",
      time: ""
    };
  },
  methods: {
    searchday() {
      if(this.day==""){
        return this.$message.error("请选择日期");
      }
      let data = { flag: "day", time: this.day };
      var myChart = echarts.init(document.getElementById("main"));
      Dtotal(data).then(res => {
        if (res.data == null) {
          return this.$message.error("暂无数据");
        }
        this.commentNum = res.data.commentNum;
        this.praiseNum = res.data.praiseNum;
        this.replyNum = res.data.replyNum;
        this.stime = res.data.time;
        console.log(this.commentNum);

        let option = {
          legend: {},
          tooltip: {},

          dataset: {
            source: [
              ["product", "每日评论数", "每日点赞数", "每日回复数"],
              [this.stime, this.commentNum, this.praiseNum, this.replyNum]
            ]
          },
          xAxis: { type: "category" },
          yAxis: {},
          series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
        };
        myChart.setOption(option);
      });
    },
    handelcheckday(e) {
      // console.log(e);
      // if(!e){
      //   return this.$message.error("请选择数据");
      // }
    },
    searchmonth() {
      if(this.month==""){
        return this.$message.error("请选择月份");
      }
      var myChart = echarts.init(document.getElementById("main"));
      let data = { flag: "month", time: this.month };
      Dtotal(data).then(res => {
        // console.log(res.data);
        if (res.data == null) {
          return this.$message.error("暂无数据");
        }
        this.commentNum = res.data.commentNum;
        this.praiseNum = res.data.praiseNum;
        this.replyNum = res.data.replyNum;
        this.stime = res.data.time;

        let option = {
          legend: {},
          tooltip: {},
          dataset: {
            source: [
              ["product", "每月总评论数", "每月总点赞数", "每月总回复数"],
              [this.stime, this.commentNum, this.praiseNum, this.replyNum]
            ]
          },
          xAxis: { type: "category" },
          yAxis: {},
          series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
        };
        myChart.setOption(option);
      });
    },
    searchall(){
      let data = { flag: "all", time:"all" };
      var myChart = echarts.init(document.getElementById("main"));
      Dtotal(data).then(res => {
        this.commentNum = res.data.commentNum;
        this.praiseNum = res.data.praiseNum;
        this.replyNum = res.data.replyNum;
        this.stime = res.data.time;
        console.log(this.commentNum);

        let option = {
          legend: {},
          tooltip: {},

          dataset: {
            source: [
              ["product", "总评论数", "总点赞数", "总回复数"],
              ["总统计数", this.commentNum, this.praiseNum, this.replyNum]
            ]
          },
          xAxis: { type: "category" },
          yAxis: {},
          series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
        };
        myChart.setOption(option);
      });

    }
  },
  created() {},
  mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    total().then(res => {
      this.list = res.data;
      let arr = this.list;
      for (let i = 0; i < arr.length; i++) {
        this.commentNum.push(arr[i].commentNum);
        this.praiseNum.push(arr[i].praiseNum);
        this.stime.push(arr[i].time);
        this.replyNum.push(arr[i].replyNum);
      }
      let option = {
        legend: {},
        tooltip: {},

        dataset: {
          source: [
            ["product", "每日评论数", "每日点赞数", "每日回复数"],
            [
              this.stime[0],
              this.commentNum[0],
              this.praiseNum[0],
              this.replyNum[0]
            ],
            [
              this.stime[1],
              this.commentNum[1],
              this.praiseNum[1],
              this.replyNum[1]
            ],
            [
              this.stime[2],
              this.commentNum[2],
              this.praiseNum[2],
              this.replyNum[2]
            ],
            [
              this.stime[3],
              this.commentNum[3],
              this.praiseNum[3],
              this.replyNum[3]
            ],
            [
              this.stime[4],
              this.commentNum[4],
              this.praiseNum[4],
              this.replyNum[4]
            ],
            [
              this.stime[5],
              this.commentNum[5],
              this.praiseNum[5],
              this.replyNum[5]
            ],
            [
              this.stime[6],
              this.commentNum[6],
              this.praiseNum[6],
              this.replyNum[6]
            ]
          ]
        },
        xAxis: { type: "category" },
        yAxis: {},
        series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
      };
      myChart.setOption(option);
    });
  }
};
</script>
<style scoped>
.searchInp {
  width: 100%;
  line-height: 70px;
  padding: 0 10px;
  margin: 0 100px;
}
.demonstration {
  margin: 0 10px;
}
</style>
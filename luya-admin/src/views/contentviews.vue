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
            <!-- <el-button type="primary" size="small" @click="searchall()">查询总数</el-button> -->
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
import { contentotal , Dcontentotal} from "@/api/new";
import { setCookie, getCookie } from "@/api/axios";
import echarts from "echarts";

export default {
  inject: ["reload"], //注入刷新方法
  components: { headTop, quillRedefine },
  data() {
    return {
      list: [],
      day: "",
      month: "",
      browseNum: [],
      clickNum: [],
      stime: []
    };
  },
  methods: {
    searchday() {
      if(this.day==""){
        return this.$message.error("请选择日期");
      }
      let data = { flag: "day", time: this.day };
      var myChart = echarts.init(document.getElementById("main"));
      Dcontentotal(data).then(res => {
          if (res.data == null) {
          return this.$message.error("暂无数据");
        }
        this.browseNum=res.data.browseNum
        this.clickNum=res.data.clickNum
        this.stime=res.data.time
        // console.log(this.commentNum);

        let option = {
          legend: {},
          tooltip: {},

          dataset: {
            source: [
              ["product", "每日内容浏览量", "每日标签点击量"],
              [this.stime, this.browseNum, this.clickNum]
            ]
          },
          xAxis: { type: "category" },
          yAxis: {},
          series: [{ type: "bar" }, { type: "bar" }]
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
      Dcontentotal(data).then(res => {
        // console.log(res.data);
        if (res.data == null) {
          return this.$message.error("暂无数据");
        }
        this.browseNum=res.data.browseNum
        this.clickNum=res.data.clickNum
        this.stime=res.data.time

        let option = {
          legend: {},
          tooltip: {},
          dataset: {
            source: [
              ["product", "每月总浏览数", "每月总点击数"],
              [this.stime, this.browseNum, this.clickNum]
            ]
          },
          xAxis: { type: "category" },
          yAxis: {},
          series: [{ type: "bar" }, { type: "bar" }]
        };
        myChart.setOption(option);
      });
    },
    
  },
  created() {},
  mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    contentotal().then(res => {
      console.log(res.data);

      this.list = res.data;
      let arr = this.list;
      for (let i = 0; i < arr.length; i++) {
        this.browseNum.push(arr[i].browseNum);
        this.clickNum.push(arr[i].clickNum);
        this.stime.push(arr[i].time);
        // this.replyNum.push(arr[i].replyNum);
      }
        let option = {
          legend: {},
          tooltip: {},

      dataset: {
        source: [
          ["product", "每日内容浏览量", "每日标签点击量", ],
          [
            this.stime[0],
            this.browseNum[0],
            this.clickNum[0],
          ],
          [
            this.stime[1],
            this.browseNum[1],
            this.clickNum[1],
          ],
          [
            this.stime[2],
            this.browseNum[2],
            this.clickNum[2],
          ],
          [
            this.stime[3],
            this.browseNum[3],
            this.clickNum[3],
          ],
          [
            this.stime[4],
            this.browseNum[4],
            this.clickNum[4],
          ],
          [
            this.stime[5],
            this.browseNum[5],
            this.clickNum[5],
          ],
          [
            this.stime[6],
            this.browseNum[6],
            this.clickNum[6],
          ]
        ]
      },
          xAxis: { type: "category" },
          yAxis: {},
          series: [{ type: "bar" }, { type: "bar" }]
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
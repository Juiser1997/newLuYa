<template>
  <div>
    <head-top></head-top>
    <el-container>
      <el-main class="mainBox">
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
          </el-col>
        </el-row>
        <div class="dateBox">{{renderDate}}</div>
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
import { totalcl, Dtotalcl } from "@/api/new";
import { setCookie, getCookie } from "@/api/axios";
import echarts from "echarts";

export default {
  inject: ["reload"], //注入刷新方法
  components: { headTop, quillRedefine },
  data() {
    return {
      day: "",
      list: [],
      name: [],
      num: [],
      renderDate: ''
    };
  },
  mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    totalcl().then(res => {
      // 默认显示最新日期
      const len = res.data.length
      let boxDate = res.data[len -1].time
      this.renderDate = boxDate
      
      this.list = res.data;
      let arr = this.list;
      for (let i = 0; i < arr.length; i++) {
        this.name.push(arr[i].name);
        this.num.push(arr[i].num);
      }
      let option = {
        legend: {},
        tooltip: {},

        dataset: {
          source: [
            ["product", "栏目访问量"],
            [this.name[0], this.num[0]],
            [this.name[1], this.num[1]],
            [this.name[2], this.num[2]],
            [this.name[3], this.num[3]],
            [this.name[4], this.num[4]],
            [this.name[5], this.num[5]],
            [this.name[6], this.num[6]],
            [this.name[7], this.num[7]],
            [this.name[8], this.num[8]],
            [this.name[9], this.num[9]]
          ]
        },
        xAxis: { type: "category" },
        yAxis: {},
        series: [{ type: "bar" }]
      };
      myChart.setOption(option);
    });
  },
  methods: {
    searchday() {
      if(this.day) this.renderDate = this.day
      console.log('-----');
      
      console.log(this.day)
      if (this.day == "") {
        return this.$message.error("请选择日期");
      }
      let data = { time: this.day };
      var myChart = echarts.init(document.getElementById("main"));

      Dtotalcl(data).then(res => {
        if (res.data == "") {
          return this.$message.error("暂无数据");
        }
        this.num = [];
        this.name = [];
        for (let j = 0; j < res.data.length; j++) {
          this.name.push(res.data[j].name);
          this.num.push(res.data[j].num);
        }
        let option = {
          legend: {},
          tooltip: {},

          dataset: {
            source: [
              ["product", "每日栏目访问量"],
              [this.name[0], this.num[0]],
              [this.name[1], this.num[1]],
              [this.name[2], this.num[2]],
              [this.name[3], this.num[3]],
              [this.name[4], this.num[4]],
              [this.name[5], this.num[5]],
              [this.name[6], this.num[6]],
              [this.name[7], this.num[7]],
              [this.name[8], this.num[8]],
              [this.name[9], this.num[9]]
            ]
          },
          xAxis: { type: "category" },
          yAxis: {},
          series: [{ type: "bar" }]
        };
        myChart.setOption(option);
      });
    },
    handelcheckday(e) {
      // if(e) this.renderDate = e
    }
  }
};
</script>
<style scoped>
/deep/ .mainBox {
  position: relative;
}
.dateBox {
  position: absolute;
  left: 481px;
  top: 94px;
}

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
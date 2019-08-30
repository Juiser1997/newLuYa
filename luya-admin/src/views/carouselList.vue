<template>
  <div>
    <head-top></head-top>
    <el-container>
      <el-main>
        <el-row>
          <el-col class="searchInp">
            <span>文章标题：</span>
            <el-input
              size="mini"
              v-model="title"
              class="searchInput"
              clearable
              placeholder="文章标题查询"
            ></el-input>
            <span class="label">分类：</span>
            <el-select
              v-model="plate"
              placeholder="板块栏目"
              size="mini"
              @change="selectTrigger"
              class="type"
              clearable
            >
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="sorts" placeholder="类别栏目" size="mini" class="type" clearable>
              <el-option v-for="item in linkage" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-button type="primary" size="small" @click="Search()">查询</el-button>
            <el-button type="success" size="small" @click="Empty()">清空</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="box">
            <el-table :data="carouelList">
              <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
              <el-table-column prop="title" label="文章标题" width="350" align="center"></el-table-column>
              <el-table-column label="轮播图片" width="350" align="center">
                <template slot-scope="props">
                  <span>
                    <img
                      :src="props.row.carouselImg || `http://p1.pstatp.com/large/61640000c66f7b2cf064`"
                      width="100"
                      height="60"
                    />
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="所在栏目" align="center" width="350"></el-table-column>
              <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="Cancel(scope.row)">取消轮播</el-button>
                  <el-button type="success" size="mini" @click="Edit(scope.row)">编辑</el-button>
                  <el-button type="info" size="mini" @click="Sort(scope.row)">排序</el-button>
                  <el-button type="warning" size="mini" @click="Change(scope.row)">修改</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block">
              <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                background
                layout="total,prev,pager,next,sizes"
                :page-sizes="[10, 50, 100]"
                :pageSize="pageSize"
                :total="total"
                align="right"
              ></el-pagination>
            </div>
            <!-- 编辑 -->
            <el-dialog
              title="编辑"
              center
              :visible.sync="dialogVisible"
              width="30%"
              modal-append-to-body
            >
              <el-col width="100%" class="form">
                <el-form ref="imgForm" label-width="110px">
                  <el-form-item label="轮播图：">
                    <el-input v-model="imgForm.carouselImg" placeholder="请输入轮播图路径" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="上传图片：">
                    <uploadBtn v-on:up-icon="carPlus" v-on:down-icon="carRemove" :imgs="imgs"></uploadBtn>
                  </el-form-item>
                </el-form>
              </el-col>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="savePerson()">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 排序 -->
            <el-dialog
              title="排序"
              center
              :visible.sync="dialogSort"
              width="30%"
              modal-append-to-body
            >
              <el-col width="100%" class="form">
                <el-form ref="sortForm" label-width="110px">
                  <el-form-item label="图一：">
                    <img :src="imgOne" width="150" height="100" />
                  </el-form-item>
                  <el-form-item label="排序：">
                    <el-input v-model="sortForm.one" type="number" placeholder="请输入序号" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="图二：" v-if="list.length >= 2">
                    <img :src="imgTwo" width="150" height="100" alt="暂无图片" />
                  </el-form-item>
                  <el-form-item label="排序：" v-if="list.length >= 2">
                    <el-input v-model="sortForm.two" type="number" placeholder="请输入序号" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="图三：" v-if="list.length >= 3">
                    <img :src="imgThree" width="150" height="100" alt="暂无图片" />
                  </el-form-item>
                  <el-form-item label="排序：" v-if="list.length >= 3">
                    <el-input v-model="sortForm.three" type="number" placeholder="请输入序号" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="图四：" v-if="list.length >= 4">
                    <img :src="imgFour" width="150" height="100" alt="暂无图片" />
                  </el-form-item>
                  <el-form-item label="排序：" v-if="list.length >= 4">
                    <el-input v-model="sortForm.four" type="number" placeholder="请输入序号" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="图五：" v-if="list.length == 5">
                    <img :src="imgFive" width="150" height="100" alt="暂无图片" />
                  </el-form-item>
                  <el-form-item label="排序：" v-if="list.length == 5">
                    <el-input v-model="sortForm.five" type="number" placeholder="请输入序号" clearable></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogSort = false">取 消</el-button>
                <el-button type="primary" @click="saveSort()">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 修改 -->
            <el-dialog
              title="修改轮播模块"
              :visible.sync="dialogFormVisible"
              width="40%"
              modal-append-to-body
              center
            >
              <span class="label">分类：</span>
              <div style="margin-bottom:20px">
                <el-select
                  v-model="plate"
                  placeholder="板块栏目(必选项)"
                  size="mini"
                  @change="selectTrigger"
                  class="type"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <el-select
                  v-model="sorts"
                  placeholder="类别栏目(必选项)"
                  size="mini"
                  @change="linkageTrigger"
                  class="type"
                >
                  <el-option
                    v-for="item in linkage"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="savePath()">确 定</el-button>
              </span>
            </el-dialog>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
import headTop from "@/components/header";
import { changesort } from "@/api/api";
import {
  columnDetails,
  carouelList,
  deleteCarousel,
  updateCarousel,
  changeSort,
  changecarousel
} from "@/api/new";
import uploadBtn from "@/components/uploadBtn";
import { getCookie } from "@/api/axios";

export default {
  name: "carouelList",
  inject: ["reload"], //注入刷新方法
  components: { headTop, uploadBtn },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: null,
      title: "", //文章标题
      plate: "", //板块1
      sorts: "", //二级栏目1
      options: [], //标题联动板块
      linkage: [], //类别选择
      carouelList: [], //轮播列表数组
      dialogVisible: false,
      dialogSort: false,
      dialogFormVisible: false,
      id: "",
      parentId: "",
      imgForm: {
        //编辑表单
        id: "",
        carouselImg: "" //图片
      },
      sortForm: {
        one: "",
        two: "",
        three: "",
        four: "",
        five: ""
      },
      parentId: "",
      imgOne: "",
      imgTwo: "",
      imgThree: "",
      imgFour: "",
      imgFive: "",
      imgs: [], //轮播图片
      list: []
    };
  },
  created() {
    this.getcoluml();
    this.getCarList();
  },
  methods: {
    //三级联动数据请求
    getcoluml() {
      columnDetails().then(res => {
        this.options = res.data;
      });
    },
    getCarList() {
      let data = { currentPage: this.currentPage, pageSize: this.pageSize };
      carouelList(data).then(res => {
        this.carouelList = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    //选择板块
    selectTrigger(id) {
      this.linkage = [];
      this.detaliList = [];
      this.detali = "";
      let option = this.options;
      for (let key in option) {
        if (option[key].id == id) {
          this.linkage = option[key].title2;
        }
      }
      this.sorts = this.linkage[0].id;
    },
    //查询
    Search() {
      let data = { currentPage: 1, pageSize: this.pageSize };
      if (this.title) {
        data.title = this.title;
      }
      if (this.sorts) {
        data.parentId = this.sorts;
      }
      carouelList(data).then(res => {
        this.carouelList = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    //清空
    Empty() {
      this.title = "";
      this.plate = "";
      this.sorts = "";
      let data = { currentPage: this.currentPage, pageSize: this.pageSize };
      carouelList(data).then(res => {
        this.carouelList = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    //取消轮播
    Cancel(e) {
      this.$confirm("是否取消此轮播图？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCarousel(e.id).then(res => {
            if (res.code == 200) {
              this.$message.success("取消成功");
              this.getCarList();
            } else {
              this.$message.error("系统错误，请联系管理员");
            }
          });
        })
        .catch(() => {
          return false;
        });
    },
    //编辑
    Edit(e) {
      this.dialogVisible = true;
      this.imgForm.carouselImg = e.carouselImg;
      this.imgForm.id = e.id;
    },
    //微信名片处理
    carPlus(data) {
      this.imgs.push(data);
      this.imgForm.carouselImg = data.url;
    },
    carRemove() {
      this.imgs = [];
      this.imgForm.carouselImg = "";
    },
    //确认编辑
    savePerson() {
      let data = this.imgForm;
      if (!this.imgForm.carouselImg) {
        return this.$message.error("请上传轮播图");
      }
      updateCarousel(data).then(res => {
        this.$message.success("修改成功"),
          setTimeout(() => {
            // this.dialogVisible = false;
            // this.getCarList();
            this.reload();
          }, 1000);
      });
    },
    //排序
    Sort(e) {
      this.dialogSort = true;
      this.parentId = e.parentId;
      let data = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        parentId: e.parentId
      };
      let list = {};
      carouelList(data).then(res => {
        list = res.data.items;
        if (list.length > 0) {
          this.imgOne = list[0].carouselImg;
          this.sortForm.one = list[0].sort;
        }
        if (list.length > 1) {
          this.imgTwo = list[1].carouselImg;
          this.sortForm.two = list[1].sort;
        }
        if (list.length > 2) {
          this.imgThree = list[2].carouselImg;
          this.sortForm.three = list[2].sort;
        }
        if (list.length > 3) {
          this.imgFour = list[3].carouselImg;
          this.sortForm.four = list[3].sort;
        }
        if (list.length > 4) {
          this.imgFive = list[4].carouselImg;
          this.sortForm.five = list[4].sort;
        }
        this.list=list;
      });
    },
    //修改排序
    saveSort() {
      let datas = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        parentId: this.parentId
      };
      let list = {};
      carouelList(datas).then(res => {
        this.list = res.data.items;
        list = res.data.items;
        let data = [];
        let sort = [
          { sort: "" },
          { sort: "" },
          { sort: "" },
          { sort: "" },
          { sort: "" }
        ];
        sort[0].sort = this.sortForm.one;
        sort[1].sort = this.sortForm.two;
        sort[2].sort = this.sortForm.three;
        sort[3].sort = this.sortForm.four;
        sort[4].sort = this.sortForm.five;
        for (var i = 0; i < list.length; i++) {
          let a = {};
          a.id = list[i].id;
          a.sort = sort[i].sort;
          data.push(a);
        }
        let sj = {};
        var obj = JSON.stringify(data);
        changeSort(obj).then(res => {
          this.$message.success("修改成功"),
            setTimeout(() => {
              this.reload();
            }, 1000);
        });
        // axios.post(changesort, data).then(res => {
        //    console.log(res)
        // })
        // axios.post('/carousel/changsort', obj).then(res => {
        //     this.$message.success('修改成功'),
        //     setTimeout(()=>{
        //         this.reload()
        //     },1000)
        // });
      });
    },
    //分页
    handleCurrentChange(val) {
      this.currentPage = val;
      let data = { currentPage: val, pageSize: this.pageSize };
      if (this.title) {
        data.title = this.title;
      }
      if (this.sorts) {
        data.parentId = this.sorts;
      }
      carouelList(data).then(res => {
        this.carouelList = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      let data = { currentPage: this.currentPage, pageSize: this.pageSize };
      if (this.title) {
        data.title = this.title;
      }
      if (this.sorts) {
        data.parentId = this.sorts;
      }
      carouelList(data).then(res => {
        this.carouelList = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    //修改
    Change(e) {
      this.dialogFormVisible = true;
      this.id = e.id;
    },
    //二级栏目
    linkageTrigger(id) {
      this.detaliList = [];
      this.detali = "";
      let linkage = this.linkage;
      for (let key in linkage) {
        if (linkage[key].id == id) {
          if (linkage[key].title3) {
            this.detaliList = linkage[key].title3;
          }
        }
      }
    },

    //确认修改
    savePath() {
      let data = { id: this.id, parentId: this.sorts };
      if (this.plate == "" || this.sorts == "") {
        return this.$message.error("请选择修改项");
      } else {
        changecarousel(data).then(res => {
          if(res.data==800){
            return this.$message.error('该栏目轮播图已有五张，请先取消该栏目下的其他轮播图');            
          }
          if (res.code == 200) {
            this.$message.success("轮播更改成功");
            this.getCarList();
          }
          this.dialogFormVisible = false;
        });
      }
    }
  }
};
</script>
<style scoped>
.searchInp {
  width: 100%;
  line-height: 70px;
  padding: 0 10px;
}
.searchInp > span {
  display: inline-block;
  margin-left: 20px;
  font-size: 14px;
}
.searchInp > .el-button {
  margin-left: 30px;
}
.searchInput {
  display: inline-block;
  width: 180px;
}
.block {
  background-color: #fff;
  padding: 15px 0;
  width: 100%;
}
</style>


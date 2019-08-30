<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row>
                  <el-col :span="24">
                    <el-table :data="shoplist" style="width: 100%" class="box" ref="filterTable">
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column prop="id" label="商家编号" width="200"></el-table-column>
                        <el-table-column label="商家logo" width="100">
                            <template slot-scope="scope">
                            <img :src="scope.row.headImg" width="40" height="40">
                            </template>
                        </el-table-column>
                        <el-table-column prop="nickName" label="商家名称" width="100"></el-table-column>
                        <el-table-column prop="realName" label="联系人" width="100"></el-table-column>
                        <el-table-column prop="remark" label="商家标语" width="100"></el-table-column>
                        <el-table-column prop="phone" label="电话" width="120"></el-table-column>
                        <el-table-column prop="tgUrl" label="推广地址" width="400"></el-table-column>
                        <el-table-column align="center" width="300" fixed="right">
                            <template slot="header" slot-scope="scope">
                                <el-input  
                                    v-model="search" 
                                    size="mini" 
                                    placeholder="输入用户昵称" 
                                    clearable
                                    @clear="reduction"
                                    @keyup.enter.native="SearchSubmit"/>
                            </template>
                            <template slot-scope="scope">
                                <el-button @click="Edit(scope.row)"  type="primary" size="small">编辑</el-button>
                                <el-button @click="Delete(scope.row)"  type="danger" size="small">删除</el-button>
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
                                :total="total">
                            </el-pagination>
                        </div>
                  </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import headTop from "@/components/header";
import { shopList,deleteShop} from "@/api/new";
export default {
components: { headTop },
  data() {
    return {
        shoplist:[],
        currentPage: 1,
        pageSize: 10,
        total:0,
        search:'',
    };
  },
  methods:{
    //分页
    handleCurrentChange(val) {
      this.currentPage = val;
      let data = { currentPage: val, pageSize: this.pageSize };
      shopList(data).then(res => {
        this.shoplist = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      let data = { currentPage: this.currentPage, pageSize: this.pageSize };
      shopList(data).then(res => {
        this.shoplist = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    //商家名称
    SearchSubmit(){
        let data = {currentPage:1,pageSize:10,name:this.search}
        shopList(data).then(res=>{
            this.shoplist = res.data.items;
            this.total = res.data.totalNum;
            this.currentPage = 1;
            this.pageSize = 10;
        })
    },
    reduction(){
        let data = {currentPage:1,pageSize:10}
        shopList(data).then(res=>{
            this.shoplist = res.data.items;
            this.total = res.data.totalNum;
            this.currentPage = 1;
            this.pageSize = 10;
        })
    },
    Edit(e){
        this.$router.push('/editshop?id='+e.id)
    },
    Delete(e){
        this.$confirm("是否删除此商家？","提示",{
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            deleteShop(e.id).then(res=>{
                if(res.code==200){
                    this.$message.success('删除成功');
                    this.getList();
                }else{
                    this.$message.error('程序错误，请联系管理员');
                } 
            })
        }).catch(() => {
            return false;
        })
    },
    getList(){
        let data = {currentPage:this.currentPage,pageSize:this.pageSize}
        shopList(data).then(res=>{
            this.shoplist = res.data.items;
            this.total = res.data.totalNum;
        })
    }
  },
  created(){
      this.getList();
  }
}
</script>
<style scoped>

</style>



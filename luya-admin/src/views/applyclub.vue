<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row>
                  <el-col :span="24">
                    <el-table :data="shoplist" style="width: 100%" class="box" ref="filterTable">
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column prop="realName" label="姓名" width="100"></el-table-column>
                        <el-table-column prop="nickName" label="昵称" width="100"></el-table-column>
                        <el-table-column prop="wxh" label="微信号" width="150"></el-table-column>
                        <el-table-column label="头像" width="100">
                            <template slot-scope="scope">
                            <img :src="scope.row.headImg" width="40" height="40">
                            </template>
                        </el-table-column>
                        <el-table-column prop="sex" label="性别" width="50"></el-table-column>
                        <el-table-column prop="phone" label="电话" width="120"></el-table-column>
                        <el-table-column prop="address" label="地址" width="150"></el-table-column>
                        <el-table-column prop="birthday" label="生日" width="100"></el-table-column>
                        <el-table-column prop="createTime" label="申请时间" width="400"></el-table-column>
                        <el-table-column align="center" width="300" fixed="right">
                            <template slot-scope="scope">
                                <el-button @click="Edit(scope.row)"  type="primary" size="small">通过</el-button>
                                <el-button @click="Delete(scope.row)"  type="danger" size="small">拒绝</el-button>
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
            <!-- 弹窗取消或不通过 -->
            <el-dialog title="取消或不通过授权" :visible.sync="dialogFormVisible" width="40%" modal-append-to-body center>
                <el-form>
                    <el-form-item label="理由">
                        <el-input v-model="reason" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitApply()">确 定</el-button>
            </div>
            </el-dialog>
        </el-container>
    </div>
</template>
<script>
import headTop from "@/components/header";
import { clubList,clubNopass,clubUpdate} from "@/api/new";
export default {
components: { headTop },
  data() {
    return {
        shoplist:[],
        currentPage: 1,
        pageSize: 10,
        total:0,
        search:'',
        dialogFormVisible:false,
        id:'',
        reason:'',
        
    };
  },
  methods:{
    //分页
    handleCurrentChange(val) {
      this.currentPage = val;
      let data = { currentPage: val, pageSize: this.pageSize,status:0 };
      clubList(data).then(res => {
        this.shoplist = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      let data = { currentPage: this.currentPage, pageSize: this.pageSize ,status:0};
      
      clubList(data).then(res => {
        this.shoplist = res.data.items;
        this.total = res.data.totalNum;
      });
    },
    //商家名称
    // SearchSubmit(){
    //     let data = {currentPage:1,pageSize:10,name:this.search,status:0}
    //     clubList(data).then(res=>{
    //         this.shoplist = res.data.items;
    //         this.total = res.data.totalNum;
    //         this.currentPage = 1;
    //         this.pageSize = 10;
    //     })
    // },
    // reduction(){
    //     let data = {currentPage:1,pageSize:10}
    //     clubList(data).then(res=>{
    //         this.shoplist = res.data.items;
    //         this.total = res.data.totalNum;
    //         this.currentPage = 1;
    //         this.pageSize = 10;
    //     })
    // },
    Edit(e){
        let data = {id:e.id}
        clubUpdate(data).then(res=>{
            if(res.code==200){
                this.$message.success('申请成功');
                this.getList();
            }else{
                this.$message.error('程序错误，请联系管理员');
            } 
        })
    },
    Delete(e){
        this.dialogFormVisible = true;
        this.id = e.id;
    },
    submitApply(){
        if(this.reason==''){
            return this.$message.error('请填写原因');
        }
        let data = {id:this.id,reason:this.reason,}
        clubNopass(data).then(res=>{
            if(res.code==200){
                this.$message.success('删除成功');
                this.getList();
            }else{
                this.$message.error('程序错误，请联系管理员');
            } 
        })
    },
    getList(){
        let data = {currentPage:this.currentPage,pageSize:this.pageSize,status:0}
        clubList(data).then(res=>{
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

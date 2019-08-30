<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row>
                  <el-col :span="12">
                      <el-form :model="shop" label-width="150px">
                        <el-form-item label="名称">
                            <el-input v-model="shop.name" placeholder="输入商家名称"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人">
                            <el-input v-model="shop.contacts" placeholder="输入商家联系人"></el-input>
                        </el-form-item>
                        <el-form-item label="电话">
                            <el-input v-model="shop.phone" placeholder="输入商家电话"></el-input>
                        </el-form-item>
                        <el-form-item label="标语">
                            <el-input v-model="shop.remark" placeholder="输入商家标语"></el-input>
                        </el-form-item>
                        <el-form-item label="地址">
                            <el-input v-model="shop.address" placeholder="输入商家地址"></el-input>
                        </el-form-item>
                        <el-form-item label="推广地址">
                            <el-input v-model="shop.tgUrl" placeholder="输入商家推广URL地址"></el-input>
                        </el-form-item>
                        <el-form-item label="商家logo">
                            <uploadBtn 
                                v-on:up-icon="upIcon" 
                                v-on:down-icon="removeIcon"
                                :imgs="icon">
                            </uploadBtn>
                        </el-form-item>
                        <el-form-item label="商家封面">
                            <uploadBtn 
                                v-on:up-icon="upImg" 
                                v-on:down-icon="removeImg"
                                :imgs="coverImg">
                            </uploadBtn>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="send"  type="primary">修改</el-button>
                            <el-button @click="back"  type="infor">返回</el-button>
                        </el-form-item>
                      </el-form>
                  </el-col>
                </el-row>
            </el-main>
        </el-container>  
    </div>
</template>

<script>
import headTop from '@/components/header';
import uploadBtn from '@/components/uploadBtn';
import {getShop,updateShop} from '@/api/new'
import {clear} from'@/util/util'
export default {
    components:{headTop,uploadBtn},
    inject:['reload'],//注入刷新方法

    data() {
        return {
            shop:{
                name:'',//商家名称
                address:'',//商家联系地址
                contacts:'',//商家联系人
                phone:'',//联系电话
                remark:'',//商家标语
                tgUrl:'',//推广地址
            },
            icon:[],//商家图标
            coverImg:[],//商家封面
            
        }
    },    
    created(){
        let  id = this.$route.query.id;
        getShop(id).then(res=>{
            this.shop =res.data;
            this.icon = [{uid:123456,url:res.data.icon}]
            this.coverImg = [{uid:123456,url:res.data.coverImg}]
        })
    },
    methods: {
        upIcon(data){
            this.icon.push(data)
        },
        removeIcon(){
            this.icon = [];
        },
        upImg(data){
            this.coverImg.push(data)
        },
        removeImg(){
            this.coverImg = [];
        },
        send(){
            let data = this.shop;
            data.icon = this.icon[0].url;
            data.coverImg = this.coverImg[0].url;
            clear(data)
            updateShop(data).then(res=>{
               this.$message.success('提交成功')
            })
        },
        back(){
            this.$router.go(-1)
        }
    }
}
</script>
<style scoped>

</style>
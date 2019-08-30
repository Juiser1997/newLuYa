<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row>
                  <el-col :span="12">
                      <el-form :model="shop" label-width="150px">
                        <el-form-item label="名称：">
                            <el-input v-model="shop.nickName" placeholder="输入商家名称"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人：">
                            <el-input v-model="shop.realName" placeholder="输入商家联系人"></el-input>
                        </el-form-item>
                        <el-form-item label="电话：">
                            <el-input v-model="shop.phone" type="number" maxlength="11" placeholder="输入商家电话"></el-input>
                        </el-form-item>
                        <el-form-item label="简介：">
                            <el-input v-model="shop.remark" placeholder="输入商家简介"></el-input>
                        </el-form-item>
                        <el-form-item label="地址：">
                            <el-input v-model="shop.address" placeholder="输入商家地址"></el-input>
                        </el-form-item>
                        <el-form-item label="推广地址：">
                            <el-input v-model="shop.tgUrl" placeholder="输入商家推广URL地址"></el-input>
                        </el-form-item>
                        <el-form-item label="商家logo：">
                            <cat-down 
                                :List="icon" 
                                v-on:sub-mit="upIcon"
                                v-on:remove="removeIcon">
                            </cat-down>
                        </el-form-item>
                        <el-form-item label="商家封面：">
                            <uploadBtn 
                                v-on:up-icon="upImg" 
                                v-on:down-icon="removeImg"
                                :imgs="coverImg">
                            </uploadBtn>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="send"  type="primary">提交</el-button>
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
import catDown from '@/components/catdown'
import {addShop} from '@/api/new'
import {check} from'@/util/util'
export default {    
    components:{headTop,uploadBtn,catDown},
    inject:['reload'],//注入刷新方法

    data() {
        return {
            shop:{
                nickName:'',//商家名称
                address:'',//商家联系地址
                realName:'',//商家联系人
                phone:'',//联系电话
                remark:'',//商家标语
                tgUrl:'',//推广地址
            },
            icon:[],//商家图标
            coverImg:[],//封面
        }
    },    
    created(){
        
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
            data.headImg = this.icon[0].url;
            data.coverImg = this.coverImg[0].url;
            data.roleId = '2019080214444277130';
            if(!check(data)){return this.$message.error('是否有空值项');}
            addShop(data).then(res=>{
               this.$message.success('提交成功'),
                setTimeout(()=>{
                    this.reload();
                },3000)
            })
        }
    }
}
</script>
<style scoped>

</style>
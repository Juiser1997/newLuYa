<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row>
                  <el-col :span="18" :offset="3">
                    <span class="label">内容:</span>
                    <div class="title">{{text}}</div>
                    <div class="title" style="width:200px;margin:10px;" v-for="(item,index) in imgs" :key="index">
                      <img :src="item" alt="" style="width:100%;">
                    </div>
                  </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import headTop from "@/components/header";
import {dtreport} from "@/api/new";

export default {
    components: { headTop},

    data(){
        return{
            text:"",
            imgs:[]
        }
    },
    created(){
        // let data = {title:this.$route.query.title,content:this.$route.query.content}
        // this.title=data.title;
        // this.content=data.content; 
        let id=this.$route.query.id;
        dtreport({id:id}).then(res=>{
            console.log(res.data);
            this.imgs=res.data.imgs
            this.text=res.data.text
            
        })       
    },
    methods:{   
        
    }

}
</script>
<style scoped>
.label{width: 100px;padding: 10px 0; padding-right: 20px;float: left;text-align: right;}
.title{float: left;width: calc(100% - 120px);padding: 10px 0;}
</style>



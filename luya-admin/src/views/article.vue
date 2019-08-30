<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row>
                  <el-col :span="18" :offset="3">
                    <span class="label">标题</span>
                    <div class="title">{{article.title}}</div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="18" :offset="3">
                    <span class="label">内容</span>
                    <div class="title">
                        <p v-html="article.content"></p>
                    </div>
                  </el-col>
                </el-row>
            </el-main>
        </el-container>

    </div>
</template>
<script>
import headTop from "@/components/header";
import {contentGet} from "@/api/new";

export default {
    components: { headTop},
    data(){
        return{
            article:{},
        }
    },
    created(){
        let id = this.$route.query.id;
        contentGet({id:id}).then(res=>{
            console.log(res.data.content)
            this.article = res.data.content;
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



<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <el-row class="box">
                    <p>账号生成</p>
                    <el-col>
                        <label><span style="color:#409EFF">品牌商账号</span>(全部栏目均可以发布文章)</label>
                        <el-button type="primary" size="small" @click="creat()">生成账号</el-button>
                    </el-col>
                    <el-col>
                        <label><span style="color:#E6A23C">大咖账号</span>(除"导购"栏目外均可以发布文章)</label>
                        <el-button type="primary" size="small" @click="go()">生成账号</el-button>
                    </el-col>
                    <el-col>
                        <label><span style="color:#67C23A">商家账号</span>(仅限于"导购"栏目内发布文章)</label>
                        <el-button type="primary" size="small" @click="creatNum()">生成账号</el-button>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import headTop from '@/components/header';
export default {
    name:'merchantList',
    components:{headTop},
    data(){
        return {
        }
    },
    created(){
    },
    methods:{
        go(){
            this.$router.push("/higherUps?roleId=" + 'master')
        },
        creat(){
            this.$router.push("/higherUps?roleId=" + '2019080214441887640')
        },
        creatNum(){
            this.$router.push("/higherUps?roleId=" + '2019080214444277130')

        }
    }
}
</script>
<style scoped>
.el-main{margin: 0;padding:0}
.box{font-size: 15px;background-color: #fff;height:100%; padding: 50px 25px;margin-bottom: 15px;line-height: 50px;}
.el-col{text-indent: 2em;display: flex}
label{width: 350px}
p{font-size: 20px;line-height: 30px;padding: 15px 0;}
.el-button{margin-left: 10px;height: 30px;align-self: center}
</style>


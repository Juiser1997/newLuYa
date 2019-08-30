<template>
    <div>
        <head-top></head-top>
        <el-container>
            <el-main>
                <cat-down 
                    :List="icon" 
                    v-on:sub-mit="submit"
                    v-on:remove="removeIcon">
                </cat-down>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import VueCropper from 'vue-cropper'
import headTop from '@/components/header';
import catDown from '@/components/catdown'
import {upload} from '@/util/util'
export default {
    components:{headTop,catDown}, 
    data(){
        return{
            icon:[],
        }
    },
    methods:{
        submit(e){
            this.icon.push(e)
        },
        removeIcon(e){
            this.icon = [];
        }
    }
}
</script>
<style scoped>
</style>



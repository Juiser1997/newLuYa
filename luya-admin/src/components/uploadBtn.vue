<template>
    <div>
        <el-upload                          
            action="http://pyplatform.oss-cn-shenzhen.aliyuncs.com"  
            list-type="picture"                       
            :on-remove="handleRemovePic"                          
            :before-upload="handPic"  
            :file-list="imgs"                          
            :http-request="uploadimg" 
            :limit="1"
            style="width:400px;">
            <!-- <div slot="tip" class="el-upload__tip">(列表图片，尺寸建议是460*360)</div>          -->
            <el-button size="small" type="primary">点击上传</el-button> 
        </el-upload>
        <el-progress :percentage="UploadPercent" v-if="Flag"></el-progress>
    </div>
</template>
<script>
import axios from 'axios';
import {randomStr} from '@/util/util';
export default {
    props:{
        imgs:Array
    },
    data(){
        return{
            UploadPercent:0,
            Flag : false,
        }
    },
    methods:{
        // 限制图片类型和大小
        handPic(file){
            const isJPEG = file.name.split('.')[1] === 'jpeg';
            const isJPG = file.name.split('.')[1] === 'jpg';
            const isPNG = file.name.split('.')[1] === 'png';
            const isLt500K = file.size / 1024 / 500 < 2;
            if (!isJPG && !isJPEG && !isPNG) {
                this.$message.error('上传图片只能是 JPEG/JPG/PNG 格式!');
                return false;
            }
            if (!isLt500K) {
                this.$message.error('单张图片大小不能超过 500KB!');
                return false;
            }
        },
        //上传图片
        uploadimg(file){
            let pro = new Promise((resolve, reject) => {        
                axios.get('http://luyabang.com/lyb/oss/gettoken?dir=eshop&bucket=pyplatform',{}).then(res=>{
                    resolve(res.data)
                })
            }); 
            pro.then(data => {
                let ossData = new FormData();
                let config = {
                    onUploadProgress: progressEvent => {
                        this.Flag = true
                        let complete = (progressEvent.loaded / progressEvent.total ).toFixed(2) * 100 ;
                        this.UploadPercent = complete;
                        setTimeout(()=>{
                            if(complete >= 100){
                                this.Flag = false
                            }
                        },2000)
                    },
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                let str = randomStr();
                ossData.append("name",file.file.name );    
                ossData.append("key",'eshop/' +str+ data.expire);        
                ossData.append("policy", data.policy);        
                ossData.append("OSSAccessKeyId", data.accessid);
                ossData.append("success_action_status", 200);        
                ossData.append("signature", data.signature);        
                ossData.append("file", file.file, file.file.name);        
                axios.post(data.host, ossData,config).then(res => {            
                    if(res.status == 200){
                        let imgData = {uid:file.file.uid,url:'http://platform.pengyou66.com/eshop/' +str+data.expire,}
                        this.$emit('up-icon',imgData)
                    }       
                }).catch(error => {            
                        console.log(error, "错误");         
                });      
            }); 
            
        },
        // 处理移除图片
        handleRemovePic(e){
            this.$emit('down-icon',e.uid)
        },
    }
}
</script>
<style  scoped>

</style>
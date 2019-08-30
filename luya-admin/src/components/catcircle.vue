<template>
    <div>
        <el-upload                          
            action="#"  
            list-type="picture"                       
            :on-remove="handleRemovePic"                          
            :before-upload="handPic"  
            :auto-upload="false" 
            :file-list="List"                          
            :limit="1"
            :on-change='changeUpload'
            style="width:254px;">
            <div slot="tip" class="el-upload__tip">(列表图片，尺寸建议是200*200或等比例)</div>         
            <el-button size="mini" type="primary">点击上传</el-button> 
        </el-upload>
        <el-dialog title="图片剪裁" :visible.sync="dialogVisible" append-to-body @closed="closeA">
            <div class="cropper-content">
                <div class="cropper" style="text-align:center;height:292px;width:468px;">
                    <vueCropper
                        ref="cropper"
                        :img="option.img"
                        :outputSize="option.size"
                        :outputType="option.outputType"
                        :info="true"
                        :full="option.full"
                        :canMove="option.canMove"
                        :canMoveBox="option.canMoveBox"
                        :original="option.original"
                        :autoCrop="option.autoCrop"
                        :fixed="option.fixed"
                        :fixedNumber="option.fixedNumber"
                        :centerBox="option.centerBox"
                        :infoTrue="option.infoTrue"
                        :fixedBox="option.fixedBox">
                    </vueCropper>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="finish" :loading="loading">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import VueCropper from 'vue-cropper'
import {upload} from '@/util/util'
export default {
    props:{
        List: Array, //页面显示的数组
    },
    data(){
        return{
            dialogVisible:false,
            option: {
                img: '', // 裁剪图片的地址
                outputSize: 1, // 裁剪生成图片的质量
                outputType: 'png', // 裁剪生成图片的格式
                canScale: false, // 图片是否允许滚轮缩放
                autoCrop: true, // 是否默认生成截图框
                // autoCropWidth: 234, // 默认生成截图框宽度
                // autoCropHeight: 146, // 默认生成截图框高度
                fixedBox: true, // 固定截图框大小 不允许改变
                fixed: true, // 是否开启截图框宽高固定比例
                fixedNumber: [13, 13], // 截图框的宽高比例
                full: true, // 是否输出原图比例的截图
                canMoveBox: false, // 截图框能否拖动
                original: false, // 上传图片按照原始比例渲染
                centerBox: true, // 截图框是否被限制在图片里面
                infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
            },
            // 防止重复提交
            loading: false,
            fileinfo:{},
        }
    },
    methods:{
        changeUpload(file) {
            this.fileinfo = file
            let reader = new FileReader();
            reader.readAsDataURL(file.raw);
            reader.onload = e =>{
                let img = e.target.result;
                this.option.img = img
                this.dialogVisible = true
            }
        },
        finish() {
            this.$refs.cropper.getCropBlob((data) => {
                this.loading = true
                data.name = this.fileinfo.name
                upload(data).then(res=>{
                    this.dialogVisible = false
                    let Idata = {uid:this.fileinfo.uid,url:res}
                    this.$emit('sub-mit',Idata)
                    this.loading = false;
                }).catch(err=>{
                    this.loading = false
                })
            })
        },
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
        // 处理移除图片
        handleRemovePic(){
            this.$emit('remove')
        },
        closeA(){
            this.loading = false;
        }
    }
}
</script>
<style scoped>
</style>

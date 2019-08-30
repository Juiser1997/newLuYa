
import axios from "axios";
import {randomStr} from '@/util/util';
// 图片上传参数配置
const uploadConfig = {
    // action:  '',  // 必填参数 图片上传地址
    // methods: 'POST',  // 必填参数 图片上传方式
    // token: sessionStorage.token,  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
    name: 'img',  // 必填参数 文件的参数名
    size: 500,  // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
    accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'  // 可选 可上传的图片格式
}
// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
    ['bold', 'italic'],
    // ['bold', 'italic', 'underline', 'strike'],
    // ['blockquote', 'code-block'],
    // [{'header': 1}, {'header': 2}],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    // [{'script': 'sub'}, {'script': 'super'}],
    // [{'indent': '-1'}, {'indent': '+1'}],
    // [{'direction': 'rtl'}],
    // [{'size': ['small', false, 'large', 'huge']}],
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    // [{'color': []}, {'background': []}],
    [{'font': []}],
    [{'align': []}],
    ['clean'],
    ['image','video']
    // ['link', 'image', 'video']
  ]
  
  // handler重写事件, 任何工具按钮的功能都可以重写，这里只重写图片上传事件
const handlers = {
    image: function image() {
      var self = this;
      var fileInput = this.container.querySelector('input.ql-image[type=file]');
      if (fileInput === null) {
        fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        // 设置图片参数名
        if (uploadConfig.name) {
          fileInput.setAttribute('name', uploadConfig.name);
        }
        // 可设置上传图片的格式
        fileInput.setAttribute('accept', uploadConfig.accept);
        fileInput.classList.add('ql-image');
        // 监听选择文件
        fileInput.addEventListener('change', function () {
        // 如果图片限制大小
        //   if (uploadConfig.size && fileInput.files[0].size >= uploadConfig.size * 1024) {
        //      return   fileInput.value = ''
        //   }
            let file = fileInput.files[0];
            let pro = new Promise((resolve, reject) => {        
                axios.get('http://luyabang.com/lyb/oss/gettoken?dir=eshop&bucket=pyplatform',{}).then(res=>{
                    resolve(res.data)
                    console.log(res)
                })
            }); 
            pro.then(data => {
                let ossData = new FormData();
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
                let str = randomStr();
                ossData.append("name",file.name );    
                ossData.append("key",'eshop/goods/' +str+ data.expire);        
                ossData.append("policy", data.policy);        
                ossData.append("OSSAccessKeyId", data.accessid);
                ossData.append("success_action_status", 200);        
                ossData.append("signature", data.signature);        
                ossData.append("file", file, file.name);        
                axios.post(data.host, ossData,config).then(res => {            
                    if(res.status == 200){
                        let imgurl ='http://platform.pengyou66.com/eshop/goods/' +str+data.expire;
                        let length = self.quill.getSelection(true).index;
                        self.quill.insertEmbed(length, 'image', imgurl)
                        self.quill.setSelection(length + 1)
                        // console.log(imgurl)
                    }       
                }).catch(error => {            
                        console.log(error, "错误");         
                });      
            }); 
        });
        this.container.appendChild(fileInput);
      }
      fileInput.click();
    },
    // video:function video(){
    //   console.log(1)
    // }
  }
  // 全部配置
export const editorOptions = {
    placeholder: '',
    theme: 'snow',  // 主题
    modules: {
      toolbar: {
        container: toolOptions,  // 工具栏选项
        handlers: handlers  // 事件重写
      }
    }
}

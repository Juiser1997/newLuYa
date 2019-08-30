import { Message } from 'element-ui'
import axios from 'axios';
//清除对象中的空值
export function clear(obj){
  for(let k in obj){
		if(obj[k] === null || obj[k] === undefined || obj[k] === "") {
			delete obj[k];
		}
	}
	return obj;
}
// 获取图片地址的String
export function getstr(arr){
	let str = '';
	for(let i in arr){
			str += arr[i].url+',';
	}
	return str = str.substr(0,str.length - 1)
}
// 空值校验
export function check(obj){
	let re_null = {'re':/\S/,'tips':'请检查是否有内容为空'};
	for(let k in obj){
			if(!re_null.re.test(obj[k])){
				Message.warning(re_null.tips)
				return  false;
			}
	}
	return true;
}
export function randomStr(){
    var expect=6;//期望的字符串长度
    var str=Math.random().toString(36).substring(2);
    while(str.length<expect){
        str=Math.random().toString(36).substring(2)
    }
    return  'lyb'+str.substring(0,expect);
};
//上传图片
export function upload(file){
	return new Promise((resolve,reject)=>{
		axios.get('http://luyabang.com/lyb/oss/gettoken?dir=eshop&bucket=pyplatform',{}).then(res=>{
			let ossData = new FormData();
			let config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			};
			let data = res.data;
			let str = randomStr();
			ossData.append("name",file.name );    
			ossData.append("key",'eshop/' +str+ data.expire);        
			ossData.append("policy", data.policy);        
			ossData.append("OSSAccessKeyId", data.accessid);
			ossData.append("success_action_status", 200);        
			ossData.append("signature", data.signature);        
			ossData.append("file", file, file.name);     
			axios.post(data.host, ossData,config).then(res => {            
				if(res.status == 200){
					let url = 'http://platform.pengyou66.com/eshop/' +str+data.expire
					resolve(url)
				}       
			}).catch(error => {            
				console.log(error, "错误");         
			});  
		})
	})
}
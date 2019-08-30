const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 空值校验
function check(obj) {
  let re = /\S/;
  for (let k in obj) {
    if (!re.test(obj[k])) {
      return false;
    }
  }
  return true;
}
//校正省份
function checkProv(val) {
  var pattern = /^[1-9][0-9]/;
  var provs = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江 ",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北 ",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏 ",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门"
  };
  if (pattern.test(val)) {
    if (provs[val]) {
      return true;
    }
  }
  return false;
}
//校正日期
function checkDate(val) {
  let pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
  if (pattern.test(val)) {
    var year = val.substring(0, 4);
    var month = val.substring(4, 6);
    var date = val.substring(6, 8);
    var date2 = new Date(year + "-" + month + "-" + date);
    if (date2 && date2.getMonth() == (parseInt(month) - 1)) {
      return true;
    }
  }
  return false;
}
//校正码
function checkCode(val) {
  let p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
  let code = val.substring(17);
  if (p.test(val)) {
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += val[i] * factor[i];
    }
    if (parity[sum % 11] == code.toUpperCase()) {
      return true;
    }
  }
  return false;
}
//身份证校验
function checkID(val) {
  if (checkCode(val)) {
    if (checkDate(val.substring(6, 14))) {
      if (checkProv(val.substring(0, 2))) {
        return true
      }
    }
  }
  return false;
} 
 function clear(obj) {
  for (let k in obj) {
    if (obj[k] === null || obj[k] === undefined || obj[k] === "") {
      delete obj[k];
    }
  }
  return obj;
}
//上传图片
function upload(file){
  return new Promise((resolve,reject)=>{
    wx.request({
      url: "https://luyabang.com/lyb/oss/gettoken?dir=eshop&bucket=pyplatform",
      data: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res=>{
        let data = res.data;
        let str = randomStr();
        wx.uploadFile({
          url:'https://pyplatform.oss-cn-shenzhen.aliyuncs.com',
          filePath: file,
          name: 'file',
          formData: {
            key:'eshop/'+str+data.expire,
            policy: data.policy,
            OSSAccessKeyId: data.accessid,
            success_action_status:'200',
            signature: data.signature,
          },
          header: { "Content-Type": "multipart/form-data" },
          success: res=> {
            let img = 'http://platform.pengyou66.com/eshop/'+str+data.expire;
            resolve(img);
          },
          fail: function (e) {
            reject(e)
          }
        })
      },
    });
  })
}
function randomStr(){
  var expect=6;//期望的字符串长度
  var str=Math.random().toString(36).substring(2);
  while(str.length<expect){
      str=Math.random().toString(36).substring(2)
  }
  return  'lyb'+str.substring(0,expect);
}
function getstr(arr){
	let str = '';
	for(let i in arr){
			str += arr[i]+',';
	}
	return str = str.substr(0,str.length - 1)
}
module.exports = {
  formatTime: formatTime,
  check: check,
  checkID: checkID,
  clear: clear,
  upload:upload,
  getstr:getstr,
}
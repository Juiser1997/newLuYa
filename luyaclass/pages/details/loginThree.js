
let {applyClub} = require('../../api/req')
let { clear, upload } = require('../../utils/util');
Page({
  data: {
    user:{},
    realName:'',
    address:'北京市朝阳区',
    wxh:'',
    submit:true,
    imgs:[],
  },
  onLoad: function (options) {
    let user = wx.getStorageSync('user');
    let day = new Date();
    var time = day.getFullYear() + "-" + this.formatNumber((day.getMonth() + 1)) + "-" + this.formatNumber(day.getDate());
    user.birthday = time
    this.setData({ user: user })
  },
  onReady: function () {

  },
  onShow: function () {
    
  },
  getName(e){
    let name = 'user.realName'
    this.setData({[name]:e.detail.value,})
  },
  getNick(e){
    let nickName = 'user.nickName'
    this.setData({[nickName]:e.detail.value})
  },
  changeSex(){
    wx.showActionSheet({
      itemList: ['男','女'],
      success: (res)=>{
        let sex= 'user.sex'
        if(res.tapIndex == 0){
          this.setData({[sex]:'男'})
        }else if(res.tapIndex == 1){
          this.setData({[sex]:'女'})
        }
      },
    });
  },
  getPhone(e){
    let phone = 'user.phone';
    this.setData({[phone]:e.detail.value})
  },
  getWxNumber(e){
    let number = 'user.wxh';
    this.setData({[number]:e.detail.value})
  },
    // picker值发生改变都会触发该方法
  bindRegionChange: function (e) { 
    let a = e.detail.value.join('');
    let address = 'address'
    this.setData({[address]: a})
  },
  bindDateChange(e){
    let time = 'user.birthday'
    this.setData({[time]:e.detail.value})
  },
  formatNumber(n){
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  getFormID(e){
    let user = this.data.user
    let xre = /^([\u4E00-\u9FA5]+|[a-zA-Z]+)$/;
    if(!this.data.realName){
      return wx.showModal({content: '姓名需要填写',showCancel:false,});
    }
    if (!this.data.wxh){
      return wx.showModal({content: '微信号需要填写',showCancel:false,});
    }
    if(!user.nickName){
      return wx.showModal({content: '昵称需要填写',showCancel:false,});
    }
    let reg = /^1[0-9]{10}$/;
    if(!reg.test(user.phone)){
      return wx.showModal({content: '请正确输入手机号号码',showCancel:false,});
    }
    if (!xre.test(user.realName)){
      return wx.showModal({content: '请正确输入姓名',showCancel:false,});
    }
    if (this.data.imgs.length == 0) {
      return wx.showModal({ content: '请上传头像', showCancel: false, });
    }
    delete user.token_
    delete user.check_dode
    delete user.name
    delete user.headImg
    delete user.address
    delete user.communityId;
    user.formId=e.detail.formId;
    user.realName = this.data.realName;
    user.address = this.data.address
    user.wxh = this.data.wxh;
    let imgs = this.data.imgs;
    if (imgs.length > 0) {
      Promise.all(imgs.map(item => upload(item))).then(res => {
        user.headImg = res[0]
        applyClub(user).then(res => {
          if(res.code==200){
            if(res.data=="正在申请！"){
              wx.showModal({content: '正在申请',showCancel:false,});
              return;
            }
            this.setData({submit:false});
          }
        })
      })  
    }
  },
  back(){
    wx.switchTab({url: '../index/index',});
  },
  //选择头像
  checkphoto() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let file = res.tempFilePaths;
        let imgs = []
        imgs.push()
        for (let i in file) {
          imgs.push(file[i]);
          this.setData({ imgs: imgs })
        }
      },
      fail: () => { },
      complete: () => { }
    });
  },
  getRealName(e){
    this.setData({ realName: e.detail.value})
  },
  getWxh(e){
    this.setData({ wxh: e.detail.value })
  }
})
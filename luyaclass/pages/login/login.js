let {check} = require('../../utils/util');
let { getcode, Regist ,getFromWxData, Login} = require('../../api/req');
const app = getApp();
let lock = true;
let alock = true;
Page({
  data: {
    name:'',
    phone:'',
    code:'',
    sex:'男',
    text:'',
    address: '湖南省长沙市岳麓区', // 初始值
    userInfo:true,
    hasUserInfo: false,
    btntext:"获取验证码",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    istrue: false,//已仔细阅读协议
  },
  onLoad: function (options) {
  },
  bindname(e){
    this.setData({name:e.detail.value,})
  },
  bindphone(e){
    this.setData({phone:e.detail.value,})
  },
  bindcode(e){
    this.setData({code:e.detail.value,})
  },
  bindtext(e){
    this.setData({text:e.detail.value,})
  },
  changesex(){
    wx.showActionSheet({
      itemList: ['男','女'],
      success: (res)=>{
        if(res.tapIndex == 0){
          this.setData({sex:'男'})
        }else if(res.tapIndex == 1){
          this.setData({sex:'女'})
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
   // picker值发生改变都会触发该方法
  bindRegionChange: function (e) { 
    let a = e.detail.value.join('');
    this.setData({address: a})
  },
  //注册
  login(){
    let data = {
      registeName:this.data.name,
      phone:this.data.phone,
      smsCode:this.data.code,
      sex:this.data.sex,
      address:this.data.address,
    }
    if(!check(data)){
      return wx.showModal({content: '请检查是否有空值项',showCancel:false,});
    }
    data.remark = this.data.text;
    let xre = /^([\u4E00-\u9FA5]+|[a-zA-Z]+)$/;
    if(!xre.test(this.data.name)){
      return wx.showModal({content: '请正确输入姓名',showCancel:false,});
    }
    let reg = /^1[0-9]{10}$/;
    if(!reg.test(this.data.phone)){
      return wx.showModal({content: '请正确输入手机号号码',showCancel:false,});
    }
    let cre = /^\d{4}$/
    if(!cre.test(this.data.code)){
      return wx.showModal({content: '请正确输入验证码',showCancel:false,});
    }
    if (!this.data.istrue) {
      return wx.showModal({ content: '请先确认已阅读协议', showCancel: false, });
    }
    if(lock){
      lock = false;
      Regist(data).then(res=>{
        if(res.code == 200){
          wx.setStorageSync('token_', res.data.token_);
          wx.setStorageSync('check_code', res.data.check_code);
          wx.setStorageSync("openid", res.data.userId);
          wx.setStorageSync('nickName', res.data.nickName);
          wx.setStorageSync('headImg', res.data.headImg);
          wx.setStorageSync('roleId', res.data.roleId);
          wx.setStorageSync('user', res.data);
          lock = true;
          wx.navigateBack();
        }
      })
    }
  },
  //获取验证码
  getCode(){
    var that=this
    if(this.data.phone ==''){
      return wx.showModal({content: '获取验证码需填电话号码',showCancel:false,});
    }
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/
    if(!reg.test(this.data.phone)){
      return wx.showModal({content: '请正确输入手机号号码',showCancel:false,});
    }
    getcode(this.data.phone).then(res=>{
        if(res.code==200){
          wx.showToast({
            title: res.data,
          })
          let coden=60
          let codeV=setInterval(function(){
              that.setData({
                btntext:'重新获取'+(--coden)+'s'
              })
              if(coden==-1){
                clearInterval(codeV)
                that.setData({
                  btntext:"获取验证码"
                })
              }
          },1000)
        }

    })
  },
  //页面按钮跳转
  getUserInfo(e) {
    if(alock){
      alock = false;
      if(e.detail.userInfo) {
        app.globalData.userInfo = e.detail.userInfo
        getFromWxData().then(res => {
          return Login(res);
        }).then(data => {
          alock  = true;
          wx.setStorageSync('token_', data.token_);
          wx.setStorageSync('check_code', data.check_code);
          if (data.code == 102) {
            this.setData({userInfo:false})
            wx.showToast({title: "授权成功请完成注册！",icon: 'success',duration: 800,mask: true});
          } else if (data.code == 200) {
            wx.setStorageSync('openid',data.data.userId)
            wx.setStorageSync('nickName', data.data.nickName);
            wx.setStorageSync('headImg', data.data.headImg);
            wx.setStorageSync('user', data.data);
            wx.showToast({title: "授权成功！",icon: 'success',duration: 800,mask: true});
            wx.navigateBack();
          }
        })
      } else {
        alock  = true;
        this.openSetting();
      }
    }

  },
  //用户未授权 跳转设置页面授权 
  openSetting: function () {
    var that = this
    if (wx.openSetting) {
      wx.openSetting({
        success: function (res) {

        }
      })
    } else {
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
      })
    }
  },
  //去协议
  goAgreement() {
    let status = this.data.istrue ? false : true;
    this.setData({ istrue: status })
  }
})
// pages/login/loginOne.js
Page({

  data: {
    haveuser:false,//用户是否登录
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    let userid = wx.getStorageSync('openid'); 
    if(userid){
      this.setData({haveuser:true,})
      wx.redirectTo({ 
        url: '../details/loginTwo',
      });
    }else{
      this.setData({haveuser:false})
    }
  },
  onHide: function () {

  },
  login(){
    this.setData({haveuser:true})
    wx.navigateTo ({ url: '../details/loginTwo',});
  },

  onShareAppMessage: function () {

  }
})
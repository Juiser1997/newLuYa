
// pages/login/loginTwo.js
Page({

  data: {
    loading:true,
  },

  onLoad: function (options) {
    
  },

  onReady: function () {

  },
  onShow: function () {
    setTimeout(() => {
      this.setData({loading:false})
    }, 2000);
  },
  onHide: function () {

  },
  govip(){
    wx.navigateTo({ url: '../details/vip'});
  }
})
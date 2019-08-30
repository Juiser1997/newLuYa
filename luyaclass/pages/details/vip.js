// pages/details/vip.js
let {tglogin} = require('../../api/req');
Page({
  data: {
    check:false,
    isVip:0
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    let token_ = wx.getStorageSync('token_');
    if (token_) {
      this.user()
    }
  },
  change(){
    let status = this.data.check ? false : true;
    this.setData({check:status})
  },
  gologin(){
    // this.user()
    // let userid = wx.getStorageSync('openid');
    //  tglogin(userid).then(res=>{
    //    this.setData({isVip:res.data.isVip})
    //  })
    
    let check = this.data.check; 
    if(this.data.isVip==1){
      return wx.showToast({title: '您已经是天高路亚俱乐部会员了',icon: 'none',duration:1000});
    }
    if (this.data.isVip == 2) {
      return wx.showToast({ title: '您的信息已提交，正在审核中！', icon: 'none', duration: 1000 });
    }
    if(check){
      wx.navigateTo({ url: '../details/loginThree',});
    }else{
      wx.showToast({title: '请勾选俱乐部章程',icon: 'none',duration:1000});
    }
  },
  user() { //用户信息请求
    // let id=1
    
    let userid = wx.getStorageSync('openid');
    tglogin(userid).then(res => {
      this.setData({ isVip: res.data.isVip })
    })
  },
})
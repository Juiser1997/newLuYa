let { check, checkID } = require('../../utils/util');
let { userapplay,userget} = require('../../api/req');
Page({
  data: {
    stageName:'',//大咖艺名
    realName:'',//大咖真实姓名
    phone:'',//大咖电话号码
    cardNum:'',//大咖身份证号码 
    sign:'',//简介
    address: '湖南省长沙市岳麓区', // 初始值地址
    applyStatus:0,
    formId:'',//表单id
    istrue:false,//已仔细阅读协议
  },
  onLoad: function (options) {
    this.auditGet()
  },
  //表单赋值
  bindname(e){
    this.setData({realName:e.detail.value,})
  },
  bindartname(e){
    this.setData({stageName:e.detail.value,})
  },
  bindphone(e){
    this.setData({phone:e.detail.value,})
  },
  bindIDcode(e){
    this.setData({ cardNum:e.detail.value,})
  },
  bindtext(e){
    this.setData({sign:e.detail.value,})
  },
   // picker值发生改变都会触发该方法
  bindRegionChange: function (e) { 
    let address = e.detail.value.join("");
    this.setData({
      address: address
    })
  },
  auditGet(){
    userget().then(res=>{
      if(res.code==200){
        this.setData({
          applyStatus: res.data.applyStatus
        })
      }
    })
  },
  //消息推送的模版
  getFormID(e){
    if(!check(data)){
      return wx.showModal({content: '请检查是否有空值项',showCancel:false,});
    }
    let xre = /^([\u4E00-\u9FA5]+|[a-zA-Z]+)$/;
    if (!xre.test(this.data.realName)){
      return wx.showModal({content: '请正确输入姓名',showCancel:false,});
    }
    if (!xre.test(this.data.stageName)) {
      return wx.showModal({ content: '请正确输入姓名', showCancel: false, });
    }
    let reg = /^1[0-9]{10}$/;
    if(!reg.test(this.data.phone)){
      return wx.showModal({content: '请正确输入手机号号码',showCancel:false,});
    }
    if (!checkID(this.data.cardNum)){
      return wx.showModal({content: '请正确输入身份证号码',showCancel:false,});
    }
    if(!this.data.istrue){
      return wx.showModal({ content: '请先确认已阅读协议', showCancel: false, });
    }
    let data = {
      stageName: this.data.stageName,
      realName: this.data.realName,
      applayPhone: this.data.phone,
      cardNum: this.data.cardNum,
      applaySign: this.data.sign,
      applayAddress: this.data.address,
      openId:wx.getStorageSync('openid'),
      formId:e.detail.formId
    }
    userapplay(data).then(res => {
      let that=this
       if(res.code==200){
         wx.showModal({
           title: '申请成功',
           content: '我们会在三个工作日内审核您的申请',
           success(res){
             if (res.confirm){
               that.auditGet()
               wx.navigateBack();
             }
           }
         })
       }
    })
  },
  //去协议
  goAgreement(){
    let status = this.data.istrue ? false : true;
    this.setData({ istrue: status })
  }
})
// pages/details/video-detail.js
Page({
  data: {
    article:{
      videosrc:'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
      title:"科拟稀码路亚竿高性比入门级，经典调性设计。",
      time :"2019-04-11",
      readnum  :"1542",
      headImg : "http://www.wucai88.com/uploads/allimg/190327/1H10H191-3.jpg",
      nickName : "偕老三",
      status:0,
      text:'路亚钓是近几年才兴起发展，路亚钓鱼是利用鱼儿捕食特点的钓法。路亚钓装备简洁'
    }
  },
  onLoad: function (options) {
  },
  reward(){
    wx.showActionSheet({
      itemList: ['现金打赏'],
      itemColor:"#4b6dff",
      success: function (res) {
      if (1 == res.tapIndex) {
          // that.setData({
          //   sexinfo: '男'
          // })
        } 
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})
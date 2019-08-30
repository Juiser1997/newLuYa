// pages/welcome/welcome.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log('-------')
    console.log(options.id)
    if (options.id) {
      // this.setdata({ id: options.contentId})
      // app.globalData.titleid = this.data.id
      app.globalData.titleid = options.id
      setTimeout(() => {
        wx.redirectTo({
          url: '../../pages/details/details?id=' + options.id
        })
      }, 1000)

    } else {
      console.log('redirect to index!!!')
      setTimeout(() => {
        wx.switchTab({
          url: "../index/index"
        })
      }, 1000)
    }
  },


  onReady: function() {

  },


  onShow: function(options) {
    // console.log('onShow--options--')
    // console.log(options)
    // console.log('onshow被调用了')
    // setTimeout(() => {
    //   wx.switchTab({
    //     url: '../index/index',
    //   });
    // }, 1000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
const app = getApp();
let {timeHandle} = require('../../utils/util');
let {usermycomment,replylist} = require('../../api/req');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [], //评论列表数据
    pageSize: 10,
    currentPage: 1,//分页页码
    pagedata: false,//判断是否继续下拉加载
    token:''//用户标识
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.commentData()
  },
  onShow(){
    //判断用户是否授权
    this.data.token = wx.getStorageSync('openid');
    let token = this.data.token
    if (token) {
      this.commentData()
    } else {
      wx.navigateTo({
        url: '../../pages/login/login'
      });
    }
  },
  //上拉加载
  onReachBottom: function () {
    if (this.data.pagedata) {
      let page = this.data.currentPage + 1;
      let list = this.data.commentList;
      let data = {
        currentPage: page,
        pageSize: 10,
      }
      usermycomment(data).then(res => {
        if (res.data.currentPage * 10 > res.data.totalNum) {
          this.setData({ pagedata: false })
        } else {
          this.setData({ pagedata: true })
        }
        list.push.apply(list, res.data.items);
        this.setData({ commentList: list, currentPage: page })
      })
    } else {
      console.log('没有更多数据了')
    }
  },
  //评论详情
  godetails(e) {
    let id = e.currentTarget.dataset.id;
    app.globalData.titleid = id;

    wx.navigateTo({ url: '../../pages/details/details?id=' + id, });
  },
 //我的评论列表数据
  commentData() {
    let data = {};
    data.currentPage = this.data.currentPage;
    data.pageSize = this.data.pageSize
    usermycomment(data).then(res => {
      let list = res.data.items
      let currentPage = res.data.currentPage;
      let pageSize = res.pageSize
      if (currentPage * 10 > res.data.totalNum) {
        this.setData({
          pagedata: false
        })
      } else {
        this.setData({
          pagedata: true
        })
      }
      this.setData({
        commentList: list
      })
    })
  },
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
        console.log("下拉啦")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
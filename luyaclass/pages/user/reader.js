let {readhistory,readDelete} = require('../../api/req');
const app = getApp();

Page({
  data: {
    newslist: [],
    token: '',
    currentTab: 0,
    havedata:true,
    currentPage:1,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.listGet()
  },
  onShow: function () {
  },
  listGet() {
    let data = {currentPage:1}
    readhistory(data).then(res => {
      let bool =res.data.currentPage*10 < res.data.totalNum ?  true : false;
      this.setData({
        newslist: res.data.items,
        havedata:bool
      })
    })
  },
  //挑详情页
  godetails(e) {
    let id = e.detail;
    app.globalData.titleid = id;
    wx.navigateTo({
      url: '../../pages/details/details?id=' + id,
    });
  },
  readdelete(e){
    let id = e.detail.id;
    let index = e.detail.idx;
    let list = this.data.newslist;
    wx.showActionSheet({
      itemList: ['删除'],
      success: res=>{
        if (res.tapIndex == 0) {
          readDelete(id).then(res=>{
            list.splice(index,1);
            this.setData({newslist:list})
          })
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.havedata) {
      let page = this.data.currentPage + 1;
      let list = this.data.newslist;
      let data = {currentPage: page,pageSize: 10,}
      readhistory(data).then(res => {
        let bool = data.currentPage*10 < data.totalNum ?  true : false;
        list.push.apply(list, res.data.items);
        this.setData({ newslist: list, currentPage: page ,havedata:bool})
      })
    } else {
      console.log('没有更多数据了')
    }
  },
})
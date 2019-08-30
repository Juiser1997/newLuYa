let { ContentList, userContent, usergetColm} = require('../../api/req');
const app = getApp();

Page({
  data: {
    headImg: "http://www.wucai88.com/uploads/allimg/190327/1H10H191-3.jpg",
    nickName: "未登录",
    id:'',
    remark: '暂无简介',//简介
    isbusiness: '',//是否为商家
    fansNumber: 0,
    contentNumber: 0,
    praiseNumber: 0,
    newslist: [],
    pagedata:true,
    currentPage: 1,
    roleId: '',
    tgUrl:"",
    num: 0
  },
  onLoad(options){
    let uid = options.uid;
    this.setData({id:uid})
  },
  onShow(){
    this.getUserColm();
    this.getUserinfo();
  },
  gotitlelist(e){
    let id = e.currentTarget.dataset.tid;
    wx.navigateTo({url: '../../pages/details/details?id='+id,});
  },
  //获取用户信息
  getUserColm() {
    let data = { id: this.data.id };
    usergetColm(data).then(res => {
      // console.log(res.data.fansNumber)
      let data = res.data
      this.setData({
        headImg: data.userInfo.headImg,
        nickName: data.userInfo.nickName,
        remark: data.userInfo.remark,
        isbusiness: data.isbusiness,
        fansNumber: data.userInfo.fansNumber,
        contentNumber: data.userInfo.contentNumber,
        praiseNumber: data.userInfo.praiseNumber,
        roleId: data.userInfo.roleId,
        tgUrl:data.userInfo.tgUrl,
      })
    })
  },
  //获取文章列表
  getUserinfo() {
    let data = { id: this.data.id };
    userContent(data).then(res => {
      let data = res.data
      let bool = data.currentPage * 10 < data.totalNum ? true : false;
      this.setData({
        newslist: data.items,
        pagedata: bool,
      })
    })
  },
  godetails(e) {
    let id = e.detail;
    app.globalData.titleid = id;
    wx.navigateTo({ url: '../../pages/details/details?id=' + id, });
  },
  go(e){
    wx.navigateTo({ url: '../../pages/writelist/bosslist?tgUrl='+this.data.tgUrl })

  },
  onReachBottom(){
    let page = this.data.currentPage + 1;
    let data = { currentPage: page, pageSize: 10, id: this.data.id };
    let list = this.data.newslist;
    if (this.data.pagedata) {
      userContent(data).then(res => {
        let bool = data.currentPage * 10 < res.data.totalNum ? true : false;
        list = list.concat(res.data.items);
        this.setData({
          newslist: list,
          currentPage: page,
          pagedata: bool,
        })
      })
    } else {
      console.log('没有更多数据了')
    }
  }
})
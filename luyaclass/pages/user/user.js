const app = getApp();
let { msgNum,userContent,usergetColm} = require('../../api/req');
Page({
  data: {
    headImg : "http://www.wucai88.com/uploads/allimg/190327/1H10H191-3.jpg",
    nickName : "未登录",
    remark:'暂无简介',//简介
    isbusiness:'',//是否为商家
    fansNumber:0,
    contentNumber: 0,
    praiseNumber: 0,
    newslist: [],
    pagedata:true,
    currentPage: 1,
    roleId:'',
    num:0,
    list:[
      {'icon':'me_icon_meguanzhu','text':'我的关注','url':'/pages/user/guanzhu'},
      {'icon':'me_icon_pinglunjilu-','text':'我的评论','url':'/pages/user/comment'},
      {'icon':'shoucang','text':'我的收藏','url':'/pages/user/collect'},
      {'icon':'me_icon_tongzhi-','text':'消息通知','url':'/pages/user/message'},
      {'icon':'me_icon_yudujilu','text':'阅读纪录','url':'/pages/user/reader'}
    ],
    haveuser:true,//用户是否登录
  },
  onLoad: function (options) {
  },
  onShow() {
    let userid = wx.getStorageSync('openid');
    if(!userid){
      this.setData({haveuser:false})
    }else{
      let user = wx.getStorageSync('user');
      this.getNum()
      this.setData({
        headImg:user.headImg,
        nickName:user.nickName,
        phone:user.phone,
        roleId:user.roleId,
        haveuser:true,
      })
    }
    this.getUserColm();
    this.getUserinfo();
    this.setData({currentPage: 1})
  },
  login(){
    let user = wx.getStorageSync('user');
    this.getNum()
    this.setData({
      haveuser:true,
      headImg:user.headImg,
      nickName:user.nickName,
      roleId:user.roleId,
      phone:user.phone
    })
  },
  //获取用户信息
  getUserColm(){
    let userid = wx.getStorageSync('openid');
    let data = { id: userid };
    usergetColm(data).then(res=>{
      let data = res.data
      this.setData({
        remark: data.userInfo.remark,
        isbusiness: data.isbusiness,
        fansNumber: data.fansNumber,
        contentNumber: data.userInfo.contentNumber,
        praiseNumber: data.userInfo.praiseNumber,
      })
    })
  },
  //获取文章列表
  getUserinfo() {
    let userid = wx.getStorageSync('openid');
    let data = { id: userid }
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
    wx.navigateTo({ url: '../../pages/details/details?id=' + id, });
  },
  //上拉加载更多
  onReachBottom() {
    let page = this.data.currentPage + 1;
    let userid = wx.getStorageSync('openid');
    let data = { currentPage: page, pageSize: 10, id: userid};
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
  },
  gouserinfo(){
    // wx.navigateTo({ url: '../user/userinfo',});
  },
  getNum(){
    msgNum().then(res=>{
      let num = res.data.number;
      if(num!=0){
        wx.setTabBarBadge({index: 4,text: JSON.stringify(num)})
      }else{
        wx.removeTabBarBadge({index:4,})
      }
      this.setData({num:num})
    })
  }
})
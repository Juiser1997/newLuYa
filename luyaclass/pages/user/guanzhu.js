const app = getApp();
let {getNextMenuData,indexData,usemyattention,fansdelete,usermyfans,FansSave} = require('../../api/req');
Page({
  data: {
    nav: [
      {'title': '我的关注','num': ''},
      {'title': '我的粉丝','num': ''},
    ],
    currentTab: 0, //teb切换
    status: 0,
    pageSize: 10,
    currentPage: 1,
    pagedata: false, //判断是否加载完全部
    havedata:true,
    guanzhuList: [], //关注的列表
    fansList: [], //粉丝的列表
    token: ''
  },
  onLoad: function(options) {
    this.useList()
    this.fansList()
  },
  onShow: function() {
   
  },
  //选项卡teb切换
  navbarTap(e){
    this.setData({currentTab: e.currentTarget.dataset.idx,currentPage:1})
    let tab = e.currentTarget.dataset.idx;
    if(tab == 0){
      this.useList()
    }else if(tab == 1){
      this.fansList();
    }
  },
  //关注列表
  useList() {
    let data = {currentPage:1,pageSize:10};
    usemyattention(data).then(res =>{
      let list = res.data.items
      let bool =res.data.currentPage*10 < res.data.totalNum ?  true : false;
      let nav = this.data.nav
      nav[0].num = res.data.totalNum
      this.setData({
        guanzhuList: list,
        nav: nav,
        havedata:bool
      })
    })

  },
  //粉丝列表
  fansList() {
    let data = {currentPage:1,pageSize:10};
    usermyfans(data).then(res => {
      let lists = res.data.items
      let bool =res.data.currentPage*10 < res.data.totalNum ?  true : false;
      let nav = this.data.nav
      nav[1].num = res.data.totalNum
      this.setData({
        fansList: lists,
        nav: nav,
        havedata:bool
      })
    })

  },
  //粉丝关注
  fensData(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.inx;
    let list = this.data.fansList;
    let clist = 'fansList['+index+'].statu';
    let status = list[index].statu == 0 ? 1 : 0;
    FansSave(id).then(res => {
      this.setData({[clist]:status})
    })
  },
  gotitlelist(e){
    let id = e.currentTarget.dataset.uid;
    wx.navigateTo({url: '../../pages/writelist/titlelist?uid='+id});
  },
  //上拉加载
  onReachBottom: function() {
    
    let tab = this.data.currentTab;
    if (this.data.havedata) {
      if(tab == 0){
        let page = this.data.currentPage + 1;
        let data = { currentPage: page, pageSize: 10, }
        let list = this.data.guanzhuList;
        usemyattention(data).then(res => {
          let bool =res.data.currentPage*10 < res.data.totalNum ?  true : false;
          list.push.apply(list, res.data.items);
          this.setData({
            guanzhuList: list,
            currentPage: page,
            havedata:bool
          });
        })

      }else if(tab == 1){
        let page = this.data.currentPage + 1;
        let data = { currentPage: page, pageSize: 10, }
        let list = this.data.fansList;
        usermyfans(data).then(res => {
          let bool =res.data.currentPage*10 < res.data.totalNum ?  true : false;
          list.push.apply(list, res.data.items);
          this.setData({
            fansList: list,
            currentPage: page,
            havedata:bool
          })
        })
      }
    }else{
      console.log('没有更多数据了')
    }
    //粉丝
  },
  //取消关注
  calloff(e){
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.inx;
    let list = this.data.guanzhuList;
    let that = this;
    let num = this.data.nav[0].num-1;
    let cnum = 'nav[0].num';
    wx.showModal({
      title: '提示',
      content: '是否取消关注',
      success: function(dar) {
        if (dar.confirm) {
          list.splice(index,1);
          fansdelete(id).then(res =>{
            that.setData({guanzhuList:list,[cnum]:num})
          })
        }
      }
    })
  }
})
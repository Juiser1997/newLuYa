//index.js
const app = getApp();
let {getNextMenuData,indexData,totalip} = require('../../api/req');
Page({
  data:{
    headnav:[],
    currentTab:0,
    newslist:[],
    midnav:[
      { "name": "新品", "src": "../../img/main_xinping.png", "url": "/pages/details/refit?id=" + '2019072516364135790'},
      { "name": "改装", "src": "../../img/main_gaizhuang.png", "url": "/pages/details/refit?id=" + '2019062115141189900' },
      { "name": "行业", "src": "../../img/main_hangye.png", "url": "/pages/details/refit?id=" + '2019072516371308340'},
      // {"name": "钓场", "src": "../../img/main_diaochang.png", "url": "/pages/details/Fishing"},
      {"name":"推荐商家","src":"../../img/main_shangjia.png","url":"/pages/welcome/shop"},
      { "name": "路亚帮", "src": "../../img/main_luyabang.png", "url": "/pages/writelist/writelist" },
    ],
    Img:[],
    Nav:[],
    texTab:0,
    midstyle:'',
    pId:'',// 父类加载更多
    cid:'',//子分类加载
    currentPage:1,//分页页码
    pagedata:true,
    tishi:true,
    level:'2',//二级level
    id:'',//二级id
  },
  onLoad(){
    this.setData({pagedata:true})
    this.getIndexData();
      totalip().then(res=>{
        console.log("成功")
      })
  },
  onShow(){
    let tishi = wx.getStorageSync('tishi'); 
    if(tishi){
      this.setData({tishi:false,})
    }
    // this.setData({texTab: 0})
  },
  //获取首页数据
  getIndexData(){
    let data = { id:'2019061813442417200'}
    indexData(data).then(res=>{
      let data = res.data;
      let bool = data.currentPage*10 < data.totalNum ?  true : false;
      let second = data.data.second
      for(let i in second){
        if (second[i].name == '改装' || second[i].name == '新品' || second[i].name == '行业'){
          second.splice(i,1)
        }
      }
      if (second[second.length-1].name == '行业'){
        second.splice(second.length - 1, 1)
      }
      this.setData({
        headnav:data.data.second,//二级栏目
        newslist:data.items,//文章列表
        pId:data.data.second[0].id,
        pagedata:bool,
        Img:data.data.carouseImgList,
      })
    })
  },
  //头部tab切换
  changeTab(e){
    let id = e.detail.id;
    this.setData({
      texTab:0,
      currentTab:e.detail.idx,
      pId:id,
      cid:'',
      pagedata:true,
      currentPage:1,
      newslist:[],
      Img:[],
      Nav:[],
    });
    if(id == '2019061813545364950' || id == '2019061813550724260'){
      this.setData({midstyle:'bignav'});
    }else{
      this.setData({midstyle:''});
    }
    let data = {currentPage:1,pageSize:10}
    if(this.data.pId == '2019061813523617930'){
      data.id = '2019061813442417200'
      //  data.id = '2019061814515270770'
      
      indexData(data).then(res=>{
        let data = res.data;
        let bool = data.currentPage*10 < res.data.totalNum ?  true : false;
        this.setData({
          newslist:data.items,
          pagedata:bool,
          Img: data.data.carouseImgList
        })
      })
    }else {
      data.id = this.data.pId
      getNextMenuData(data).then(res=>{
        let data = res.data;
        let bool = data.currentPage*10 < res.data.totalNum ?  true : false;
        this.setData({
          newslist:data.items,
          pagedata:bool,
          Nav:data.data.nextMeun,
          Img: data.data.carouseImgList
        })
      })
    }
  },
  //切换中间的tab 加载子分类
  texbarTap(e){
    let tab,id;
    let index = e.currentTarget.dataset.idx;
    if((/^[0-9]+$/).test(index)){
      tab= index
      id = e.currentTarget.dataset.id
    }else{
      tab = e.detail.idx;
      id = e.detail.id
    }
    this.setData({
      texTab:tab,
      pagedata:true,
      currentPage:1,
      cid:id,
      newslist:[],
      pId:id,
    });
    let data = {currentPage:1,pageSize:10,id:id}
    getNextMenuData(data).then(res=>{
      let data = res.data;
      let bool = data.currentPage*10 < data.totalNum ?  true : false;
      this.setData({
        newslist:data.items,
        pagedata:bool,
      })
    })
  },
  //去文章详情
  godetails(e){
    let id = e.detail;
    app.globalData.titleid = id;
    wx.navigateTo({url: '../../pages/details/details',});
  },
  // 上拉加载更多 加分类
  onReachBottom(){
    let page = this.data.currentPage + 1;
    let data = {currentPage:page,pageSize : 10,id:this.data.pId};
    let list = this.data.newslist;
    if(this.data.pagedata){
      if(this.data.pId == '2019061813523617930'){
        data.id = '2019061813442417200'
        indexData(data).then(res=>{
          let bool = data.currentPage*10 < res.data.totalNum ?  true : false;
          list = list.concat(res.data.items);
          this.setData({
            newslist:list,
            currentPage:page,
            pagedata:bool,
          })
        })
      }else {
        getNextMenuData(data).then(res=>{
          let bool = data.currentPage*10 < res.data.totalNum ?  true : false;
          list = list.concat(res.data.items);
          this.setData({
            newslist:list,
            currentPage:page,
            pagedata:bool,
          })
        })
      }
    }else{
      console.log('没有更多数据了')
    }
  },
  //下拉刷新
  onPullDownRefresh(){
    wx.showNavigationBarLoading();
    this.setData({currentPage:1});//还原数据
    let data = {currentPage:1,pageSize:10,}
    if(this.data.cid == ''){
      data.id = this.data.pId
    }
    if(this.data.pId == '2019061813523617930'){
      data.id = '2019061813442417200'
      indexData(data).then(res=>{
        let bool = data.currentPage*10 < res.data.totalNum ?  true : false;
        this.setData({
          newslist:res.data.items,
          pagedata:bool,
        })
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      })
    }else{
      data.id = this.data.pId;
      getNextMenuData(data).then(res=>{
        let bool = data.currentPage*10 < res.data.totalNum ?  true : false;
        this.setData({
          newslist:res.data.items,
          pagedata:bool,
        })
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      })
    }
  },
  changetips(){
    wx.setStorageSync('tishi', 120);
    this.setData({tishi:false})
  }
})

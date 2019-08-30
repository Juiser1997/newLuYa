// pages/class/class.js
const app = getApp();
let {getNextMenuData,indexData} = require('../../api/req');
Page({
  data: {
    headnav:[],
    currentTab:0,
    Img:[],
    Nav:[],
    texTab:0,
    newslist:[],
    pId :'',// 父类加载更多
    cid:'',//子分类加载
    currentPage:1,//分页页码
    pagedata:true,
  },
  onLoad(){
    this.setData({pagedata:true})
    this.getIndexData();
  },
  onShow(){
    // let data = { currentPage: 1, pageSize: 10, id: '2019061814513855570' }
    // getNextMenuData(data).then(res => {
    //   let data = res.data;
    //   let bool = data.currentPage * 10 < data.totalNum ? true : false;
    //   this.setData({
    //     newslist: data.items,
    //     pagedata: bool,
    //     Nav: data.data.nextMeun,
    //     Img: data.data.carouseImgList
    //   })
    // })
    // this.setData({texTab: 0})
  },
  onReady(){
    let data = { currentPage: 1, pageSize: 10, id: '2019061814513855570' }
    getNextMenuData(data).then(res => {
      // console.log(res)
      this.setData({
        newslist: res.data.items,
        // pagedata: bool,
        Nav: res.data.data.nextMeun,
        Img: res.data.data.carouseImgList
      })
    })

  },
  //获取首页数据
  getIndexData(){
    let id = '2019061813463755790'
    let data = {id:id}
    indexData(data).then(res=>{
      let data = res.data;
      let bool = data.currentPage*10 < data.totalNum ?  true : false;
      this.setData({
        headnav:data.data.second,
        newslist:data.items,
        pId:data.data.second[0].id,
        pagedata:bool,
        Img:data.data.carouseImgList
      })
    })
  },
  //头部tab切换
  changeTab(e){
    let id = e.detail.id;
    this.setData({
      texTab: 0,
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
    let data = {currentPage:1,pageSize:10,id:this.data.pId}
    getNextMenuData(data).then(res=>{
      let data = res.data;
      let bool = data.currentPage*10 < data.totalNum ?  true : false;
      this.setData({
        newslist:data.items,
        pagedata:bool,
        Nav:data.data.nextMeun,
        Img:data.data.carouseImgList
      })
    })
  },
  //切换中间的tab 加载子分类
  texbarTap(e){
    let id = e.detail.id;
    this.setData({
      texTab:e.detail.idx,
      pagedata:true,
      currentPage:1,
      cid:id,
      newslist:[],
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
  godetails(e){
    let id = e.detail;
    app.globalData.titleid = id;
    wx.navigateTo({ url: '../../pages/details/details', });
  },
  govideodetail(e){
    let id = e.detail;
    // app.globalData.titleid = id;
    wx.navigateTo({url: '../../pages/details/video-detail?id='+id,});
  },
  //搜索
  mySearch(e){
    let search = e.detail;
  },
  // 清除
  myRemove(){
  },
  // 上拉加载更多 加分类
  onReachBottom(){
    let page = this.data.currentPage+1;
    let data = {currentPage : page,pageSize : 10,};
    // data.id = this.data.cid == '' ? this.data.pId : this.data.cid;
    if(this.data.cid == ''){
      data.id = this.data.pId;
    }else{
      data.type = this.data.cid;
    }
    let list = this.data.newslist;
    if(this.data.pagedata){
      getNextMenuData(data).then(res=>{
        let bool = data.currentPage*10 < data.totalNum ?  true : false;
        list = list.concat(res.data.items);
        this.setData({
          newslist:list,
          currentPage:page,
          pagedata:bool,
        })
      })
    }else{
      console.log('没有更多数据了')
    }
  },
  //下拉刷新
  onPullDownRefresh(){
    wx.showNavigationBarLoading();
    this.setData({currentPage:1});//还原数据
    let data = {status:1,currentPage:1,pageSize:10,}
    data.id = this.data.cid == '' ? this.data.pId : this.data.cid;
    if(this.data.cid == ''){
      data.id = this.data.pId
    }else{
      data.type = this.data.cid;
    }
    getNextMenuData(data).then(res=>{
      let bool = data.currentPage*10 < data.totalNum ?  true : false;
      this.setData({
        newslist:res.data.items,
        pagedata:bool,
      })
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    })
  },
})
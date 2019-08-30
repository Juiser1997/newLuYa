let {getNextMenuData} = require('../../api/req');
const app = getApp();
Page({
  data: {
    newslist:[],
    Img: [],
    pagedata: true,
    currentPage:1,//分页页码  
    id:'',//栏目id  
  },
  onLoad(options){
    this.setData({id:options.id})
    if (options.id == '2019072516364135790'){
      wx.setNavigationBarTitle({
        title: '新品'
      })
    }
    if (options.id == '2019062115141189900') {
      wx.setNavigationBarTitle({
        title: '改装'
      })
    }
    if (options.id == '2019072516371308340') {
      wx.setNavigationBarTitle({
        title: '行业'
      })
    }
    this.getList()
  },
  onShow(){
    this.setData({ texTab: 0 })
  },
  getList(){
    let data = { currentPage: 1, pageSize: 10,id:this.data.id
    };
    getNextMenuData(data).then(res => {
      let data = res.data;
      let bool = data.currentPage * 10 < res.data.totalNum ? true : false;
      this.setData({
        newslist: data.items,
        pagedata: bool,
        Img: data.data.carouseImgList
      })
    })
  },
  godetails(e) {
    let id = e.detail;
    app.globalData.titleid = id;
    wx.navigateTo({ url: '../../pages/details/details?id=' + id, });
  },
  //切换中间的tab 加载子分类
  texbarTap(e) {
    let tab, id;
    let index = e.currentTarget.dataset.idx;
    if ((/^[0-9]+$/).test(index)) {
      tab = index
      id = e.currentTarget.dataset.id
    } else {
      tab = e.detail.idx;
      id = e.detail.id
    }
    this.setData({
      texTab: tab,
      pagedata: true,
      currentPage: 1,
      cid: id,
      newslist: [],
    });
    let data = { currentPage: 1, pageSize: 10, id: id }
    getNextMenuData(data).then(res => {
      let data = res.data;
      let bool = data.currentPage * 10 < data.totalNum ? true : false;
      this.setData({
        newslist: data.items,
        pagedata: bool,
      })
    })
  },
  onReachBottom(){
    if (this.data.pagedata){
      let page = this.currentPage+1;
      let data = {currentPage:page,pageSize:10,id:this.data.id};
      let list = this.data.newslist;
      getNextMenuData(data).then(res=>{
        let bool = res.data.currentPage*10 < res.data.totalNum ?  true : false;
        list.push.apply(list, res.data.items);
        this.setData({
          list:list,
          pagedata:bool,
          currentPage:page,
        })
      })
    }
  }
})
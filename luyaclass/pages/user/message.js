// pages/user/message.js
let {msgPush} = require('../../api/req');
const app = getApp();

Page({
  data: {
    list:[],
    currentPage:1,//分页页码
    pagedata:true,
    // pushId:[]
  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.getList()
  },
 
  //获取收藏列表
  getList(){
    let data = {currentPage:1,pageSize:10}
    msgPush(data).then(res=>{
      let bool =res.data.currentPage*10 < res.data.totalNum ?  true : false;
      let arr = res.data.items
      // console.log(arr)
      // for(let i in arr){
      //   this.data.pushId.push(arr[i].id)
      // }
      // console.log(this.data.pushId)
      this.setData({
        list: arr,
        pagedata:bool,
      })
    })
  },
  onReachBottom: function () {
    let page = this.data.currentPage+1;
    let data = {currentPage : page,pageSize : 10,};
    let list = this.data.list;
    if(this.data.pagedata){
      msgPush(data).then(res=>{
        let bool =res.data.currentPage*10 <res.data.totalNum ?  true : false;
        list = list.concat(res.data.items);
        
        this.setData({
          list:list,
          currentPage:page,
          pagedata:bool,
          
        })
      })
    }else{
      console.log('没有更多数据了')
    }
  },
  //去文章详情
  godetail(e){
    let id = e.currentTarget.dataset.cid;
    // console.log(e.currentTarget.dataset)
    let pid = e.currentTarget.dataset.id;
    // console.log(pushId)
    
    app.globalData.titleid = id;
    app.globalData.pushId = pid;
    wx.navigateTo({url: '../../pages/details/details',});
  },
})
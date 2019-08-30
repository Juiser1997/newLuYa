let {collectList,collectDel} = require('../../api/req');
const app = getApp();

Page({
  data: {
    list:[],
    currentPage:1,//分页页码
    pagedata:true,
  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.getList()
  },
  //获取收藏列表
  getList(){
    let data = {currentPage:1,pageSize:10}
    collectList(data).then(res=>{
      console.log(res.data)
      let bool =res.data.currentPage*10 < res.data.totalNum ?  true : false;
      this.setData({
        list:res.data.items,
        pagedata:bool
      })
    })
  },
  //去文章详情
  gotitle(e){
    let id = e.currentTarget.dataset.id
    app.globalData.titleid = id;

    wx.navigateTo({url: '../../pages/details/details?id='+id,});
  },
  //删除收藏
  DelCollect(e){
    let id = e.currentTarget.dataset.cid;
    let index = e.currentTarget.dataset.inx;
    let list = this.data.list;
    wx.showActionSheet({
      itemList: ['删除'],
      success: res=>{
        if (res.tapIndex == 0) {
          collectDel(id).then(res=>{
            list.splice(index,1);
            this.setData({list:list})
          })
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  onReachBottom: function () {
    
    if(this.data.pagedata){
      let page = this.data.currentPage + 1;
      let list = this.data.list;
      let data = { currentPage: page, pageSize: 10 };
      collectList(data).then(res=>{
        console.log(res.data)
        let bool = res.data.currentPage*10 <res.data.totalNum ?  true : false;
        list = list.concat(res.data.items);
        this.setData({
          list:list,
          currentPage:page,
          pagedata:bool,
        })
        // console.log(this.data.pagedata)
      })
    }else{
      console.log('没有更多数据了')
    }
  },
})
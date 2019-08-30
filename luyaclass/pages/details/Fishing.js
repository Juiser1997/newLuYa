let {getNextMenuData} = require('../../api/req');
Page({
  data: {
    list:[],
    havadata:true,
    currentPage:1,//分页页码  
    id:'2019062115140561000',//栏目id  
  },
  onLoad(options){
    this.getList()
  },
  onShow(){

  },
  getList(){
    let data = {currentPage:1,pageSize:10,id:this.data.id};
    getNextMenuData(data).then(res=>{
      let bool = res.data.currentPage*10 < res.data.totalNum ?  true : false;
      this.setData({
        list:res.data.items,
        havadata:bool
      })
    })
  },
  gotitlelist(e){
    let id = e.currentTarget.dataset.tid;
    wx.navigateTo({url: '../../pages/details/details?id='+id,});
  },
  onReachBottom(){
    if(this.data.havadata){
      let page = this.currentPage+1;
      let data = {currentPage:page,pageSize:10,id:this.data.id};
      let list = this.data.list;
      getNextMenuData(data).then(res=>{
        let bool = res.data.currentPage*10 < res.data.totalNum ?  true : false;
        list.push.apply(list, res.data.items);
        this.setData({
          list:list,
          havadata:bool,
          currentPage:page,
        })
      })

    }
  }
})
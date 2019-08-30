let { writeList, tjshopList } = require('../../api/req');
Page({
  data: {
    list: [],
    havadata: true,
    currentPage: 1,//分页页码    
    count:0,
  },
  onLoad(options) {
    this.getList()
  },
  onShow() {

  },
  getList() {
    let data = { currentPage: 1, pageSize: 10,flag:1 }
    tjshopList(data).then(res => {
      let bool = res.data.currentPage * 10 < res.data.totalNum ? true : false;
      this.setData({
        list: res.data.items,
        havadata: bool
      })
      let list = this.data.list
      let sort = 0
      for( let i in list){
        if(list[i].isTg == 1){
          sort++;
        }
      }
      this.setData({
        count: sort
      })
    })
  },
  gotitlelist(e) {
    let id = e.currentTarget.dataset.uid;
    wx.navigateTo({ url: '../../pages/writelist/titlelist?uid=' + id });
  },
  onReachBottom() {
    let page = this.data.currentPage + 1;
    if (this.data.havadata && page < 11) {
      let data = { currentPage: page, pageSize: 10, };
      let list = this.data.list;
      writeList(data).then(res => {
        let bool = res.data.currentPage * 10 < res.data.totalNum ? true : false;
        list.push.apply(list, res.data.items);
        this.setData({
          list: list,
          havadata: bool,
          currentPage: page,
        })
      })

    }
  }
})
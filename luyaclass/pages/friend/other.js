// pages/friend/other.js
let {dynamiclist} = require('../../api/req');
Page({
  data: {
    cliList:[],
    currentPage: 1,
    pagedata: false,
  },
  onLoad: function (options) {
   let data = {currentPage:1,pageSize:10,userId:options.uid}
    dynamiclist(data).then(res => {
      if (res.code == 200) {
        let item = res.data.items;
          if(item.length>0){
          for(let j in item){
            for(let k in item[j].time){
                item[j].time[k].day = item[j].time[k].date.split('-')[2]
                item[j].time[k].month = item[j].time[k].date.split('-')[1]
            }
          }
          this.setData({
            cliList: item,
            headName: item[0].time[0].nickName,
            headImg: item[0].time[0].headImg,
          });
        }
      }
    })
  },
  onShow: function () {

  },
  //去动态详情页
  godetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({url: '../../pages/friend/detail?id='+id,});
  },
})
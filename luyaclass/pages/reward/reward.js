// pages/reward/reward.js
Page({
  data: {
    authorInfo:{
      headImg : "http://www.wucai88.com/uploads/allimg/190327/1H10H191-3.jpg",
      nickName : "偕老三",
    },
    moneylist:['1','2','5','10','20','50','100','自定义'],
    tab:0,
    money:0,
  },
  onLoad: function (options) {

  },
  checkMoney(e){
    let money = e.currentTarget.dataset.my;
    let list = this.data.moneylist;
    let i;
    for(let k in list){
      if(money == list[k]){
        i=k;
      }
    }
    this.setData({
      tab:i,
      money:money
    })
  },
})
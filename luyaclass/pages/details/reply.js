// pages/details/reply.js
let {ReplayList,ReplayDelete,PraiseSave,Replay} = require('../../api/req');
const app = getApp()
Page({
  data: {
    currentPage:1,
    list:[],//回复列表
    comment:{},//评论内容
    replyText:'',//回复内容
    havedata:true,//下拉加载的提示
    id:'',
    IPX:app.globalData.isIPX,
  },
  onLoad: function (options) {
    let data = {id:options.commentId,currentPage:this.data.currentPage,pageSize:10}
    this.setData({id:options.commentId,})
    this.getreplylist(data)
  },
  onShow: function () {

  },
  getreplylist(data){
    ReplayList(data).then(res=>{
      let bool = res.currentPage*10 < res.totalNum ?  true : false;
      this.setData({
        comment:res.data.data,
        list:res.data.items,
        currentPage:1,
        havedata:bool
      })
    })
  },
  //绑定回复输入内容
  ReplyText(e){
    this.setData({replyText:e.detail.value,})
  },
  //发送回复
  Reply(){
    let data = {
      content:this.data.replyText,
      commentId:this.data.comment.id,
      toUserId:this.data.comment.userId,
    }
    Replay(data).then(res=>{
      let ndata = {
        id:this.data.comment.id,
        currentPage:1,
        pageSize:10*this.currentPage,
      }
      this.getreplylist(ndata);
      this.setData({replyText:''})
    })
  },
  //举报
  Report(e){
    wx.showActionSheet({
      itemList: ['淫秽色情','违法信息','营销广告','恶意攻击谩骂'],
      success: (res)=>{
        let reason = '';
        if (res.tapIndex == 0) {
          reason = '淫秽色情'
        } else if (res.tapIndex == 1) {
          reason = '违法信息'
        }else if(res.tapIndex == 2){
          reason = '营销广告'
        }else if(res.tapIndex == 3){
          reason ='恶意攻击谩骂'
        }
        let  data = {reason:reason,commentId:this.data.id,flag:'2'};
        report(data).then(res=>{
          if(res.data==102){
            wx.showToast({title: '您已经举报过了',icon: 'none',duration:1000});
          }else if(res.data==103){
            wx.showToast({title: '当日举报以超过10次，请注意你的行为。举报 次数过多将封号处理！',icon: 'none',duration:3000});
          }else{
            wx.showToast({title: '举报成功',icon: 'none',duration:1000});
          }
        })
      },
    });
  },
  //评论点赞
  ReplyPraise(){
    let comment = this.data.comment;
    let status = comment.isPraise == '0' ? '1' : '0';
    let num = comment.isPraise == '0' ? parseInt(comment.praise) + 1 : parseInt(comment.praise) - 1;
    let data = {
      flag:'3',
      contentId:comment.id,
    }
    let isPraise = 'comment.isPraise';//是否点赞
    let praise = 'comment.praise';//点赞数
    PraiseSave(data).then(res=>{
      this.setData({[isPraise]:status,[praise]:num})
    })
  },
  // 上拉加载更多
  onReachBottom(){
    if(this.data.havedata){
        let page = this.data.currentPage+1;
        let list = this.data.list;
        let data = {
          currentPage:page,
          pageSize:10,
          id:this.data.comment.id,
        }
        ReplayList(data).then(res=>{
          let bool = res.currentPage*10 < res.totalNum ?  true : false;
          list.push.apply(list,res.data.items);
          this.setData({list:list,currentPage:page,havedata:bool})
        })

    }else{
      console.log('没有更多数据了')
    }
  },
  //激活删除框
  DeleteReply(e){
    let userid = e.currentTarget.dataset.user;
    let Cuserid = wx.getStorageSync('openid');
    let index = e.currentTarget.dataset.idx;
    if(userid == Cuserid){
      wx.showActionSheet({
        itemList: ['删除'],
        success: res=>{
          if (res.tapIndex == 0) {
            let list = this.data.list;
            let data = {id:list[index].id,} 
            let num = this.data.comment.replay - 1;
            let replay = 'comment.replay';
            ReplayDelete(data).then(res=>{
              list.splice(index,1)
              this.setData({list:list,[replay]:num})
            })
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  },
})
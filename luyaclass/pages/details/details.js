let {
  getArticleDetail,
  CommentSave,
  Commentlist,
  CommentDelete,
  Replay,
  PraiseSave,
  FansSave,
  nolike,
  report,
  collectSave
} = require('../../api/req');
const app = getApp()
Page({
  data: {
    status: 0, //关注状态
    articleDetail: {}, //文章
    comment: [], //评论列表
    CommentText: '', //评论内容
    replyText: '', //回复内容
    index: 0,
    keybl: false, //回复输入框
    currentPage: 1,
    havedata: true, //下拉加载的提示
    commentNum: 0, //评论数
    contentId: '', //文章Id
    toView: 'top',
    height: 0,
    content: '',
    IPX: app.globalData.isIPX,
    userId: '',
    havacontent: true,
    // titleid: app.globalData.titleid
    // token: ""
    // titleid:''
  },
  onLoad: function(options) {
    // wx.showNavigationBarLoading();
    // if(options.id){
    //   let id = options.id;
    //  let pid = options.pid;
    //  this.setData({ contentId: id });
    //  let data = { id: id };
    //  getArticleDetail(data).then(res => {
    //    if (res.data == 104) {
    //      wx.showToast({ title: "文章不存在！", icon: 'success', duration: 800, mask: true });
    //      this.setData({ havacontent: false })
    //      return
    //    }
    //    let bool = res.data.currentPage * 10 < res.data.totalNum ? true : false;
    //    this.setData({
    //      status: res.data.data.isAttention,
    //      articleDetail: res.data.data.userContent,
    //      comment: res.data.items,
    //      commentNum: res.data.totalNum,
    //      havedata: bool,
    //      content: res.data.data.userContent.content,
    //    })
    //  })

    // }
    // if(options.pushid){
    //   data.pushid = options.pushid;
    // }
    //   let id = options.id;
    //   let pid = options.pid;
    //   this.setData({ contentId: id });
    //   let data = { id: id };
    //   let userId = wx.getStorageSync('openid');

    //   if (userId) {
    //     data.userId = userId;
    //     this.setData({ userId: userId })
    //   }
    //   if (pid) {
    //     data.pushId = pid
    //   }
    //   getArticleDetail(data).then(res => {
    //     if (res.data == 104) {
    //       wx.showToast({ title: "文章不存在！", icon: 'success', duration: 800, mask: true });
    //       this.setData({ havacontent: false })
    //       return
    //     }
    //     let bool = res.data.currentPage * 10 < res.data.totalNum ? true : false;
    //     this.setData({
    //       status: res.data.data.isAttention,
    //       articleDetail: res.data.data.userContent,
    //       comment: res.data.items,
    //       commentNum: res.data.totalNum,
    //       havedata: bool,
    //       content: res.data.data.userContent.content,
    //     })
    //   })
  },

  onShow() {
    let id = app.globalData.titleid;
    let pushId = app.globalData.pushId;
    this.setData({
      contentId: id
    });
    let data = {
      id: id
    };
    let userId = wx.getStorageSync('openid');
    if (userId) {
      data.userId = userId;
      this.setData({ userId: userId })
    }
    // if(cid){
    //   data.id=cid
    // }else{
    //   data.id=id
    // }
    if (pushId) {
      data.pushId = pushId
    }
    getArticleDetail(data).then(res => {
      if (res.data == 104) {
        wx.showToast({
          title: "文章不存在！",
          icon: 'success',
          duration: 800,
          mask: true
        });
        this.setData({
          havacontent: false
        })
        return
      }
      let bool = res.data.currentPage * 10 < res.data.totalNum ? true : false;
      this.setData({
        status: res.data.data.isAttention,
        articleDetail: res.data.data.userContent,
        comment: res.data.items,
        commentNum: res.data.totalNum,
        havedata: bool,
        content: res.data.data.userContent.content,
      })
    })
    wx.getSystemInfo({
      success: res => {
        // consol e.log(res)
        this.setData({
          height: res.windowHeight
        })
      },
    });

  },
  onHide() {
    this.setData({
      havacontent: true
    })

  },
  onUnload() {
    app.globalData.pushId = "";
  },
  //举报
  Report(e) {
    wx.showActionSheet({
      itemList: ['淫秽色情', '违法信息', '营销广告', '恶意攻击谩骂'],
      success: (res) => {
        let reason = '';
        if (res.tapIndex == 0) {
          reason = '淫秽色情'
        } else if (res.tapIndex == 1) {
          reason = '违法信息'
        } else if (res.tapIndex == 2) {
          reason = '营销广告'
        } else if (res.tapIndex == 3) {
          reason = '恶意攻击谩骂'
        }
        let data = {};
        if (e.currentTarget.dataset.ty === 'content') {
          data = {
            reason: reason,
            commentId: this.data.articleDetail.contentId,
            flag: '1',
            title: this.data.articleDetail.title
          }
        } else {
          let index = e.currentTarget.dataset.inx;
          let id = this.data.comment[index].id;
          let txt = this.data.comment[index].content;
          data = {
            reason: reason,
            commentId: id,
            flag: '3',
            title: txt
          }
        }
        report(data).then(res => {
          if (res.data == 102) {
            wx.showToast({
              title: '您已经举报过了',
              icon: 'none',
              duration: 1000
            });
          } else if (res.data == 103) {
            wx.showToast({
              title: '当日举报以超过10次，请注意你的行为。举报 次数过多将封号处理！',
              icon: 'none',
              duration: 3000
            });
          } else {
            wx.showToast({
              title: '举报成功',
              icon: 'none',
              duration: 1000
            });
          }
        })
      },
    });
  },
  //绑定文本输入内容
  CommentText(e) {
    this.setData({
      CommentText: e.detail.value,
    })
  },
  //发送评论
  Comment() {
    let data = {
      contentId: this.data.articleDetail.contentId,
      content: this.data.CommentText,
      flag: '1'
    }
    let list = this.data.comment;
    let clist = 'comment'
    let com = 'articleDetail.comments';
    let num = this.data.articleDetail.comments + 1;
    CommentSave(data).then(res => {
      let comment = {
        nickName: wx.getStorageSync('nickName'),
        id: res.data,
        headImg: wx.getStorageSync('headImg'),
        userId: wx.getStorageSync('openid'),
        content: this.data.CommentText,
        isPraise: '0',
        praise: 0,
        replyList: {
          data: {
            items: [],
            totalNum: 1
          }
        }
      };
      list.unshift(comment);
      wx.showToast({
        title: "评论成功！",
        icon: 'success',
        duration: 800,
        mask: true
      });
      this.setData({
        CommentText: '',
        [clist]: list,
        [com]: num
      })
    })
  },
  //绑定回复输入内容
  ReplyText(e) {
    this.setData({
      replyText: e.detail.value,
    })
  },
  //发送回复
  Reply() {
    let nbl = this.data.keybl == false ? true : false;
    let index = this.data.index;
    let list = this.data.comment;
    let data = {
      commentId: list[index].id,
      toUserId: list[index].userId,
      content: this.data.replyText
    }
    let clist = 'comment[' + index + '].replyList.data.items'
    let rlist = list[index].replyList.data.items;
    let num = list[index].replyList.data.totalNum + 1;
    let snum = 'comment[' + index + '].replyList.data.totalNum'
    Replay(data).then(res => {
      let repdata = {
        nickName: wx.getStorageSync('nickName'),
        id: res.data,
        headImg: wx.getStorageSync('headImg'),
        commentId: data.contentId,
        userId: wx.getStorageSync('openid'),
        content: data.content,
      }
      rlist.unshift(repdata);
      this.setData({
        keybl: nbl,
        replyText: '',
        [clist]: rlist,
        [snum]: num
      })
    })
  },
  //打开回复输入框
  changeReplyStatus(e) {
    let nbl = this.data.keybl == false ? true : false;
    let index = e.currentTarget.dataset.ind;
    this.setData({
      index: index,
      keybl: nbl
    })
  },
  //关注
  changeAttentionStatus() {
    let num = this.data.status == 0 ? 1 : 0;
    FansSave(this.data.articleDetail.id).then(res => {
      this.setData({
        status: num
      })
    })
  },
  //点赞
  Praise(e) {
    let index = e.currentTarget.dataset.ind;
    if ((/^[0-9]+$/).test(index)) { //评论的点赞
      let replaydata = this.data.comment;
      let status = replaydata[index].isPraise == '0' ? '1' : '0';
      let num = replaydata[index].isPraise == '0' ? parseInt(replaydata[index].praise) + 1 : parseInt(replaydata[index].praise) - 1;
      let data = {
        flag: '3',
        contentId: replaydata[index].id,
      }
      let isPraise = 'comment[' + index + '].isPraise'; //是否点赞
      let praise = 'comment[' + index + '].praise'; //点赞数
      PraiseSave(data).then(res => {
        this.setData({
          [isPraise]: status,
          [praise]: num
        })
      })
    } else { //文章的点赞
      let cdata = this.data.articleDetail;
      let status = cdata.isPraise == '0' ? '1' : '0';
      let num = cdata.isPraise == '0' ? parseInt(cdata.praise) + 1 : parseInt(cdata.praise) - 1;
      let isPraise = 'articleDetail.isPraise'; //是否点赞
      let praise = 'articleDetail.praise'; //点赞数
      let data = {
        flag: '1',
        contentId: this.data.contentId,
      }
      PraiseSave(data).then(res => {
        this.setData({
          [isPraise]: status,
          [praise]: num
        })
      })
    }
  },
  //文章不喜欢
  noLike(e) {
    let id = this.data.articleDetail.contentId;
    let cdata = this.data.articleDetail;
    let nlike = 'articleDetail.nolike'; //不喜欢数
    let nislike = 'articleDetail.isLike'; //不喜欢的状态
    let status = e.currentTarget.dataset.sta;
    let num = status == '0' ? parseInt(cdata.nolike) + 1 : parseInt(cdata.nolike) - 1;
    let sta = status == '0' ? '1' : '0';
    nolike(id).then(res => {
      if (res.data === '1') {
        this.setData({
          [nlike]: num,
          [nislike]: sta
        })
      } else if (res.data === '102') {
        wx.showToast({
          title: "您已经不喜欢过了！",
          icon: 'success',
          duration: 800,
          mask: true
        });
      }
    })
  },
  //上拉加载更多
  getmore() {
    if (this.data.havedata) {
      let page = this.data.currentPage + 1;
      let list = this.data.comment;
      // let token_ = wx.getStorageSync('token_');
      // console.log(token_)
      // data.token = token_
      // this.setData({ token: token_ })
      let data = {
        currentPage: page,
        pageSize: 10,
        id: this.data.articleDetail.contentId,
        // token:token_
      }
      Commentlist(data).then(res => {
        let bool = res.currentPage * 10 < res.totalNum ? true : false;
        list.push.apply(list, res.data.items);
        this.setData({
          comment: list,
          currentPage: page,
          havedata: bool
        })

        // if (token_) {
        //   data.token = token_
        //   this.setData({ token: token_ })
        // }
      })
    } else {
      console.log('没有更多数据了')
    }
  },
  //回首页
  gohome() {
    wx.switchTab({
      url: '../index/index',
    });
  },
  //文章分享
  onShareAppMessage(res) {
    let data = this.data.articleDetail;
    // app.globalData.titleid=data.contentId
    // this.setData({contentId:cid})
    if (res.from === 'button' || res.from === 'menu') {
      console.log(1111)
      return {
        title: data.title,
        // imageUrl:'http://platform.pengyou66.com/eshop/goods/nanzhoucqvzfj1561707227',
        path: "/pages/welcome/welcome?id=" + data.contentId,
      }
    }
  },
  //楼层跳跃
  move(e) {
    let mvid = e.currentTarget.dataset.mv;
    this.setData({
      toView: mvid
    })
    // this.onLoad()
  },
  //收藏文章
  collect() {
    let status = this.data.articleDetail.isCollect == '0' ? '1' : '0';
    let id = this.data.contentId;
    let Status = 'articleDetail.isCollect'
    collectSave(id).then(res => {
      this.setData({
        [Status]: status
      })
    })
  },
  //删除评论
  DeleteComment(e) {
    let userId = wx.getStorageSync('openid');
    let delUser = e.currentTarget.dataset.user;
    let index = e.currentTarget.dataset.idx;
    if (userId == delUser) {
      wx.showActionSheet({
        itemList: ['删除'],
        success: res => {
          if (res.tapIndex == 0) {
            let list = this.data.comment;
            let data = {
              flag: '1',
              id: list[index].id
            }
            let clist = 'comment'
            CommentDelete(data).then(res => {
              list.splice(index, 1);
              this.setData({
                [clist]: list
              })
            })
          }
        },
        fail: () => {},
        complete: () => {}
      });
    }
  }
})
let {
  contentDetail,
  CommentSave,
  FansSave,
  PraiseSave,
  Replay,
  CommentDelete,
  report
} = require('../../api/req');
let {
  getstr
} = require('../../utils/util')
const app = getApp()
Page({
  data: {
    dynamic: {},
    comment: [], //评论列表
    CommentText: '', //评论内容
    replyText: '', //回复内容
    keybl: false, //回复输入框
    currentPage: 1,
    havedata: true, //下拉加载的提示
    toView: 'top',
    height: 0,
    index: 0, //评论的下标
    IPX: app.globalData.isIPX,
    userId: '',
    fullScreen: false,
    autoplay: false,
    url: '',
  },
  onLoad: function(options) {
    console.log(options)
    // 获取亚路圈传递过来的time
    let timeSjc = options.time
    let userId = wx.getStorageSync('openid');
    this.setData({
      userId: userId
    })
    let data = {
      id: options.id
    }
    let read = options.read;
    if (read) {
      data.fromOwn = 'isRead'
    }
    contentDetail(data).then(res => {
      let bool = res.data.currentPage * 10 < res.data.totalNum ? true : false;
      // 将路亚圈页面传递过来的time挂到dynamic上
      res.data.data.userDynamic.sjc = timeSjc
      this.setData({

        dynamic: res.data.data.userDynamic,
        comment: res.data.items,
        havedata: bool
      })
      console.log(this.data.dynamic)
    })
    wx.getSystemInfo({
      success: res => {
        this.setData({
          height: res.windowHeight
        })
      },
    });
  },
  onReady() {
    this.videoContext = wx.createVideoContext('myvideo')
  },
  onShow: function() {

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
      contentId: this.data.dynamic.id,
      content: this.data.CommentText,
      flag: '2'
    }
    let list = this.data.comment;
    let clist = 'comment'
    let com = 'dynamic.comments';
    let num = this.data.dynamic.comments + 1;
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
  //点赞
  Praise(e) {
    let index = e.currentTarget.dataset.ind;
    if ((/^[0-9]+$/).test(index)) { //评论的点赞
      let praise = 'comment[' + index + '].praise';
      let isPraise = 'comment[' + index + '].isPraise';
      let stu = this.data.comment[index].isPraise;
      let num = stu == '0' ? parseInt(this.data.comment[index].praise) + 1 : parseInt(this.data.comment[index].praise) - 1;
      let status = stu == '0' ? '1' : '0';
      let data = {
        flag: '3',
        contentId: this.data.comment[index].id
      };
      PraiseSave(data).then(res => {
        this.setData({
          [isPraise]: status,
          [praise]: num
        })
      })
    } else { //动态的点赞
      let data = {
        flag: '2',
        contentId: this.data.dynamic.id
      };
      let praise = 'dynamic.praise';
      let isPraise = 'dynamic.isPraise';
      let num = this.data.dynamic.isPraise == '0' ? parseInt(this.data.dynamic.praise) + 1 : parseInt(this.data.dynamic.praise) - 1;
      let status = this.data.dynamic.isPraise == '0' ? '1' : '0';
      PraiseSave(data).then(res => {
        this.setData({
          [isPraise]: status,
          [praise]: num
        })
      })
    }
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
          let dcontent = this.data.dynamic.content;
          data = {
            reason: reason,
            commentId: this.data.dynamic.id,
            flag: '2'
          }
          if (dcontent.imgs) {
            let img = getstr(dcontent.imgs);
            data.content = img;
          }
          if (dcontent.text) {
            data.title = dcontent.text
          }
        } else {
          let index = e.currentTarget.dataset.inx;
          let txt = this.data.comment[index].content;
          let commentId = this.data.comment[index].id
          data = {
            reason: reason,
            commentId: commentId,
            flag: '3',
            title: txt,
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
  //关注
  changeAttent() {
    let id = this.data.dynamic.userId;
    let status = this.data.dynamic.isAttention == 0 ? 1 : 0;
    let isAttention = 'dynamic.isAttention';
    FansSave(id).then(res => {
      this.setData({
        [isAttention]: status
      })
    })
  },
  //回圈
  gohome() {
    wx.switchTab({
      url: '../friend/friend',
    });
  },
  //上拉加载更多
  getmore() {
    if (this.data.havedata) {
      let page = this.data.currentPage + 1;
      let list = this.data.comment;
      let data = {
        currentPage: page,
        pageSize: 10,
        id: this.data.dynamic.id,
      }
      Commentlist(data).then(res => {
        let bool = res.currentPage * 10 < res.totalNum ? true : false;
        list.push.apply(list, res.data.items);
        this.setData({
          comment: list,
          currentPage: page,
          havedata: bool
        })
      })
    } else {
      console.log('没有更多数据了')
    }
  },
  //动态分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      return {
        title: this.data.dynamic.nickName + '新发了一条动态，快来看看吧',
        imageUrl: 'http://platform.pengyou66.com/eshop/goods/nanzhoucqvzfj1561707227',
        path: "/pages/friend/detail?id=" + this.data.dynamic.id,
      }
    }
  },
  //楼层跳跃
  move(e) {
    let mvid = e.currentTarget.dataset.mv;
    this.setData({
      toView: mvid
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
              flag: '2',
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
  },
  //预览图片
  imgPreview(e) {
    let imgs = e.currentTarget.dataset.list;
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: imgs,
    });
  },
  //看视频
  openVideo(e) {
    this.setData({
      autoplay: true,
      url: e.currentTarget.dataset.url
    }, () => {
      this.videoContext.requestFullScreen();
      this.videoContext.play();
    })

  },
  //关视频
  closeVideo() {
    //执行退出全屏方法
    this.setData({
      autoplay: false,
      url: ''
    }, () => {
      this.videoContext.exitFullScreen();
      this.videoContext.pause();
      this.videoContext.seek(0);
    })
  },
})
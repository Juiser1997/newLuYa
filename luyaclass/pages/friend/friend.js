let {
  dynamicgetall,
  dynamicatention,
  PraiseSave,
  dynamiclist,
  FansSave,
  dynamicnearby,
  dynamicDelete,
  dynamicMsg
} = require('../../api/req');
const app = getApp();
Page({
  data: {
    headnav: [{
        id: '1',
        name: '路亚圈'
      },
      {
        id: '2',
        name: '关注'
      },
      {
        id: '3',
        name: '附近'
      },
      {
        id: '4',
        name: '我的圈'
      },
    ],
    currentTab: 0,
    friendList: [], //路亚圈列表
    cliList: [], //我的圈子数据
    attention: [], //关注的数据列表
    nearby: [], //附近的数据列表
    currentPage: 1,
    pagedata: false, //判断路亚圈是否还有下一页
    haveuser: true, //用户是否登录
    user: {},
    msg: false,
    video: '',
    one: true,
    isclose: true,
  },
  onLoad: function(options) {
    this.dynamiclistGet()
    this.setData({
      isclose: true
    })
    let one = wx.getStorageSync('one');
    if (one) {
      this.setData({
        one: false
      })
    }
    let userid = wx.getStorageSync('openid');
    if (userid) {
      this.setData({
        userId: userid,
        haveuser: true
      })
      this.node(this.data.currentTab)
      dynamicMsg().then(res => {
        let msg = res.data == 0 ? true : false;
        this.setData({
          msg: msg
        })
      })
    } else {
      this.setData({
        haveuser: false
      })
    }
  },
  onReady() {
    this.videoContext = wx.createVideoContext('myvideo')

  },
  onShow() {
    let dymic = app.globalData.dymic
    console.log(dymic)
    if (dymic == "second") {

      this.setData({
        currentPage: 1,
        friendList: [],
        attention: [],
        nearby: [],
        cliList: [],
      })
      this.dynamicGet()
    }
    app.globalData.dymic = 'first'
    // console.log(dymic)
    // let one = wx.getStorageSync('one'); 
    // if(one){
    //   this.setData({one:false})
    // }
    // let userid = wx.getStorageSync('openid');  
    // if(userid) {
    //   this.setData({userId:userid,haveuser:true})
    //   this.node(this.data.currentTab)
    //   dynamicMsg().then(res=>{
    //     let msg = res.data == 0 ? true : false;
    //     this.setData({msg:msg})
    //   })
    // }else{
    //   this.setData({haveuser:false})
    // }
  },
  onHide() {
    // this.setData({
    //   currentPage:1,
    //   friendList:[],
    //   attention:[],
    //   nearby:[],
    //   cliList:[],
    // })  
  },
  login() {
    let userid = wx.getStorageSync('openid');
    this.setData({
      haveuser: true,
      userId: userid
    })
    this.node(this.data.currentTab);
  },
  //路亚圈
  dynamicGet() {
    let data = {
      currentPage: this.data.currentPage,
      pageSize: 10
    }
    let list = this.data.friendList;
    dynamicgetall(data).then(res => {
      if (res.code == 200) {
        let bool = res.data.currentPage * 10 < res.data.totalNum ? true : false;
        if (this.data.currentPage == 1) {
          // console.log(res.data.items)
          this.setData({
            friendList: res.data.items,
            pagedata: bool
          })
          console.log(this.data.friendList)

        } else {
          list.push.apply(list, res.data.items)
          this.setData({
            friendList: list,
            pagedata: bool
          })
        }
      }
    })
    this.dynamiclistGet()
  },
  //关注
  dynamicatentionGet() {
    let data = {
      pageSize: 10,
      currentPage: this.data.currentPage
    }
    let list = this.data.attention;
    dynamicatention(data).then(res => {
      if (res.code == 200) {
        let bool = res.data.currentPage * 10 < res.data.totalNum ? true : false;
        if (this.data.currentPage == 1) {
          this.setData({
            attention: res.data.items,
            pagedata: bool
          })
        } else {
          list.push.apply(list, res.data.items)
          this.setData({
            attention: list,
            pagedata: bool
          })
        }
      }
    })
    this.dynamiclistGet()
  },
  //附近
  nearbyGet() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        let data = {
          pageSize: 10,
          currentPage: this.data.currentPage,
          latitude: res.latitude,
          longitude: res.longitude,
          dis: 100
        }
        let list = this.data.nearby;
        dynamicnearby(data).then(res => {
          if (res.code == 200) {
            let bool = res.data.currentPage * 10 < res.data.totalNum ? true : false;
            if (this.data.currentPage == 1) {
              this.setData({
                nearby: res.data.items,
                pagedata: bool
              })
            } else {
              list.push.apply(list, res.data.items)
              this.setData({
                nearby: list,
                pagedata: bool
              })
            }
          }
        })
      },
      fail: (e) => {
        wx.showModal({
          content: '请打开手机定位',
          showCancel: false,
        })
      },
    })
    this.dynamiclistGet()
  },
  //我的圈
  dynamiclistGet() {
    let data = {
      currentPage: this.data.currentPage,
      pageSize: 10
    }
    let list = this.data.cliList;
    dynamiclist(data).then(res => {
      if (res.code == 200) {
        let item = res.data.items;
        if (item.length > 0) {
          for (let j in item) {
            for (let k in item[j].time) {
              item[j].time[k].day = item[j].time[k].date.split('-')[2]
              item[j].time[k].month = item[j].time[k].date.split('-')[1]
            }
          }
          if (this.data.currentPage == 1) {
            this.setData({
              cliList: res.data.items,
              headName: item[0].time[0].nickName,
              headImg: item[0].time[0].headImg,
            })
          } else {
            list.push.apply(list, res.data.items)
            this.setData({
              cliList: list,
              headName: item[0].time[0].nickName,
              headImg: item[0].time[0].headImg,
            })
          }
        }
      }
    })
  },
  //切换方法
  node(index) {
    if (index == 0) {
      this.dynamicGet();
    } else if (index == 1) {
      this.dynamicatentionGet()
    } else if (index == 2) {
      this.nearbyGet()
    } else if (index == 3) {
      this.dynamiclistGet()
    }
  },
  //切换teb
  changeTab(e) {
    let tab = e.detail.idx;
    this.setData({
      currentTab: tab,
      currentPage: 1,
      friendList: [],
      attention: [],
      nearby: [],
      cliList: [],
    }, () => {
      this.node(tab);
    })
  },
  //关注
  changeAttent(e) {
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.idx
    let tab = this.data.currentTab;
    let isAttention = ['friendList', 'attention', 'nearby'][tab] + '[' + index + '].isAttention';
    let status = [this.data.friendList, this.data.attention, this.data.nearby][tab][index].isAttention == 0 ? 1 : 0;
    FansSave(id).then(res => {
      this.setData({
        [isAttention]: status
      })
    })
  },
  getData(index) {
    let tab = this.data.currentTab;
    let sign = ['friendList', 'attention', 'nearby'][tab];
    let dynamic = [this.data.friendList, this.data.attention, this.data.nearby][tab][index];
    return {
      status: dynamic.isPraise == '0' ? '1' : '0',
      num: dynamic.isPraise == '0' ? parseInt(dynamic.praise) + 1 : parseInt(dynamic.praise) - 1,
      isPraise: sign + '[' + index + '].isPraise',
      praise: sign + '[' + index + '].praise',
      contentId: dynamic.id,
    };
  },
  //点赞
  Praise(e) {
    let index = e.currentTarget.dataset.index;
    let cdata = this.getData(index);
    let data = {
      flag: '2',
      contentId: cdata.contentId
    };
    PraiseSave(data).then(res => {
      this.setData({
        [cdata.isPraise]: cdata.status,
        [cdata.praise]: cdata.num
      })
    })
  },
  //上拉加载
  onReachBottom() {
    let tab = this.data.currentTab;
    let page = this.data.currentPage + 1;
    if (!this.data.pagedata) {
      return console.log('没有更多数据了');
    }
    this.setData({
      currentPage: page
    }, () => {
      this.node(tab)
    })
    this.dynamiclistGet()

  },
  //预览图片
  imgPreview(e) {
    let imgs = e.currentTarget.dataset.list;
    // console.log(imgs)
    let src = e.currentTarget.dataset.src.split("?")[0];
    // console.log(src)
    wx.previewImage({
      current: src,
      urls: imgs,
    });

  },
  //去动态详情页
  godetail(e) {
    console.log(e.currentTarget.dataset.time)
    let time = e.currentTarget.dataset.time
    let id = e.currentTarget.dataset.id;
    let read = e.currentTarget.dataset.rd;
    if (read == 0) {
      wx.navigateTo({
        url: '../../pages/friend/detail?time=' + time + '&id=' + id + '&read=' + read,
      });
    } else {
      wx.navigateTo({
        url: '../../pages/friend/detail?time=' + time + '&id=' + id,
      });
    }
  },
  //删除动态
  Deldynamic(e) {
    let index = e.currentTarget.dataset.idx;
    let id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['删除'],
      success: res => {
        if (res.tapIndex == 0) {
          let list = this.data.cliList[0].time;
          let slist = 'cliList[' + 0 + '].time'
          dynamicDelete(id).then(res => {
            list.splice(index, 1);
            wx.showToast({
              title: "删除成功！",
              icon: 'success',
              duration: 800,
              mask: true
            });
            this.setData({
              [slist]: list
            })
          })
        }
      },
      fail: () => {},
      complete: () => {}
    });
  },
  //动态分享
  onShareAppMessage(res) {
    let id = res.target.dataset.id
    let nickName = res.target.dataset.name;
    if (res.from === 'button') {
      return {
        title: nickName + '新发了一条动态，快来看看吧',
        imageUrl: 'http://platform.pengyou66.com/eshop/goods/nanzhoucqvzfj1561707227',
        path: "/pages/friend/detail?id=" + id,
      }
    }
  },
  //他的圈
  gouser(e) {
    let userid = wx.getStorageSync('openid');
    let uid = e.currentTarget.dataset.uid;
    if (userid != uid) {
      wx.navigateTo({
        url: '../../pages/friend/other?uid=' + uid,
      });
    }
  },
  //看视频
  openVideo(e) {
    let index = e.currentTarget.dataset.idx;
    this.videoContext = wx.createVideoContext('myvideo' + index);
    let tab = this.data.currentTab;
    let url = ['friendList', 'attention', 'nearby'][tab] + '[' + index + '].isUrl';
    this.setData({
      [url]: e.currentTarget.dataset.url
    }, () => {
      this.videoContext.requestFullScreen();
      this.videoContext.hideStatusBar();
      this.videoContext.play();
    })
  },
  //关视频
  closeVideo(e) {
    let index = e.currentTarget.dataset.idx;
    let tab = this.data.currentTab;
    let url = ['friendList', 'attention', 'nearby'][tab] + '[' + index + '].isUrl';
    this.setData({
      [url]: ''
    }, () => {
      this.videoContext.exitFullScreen();
      this.videoContext.showStatusBar();
      this.videoContext.pause();
      this.videoContext.seek(0);
    })
  },
  changets() {
    wx.setStorageSync('one', 120);
    this.setData({
      one: false,
    })
  },
  closeto() {
    this.setData({
      isclose: false
    })
  }
})
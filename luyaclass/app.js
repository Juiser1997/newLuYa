//app.js

App({
  onLaunch() {
    console.log(this)
    this.getUpDateNew()
    this.checkMobiel();
  },

  globalData: {
    userInfo: null,
    loading: false,
    isIpx: false,
    titleid: null,
    dymic: "first",
    pushId: '',
    // contentid:""
  },

  /**
   * 版本更新
   */
  getUpDateNew() {

    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function(result) {
        // 有新版本
        if (result.hasUpdate) {
          updateManager.onUpdateReady(function() {
            // wx.showToast({
            //   title: '检测已有新版本'
            // })
            // setTimeout(() => {
            //   updateManager.applyUpdate()
            // }, 2000)
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success(res) {
                console.log(res)
              }
            })
          });
          updateManager.onUpdateFailed(function() {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            });
          });
        }
      });
    } else {
      // 有更新肯定要用户使用新版本，对不支持的低版本客户端提示
      wx.showModal({
        title: '温馨提示',
        content: '当前微信版本过低，无法使用该应用，请升级到最新微信版本后重试。'
      });
    }
  },

  checkMobiel() {
    let that = this;
    wx.getSystemInfo({
      success: res => {
        if (res.screenHeight == 812) {
          that.globalData.isIPX = true;
        }
      },
    });
  },

})
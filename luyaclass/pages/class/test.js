// pages/class/test.js

let _animation;
let _animationIndex = 0;
let _animationIntervalId = -1;
const _time = 100;
Page({
  data: {
    animation:''
  },
  onReady: function () {
    _animationIndex = 0;
    _animationIntervalId = -1;
    this.data.animation = '';
  },
  onShow: function () {
    _animation = wx.createAnimation({
      duration:_time,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0'
    })
    this.startAnimationInterval();
  },
  onHide(){
    this.stopAnimationInterval()
  },
  //旋转动画
  rotateAni: function (n) {
    _animation.rotate(30 * (n)).step()
    this.setData({
      animation: _animation.export()
    })
  },
  //开始旋转
  startAnimationInterval: function () {
    var that = this;
    that.rotateAni(++_animationIndex); // 进行一次旋转
    _animationIntervalId = setInterval(function () {
      that.rotateAni(++_animationIndex);
    },_time); // 每间隔_ANIMATION_TIME进行一次旋转
  },
  //停止旋转
  stopAnimationInterval: function () {
    if (_animationIntervalId> 0) {
      clearInterval(_animationIntervalId);
      _animationIntervalId = 0;
    }
  },
})
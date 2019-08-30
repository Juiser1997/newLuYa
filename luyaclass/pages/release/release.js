
let {dynamicsave} = require('../../api/req');
let {clear,upload} = require('../../utils/util');
const app = getApp();

Page({
  data: {
    imgs: [], //图片
    vid: [],
    viderImg:[],//封面图片
    url:'',
    status: 1,
    address: '', //位置
    texNum: 0,
    text: '', //内容
    latitude: '', //纬度
    longitude: '', //精度
    position:'',
    lock:true,
    checklock:true,
    autoplay:false,
    //test
    cWidth: 0,
    cHeight: 0
    
  },
  onLoad: function(options) {

  },
  onShow: function() {

  },
  onHide(){
    this.setData({lock:true,checklock:true,})
  },
  onReady: function () {
    this.videoContext = wx.createVideoContext('myvideo')
  },
  //文本输入
  editText(e) {
    this.setData({
      text: e.detail.value,
      texNum: (140 - e.detail.value.length)
    })
  },
  checkphoto() {
    let count = 9 - this.data.imgs.length;
    let ncount = count > 0 ? count : 0;
    wx.chooseImage({
      count: ncount,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // console.log(res)
        let file = res.tempFilePaths;
        let imgs = this.data.imgs
        imgs.push()
        for(let i in file){
          // file[i]=file[i] +"?x-oss-process=image/quality,q_60 "
          console.log(file[i])
          imgs.push(file[i]);
          this.setData({imgs:imgs})
      }
          upload(file).then(res=>{
            console.log(res)
            let simgs=res +"?x-oss-process=image/quality,q_60 "

            imgs.push(simgs);
            this.setData({imgs:imgs})
          })
      },
      fail: () => {},
      complete: () => {}
    });
  },
  // checkphoto(){
  //   let that = this
  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['compressed'], // 指定只能为压缩图，首先进行一次默认压缩
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (photo) {
  //       //-----返回选定照片的本地文件路径列表，获取照片信息-----------
  //       wx.getImageInfo({
  //         src: photo.tempFilePaths[0],
  //         success: function (res) {
  //           //---------利用canvas压缩图片--------------
  //           var ratio = 2;
  //           var canvasWidth = res.width //图片原始长宽
  //           var canvasHeight = res.height
  //           while (canvasWidth > 400 || canvasHeight > 400) {// 保证宽高在400以内
  //             canvasWidth = Math.trunc(res.width / ratio)
  //             canvasHeight = Math.trunc(res.height / ratio)
  //             ratio++;
  //           }
  //           that.setData({
  //             cWidth: canvasWidth,
  //             cHeight: canvasHeight
  //           })

  //           //----------绘制图形并取出图片路径--------------
  //           var ctx = wx.createCanvasContext('canvas')
  //           ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
  //           ctx.draw(false, setTimeout(function () {
  //             wx.canvasToTempFilePath({
  //               canvasId: 'canvas',
  //               destWidth: canvasWidth,
  //               destHeight: canvasHeight,
  //               success: function (res) {
  //                 console.log(res.tempFilePath)//最终图片路径

  //               },
  //               fail: function (res) {
  //                 console.log(res.errMsg)
  //               }
  //             })
  //           },100))    //留一定的时间绘制canvas
  //           // fail: function(res) {
  //           //   console.log(res.errMsg)
  //           // }
  //         }
  //         })
          
  //     }
  //   })
  // },
  checkvideo() {
    if(!this.data.checklock){return false;}
    this.setData({checklock:false})
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 60,
      success: (res) => {
        let file = res.tempFilePath;
        let video = [];
        let img= [];
        if(res.duration > 15){
           return wx.showToast({title: "你选的视频太大了",icon: 'success',duration: 800,mask: true});
        }
        wx.showLoading({title: '上传中',})
        upload(file).then(res=>{
          let videoImg = res+'?x-oss-process=video/snapshot,t_10000,m_fast';
          video.push(res);
          img.push(videoImg);
          wx.hideLoading()
          this.setData({vid:video,viderImg:img,checklock:true})
        })
      },
      fail: () => {},
      complete: () => {}
    });
  },
  govideo(e){
    this.setData({autoplay:true,url:e.currentTarget.dataset.url},()=>{
      this.videoContext.requestFullScreen();
      this.videoContext.hideStatusBar();
      this.videoContext.play();
    })
  },
  closeVideo() {
    //执行退出全屏方法
    this.setData({autoplay:false,url:''},()=>{
      this.videoContext.exitFullScreen();
      this.videoContext.showStatusBar();
      this.videoContext.pause();
      this.videoContext.seek(0);
    })
  },
  // 切换发布状态
  releaseStatus() {
    wx.showActionSheet({
      itemList: ['公开发表', '关注可见'],
      success: (res) => {
        if (res.tapIndex == 0) {
          this.setData({
            status: 1
          })
        } else if (res.tapIndex == 1) {
          this.setData({
            status: 0
          })
        }
      },
    });
  },
  //获取定位
  getaddress() {
    let that = this;
    wx.showActionSheet({
      itemList: ['使用定位', '不使用'],
      success: (res) => {
        if (res.tapIndex == 0) {
          wx.chooseLocation({
            success: function(res) {
              that.setData({
                address: res.address,
                longitude: res.longitude,
                latitude: res.latitude
              })
            },
          })
        } else if (res.tapIndex == 1) {
          this.setData({
            address: ''
          })
        }
      },
    });
  },
  //发布
  fabuBtn() {
    let imgs = this.data.imgs;
    let text = this.data.text;
    let vid = this.data.vid;
    // app.globalData.dymic = "second"
    if(imgs.length == 0 && text == '' && vid.length== 0){
      return wx.showToast({title: "不发布点什么吗？",icon: 'success',duration: 800,mask: true})
    }
    if(!this.data.lock){return false;}
    this.setData({lock:false})
    wx.showLoading({title: '上传中',})
    let data = {
      text:text,
      address:this.data.address,
      publicity:this.data.status,
      latitude:this.data.latitude,
      longitude:this.data.longitude,
      status:1,
      imgs:[]
    };
    if(imgs.length>0){
      Promise.all(imgs.map(item =>upload(item))).then(res=>{
        data.imgs = res;
        clear(data)
        dynamicsave(data).then(res => {
          if (res.code == 200) {
            wx.hideLoading()
            wx.switchTab({url: '../friend/friend',})
            wx.showToast({title: "发布成功",duration: 800,mask: true });
            this.cancel()
            this.setData({lock:true})
            app.globalData.dymic="second"
          }else{
            this.setData({lock:true})
          }
        })
      })
    }
    if(vid.length>0){
      data.video = vid[0];
      data.videoImg = this.data.viderImg[0];
      clear(data)
      dynamicsave(data).then(res => {
        if (res.code == 200) {
          wx.hideLoading()
          wx.switchTab({url: '../friend/friend',})
          wx.showToast({title: "发布成功",duration: 800,mask: true });
          this.cancel()
          this.setData({lock:true})
          app.globalData.dymic = "second"
        }else{
          this.setData({lock:true})
        }
      })
    }
    if(vid.length == 0 && imgs.length == 0 && text!=""){
      clear(data)
      dynamicsave(data).then(res => {
        if (res.code == 200) {
          wx.hideLoading()
          wx.switchTab({url: '../friend/friend',})
          wx.showToast({title: "发布成功",duration: 800,mask: true });
          this.cancel()
          this.setData({lock:true})
          app.globalData.dymic = "second"
        }else{
          this.setData({lock:true})
        }
      })
    }
  },
  randomStr(){
    var expect=6;//期望的字符串长度
    var str=Math.random().toString(36).substring(2);
    while(str.length<expect){
        str=Math.random().toString(36).substring(2)
    }
    return  'lyb'+str.substring(0,expect);
  },
  //预览图片
  imgPreview(e){
    let imgs  = e.currentTarget.dataset.list;
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: imgs,
    });
  },
  //长按删除图片
  DeleteImg(e){
    let index = e.currentTarget.dataset.inx;
    let list = this.data.imgs
    wx.showActionSheet({
      itemList: ['删除图片'],
      success: (res)=>{
        if(res.tapIndex == 0){
          list.splice(index,1);
          this.setData({imgs:list})
        }
      },
      fail: ()=>{},
    });
  },
  //取消
  cancel(){
    this.setData({
      imgs: [], //图片
      status: 1,
      address: '', //位置
      text: '', //内容
      latitude: '', //纬度
      longitude: '', //精度
      position:'',
      vid:[],
      viderImg:[],
    })
  },
})
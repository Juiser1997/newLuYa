let {check} = require('../../utils/util');
let {getcode,Regist,userget,userupdate} = require('../../api/req');
Page({
  data: {
    editstatus: 0,
    phonestatus: 0, 
    datas: {},
    address: '湖南,长沙岳麓区',
    id:'',
  },
  onLoad: function(options) {
  },
  onShow() {
    this.data.token = wx.getStorageSync('token_');
    let token = this.data.token
    if (token) {
      this.userList()
    } else {
      wx.navigateTo({
        url: '../../pages/login/login'
      });
    }
  },
  userList() { //用户信息请求
    let datas = this.data.datas
    let id=1
    userget(id).then(res=>{
      this.setData({
        datas:res.data,
        address: res.data.address,
        id: res.data.id,
        phone: res.data.phone
      })
    })
  },
  bindname(e) {
    let datas=this.data.datas
    datas.registeName = e.detail.value,
    this.setData({
      datas: datas
    })
  },
  // changeEdit() {
  //   this.setData({
  //     editstatus: 1,
  //   })
  // },
  // changeEditend() {
  //   this.setData({
  //     phonestatus: 1,
  //   })
  // },
  bindphone(e) {
    let datas = this.data.datas
    datas.phone = e.detail.value,
    this.setData({
      datas: datas,
    })
  },
  bindtext(e) {
    let datas = this.data.datas
    datas.remark = e.detail.value,
    this.setData({
      datas: datas,
    })
  },
  // changesex() {
  //   wx.showActionSheet({
  //     itemList: ['男', '女'],
  //     success: (res) => {
  //       let datas=this.data.datas
  //       datas.sex="男"
  //       if (res.tapIndex == 0) {
  //         this.setData({
  //           datas: datas
  //         })
  //       } else if (res.tapIndex == 1) {
  //         let datas = this.data.datas
  //         datas.sex = "女"
  //         this.setData({
  //           datas: datas
  //         })
  //       }
  //     },
  //     fail: () => {},
  //     complete: () => {}
  //   });
  // },

  // bindRegionChange: function(e) {
  //   let address = e.detail.value.join("");
  //   this.setData({
  //     address: address
  //   })
  // },
  // login() {
  //   let data = {}
  //   data.registeName = this.data.datas.registeName
  //   data.phone = this.data.datas.phone
  //   data.sex = this.data.datas.sex
  //   data.remark = this.data.datas.remark
  //   data.id=this.data.id
  //   data.address = this.data.address
  //   let xre = /^([\u4E00-\u9FA5]+|[a-zA-Z]+)$/;
  //   if (!xre.test(this.data.nickName)) {
  //     return wx.showModal({ content: '请正确输入姓名', showCancel: false, });
  //   }
  //   let reg = /^1[0-9]{10}$/;
  //   if (!reg.test(this.data.phone)) {
  //     return wx.showModal({ content: '请正确输入手机号号码', showCancel: false, });
  //   }
  //   userupdate(data).then(res => {
  //       if(res.code==200){
  //         wx.showToast({title: "修改成功",icon: 'success',duration: 800,mask: true});
  //         this.userList()
  //         wx.navigateBack();
  //       }
  //   })
  // }
})
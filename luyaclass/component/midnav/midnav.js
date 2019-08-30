// component/headnav/headnav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    only:String,
    modalHidden:{
      type:Boolean,
      value:true
    },
    midNav:Array,
    midNavTab:Number,
    border:String,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    barTap(e){
      const myEventDetail = e.currentTarget.dataset; // detail对象，提供给事件监听函数
      this.triggerEvent('myMidNavChangeTab', myEventDetail)
    },
  }
})
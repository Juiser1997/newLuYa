// component/video-title/video-title.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    List:Array,
    modalHidden:{
      type:Boolean,
      value:true
    },
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
    gotitle(e){
      const myEventDetail = e.currentTarget.dataset.id; // detail对象，提供给事件监听函数
      this.triggerEvent('videoId', myEventDetail)
    }
  }
})

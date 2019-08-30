Component({
  properties: {
    placeholder:String,
    left:{
      type:Number,
      value:15
    },
    modalHidden:{
      type:Boolean,
      value:true
    },
  },
  data: {
    searchvalue:'',
    list:[]
  },
  methods: {
    searchname(e){
      this.setData({searchvalue:e.detail.value,})
    },
    //搜索
    search(){
      this.triggerEvent('Search', this.data.searchvalue)
    },
    //清除
    remove(){
      this.setData({ searchvalue:'',});
      this.triggerEvent('Remove', '删除')
    },
  }
})
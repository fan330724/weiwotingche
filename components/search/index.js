// components/search/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    p:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    p:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onConfirm(e){
      console.log(e)
      this.setData({
        p:e.detail.value
      })
      this.triggerEvent("onConfirm",this.data.p)
    },
    clearInput(){
      this.triggerEvent("clearInput")
    },
    toyu(){
      this.triggerEvent("toyu")
    }
  }
  
})

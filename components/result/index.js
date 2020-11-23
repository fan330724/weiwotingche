// components/result/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fail:{
      type:Number,
      value:1
    }
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
    onrecord(){
      wx.redirectTo({
        url: '../../pages/record/record',
      })
    },
    onback(){
      wx.navigateBack()
    }
  }
})

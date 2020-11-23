// components/results/index.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 图片开关
    cook: {
      type: Number,
      value:0
    },
    text:{
      type:String,
      value:"恭喜您成为帷幄PLUS会员"
    },
    btntext:{
      type:String,
      value:"立即体验"
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
    onclick(e) {
      console.log(e)
      var {text} = e.currentTarget.dataset
      console.log(text)
      switch(text){
        case "立即体验":
          wx.switchTab({
            url: '../../pages/home/home',
          });
          break;
        case "重新支付":
          wx.navigateBack();
          break;
        case "查看充值记录":
          wx.redirectTo({
            url: '../../pages/record/record',
          })
      }
    }
  }
})
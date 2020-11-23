// pages/pdf/pdf.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    URL:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let _this = this
    let url = options.url
    console.log(url)
    _this.setData({
      URL:url
    })
  },
})
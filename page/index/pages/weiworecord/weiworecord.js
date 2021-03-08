// pages/weiworecord/weiworecord.js
import http from "../../../../request/index/weiworecord.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:"", //记录列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.request()
  },
  request(){
    http.findMoneyRecord({
      CELLPHONE: wx.getStorageSync('CELLPHONE')
    }).then((res) => {
      console.log(res.data.data.datas)
      this.setData({
        list:res.data.data.datas
      })
    })
  },
})
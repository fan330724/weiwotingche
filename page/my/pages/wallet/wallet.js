// pages/wallet/wallet.js
var app = getApp()
import http from '../../../../request/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.getStorage({
      key: "CELLPHONE",
      success: function (res) {
        http.wallect({
          CELLPHONE: res.data + '',
        }).then(res => {
          that.setData({
            total: res.data.data.datas.TOTAL_FEE
          })
        })
      }
    })
  },
  //功能暂未开放
  no: function () {
    wx.showToast({
      title: '功能暂未开放',
      mask: true,
      duration: 2000,
      icon: 'loading'
    })
  },
})
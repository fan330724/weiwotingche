// pages/openhongbao/index.js
var app = getApp()
import http from '../../request/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showOpen: 0, //控制拆红包的状态
    showPrice: true, //控制弹窗拆红包
    cellphone: '', //手机号
    ID: "", //传过来的id
    price: "", //金额
  },
  //点击拆红包
  toopen() {
    this.setData({
      showOpen: 1
    })
    http.getMallReward({
      ID: this.data.ID,
      openid: wx.getStorageSync('openid')
    }).then((res) => {
      console.log(res.data.data)
      this.setData({
        showOpen: 2,
        price: res.data.data
      })
    })
  },
  //拆完红包点击确认
  hideMask() {
    wx.reLaunch({
      url: "../home/home"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let {
      cellphone,
      ID
    } = options
        
    this.setData({
      cellphone,
      ID
    })
    if (!wx.getStorageSync('CELLPHONE')) {
      wx.setStorageSync('CELLPHONE', cellphone)
    }else{
      return
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
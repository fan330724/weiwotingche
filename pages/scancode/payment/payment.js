// pages/scancode/scancode.js
var app = getApp()
import request from '../../../request/scancode.js'
import http from '../scancode.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:"",
    openid:"",
    page:"pay"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    http.resetToken()
    if(options.item){
      let list = JSON.parse(options.item);
      this.setData({
        list
      })
    }else{
      this.getOpenid()
    }
  },

  //获取openid
  getOpenid(){
    let that = this;
    wx.login({
      success(res) {
        request.getOpenid({
          CODE: res.code
        },app.data.token).then(res => {
          // console.log(res.data)
          that.setData({
            openid: res.data.data
          })
          that.getfee(res.data.data)
        })
      },
    })
  },
  //获取车辆出场API
  getfee(openid) { 
    request.getfee({
      PARK_ID: "397040718163476480",
      CAMERA_ID: "398419227549106176",
      OPENID: openid,
    },app.data.token).then(res => {
      console.log(res)
      this.setData({
        list: res.data.data
      })
    })
  },
  //点击确认支付按钮
  getPhoneNumber(e) {
    // console.log(e)
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.login({
        success(res) {
          request.session_key({
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData,
            code: res.code
          }).then(res => {
            let phone = JSON.parse(res.data.data)
            console.log(phone)
          })
        }
      })
    } else {
      this.parkingfee()
      console.log("点击了拒绝")
    }
  },

  //支付函数
  payment(data) {
    let that = this;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function (res2) {
        that.setData({
          page: 'sucess',
        })
      },
      fail: function (res2) {
        that.setData({
          page: 'err'
        })
      }
    })
  },

  //支付车费
  parkingfee() {
    request.parkingfee({
      PAY_TYPE: 'wxxpay',
      OPEN_ID: this.data.openid || this.data.list.OPEN_ID,
      FEE: this.data.list.TOTAL,
      PARK_ID: "397040718163476480" || this.data.list.PARK_ID
    }, app.data.token).then(res => {
      console.log(res.data.data)
      this.payment(res.data.data)
    })
  },

  toindex(){
    wx.reLaunch({
      url: '../../home/home',
    })
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
    // this.resetToken()
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
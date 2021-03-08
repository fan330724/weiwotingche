// pages/recharge/recharge.js
var app = getApp();
import http from '../../../../request/http.js'
Page({

  /**
   * 页面的初始数据
   */

  data: {
    nPay: '50',
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {

  },
  // 轮播切换
  swiper: function (e) {
    let index = e.detail.current;
    if (index == 0) {
      this.setData({
        nPay: "50"
      })
    } else if (index == 1) {
      this.setData({
        nPay: "100"
      })
    } else if (index == 2) {
      this.setData({
        nPay: "300"
      })
    }
  },
  // 调起充值接口
  wxpay: function (res) {
    let _this = this
    var cellphone = wx.getStorageSync('CELLPHONE')
    http.recharge({
      CELLPHONE: cellphone,
      PAY_TYPE: 'wxxpay',
      TOTAL: _this.data.nPay,
      openid: wx.getStorageSync('openid')
    }).then((res) => {
      wx.requestPayment({
        timeStamp: res.data.data.timeStamp,
        nonceStr: res.data.data.nonceStr,
        package: res.data.data.package,
        signType: res.data.data.signType,
        paySign: res.data.data.paySign,
        success: function (res2) {
          wx.navigateTo({
            url: '../results/results?cook=' + 2,
          })
        },
        fail: function (res2) {
          wx.navigateTo({
            url: '../result/result?fail=0',
          })
        }
      })
    })
  },
  //跳转协议
  toczxy() {
    wx.navigateTo({
      url: '../czxy/czxy?xy=充值协议',
    })
  },
})
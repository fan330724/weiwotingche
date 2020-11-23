// pages/recharge/recharge.js
var checkNetWork = require("../../utils/CheckNetWork.js")
var app = getApp();

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
    if (!checkNetWork.checkNetWorkStatu()) {
      console.log('网络错误')
      self.setData({
        flag: false
      })
      return
    }
    wx.showLoading({
      title: '请稍后',
    })
    var cellphone = wx.getStorageSync('CELLPHONE')
    wx.request({
      url: app.data.url + 'api/pay/recharge.shtml',
      data: {
        CELLPHONE: cellphone,
        PAY_TYPE: 'wxxpay',
        TOTAL: _this.data.nPay,
        openid:wx.getStorageSync('openid')
      },
      method: 'POST',
      success: function (res1) {
        console.log(res1)
        wx.hideLoading()
        wx.requestPayment({
          timeStamp: res1.data.data.timeStamp,
          nonceStr: res1.data.data.nonceStr,
          package: res1.data.data.package,
          signType: res1.data.data.signType,
          paySign: res1.data.data.paySign,
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
      }
    })
  },
  //跳转协议
  toczxy() {
    wx.navigateTo({
      url: '../czxy/czxy?xy=充值协议',
    })
  },
})
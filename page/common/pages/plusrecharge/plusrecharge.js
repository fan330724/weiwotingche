// pages/plusrecharge/plusrecharge.js
import http from '../../../../request/http.js'
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nPay: '30',
    CARD_TYPE: 2,
    index: 0,
    cell:"",
    openid:"",
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
        nPay: "30",
        CARD_TYPE: 2,
      })
    } else if (index == 1) {
      this.setData({
        nPay: "280",
        CARD_TYPE: 4,
      })
    }
  },
  // 调起充值接口
  wxpay: function (res) {
    let _this = this
    http.vip({
      CELLPHONE: wx.getStorageSync('CELLPHONE'),
      PAY_TYPE: 'wxxpay',
      TOTAL: _this.data.nPay,
      openid: wx.getStorageSync('openid'),
      CARD_TYPE: this.data.CARD_TYPE
    }).then((res) => {
      if (res.data.errmsg == " OK") {
        var ORDER_CODE = res.data.data.ORDER_CODE
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
          success: function (res2) {
            wx.navigateTo({
              url: `../sharing/success/success?ORDER_CODE=${ORDER_CODE}`,
            })
          },
          fail: function (res2) {
            wx.navigateTo({
              url: `../results/results?cook=${1}`,
            })
          }
        })
      }else{
        wx.showToast({
          title: res.data.errmsg,
          icon:"none"
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  //跳转协议
  toczxy() {
    wx.navigateTo({
      url: '../czxy/czxy?xy=PLUS会员协议',
    })
  },
})
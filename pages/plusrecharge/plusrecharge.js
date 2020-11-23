// pages/plusrecharge/plusrecharge.js
var checkNetWork = require("../../utils/CheckNetWork.js")
import http from '../../request/http.js'
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nPay: '30',
    CARD_TYPE: 2,
    index: 0,
    // btnColor:false
    cell:"",
    openid:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      cell: options.cell,
      openid: options.openid
    })
  },
  // 轮播切换
  swiper: function (e) {
    let index = e.detail.current;
    if (index == 0) {
      this.setData({
        nPay: "0.01",
        CARD_TYPE: 2,
        // btnColor:true
      })
    } else if (index == 1) {
      this.setData({
        nPay: "0.01",
        CARD_TYPE: 4,
        // btnColor:false
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
    http.vip({
      CELLPHONE: wx.getStorageSync('CELLPHONE'),
      PAY_TYPE: 'wxxpay',
      TOTAL: _this.data.nPay,
      openid: wx.getStorageSync('openid'),
      CARD_TYPE: this.data.CARD_TYPE
    }).then((res) => {
      console.log(res)
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
              url: `../sharing/success/success?ORDER_CODE=${ORDER_CODE}&cell=${_this.data.cell}&openid=${_this.data.openid}`,
            })
          },
          fail: function (res2) {
            wx.navigateTo({
              url: `../results/results?cook=${1}`,
            })
            // wx.navigateTo({
            //   url: `../sharing/success/success?ORDER_CODE=${ORDER_CODE}&cell=${_this.data.cell}&openid=${_this.data.openid}`,
            // })
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
})
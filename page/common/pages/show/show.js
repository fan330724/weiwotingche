//引状态包
var openid = null
const packs = require('../../../../utils/pack.js')
var app = getApp()
Page({
  data: {
    data: '',
    pageNow: 0,
    pageSize: 1,
    hidden: 1,
    play: 0,
    phone: '',
    yy: 0, // 是否为预约订单
    yp: 0, // 是否需要支付
    qx:1  //是否显示取消
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading()
    console.log(options)
    var that = this
    if (options.data == '1') {
      console.log('我是未支付订单')
      var phone = wx.getStorageSync('CELLPHONE')
      wx.request({
        url: app.data.url + 'api/order/findOrderHis.shtml',
        data: {
          CELLPHONE: phone + '',
          pageNow: that.data.pageNow,
          pageSize: that.data.pageSize,
        },
        method: 'POST',
        dataType: 'json',
        success: function (position) {
          var arr = JSON.parse(position.data.data.datas);
          let arrNOpay = arr.filter((e) => e.ORDER_STATUS<=3)
          arrNOpay[0].ORDER_STATUS = packs.packs(arrNOpay[0].ORDER_STATUS)
          that.setData({
            hidden: 0,
            data: arrNOpay[0],
            play: 1,
            phone: phone
          })
          wx.hideLoading()
        }
      })
    } else {
      var cook = JSON.parse(options.data)
      if (cook.ORDER_STATUS === '预约未付款' || cook.ORDER_STATUS === '预约付款' || cook.ORDER_STATUS === '预约取消') {
        that.setData({
          yy: 1
        })
      }
      if (cook.ORDER_STATUS === '预约未付款'){
        that.setData({
          yp: 0
        })
      }
      if (cook.ORDER_STATUS === '预约取消') {
        that.setData({
          qx: 0
        })
      }
      console.log(cook)
      that.setData({
        data: cook,
        hidden: 0,
      })
    }
  },
  plays: function () {
    var that = this
    wx.showLoading({
      title: '支付中...',
    })
    wx.login({
      success: function (e) {
        console.log(that.data.data.TOTAL)
        var phone = wx.getStorageSync('CELLPHONE')
        console.log(that.data.data.ORDER_CODE)
        wx.request({
          url: app.data.url + '/api/pay/sign.shtml',
          data: {
            // CELLPHONE:phone,
            PAY_TYPE: 'wxxpay',
            TOTAL: that.data.data.TOTAL,
            CODE: e.code,
            // OPENID: openid,
            ORDER_CODE: that.data.data.ORDER_CODE
          },
          method: 'POST',
          success: function (res1) {
            wx.hideLoading()
            console.log(res1)
            wx.requestPayment({
              timeStamp: res1.data.data.timeStamp,
              nonceStr: res1.data.data.nonceStr,
              package: res1.data.data.package,
              paySign: res1.data.data.paySign,
              signType: 'MD5',
              success: function (res2) {
                wx.navigateBack();
              }
            })
          }
        })
      }
    })
  },
  //取消订单接口
  qx: function () {
    var _this = this
    wx.showLoading({
      title: '正在取消',
      mask: true
    })
    wx.request({
      url: app.data.url + 'api/order/cancel.shtml',
      data: {
        ORDER_CODE: _this.data.data.ORDER_CODE
      },
      method: "POST",
      success: function (res) {
        wx.hideLoading()
        wx.removeStorageSync('YYMESAGE')
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.navigateBack()
            }, 2000)
          }
        })
      }
    })
  }
})
// pages/scancode/scancode.js
var app = getApp()
import request from '../../../request/scancode.js'
import http from '../scancode.js'
const regeneratorRuntime = require('../../../lib/runtime/runtime.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: "",
    openid: "",
    page: "pay",
    //获取摄像头id  车场id
    PARKID: "",
    CAMERAID: "",
    showBtn: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.item) {
      let list = JSON.parse(options.item);
      this.setData({
        list
      })
    } else if (options.q) {
      var scan_url = decodeURIComponent(options.q);
      var PARKID = http.getQueryString(scan_url, 'PARKID');
      var CAMERAID = http.getQueryString(scan_url, 'CAMERAID');
      this.setData({
        PARKID,
        CAMERAID
      })
      this.init()
    }
  },

  async init() {
    await http.resetToken()
    await setTimeout(() => {
      this.getOpenid()
    }, 500)
  },
  //获取openid
  getOpenid() {
    let that = this;
    wx.login({
      success(res) {
        request.getOpenid({
          CODE: res.code
        }, app.data.token).then(res => {
          console.log(res.data)
          if (res.data.errcode == 0) {
            that.setData({
              openid: res.data.data
            })
            that.getfee(res.data.data)
          } else {
            wx.showToast({
              title: res.data.errmsg,
              mask: true,
              icon: "none"
            })
          }
        })
      },
    })
  },
  //获取车辆出场API
  getfee(openid) {
    request.getfee({
      PARK_ID: this.data.PARKID,
      CAMERA_ID: this.data.CAMERAID,
      OPENID: openid,
    }, app.data.token).then(res => {
      console.log(res.data)
      if (res.data.errcode == 0) {
        this.setData({
          list: res.data.data
        })
        if(res.data.data.TOTAL == 0){
          this.setData({
            showBtn: false
          })
        }else{
          this.setData({
            showBtn: true
          })
        }
      } else {
        wx.showToast({
          title: res.data.errmsg,
          mask: true,
          icon:"none"
        })
      }
    })
  },
  //点击确认支付按钮
  getPhoneNumber(e) {
    let that = this;
    // if (e.detail.errMsg == "getPhoneNumber:ok") {
    //   wx.login({
    //     success(res) {
    //       request.session_key({
    //         iv: e.detail.iv,
    //         encryptedData: e.detail.encryptedData,
    //         code: res.code
    //       }).then(res => {
    //         let phone = JSON.parse(res.data.data)
    //         console.log(phone)
    //         that.parkingfee()
    //       })
    //     }
    //   })
    // } else {
    //   that.parkingfee()
    // }
    that.parkingfee()
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
      ORDER_CODE: this.data.list.ORDER_CODE,
      PARK_ID: this.data.PARKID || this.data.list.PARK_ID
    }, app.data.token).then(res => {
      console.log(res.data)
      if (res.data.errcode == 0) {
        this.payment(res.data.data)
      } else {
        wx.showToast({
          title: res.data.errmsg,
          mask: true,
          icon: "none"
        })
      }
    })
  },

  toindex() {
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
})
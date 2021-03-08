// pages/scancode/scancode.js
import http from '../../../request/scancode/scancode.js'
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
  async init(){
    let sign = http.resetToken()
    if(sign) {
      await http.getOpenid();
      this.getfee()
    }else{
      await http.getToken();
      await http.getOpenid();
      this.getfee()
    }
  },
  //获取车辆出场API
  getfee() {
    http.getfee({
      PARK_ID: this.data.PARKID,
      CAMERA_ID: this.data.CAMERAID,
      OPENID: wx.getStorageSync('sconCodeOpenid'),
    }).then(res => {
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
    this.parkingfee()
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
    http.parkingfee({
      PAY_TYPE: 'wxxpay',
      OPEN_ID: this.data.openid || this.data.list.OPEN_ID,
      FEE: this.data.list.TOTAL,
      ORDER_CODE: this.data.list.ORDER_CODE,
      PARK_ID: this.data.PARKID || this.data.list.PARK_ID
    }).then(res => {
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
      url: '../../../page/tabBar/home/home',
    })
  },
})
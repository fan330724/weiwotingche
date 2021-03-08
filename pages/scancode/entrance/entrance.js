// pages/scancode/entrance/entrance.js
import http from '../../../request/scancode/scancode.js'
const regeneratorRuntime = require('../../../lib/runtime/runtime.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    //获取摄像头id  车场id
    CAMERAID: "",
    PARKID: "",
    //按钮显隐
    showBtn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取URL中的车场id 摄像头id
    if (options.q) {
      var scan_url = decodeURIComponent(options.q);
      var PARKID = http.getQueryString(scan_url, 'PARKID');
      var CAMERAID = http.getQueryString(scan_url, 'CAMERAID');
      this.setData({
        PARKID,
        CAMERAID
      });
      this.init();
      
    }
  },

  async init(){
    let sign = http.resetToken()
    if(sign) {
      await http.getOpenid();
      this.scan();
    }else{
      await http.getToken();
      await http.getOpenid();
      this.scan();
    }
  },
  /**
   * 扫码入场
   */
  scan() {
    http.scan({
      PARK_ID: this.data.PARKID,
      CAMERA_ID: this.data.CAMERAID,
    }).then(res => {
      if (res.data.errcode == 0) {
        let data = res.data.data;
        let PLATE_NUMBER = data.PLATE_NUMBER.split("")
        console.log(PLATE_NUMBER)
        this.setData({
          list: {
            PARKNAME: data.PARK_NAME,
            IN_TIME: data.IN_TIME,
            PLATE_NUMBER: PLATE_NUMBER,
            IN_TIME: data.IN_TIME,
            ORDER_CODE: data.ORDER_CODE,
            plate: data.PLATE_NUMBER
          },
          showBtn: true
        })
      } else {
        this.setData({
          showBtn: false
        })
        wx.showToast({
          title: res.data.errmsg,
          mask: true,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * 扫码入场抬杠
   */
  liftRod() {
    http.liftRod({
      PARK_ID: this.data.PARKID,
      CAMERA_ID: this.data.CAMERAID,
      OPEN_ID: wx.getStorageSync('sconCodeOpenid'),
      PLATE_NUMBER: this.data.list.plate,
      IN_TIME: this.data.list.IN_TIME,
      ORDER_CODE: this.data.list.ORDER_CODE
    }).then(res => {
      // console.log(res)
      if (res.data.data == "ok") {
        wx.showToast({
          title: '入场成功',
          mask: true,
        })
        this.setData({
          showBtn: false
        })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          mask: true,
          icon:"none"
        })
      }
    })
  },
  /**
   * 确认入场
   */
  getPhoneNumber(e) {
    this.liftRod()
  },
})
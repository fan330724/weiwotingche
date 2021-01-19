// pages/scancode/entrance/entrance.js
import http from '../scancode.js'
import request from '../../../request/scancode.js'

let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.resetToken()
    this.scan()
  },
  /**
   * 获取openid
   */
  getOpenid() {
    let that = this;
    wx.login({
      success(res) {
        request.getOpenid({
          CODE: res.code
        }, app.data.token).then(res => {
          // console.log(res.data)
          that.liftRod(res.data.data)
        })
      },
    })
  },
  /**
   * 扫码入场
   */
  scan() {
    request.scan({
      PARK_ID: "397040718163476480",
      CAMERA_ID: "398420980638154752",
    }, app.data.token).then(res => {
      console.log(res.data)
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
          }
        })
      } else {
        wx.showToast({
          title: '请求失败，请重新扫码',
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
  liftRod(openid){
    request.liftRod({
      PARK_ID: "397040718163476480",
      CAMERA_ID: "398420980638154752",
      OPEN_ID: openid,
      PLATE_NUMBER: this.data.list.plate,
      IN_TIME: this.data.list.IN_TIME,
      ORDER_CODE: this.data.list.ORDER_CODE
    },app.data.token).then(res => {
      // console.log(res)
      if(res.data.data == "ok"){
        wx.showToast({
          title: '入场成功',
          mask: true,
        })
      }else{
        wx.showToast({
          title: res.data.errmsg,
          mask: true,
        })
      }
    })
  },
  /**
   * 确认入场
   */
  getPhoneNumber(e) {
    let that = this;
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
            that.getOpenid()
          })
        }
      })
    } else {
      that.getOpenid()
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
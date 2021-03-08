// pages/login/login.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellphone: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  registInput(e) {
    var phoneNumber = e.detail.value
    this.setData({
      cellphone: phoneNumber
    })
  },
  //获取验证码
  getCode: function () {
    var that = this
    //验证手机号正则
    var pattern = /^[1][3,4,5,7,8,9]\d{9}$/;
    if (pattern.test(that.data.cellphone)) {
      wx.login({
        success: (res) => {
          var code = res.code
          that.request(code)
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '电话号码不正确',
        showCancel: false
      })
    }
  },
  request(code) {
    var that = this
    //服务器获取验证码
    wx.showLoading({
      title: '请稍后',
    })
    wx.request({
      url: app.data.url + '/api/member/loginApp.shtml',
      data: {
        CELLPHONE: that.data.cellphone,
        CODE: code
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.errmsg == '验证码超出同模板同号码天发送上限') {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '今日验证码已达上限',
          })
          return
        } else {
          wx.setStorageSync('openid', res.data.data.data.OPEN_ID)
          wx.navigateTo({
            url:`../wxyzm/wxyzm?phone=${that.data.cellphone}&code=${res.data.data.data.VERIFICATION_CODE}`
          })
        }
      }
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
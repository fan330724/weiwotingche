// pages/yzm/yzm.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '',
    cellphone: "",
    code: "",
    focusIndex: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var {
      phone,
      code,
    } = options
    this.setData({
      cellphone: phone,
      code,
    })
    this.goGetCode()
  },
  //倒计时
  goGetCode: function () {
    var that = this;
    var time = 60;
    that.setData({
      text: '60秒',
    })
    var Interval = setInterval(function () {
      time--;
      if (time > 0) {
        that.setData({
          text: time + '秒'
        })
      } else {
        clearInterval(Interval);
        that.setData({
          text: '重新发送'
        })
      }
    }, 1000)
  },
  //光标
  setValue(e) {
    // 设置光标
    var value = e.detail.value
    this.setData({
      value: value,
      focusIndex: value.length
    })
  },
  //点击确认
  inputblur() {
    if (this.data.focusIndex < 4 || this.data.value != this.data.code) {
      wx.showToast({
        title: '请输入正确验证码',
        icon: "none"
      })
    } else {
      this.request()
    }
  },
  //点击重新发送
  oncode() {
    if (this.data.text == '重新发送') {
      this.goGetCode()
      wx.request({
        url: app.data.url + '/api/member/loginApp.shtml',
        data: {
          CELLPHONE: this.data.cellphone,
        },
        method: 'POST',
        success: function (res) {
          console.log(res.data)
          wx.hideLoading()
          if (res.data.errmsg == '验证码超出同模板同号码天发送上限') {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '今日验证码已达上限',
            })
            return
          } else {
            wx.showToast({
              title: '发送成功',
              icon: "none"
            })
          }
        }
      })
    }
  },
  //获取数据
  request() {
    wx.showLoading({
      title: '请稍后',
      mask: true
    })
    wx.request({
      url: app.data.url + '/api/member/login.shtml',
      data: {
        CELLPHONE: this.data.cellphone,
        VERIFICATION_CODE: this.data.code,
      },
      method: "post",
      success: (res) => {
        console.log(res)
        if (res.data.data.loginType == 'success') {
          wx.setStorageSync('CELLPHONE', this.data.cellphone)
          wx.reLaunch({
            url: '../welfare/welfare',
          })
        } else {
          wx.showToast({
            title: '账号或验证码不对',
            icon: "none"
          })
        }
        wx.hideLoading()
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
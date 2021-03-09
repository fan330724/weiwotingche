// pages/yzm/yzm.js
import http from '../../request/http.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '',
    cellphone: "",
    code: "",
    focusIndex: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let {
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
    if (value.length == '4') {
      if (value != this.data.code) {
        wx.showToast({
          title: '请输入正确验证码',
          icon: "none"
        })
      } else {
        this.request()
      }
    }
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
      http.loginApp({
        CELLPHONE: this.data.cellphone,
      }).then(res => {
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
      })
    }
  },
  //获取数据
  request() {
    http.login({
      CELLPHONE: this.data.cellphone,
      VERIFICATION_CODE: this.data.code,
    }).then(res => {
      if (res.data.data.loginType == 'success') {
        wx.setStorageSync('CELLPHONE', this.data.cellphone)
        wx.reLaunch({
          url: '../../page/tabBar/home/home',
        })
      } else {
        wx.showToast({
          title: '账号或验证码不对',
          icon: "none"
        })
      }
    })
  },
})
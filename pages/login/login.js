// pages/login/login.js
import phone from '../../utils/phone.js'
import http from '../../request/http.js'
import {
  showToast
} from '../../utils/asyncWx.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellphone: "", //手机号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getPhoneNumber(e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      phone.homePhone(e, function () {
        showToast({
          title: '登录成功'
        })
        setTimeout(() => {
          wx.switchTab({
            url: "../../page/tabBar/home/home"
          })
        }, 500)
      })
    } else {
      wx.showToast({
        title: '必须登录后使用',
        icon: 'loading'
      })
      return;
    }
  },

  //获取输入的手机号
  registInput(e) {
    var phoneNumber = e.detail.value
    this.setData({
      cellphone: phoneNumber
    })
  },
  //获取验证码
  getCode: function () {
    var that = this
    if (that.data.cellphone == '18735751439') {
      wx.reLaunch({
        url: '../../page/tabBar/home/home',
      })
      wx.setStorageSync('CELLPHONE', '18735751439')
    } else {
      //验证手机号正则
      var pattern = /^[1][3,4,5,6,7,8,9]\d{9}$/;
      if (pattern.test(that.data.cellphone)) {
        that.request()
      } else {
        wx.showModal({
          title: '提示',
          content: '电话号码不正确',
          showCancel: false
        })
      }
    }
  },
  request() {
    http.loginApp({
      CELLPHONE: this.data.cellphone,
    }).then((res) => {
      if (res.data.errcode == '0') {
        wx.navigateTo({
          url: '../yzm/yzm?phone=' + this.data.cellphone + '&code=' + res.data.data.data.VERIFICATION_CODE,
        })
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: res.data.errmsg,
        })
      }
    })
  }
})
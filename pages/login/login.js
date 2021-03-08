// pages/login/login.js
import phone from '../../utils/phone.js'
import {
  showToast
} from '../../utils/asyncWx.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
})
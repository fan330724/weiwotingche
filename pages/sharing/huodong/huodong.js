// pages/huodong/huodong.js
var app = getApp()
import http from '../../../request/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    inx: "",
    total: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cellphone = wx.getStorageSync('CELLPHONE')
    if (cellphone) {
      http.getshareRecord(cellphone).then((res) => {
        console.log(res.data.data)
        var data = res.data.data.list
        var total = res.data.data.total
        var arr = []
        data.filter((v) => {
          var phone = v.B_SHARE_CELLPHONE
          var date = v.UPDATE_DATE.toString().substring(0, 10)
          var x = phone.toString().replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
          arr.push({
            CELLPHONE: x,
            UPDATE_DATE: date,
            B_SHARE_MONEY: v.B_SHARE_MONEY,
            SHARE_MONEY: v.SHARE_MONEY,
            SHARE_TYPE: v.SHARE_TYPE
          })
        })
        this.setData({
          list: arr,
          total
        })
        if (this.data.list.length < 3) {
          this.setData({
            inx: this.data.list.length
          })
        } else {
          this.setData({
            inx: 3
          })
        }
      })
    } else {
      wx.reLaunch({
        url: `../../login/login?openType=2`,
      })
    }

  },

  torule() {
    wx.navigateTo({
      url: '../rule/rule?type=1',
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
  onShow: function () {},

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
  onShareAppMessage: function (res) {
    if (res.from == 'button') {
      let CELLPHONE = wx.getStorageSync('CELLPHONE')
      return {
        title: '我的红包已到账！你也快来领取吧~',
        // desc: '帷幄停车',
        path: '/pages/sharing/agree/agree?INVITER=' + CELLPHONE + '&openid=' + wx.getStorageSync('openid'),
        imageUrl: 'http://124.70.23.12:8084/gameIcon/image/fenxiang2.png',
        success: () => {
          wx.showShareMenu({
            withShareTicket: true,
          })
        }
      }
    } else if (res.from == 'menu') {
      let CELLPHONE = wx.getStorageSync('CELLPHONE')
      return {
        title: '我的红包已到账！你也快来领取吧~',
        // desc: '帷幄停车',
        path: '/pages/sharing/agree/agree?INVITER=' + CELLPHONE + '&openid=' + wx.getStorageSync('openid'),
        imageUrl: 'http://124.70.23.12:8084/gameIcon/image/fenxiang2.png',
        success: () => {
          wx.showShareMenu({
            withShareTicket: true,
          })
        }
      }
    }
  },
})
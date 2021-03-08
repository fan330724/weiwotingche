// pages/mycar/mycar.js
var checkNetWork = require("../../utils/CheckNetWork.js");
const {
  default: http
} = require("../../request/http.js");
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    arr: [],
  },
  // 删除事件
  editIDcard: function (event) {
    console.log(event)
    var that = this;
    if (!checkNetWork.checkNetWorkStatu()) {
      console.log('网络错误')
      self.setData({
        flag: false
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '是否删除' + event.currentTarget.dataset.name,
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          //点击确认按钮
          wx.getStorage({
            key: 'CELLPHONE',
            success: function (res) {
              http.unBindingPlateNumber({
                CELLPHONE: res.data,
                PLATENUMBER: event.currentTarget.dataset.name
              }).then(res => {
                that.onShow()
              })
            },
          })
        }
      },

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  redirect: function (res) {
    wx.navigateTo({
      url: '../license/license',
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
    var that = this
    wx.getStorage({
      key: 'CELLPHONE',
      success: function (e) {
        http.memberPlateNumber({
          CELLPHONE: e.data
        }).then(res => {
          console.log(res)
          var arr = res.data.data;
          that.setData({
            arr
          })
        })
      },
    });
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})
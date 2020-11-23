// pages/fankui/fankui.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '',
    tLength: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  // 键盘输入
  cons: function(e) {
    let val = e.detail.value
    this.setData({
      text: val
    })
  },
  //提交信息
  pull: function() {
    let _this = this
    if(_this.data.text.length==0){
      return;
    }
    wx.showLoading({
      title: '正在提交',
    })
    let cellphone = wx.getStorageSync("CELLPHONE")
    wx.request({
      url: app.data.url + '/api/feedback/feedbackADD.shtml',
      data: {
        TITLE: '帷幄停车',
        CONTENT: _this.data.text,
        CELLPHONE: cellphone
      },
      method: "POST",
      success: function(res) {
        wx.hideLoading()
        if (res.data.data.loginType == 'success') {
          wx.showModal({
            title: '提交成功',
            content: '感谢您宝贵的意见',
            showCancel:false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack()
              }
            }
          })
        }else{
          wx.showToast({
            title:'未知错误',
            icon:'none'
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '未知错误',
          icon: 'none'
        })
      }
    })
  }
})
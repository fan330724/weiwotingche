// pages/wallet/wallet.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    total:0
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
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
    var total, phone;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.getStorage({
      key: "CELLPHONE",
      success: function (res) {
        console.log("data:" + res.data);
        wx.request({
          url: app.data.url + '/api/wallect/wallect.shtml',
          data: {
            CELLPHONE: res.data + '',
          },
          method: 'POST',
          success: function (position) {
            console.log(position)
            //字符串转对象
            wx.hideLoading();
            that.setData({
              total: position.data.data.datas.TOTAL_FEE
            })
          },
          dataType: "json"
        })
      }
    })  
  },
  //功能暂未开放
  no:function(){
    wx.showToast({
      title: '功能暂未开放',
      mask: true,
      duration: 2000,
      icon: 'loading'
    })
  },
})
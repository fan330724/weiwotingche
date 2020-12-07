// pages/daka/daka.js
import http from '../../request/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal:false, //控制弹窗
    rank:"", //是否是plus会员
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.memberInfo(wx.getStorageSync('CELLPHONE')).then(res => {
      console.log(res.data.data.data)
      var rank = res.data.data.data.VIP_RANK
      this.setData({
        rank
      })
    })
  },
  //点击打卡
  todaka(){
    this.setData({
      showModal:true
    })
  },
  //关闭弹窗
  hideMask(){
    this.setData({
      showModal:false
    })
  },
  //跳转开通会员页
  tomember(){
    wx.navigateTo({
      url: '../member/member',
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
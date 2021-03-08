// pages/sharing/agree/agree.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cell:"",
    openid:"",
  },
  //点击接受邀请
  tologin() {
    var {
      cell,
      openid
    } = this.data
    var cellphone = wx.getStorageSync('CELLPHONE')
    if (cellphone) {
      wx.reLaunch({
        url: `../../member/member?cell=${cell}&openid=${openid}`,
        // url: `../../member/member?cell=18735751439&openid=o-Mzt0PhoLnavcOJiwxxHHhWXDAk`,
      })
    } else {
      wx.reLaunch({
        url: `../../login/login?cell=${cell}&openType=1&openid=${openid}`,
        // url: `../../login/login?cell=18735751439&openType=1`,
      })
    }
  },
  //点击活动规则
  torule() {
    wx.navigateTo({
      url: '../rule/rule?type=1',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cell: options.INVITER,
      openid: options.openid,
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
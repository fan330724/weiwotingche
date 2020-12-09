// pages/daka/daka.js
import http from '../../request/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal:false, //控制弹窗
    rank:"", //是否是plus会员
    showCard: true, //控制打卡按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //点击打卡
  todaka(){
    http.toSignRecord({
      CELLPHONE: wx.getStorageSync("CELLPHONE")
    }).then(res => {
      console.log(res)
      if(res.data.errcode == 0){
        this.setData({
          showModal:true,
          showCard: false
        })
      }else{
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none',
          mask: true,
        })
      }
    })
  },

  //获取用户信息
  onmember(){
    http.memberInfo(wx.getStorageSync('CELLPHONE')).then(res => {
      console.log(res.data.data.data)
      var rank = res.data.data.data.VIP_RANK
      this.setData({
        rank
      })
    })
  },

  //获取打卡状态
  ongetSignCount(){
    http.getSignCount({
      CELLPHONE: wx.getStorageSync("CELLPHONE")
    }).then(res => {
      console.log(res.data.errmsg)
      if(res.data.errmsg == ' OK'){
        this.setData({
          showCard: true
        })
      }else{
        this.setData({
          showCard: false
        })
      }
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
    if(wx.getStorageSync('CELLPHONE')){
      this.onmember()
      this.ongetSignCount()
    }else{
      wx.redirectTo({
        url: '../login/login?type=daka',
      })
    }
    
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
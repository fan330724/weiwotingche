// pages/xiaoxizhongxin/xiaoxizhongxin.js
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
  tohuodong(){
    wx.navigateTo({
      url: '../huodongguangao/huodongguangao',
    })
  },
  tonotice(e){
    var {state,title} = e.currentTarget.dataset
    wx.navigateTo({
      url: `../notice/notice?state=${state}&title=${title}`,
    })
  },
})
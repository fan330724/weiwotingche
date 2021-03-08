// pages/lianxiwomen/lianxiwomen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  makephone(e){
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
})
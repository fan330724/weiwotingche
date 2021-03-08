// pages/set/set.js
var app = getApp()
import http from '../../../../request/my/set.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    version:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.version({}).then(res => {
      var {version} = res.data.data
      this.setData({
        version
      })
    })
  },
  lianxi:function(){
    wx.navigateTo({
      url: '../lianxiwomen/lianxiwomen',
    })
  },
  banben(){
    wx.navigateTo({
      url: `../banbenxinxi/banbenxinxi?version=${this.data.version}`,
    })
  },
  toexit(){
    wx.removeStorage({
      key: 'CELLPHONE',
      success:(res) => {
        console.log(res)
        wx.reLaunch({
          url: '../../../../pages/login/login',
        })
      }
    })
  },
})
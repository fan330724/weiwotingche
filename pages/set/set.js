// pages/set/set.js
var app = getApp()
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
    wx.request({
      url: app.data.url+'/api/version/version.shtml',
      method:"POST",
      success:(res) => {
        console.log(res)
        var {version} = res.data.data
        this.setData({
          version
        })
      }
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
          url: '../login/login',
        })
      }
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
})
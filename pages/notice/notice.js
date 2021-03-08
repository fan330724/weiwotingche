// pages/tingchetongzhi/tingchetongzhi.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    title:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var {
      state,
      title
    } = options
    this.setData({
      title
    })
    this.gettongzhi(state)
    wx.setNavigationBarTitle({
      title
    })
  },
  gettongzhi(state) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.data.url + 'api/notice/owner.shtml',
      method: 'post',
      data: {
        CELLPHONE: wx.getStorageSync('CELLPHONE'),
        MSG_TYPE: state
      },
      success: (res) => {
        var data = res.data.data
        console.log(data)
        var arr = []
        for(var i in data){
          var array = {
            TITLE:data[i].TITLE,
            CREATE_DATE:data[i].CREATE_DATE,
            CONTENT:JSON.parse(data[i].CONTENT)
          }
          arr.push(array)
        }
        console.log(arr)
        if (data.length == 0) {
          that.setData({
            show: true
          })
        } else {
          that.setData({
            show: false,
            listarr: arr
          })
        }
        wx.hideLoading()
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
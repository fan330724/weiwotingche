// pages/markertap/markertap.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: ['../../image/home/parkID.png'],
    ops: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let op = JSON.parse(options.id)
    let statics = options.static
    this.setData({
      ops: op
    })
  },
  dh() {
    var that = this
    // 百度地图转腾讯地图
    var X_PI = 3.14159265358979324 * 3000.0 / 180.0
    var x = that.data.ops.LON - 0.0065
    var y = that.data.ops.LAT - 0.006
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI)
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
    var gg_lon = z * Math.cos(theta)
    var gg_lat = z * Math.sin(theta)
    const latitude = gg_lat
    const longitude = gg_lon
    wx.openLocation({
      latitude,
      longitude,
      scale: 12,
      name: that.data.ops.NAME,
      address: that.data.ops.ADDRESS
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
    var that = this
    // 获取车场图片
    wx.request({
      url: app.data.url + '/mer/workPark/QueryPicture.shtml',
      data: {
        PARK_ID: this.data.ops.ID,
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        let imgList = res.data.data;
        if (imgList == null) {
          return
        }
        let imgL = imgList.map((val) => {
          // console.log(val)
          return app.data.url + val
        })
        that.setData({
          imgList: imgL
        })
      }
    })
  },
  previewImage(e) {
    var {
      src,
      list
    } = e.currentTarget.dataset
    console.log(src, list)
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
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
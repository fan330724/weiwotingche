// pages/tingchetongzhi/tingchetongzhi.js
var app = getApp()
import http from '../../../../request/http.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    title: ""
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
    http.owner({
      CELLPHONE: wx.getStorageSync('CELLPHONE'),
      MSG_TYPE: state
    }).then(res => {
      var data = res.data.data
      console.log(data)
      var arr = []
      for (var i in data) {
        var array = {
          TITLE: data[i].TITLE,
          CREATE_DATE: data[i].CREATE_DATE,
          CONTENT: JSON.parse(data[i].CONTENT)
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
    })
  },
  
})
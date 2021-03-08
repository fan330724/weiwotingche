// pages/wechatactivities/wxdetails/wxdetails.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "15035123606", //客服电话
    wxcell:"",  //手机号
    price:"",  //钱数
    list:""   // 列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wxcell:options.cell
    })
    
  },
  //点击复制
  tocode() {
    wx.setClipboardData({
      data: this.data.phone,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  request() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.data.url + '/api/member/memberBoundCount.shtml',
      data: {
        CELLPHONE: this.data.wxcell
      },
      method: 'post',
      success: (res) => {
        console.log(res.data.data.memList)
        var data = res.data.data.memList
        var arr = []
        data.filter((v) => {
          var phone = v.CELLPHONE
          var date = v.UPDATE_DATE.toString().substring(0, 10)
          var x = phone.toString().replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
          arr.push({
            CELLPHONE: x,
            UPDATE_DATE: date,
          })
        })
        this.setData({
          list: arr,
        })
        if (this.data.list.length < 5) {
          this.setData({
            inx: this.data.list.length
          })
        } else {
          this.setData({
            inx: 5
          })
        }
        var length = this.data.list.length
        console.log(length)
        this.price(length)
        wx.hideLoading()
      },
    })
  },
  price(length){
    if(length<=20){
      console.log(length*300*0.03)
      var price = length*300*0.03
      this.setData({
        price
      })
    }else if(length>=20&&length<=50){
      console.log(length*300*0.05)
      var price = length*300*0.05
      this.setData({
        price
      })
    }else if(length>=50&&length<=100){
      console.log(length*300*0.07)
      var price = length*300*0.07
      this.setData({
        price
      })
    }else if(length>100){
      console.log(length*300*0.08)
      var price = length*300*0.08
      this.setData({
        price
      })
    }
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
    this.request()
    
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
  onShareAppMessage: function (res) {
    console.log(res)
    console.log(wx.getStorageSync('CELLPHONE'))
    if (res.from == 'button') {
      return {
        title: '帷幄停车',
        // desc: '帷幄停车',
        path: '/pages/sharing/accept/accept?cellphone=' + this.data.wxcell + '&chnnel=wxx',
        imageUrl: 'http://124.70.23.12:8084/gameIcon/image/fenxiang.png',
        success: () => {
          wx.showShareMenu({
            withShareTicket: true,
          })
        }
      }
    } else if (res.from == 'menu') {
      return {
        title: '帷幄停车',
        // desc: '帷幄停车',
        path: '/pages/sharing/accept/accept?cellphone=' + this.data.wxcell + '&chnnel=wxx',
        imageUrl: 'http://124.70.23.12:8084/gameIcon/image/fenxiang.png',
        success: () => {
          wx.showShareMenu({
            withShareTicket: true,
          })
        }
      }
    }
  },
})
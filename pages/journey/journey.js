//引状态包
const packs = require('../../utils/pack.js')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: "",
    pageNow: 0,
    pageSize: 10,
    show: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.request()
  },
  todetail(e){
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: `../journeydetail/journeydetail?id=${e.currentTarget.dataset.id}`,
    })
  },
  onShow: function () {
    
  },
  request() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.data.url + 'api/order/findOrderRefillBuyHis.shtml',
      method: 'post',
      data: {
        CELLPHONE: wx.getStorageSync('CELLPHONE'),
        STATUS: 2,
        pageSize: this.data.pageSize,
        pageNow: this.data.pageNow,
      },
      success: (res) => {
        // console.log(res)
        //隐藏导航条加载动画
        wx.hideNavigationBarLoading();
        //停止下拉刷新
        wx.stopPullDownRefresh();
        wx.hideLoading()
        var list = JSON.parse(res.data.data)
        console.log(list)
        if (res.data.data == null) {
          this.setData({
            show: true
          })    
        } else {
          var arr = []
          var title = ''
          var start = ''
          list.map(v => {
            if (v.IS_RECHARGE == 1) {
              title = '储值会员充值'
            } else if (v.IS_RECHARGE == 3) {
              title = 'PLUS会员购买'
            } else if (v.IS_RECHARGE == 4) {
              title = '卡券购买'
            }
            if (v.ORDER_STATUS == 4) {
              start = '充值成功'
            } 
            // else if (v.ORDER_STATUS == 8 || v.ORDER_STATUS == 6) {
            //   start = '未支付'
            // }
            arr.push({
              title: title,
              start: start,
              TOTAL: parseFloat(v.TOTAL).toFixed(2),
              UPDATE_DATE: v.UPDATE_DATE,
              ID:v.ID,
              REFUND_STATUS:v.REFUND_STATUS   
            })
          })
          this.setData({
            show: false,
            list: arr
          })
        }
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
  //  */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.setData({
      pageNow:0
    })
    this.request()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.data.url + 'api/order/findOrderRefillBuyHis.shtml',
      method: 'post',
      data: {
        CELLPHONE: wx.getStorageSync('CELLPHONE'),
        STATUS: 2,
        pageSize: this.data.pageSize,
        pageNow: this.data.pageNow += 1,
      },
      success: (res) => {
        wx.hideLoading()
        var list = JSON.parse(res.data.data)
        if (res.data.data == null) {
          wx.showToast({
            title: '我是有底线的',
            icon:"none"
          })
        } else {
          console.log(list)
          var arr = []
          var title = ''
          var start = ''
          list.map(v => {
            if (v.IS_RECHARGE == 1) {
              title = '储值会员充值'
            } else if (v.IS_RECHARGE == 3) {
              title = 'PLUS会员购买'
            }else if (v.IS_RECHARGE == 4) {
              title = '卡券购买'
            }
            if (v.ORDER_STATUS == 4) {
              start = '充值成功'
            }
            // else if (v.ORDER_STATUS == 8 || v.ORDER_STATUS == 6) {
            //   start = '未支付'
            // }
            arr.push({
              title: title,
              start: start,
              TOTAL: parseFloat(v.TOTAL).toFixed(2),
              UPDATE_DATE: v.UPDATE_DATE,
              ID:v.ID,
              REFUND_STATUS:v.REFUND_STATUS   
            })
          })
          this.setData({
            list: [...this.data.list,...arr]
          })
        }
      }
    })
  },
})
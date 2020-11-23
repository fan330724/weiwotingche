// pages/record/record.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['上月', '本月'], //下拉列表的数据
    index: 1, //选择的下拉列表下标
    listarr: '',
    pageNow: 0,
    pageSize: 10,
    date: "", //点击日历存储的时间
    cook: false,
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show,
      pageNow: 0
    });
    this.getjilu()
    // console.log(this.data.index)
  },
  getjilu() {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.data.url + '/api/order/findOrderRefillBuyHis.shtml',
      method: 'post',
      data: {
        CELLPHONE: wx.getStorageSync('CELLPHONE'),
        STATUS: 1,
        pageSize: that.data.pageSize,
        pageNow: that.data.pageNow,
      },
      success: (res) => {
        // console.log(res)
        wx.hideNavigationBarLoading() //完成停止加载
        //停止下拉刷新
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (res.data.data == null) {
          that.setData({
            cook: false
          })
        } else {
          var data = JSON.parse(res.data.data);
          console.log(data)
          var arr = []
          var title = ''
          var start = ''
          data.map(v => {
            // var create = v.UPDATE_DATE.substring(0, 7)
            // console.log(create)
            if (v.IS_RECHARGE == 1) {
              title = '储值会员充值'
            } else if (v.IS_RECHARGE == 3) {
              title = 'plus会员充值'
            }
            if (v.ORDER_STATUS == 4) {
              start = '支付成功'
            } else if (v.ORDER_STATUS == 8 || v.ORDER_STATUS == 6) {
              start = '未支付'
            }
            arr.push({
              title: title,
              start: start,
              TOTAL: v.TOTAL,
              UPDATE_DATE: v.UPDATE_DATE
            })
            // if (that.data.index == 1) {
            //   if (create == that.data.date) {
            //     arr.push({
            //       title: title,
            //       start: start,
            //       TOTAL: v.TOTAL,
            //       UPDATE_DATE: v.UPDATE_DATE
            //     })
            //     that.setData({
            //       listarr: arr,
            //       cook: true
            //     })
            //   } else if (arr.length == 0) {
            //     that.setData({
            //       cook: false
            //     })
            //   }
            // } else if (that.data.index == 0) {
            //   // console.log(that.data.date)
            //   var ndate = that.data.date.substring(that.data.date.length - 1) - 1
            //   var b = this.data.date.substring(0, this.data.date.length - 1)
            //   // console.log(ndate, b)
            //   if (create == (b + ndate)) {
            //     arr.push({
            //       title: title,
            //       start: start,
            //       TOTAL: v.TOTAL,
            //       UPDATE_DATE: v.UPDATE_DATE
            //     })
            //     that.setData({
            //       listarr: arr,
            //       cook: true
            //     })
            //   } else if (arr.length == 0) {
            //     that.setData({
            //       cook: false
            //     })
            //   }
            // }
          })
          that.setData({
            listarr:arr,
            cook:true
          })
        }
      },
      dataType: "json"
    })
  },
  bindDateChange(e) {
    var {
      value
    } = e.detail
    this.setData({
      date: value
    })
    console.log(this.data.date)
    this.getjilu()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var newdate = year + '-' + 0 + month
    // console.log(newdate)
    this.setData({
      date: newdate
    })
    this.getjilu()
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
    wx.showNavigationBarLoading();
    this.setData({
      pageNow: 0
    })
    this.getjilu()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.data.url + '/api/order/findOrderRefillBuyHis.shtml',
      method: 'post',
      data: {
        CELLPHONE: wx.getStorageSync('CELLPHONE'),
        STATUS: 1,
        pageNow: that.data.pageNow+=1,
        pageSize: that.data.pageSize,
      },
      success: (res) => {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.hideLoading()
        // console.log(res)
        var data = JSON.parse(res.data.data);
        if (res.data.data == null) {
          wx.showToast({
            title: '我是有底线的',
            icon: "none"
          })
        } else {
          console.log(data)
          var arr = []
          var title = ''
          var start = ''
          data.map(v => {
            // var create = v.UPDATE_DATE.substring(0, 7)
            // console.log(create)
            if (v.IS_RECHARGE == 1) {
              title = '储值会员充值'
            } else if (v.IS_RECHARGE == 3) {
              title = 'plus会员充值'
            }
            if (v.ORDER_STATUS == 4) {
              start = '支付成功'
            } else if (v.ORDER_STATUS == 8 || v.ORDER_STATUS == 6) {
              start = '未支付'
            }
            arr.push({
              title: title,
              start: start,
              TOTAL: v.TOTAL,
              UPDATE_DATE: v.UPDATE_DATE
            })
            // if (that.data.index == 1) {
            //   if (create == that.data.date) {
            //     arr.push({
            //       title: title,
            //       start: start,
            //       TOTAL: v.TOTAL,
            //       UPDATE_DATE: v.UPDATE_DATE
            //     })
            //     that.setData({
            //       cook: true
            //     })
            //   } else if (arr.length == 0) {
            //     that.setData({
            //       cook: false
            //     })
            //   }
            // } else if (that.data.index == 0) {
            //   // console.log(that.data.date)
            //   var ndate = that.data.date.substring(that.data.date.length - 1) - 1
            //   var b = this.data.date.substring(0, this.data.date.length - 1)
            //   // console.log(ndate, b)
            //   if (create == (b + ndate)) {
            //     arr.push({
            //       title: title,
            //       start: start,
            //       TOTAL: v.TOTAL,
            //       UPDATE_DATE: v.UPDATE_DATE
            //     })
            //     that.setData({
            //       cook: true
            //     })
            //   } else if (arr.length == 0) {
            //     that.setData({
            //       cook: false
            //     })
            //   }
            // }
          })
          that.setData({
            listarr: [...that.data.listarr, ...arr],
          })
        }
      },
      complete:()=>{
        wx.hideLoading()
      },
      dataType: "json"
    })
  },
})
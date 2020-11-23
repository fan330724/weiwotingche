// pages/bill/bill.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    arr:[],
    pageIndex:1,
    pageSize: 10,
    hasMoreData: true,
    tab:1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var FLOW_STATUS, TOTAL, CREATE_DATE;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.getStorage({
      key: 'CELLPHONE',
      success: function (res) {
      wx.request({
          url: app.data.url+'/api/order/wflow.shtml',
          data: {
            CELLPHONE: res.data+'',
            pageSize: that.data.pageSize,
            pageIndex: that.data.pageIndex,
          },
          method: 'POST',
          success: function (res) {
            wx.hideLoading()
            var arr = JSON.parse(res.data.data);
            console.log(arr)
            var contentlistTem = that.data.arr
            if(arr.length != 0){
              if (that.data.pageIndex == 1){
                for (var i = 0; i < arr.length; i++) {
                  for (var j = 0; j < 6; j++) {
                  }
                }
                that.setData({
                  arr: contentlistTem.concat(arr),
                })
              }
              if (arr.length < that.data.pageSize){
                that.setData({
                  hasMoreData: false
                })
              }else{
                that.setData({
                  arr: contentlistTem.concat(arr),
                  hasMoreData: true,
                  pageIndex: that.data.pageIndex + 1
                })
              }
            }else{
              wx.showToast({
                title: '无更多内容',
              })
            }
          },
          fail: function (position) {
            console.log('错误')
          },
          complete: function (position) {
            // complete
          },
          dataType: "json"
        })
      }
    })    
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (res) {
     console.log('下拉触底事件'+res)
     if (this.data.hasMoreData) {
       this.onLoad('加载更多数据')
     } else {
       wx.showToast({
         title: '没有更多数据',
       })
     }
  },
  //  tab 切换
  change:function(e){
    let val = e.currentTarget.dataset.id
    this.setData({
      tab:val
    })
  }

})
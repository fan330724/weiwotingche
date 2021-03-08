//引状态包
const packs = require('../../../../utils/pack.js')
import http from '../../../../request/http.js'
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myjourney: 0,
    arr: [],
    pageNow: 0,
    pageSize: 7,
    Njourney: [],
    hasMoreData: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    var that = this
    var TOTAL, PAY_TYPE_NAME, PARKNAME, CREATE_DATE;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.getStorage({
      key: "CELLPHONE",
      success: function (res) {
        http.findOrderHis({
          CELLPHONE: res.data + '',
          IS_RECHARGE: 0,
          pageNow: 0,
          pageSize: 10,
        }).then(position => {
          if (position.data.data === null) {
            wx.showToast({
              title: '暂无订单',
            })
            return
          }
          var arr = JSON.parse(position.data.data.datas);
          console.log(arr)
          var contentlistTem = that.data.arr
          for (let i = 0; i < arr.length; i++) {
            arr[i].ORDER_STATUS = packs.packs(arr[i].ORDER_STATUS)
            arr[i].CREATE_DATE = packs.splices(arr[i].CREATE_DATE)
          }
          that.is_N(arr)
          //修改状态
          if (arr.length != 0) {
            if (that.data.pageNow == 0) {
              that.setData({
                arr: contentlistTem.concat(arr),
                hasMoreData: true,
              })
            } else {
              that.setData({
                arr: contentlistTem.concat(arr),
                hasMoreData: true,
                pageNow: that.data.pageNow + 1
              })
            }
          } else {
            wx.showToast({
              title: '无更多内容',
            })
          }
        })
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
  //  */
  onPullDownRefresh: function () {
    this.setData({
      Njourney: [],
      arr: [],
      pageNow: 0,
      pageSize: 20,
      hasMoreData: false,
    })
    wx.showNavigationBarLoading();
    this.onShow() //重新加载 
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function() {
  //   if (this.data.hasMoreData) {
  //     this.onShow()
  //   }
  // },
  // 传递详细信息 
  nextshow: function (e) {
    var data = JSON.stringify(e.currentTarget.dataset.data)
    if (e.currentTarget.dataset.data.ORDER_STATUS == '3') {
      wx.navigateTo({
        url: '../../../../page/common/pages/show/show?data=1'
      })
    } else {
      return;
    }
  },
  onHide: function () {
    this.setData({
      pageNow: 0,
      arr: []
    })
  },
  // 判断是否存在未支付订单
  is_N: function (list) {
    if (this.data.Njourney.length != 0) {
      return;
    }
    let noList = list.filter((val) => {
      return val.ORDER_STATUS != '已完成'
    })
    console.log(noList)
    if (noList.length != 0) {
      noList[0].CREATE_DATE = packs.splices(noList[0].CREATE_DATE)
      this.setData({
        Njourney: noList
      })
    }

  },
  //获取大数据的订单
  getMoreList() {
    let that = this
    let List = this.data.arr;
    if (!this.data.hasMoreData) {
      return;
    }
    http.findOrderHis({
      CELLPHONE: wx.getStorageSync('CELLPHONE'),
      pageNow: that.data.pageNow + 1,
      pageSize: that.data.pageSize,
    }).then(res => {
      wx.hideLoading()
      if (res.data.data == null) {
        wx.showToast({
          title: '没有更多订单',
          icon: 'success'
        })
        that.setData({
          hasMoreData: false
        })
        return;
      }
      let More = JSON.parse(res.data.data.datas)
      More.map((ele) => {
        ele.ORDER_STATUS = packs.packs(ele.ORDER_STATUS)
        ele.CREATE_DATE = packs.splices(ele.CREATE_DATE)
        List.push(ele)
      })
      that.setData({
        arr: List,
        pageNow: that.data.pageNow + 1
      })
    })
  }
})
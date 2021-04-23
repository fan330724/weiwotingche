// pages/oldlist/oldlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [],
    noPrice: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    let list = JSON.parse(options.data)
    console.log(list)
    if (list.every((ele) => {
        return ele.PRICE == "0.0"
      })) {
      console.log('春风得意马蹄疾，一日看尽长安花')
      _this.setData({
        noPrice: true
      })
      wx.showToast({
        title: '未有需要开票的订单',
        icon: 'none'
      })
    } else {
      console.log('走马看花')
      _this.setData({
        arr: list
      })
    }



  },
  nextshow: function (e) {
    if (e.currentTarget.dataset.url != undefined) {
      wx.navigateTo({
        url: '../pdf/pdf?url=' + e.currentTarget.dataset.url,
      })
    } else {
      let price = e.currentTarget.dataset.data
      let id = e.currentTarget.dataset.id
      let park_id = e.currentTarget.dataset.parkid
      console.log(park_id)
      wx.navigateTo({
        url: '../openfq/openfq?price=' + price + '&id=' + id + '&park_id=' + park_id,
      })
    }
  }
})
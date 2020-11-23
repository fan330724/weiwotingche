// pages/coupon/coupon.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0, //顶部切换下标
    show: true, //显示有没有优惠卷
    list: "", //返回的数据列表
    pageNow: 1, //请求的参数页
    pageSize: 10, //请求的参数条
  },
  //顶部切换
  tab(e) {
    var {
      id
    } = e.currentTarget.dataset
    console.log(id)
    this.setData({
      active: id,
      show: true,
      pageNow: 1,
    })
    this.getcoupon()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  getcoupon() {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if(that.data.pageNow > 1){
      that.setData({
        pageNow: 1
      })
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
    wx.request({
      url: app.data.url + 'api/cardCase/mycards.shtml',
      method: 'post',
      data: {
        CELLPHONE: wx.getStorageSync('CELLPHONE'),
        pageNow: that.data.pageNow,
        pageSize: that.data.pageSize,
        status: that.data.active
      },
      success: (res) => {
        wx.hideLoading()
        console.log(res)
        var data = res.data.data
        console.log(data)
        if (data.length == 0) {
          that.setData({
            show: true,
            list: ''
          })
        } else {
          var arr = []
          data.filter((v) => {
            // console.log(v)
            var startDate = v.CREATE_DATE.substring(0, 10)
            var endDate = v.END_TIME.substring(0, 10)
            var text = ''
            if (v.CARD_TYPE == 'GAS-S') {
              text = "加油"
            } else if (v.CARD_TYPE == 'PARKWW' || v.CARD_TYPE == 'PARK-TLW' || v.CARD_TYPE == 'PARK-TCL') {
              text = "停车"
            } else if (v.CARD_TYPE == 'WASH-CXJ') {
              text = "洗车"
            }
            arr.push({
              startDate,
              endDate,
              CARD_TYPE: v.CARD_TYPE,
              CARD_NAME: v.CARD_NAME,
              INTRODUCTION: v.INTRODUCTION,
              ID: v.ID,
              text
            })
          })
          that.setData({
            show: false,
            list: arr,
            pageNow: 1
          })
        }
      }
    })
  },
  //点击立即使用
  touse(e) {
    console.log(e)
    var item = JSON.stringify(e.currentTarget.dataset.item)
    var text = e.currentTarget.dataset.item.text
    console.log(text)
    if (text == '加油') {
      wx.navigateToMiniProgram({
        appId: 'wxd12b115cbc2dae11',
        path: '/pages/index/main?path=%2Fapp-vue%2Fapp%2Findex.html%23%2Fcoupon_list2',
        success(res) {
          // 打开成功
          console.log('打开成功')
        }
      })
    }else{
      wx.navigateTo({
        url: `../use/use?item=${item}`,
      })
    }

    // wx.showModal({
    //   title:"是否跳转山西加油",
    //   content:"点击确认跳转山西加油小程序，点击取消跳转",
    //   success:(res)=> {
    //     if(res.cancel){
    //       wx.navigateTo({
    //         url: `../use/use?item=${item}`,
    //       })
    //     }else if(res.confirm){
    //     }
    //   }
    // })

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
    this.getcoupon()
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
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.data.url + 'api/cardCase/mycards.shtml',
      method: 'post',
      data: {
        CELLPHONE: wx.getStorageSync('CELLPHONE'),
        pageNow: that.data.pageNow+=1,
        pageSize: that.data.pageSize,
        status: that.data.active
      },
      success: (res) => {
        wx.hideLoading()
        console.log(res)
        var data = res.data.data
        console.log(data)
        if (data.length == 0) {
          wx.showToast({
            title: '我是有底线的',
            icon: "none",
          })
        } else {
          var arr = []
          data.filter((v) => {
            // console.log(v)
            var startDate = v.CREATE_DATE.substring(0, 10)
            var endDate = v.END_TIME.substring(0, 10)
            var text = ''
            if (v.CARD_TYPE == 'GAS-S') {
              text = "加油"
            } else if (v.CARD_TYPE == 'PARKWW' || v.CARD_TYPE == 'PARK-TLW'|| v.CARD_TYPE == 'PARK-TCL') {
              text = "停车"
            } else if (v.CARD_TYPE == 'WASH-CXJ') {
              text = "洗车"
            }
            arr.push({
              startDate,
              endDate,
              CARD_TYPE: v.CARD_TYPE,
              CARD_NAME: v.CARD_NAME,
              INTRODUCTION: v.INTRODUCTION,
              ID: v.ID,
              text
            })
          })
          that.setData({
            list: [...that.data.list, ...arr]
          })
        }
      }
    })
  },
})
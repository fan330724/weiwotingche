// pages/discount/discount.js
const qqmap = require('../../utils/qqmap.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectShow: false, //是否显示下拉
    title: "", //标题,
    cityname: "", //当前定位城市
    pageSize: 100,
    pageNow: 1,
    LAT: "",
    LON: "",
    list: "", //返回数据
    PARKCO: '',
    rank: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var {
      title
    } = options
    this.setData({
      title
    })
    wx.setNavigationBarTitle({
      title
    })
    this.getlocation()
    this.requestVip()
    setTimeout(() => {
      this.getdata()
    }, 800)


    wx.getSystemInfo({
      success(res) {
        console.log(res.locationEnabled)
        if (res.locationEnabled == false) {
          wx.showModal({
            title: "请开启手机定位",
            success(res) {
              if (res.confirm) {
                wx.chooseLocation({
                  success() {
                    wx.navigateBack(-2)
                  }
                })
              } else {
                wx.navigateBack()
              }
            }
          })
        }
      }
    })
  },
  //获取地址
  getlocation() {
    var that = this
    //逆解析地址
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        //地址逆解析获取cityname
        qqmap.nimap(res.latitude, res.longitude, function (res) {
          // console.log(res)
          var {
            city,
            province,
            district
          } = res.result.address_component
          var {
            lat,
            lng
          } = res.result.location
          that.setData({
            cityname: [province, city, district],
            LAT: lat,
            LON: lng
          })
        })
      }
    })
  },
  //request请求
  request(url) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.data.url + url,
      method: 'post',
      data: {
        CELLPHONE: wx.getStorageSync('CELLPHONE'),
        pageSize: this.data.pageSize,
        pageNow: this.data.pageNow,
        LAT: this.data.LAT,
        LON: this.data.LON
      },
      success: (res) => {
        console.log(res)
        var list = res.data.data
        console.log(list)
        this.setData({
          list
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.hideLoading()
      }
    })
  },
  //获取数据
  getdata() {
    if (this.data.title == '洗车列表') {
      this.request('api/biz/carWashList.shtml')
    } else if (this.data.title == '停车场') {
      this.request('/api/biz/parkList.shtml')
    }
  },
  //获取地区值
  getchange(e) {
    this.setData({
      selectShow: !this.data.selectShow
    })
    console.log(e.detail.value)
    var value = e.detail.value.toString()
    console.log(value)
    qqmap.dimap(value, (res) => {
      var data = res.result.location
      console.log(data)
      this.setData({
        LAT: data.lat,
        LON: data.lng
      })
      this.getdata()
    })
  },
  toanimation() {
    this.setData({
      selectShow: !this.data.selectShow
    })
  },
  todetails(e) {
    console.log(e)
    var {
      id,
      title,
      getlist
    } = e.detail
    if (title == '停车场' && this.data.rank == 1 && this.data.PARKCO == 1) {
      console.log(111)
      wx.navigateTo({
        url: `../discount-detail/discount-detail?id=${id}&title=${title}&getlist=${getlist}`,
      })
    } else if (title == '洗车门店') {
      wx.navigateTo({
        url: `../discount-detail/discount-detail?id=${id}&title=${title}&getlist=${getlist}`,
      })
    } else if (this.data.rank != 1) {
      wx.showToast({
        title: '您不是PLUS会员',
        icon: "none"
      })
    } else if (this.data.PARKCO != 1) {
      wx.showToast({
        title: '您本周已购买',
        icon: "none"
      })
    }
  },
  // //获取vip
  requestVip() {
    wx.request({
      url: app.data.url + '/api/member/memberInfo.shtml',
      method: 'post',
      data: {
        CELLPHONE: wx.getStorageSync('CELLPHONE')
      },
      success: (res) => {
        console.log(res)
        var rank = res.data.data.data.VIP_RANK
        var PARKCO = res.data.data.data.PARKCO
        this.setData({
          rank,
          PARKCO
        })
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
    wx.showNavigationBarLoading();
    // 1 重置数组
    this.setData({
      list: []
    })
    // 2 重置页码
    this.data.pageNow = 1;
    // 3 发送请求
    this.getdata()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   wx.showLoading({
  //     title: '努力加载中',
  //   })
  //   if (this.data.title == '洗车列表') {
  //     this.requestmore('api/biz/carWashList.shtml')
  //   } else if (this.data.title == '停车场') {
  //     this.requestmore('/api/biz/parkList.shtml')
  //   }
  // },
  // requestmore(url) {
  //   wx.request({
  //     url: app.data.url + url,
  //     method: 'post',
  //     data: {
  //       CELLPHONE: wx.getStorageSync('CELLPHONE'),
  //       pageSize: this.data.pageSize,
  //       pageNow: this.data.pageNow++,
  //       LAT: this.data.LAT,
  //       LON: this.data.LON
  //     },
  //     success: (res) => {
  //       console.log(res)
  //       var list = res.data.data
  //       console.log(list)
  //       this.setData({
  //         list: [...this.data.list, ...list]
  //       })
  //       wx.hideNavigationBarLoading() //完成停止加载
  //       wx.stopPullDownRefresh() //停止下拉刷新
  //       wx.hideLoading()
  //     }
  //   })
  // }
})
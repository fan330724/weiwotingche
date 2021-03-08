// pages/discount-detail/discount-detail.js
import request from '../../../../request/home/discount-detail.js'
import http from '../../../../request/http.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [{
      url: 'http://124.70.23.12:8084/gameIcon/image/timg.png'
    }, ],
    currentSwiper: 0, //轮播图索引
    title: "", //标题
    tabTitle: "", //tabbar 标题
    tabindex: 0, //tabbar切换索引
    swiperHeight: "", //swiper的高度
    id: "", //传过来的参数
    list: "", //请求回来的数据
    getlist: "", //传过来的数据
    checked: false, //判断使用不使用五折
    num: 0, //总价
    rank: 0, //会员
    HALF_PRICE: "",
    SG_ID: "",
    IS_SVIP_PRICE: ""
  },
  listArr: [],
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    });
  },
  tochecked() {
    this.setData({
      checked: !this.data.checked
    })
    this.data.list.findIndex((v, i) => {
      // console.log(v)
      if (v.checked) {
        this.ischecked(v.BASE_PRICE, v.VIP_PRICE)
      } else if (v.wchecked) {
        this.ischecked(v.BASE_PRICE, v.DISCOUNT)
      }
    })
  },
  /** 
   * 点击tab切换 
   */
  toggle(e) {
    // console.log(e.currentTarget.dataset.index);
    var {
      index
    } = e.currentTarget.dataset
    if (index == 2 && this.data.title == '停车场') {
      this.setData({
        tabindex: 1
      })
    } else {
      this.setData({
        tabindex: index
      })
    }
    this.swiperHeight()
  },
  //滑动tab切换
  bindChange: function (e) {
    var that = this;
    that.setData({
      tabindex: e.detail.current
    });
    that.swiperHeight()
  },
  //拨打电话
  makephone() {
    if (this.data.getlist.PHONE == "") {
      wx.showToast({
        title: '抱歉！没有电话号码',
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: this.data.getlist.PHONE,
      })
    }
  },
  // 点击导航
  dh(e) {
    // 百度地图转腾讯地图
    var X_PI = 3.14159265358979324 * 3000.0 / 180.0
    var x = this.data.getlist.LON - 0.0065
    var y = this.data.getlist.LAT - 0.006
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
      name: this.data.getlist.BIZ_NAME,
      address: this.data.getlist.ADDRESS
    })
  },
  //动态高度
  swiperHeight() {
    switch (this.data.title) {
      case '洗车门店':
        switch (this.data.tabindex) {
          case 0:
            let height0 = 0
            this.get_wxml(".conten,.con", (res) => {
              // console.log(res)
              for (var i in res[0]) {
                // console.log(res[0][i])
                height0 += res[0][i].height
              }
              this.setData({
                swiperHeight: height0 + 40
              })
            });
            break;
          case 1:
            break;
          case 2:
            let height = 0
            this.get_wxml(".notice", (res) => {
              // console.log(res)
              for (var i in res[0]) {
                // console.log(res[0][i])
                height += res[0][i].height
              }
              this.setData({
                swiperHeight: height
              })
            });
            break;
        }
        break;
      case '停车场':
        switch (this.data.tabindex) {
          case 0:
            let height0 = 0
            this.get_wxml(".conten,.con", (res) => {
              // console.log(res)
              for (var i in res[0]) {
                // console.log(res[0][i])
                height0 += res[0][i].height
              }
              this.setData({
                swiperHeight: height0 + 40
              })
            });
            break;
          case 1:
            let height = 0
            this.get_wxml(".notice", (res) => {
              // console.log(res)
              for (var i in res[0]) {
                // console.log(res[0][i])
                height += res[0][i].height
              }
              this.setData({
                swiperHeight: height
              })
            });
            break;
        }
        break;
    }
  },
  //判断是不是会员
  isvip(e) {
    var {
      id
    } = e.currentTarget.dataset
    // console.log(id)
    this.setData({
      SG_ID: id
    })
    if (this.data.rank == 1) {
      // console.log(this.data.list)
      this.data.list.findIndex((v, i) => {
        if (v.ID == id) {
          this.listArr[i].checked = true
          this.listArr[i].wchecked = false
          this.setData({
            list: this.listArr,
            num: v.VIP_PRICE,
          })
          // if(this.data.checked){
          //   this.setData({
          //     num:this.listArr[i].BASE_PRICE/2
          //   })
          // }
          this.ischecked(this.listArr[i].BASE_PRICE, v.VIP_PRICE)
        } else {
          this.listArr[i].checked = false
          this.listArr[i].wchecked = false
          this.setData({
            list: this.listArr,
          })
        }
      })
    } else {
      this.data.list.findIndex((v, i) => {
        this.listArr[i].checked = false
        this.listArr[i].wchecked = false
        this.setData({
          list: this.listArr,
        })
      })
      wx.showToast({
        title: 'plus会员专属',
        icon: "none"
      })
    }

  },
  isweiwo(e) {
    var {
      id
    } = e.currentTarget.dataset
    console.log(id)
    this.setData({
      SG_ID: id
    })
    this.listArr.findIndex((v, i) => {
      if (v.ID == id) {
        this.listArr[i].wchecked = true
        this.listArr[i].checked = false
        this.setData({
          list: this.listArr,
          num: v.DISCOUNT,
        })

        // if(this.data.checked){
        //   this.setData({
        //     num:this.listArr[i].BASE_PRICE/2
        //   })
        // }
        this.ischecked(this.listArr[i].BASE_PRICE, v.DISCOUNT)
      } else {
        this.listArr[i].wchecked = false
        this.listArr[i].checked = false
        this.setData({
          list: this.listArr,
        })
      }
    })
  },
  //判断选中五折洗车
  ischecked(ovalue, nvalue) {
    if (this.data.checked) {
      this.setData({
        num: ovalue / 2
      })
    } else {
      this.setData({
        num: nvalue
      })
    }
  },
  // 调起充值接口
  wxpay: function (res) {
    let _this = this
    if (_this.data.num == 0) {
      wx.showToast({
        title: '请选择',
        icon: 'none'
      })
      return
    }
    if (_this.data.checked) {
      _this.setData({
        IS_SVIP_PRICE: 1
      })
    } else {
      _this.setData({
        IS_SVIP_PRICE: 0
      })
    }
    var cellphone = wx.getStorageSync('CELLPHONE')
    request.sg({
      CELLPHONE: cellphone,
      PAY_TYPE: 'wxxpay',
      TOTAL: _this.data.num,
      SG_ID: _this.data.SG_ID,
      IS_SVIP_PRICE: _this.data.IS_SVIP_PRICE,
      openid: wx.getStorageSync('openid')
    }).then(res1 => {
      wx.requestPayment({
        timeStamp: res1.data.data.timeStamp,
        nonceStr: res1.data.data.nonceStr,
        package: res1.data.data.package,
        signType: res1.data.data.signType,
        paySign: res1.data.data.paySign,
        success: function (res2) {
          console.log(res2)
          wx.navigateTo({
            url: '../../../common/pages/results/results?cook=0',
          })
        },
        fail: function (res2) {
          console.log(res2)
          wx.navigateTo({
            url: '../../../common/pages/result/result?fail=1',
          })
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var {
      title,
      id,
      getlist
    } = options
    this.setData({
      title,
      id,
      getlist: JSON.parse(getlist)
    })
    wx.setNavigationBarTitle({
      title
    })
    switch (title) {
      case '洗车门店':
        this.setData({
          tabTitle: '洗车价格'
        })
        break;
      case '停车场':
        this.setData({
          tabTitle: '停车券价格'
        })
        break;
    }
    this.request(this.data.id)
    this.requestVip()
    setTimeout(() => {
      this.swiperHeight()
    }, 800)
  },
  //动态获取元素的高度
  get_wxml(className, callback) {
    wx.createSelectorQuery().selectAll(className).boundingClientRect().exec(callback)
  },
  //获取详情数据
  request(id) {
    request.sgList({
      BIZ_ID: id
    }).then(res => {
      this.setData({
        HALF_PRICE: res.data.data.HALF_PRICE
      })
      var {
        list
      } = res.data.data
      if (res.statusCode == 200) {
        list.filter((v) => {
          this.listArr.push({
            SG_NAME: v.SG_NAME,
            VIP_PRICE: v.VIP_PRICE,
            DISCOUNT: v.DISCOUNT,
            BASE_PRICE: v.BASE_PRICE,
            ID: v.ID,
            INTRODUCTION: v.INTRODUCTION,
            EXTEND_DATA: v.EXTEND_DATA,
            BIZ_NAME: v.BIZ_NAME,
            checked: false,
            wchecked: false
          })
        })
        this.setData({
          list: this.listArr
        })
      } else {
        wx.showToast({
          title: '加载失败，请重新加载',
        })
      }
    })
  },
  //获取vip
  requestVip() {
    http.memberInfo({
      CELLPHONE: wx.getStorageSync('CELLPHONE')
    }).then(res => {
      var rank = res.data.data.data.VIP_RANK
      var PARKCO = res.data.data.data.PARKCO
      this.setData({
        rank,
        PARKCO
      })
    })
  },
})
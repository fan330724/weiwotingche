// pages/home/home.js
const qqmap = require('../../../utils/qqmap.js');
import phone from '../../../utils/phone.js'
import request from '../../../request/http.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //城市名
    cityname: '',
    //车牌数据
    arr: [],
    state: "车辆未进场",
    showModal: true, //活动弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  //获取订单信息
  getorder() {
    var that = this
    wx.getStorage({
      key: 'CELLPHONE',
      success: function (e) {
        request.vehicleState({
          CELLPHONE: e.data,
          pageNow: 0,
          pageSize: 1,
          IS_RECHARGE: 0
        }).then((res) => {
          if (res.data.data == null) {
            return
          }
          var arr = JSON.parse(res.data.data);
          console.log(arr);
          console.log(that.data.arr);
          if (that.data.arr) {
            for (var i = 0; i < that.data.arr.data.length; i++) {
              if (that.data.arr.data[i].NUMBER == arr[0].PLATE_NUMBER) {
                that.setData({
                  current: i
                })
                switch (arr[0].ORDER_STATUS) {
                  case 2:
                    that.setData({
                      state: "车辆已进场"
                    });
                    break;
                  case 3:
                    that.setData({
                      state: "车辆代缴费"
                    });
                    break;
                  case 4:
                    that.setData({
                      state: "车辆未入场"
                    });
                    break;
                }
              }
            }
          }

        })
      },
    });
  },
  toshow() {
    wx.navigateTo({
      url: '../../common/pages/show/show?data=1'
    })
  },
  //获取车辆信息
  getChe() {
    var that = this
    wx.getStorage({
      key: 'CELLPHONE',
      success: function (e) {
        request.memberPlateNumber({
          CELLPHONE: e.data
        }).then((res) => {
          console.log(res);
          var arrs = res.data.data;
          that.setData({
            arr: arrs
          })
        }).catch((err) => {
          console.log(err)
        })
      },
    });
  },
  //获取解析地址
  getLocation() {
    let that = this;
    qqmap.getUserLocation(function (res) {
      let latitude = res.latitude
      let longitude = res.longitude
      qqmap.nimap(latitude, longitude, function (res) {
        that.setData({
          cityname: res.result.address_component.city
        })
      })
    })
  },
  //跳转搜索页面
  search() {
    wx.navigateTo({
      url: `../../common/pages/search/search?city=${this.data.cityname}`,
    })

  },
  //跳转大于鲸选小程序
  tomall() {
    wx.navigateToMiniProgram({
      appId: 'wx40ebc5e4a22c2170',
      path: 'pages/index/index?d=106607',
      extraData: {
        d: 106607,
      },
      success(res) {
        // 打开成功
        console.log('打开成功')
      }
    })
  },
  //跳转停靠位置
  toposition() {
    wx.navigateTo({
      url: '../../home/pages/position/position',
    })
  },
  //跳转滴滴
  todidi() {
    wx.navigateTo({
      url: '../../didi/dididetail/dididetail',
    })
  },
  //关闭弹出框
  hideMask() {
    this.setData({
      showModal: false
    })
  },
  //存在未支付订单
  showModal() {
    wx.showModal({
      content: '存在未支付订单，请结算后使用',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../../common/pages/show/show?data=1'
          })
        }
      }
    });
  },
  //添加车辆
  redirect: function (res) {
    wx.navigateTo({
      url: '../../common/pages/license/license',
    })
  },
  //会员中心
  member() {
    wx.navigateTo({
      url: '../../common/pages/member/member',
    })
  },
  //优惠停车  优惠洗车
  todiscount(e) {
    var {
      title
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../../home/pages/discount/discount?title=${title}`,
    })

  },
  // 功能未开放
  weikaifang: function () {
    wx.showToast({
      title: '功能暂未开放',
      mask: true,
      duration: 1000,
      icon: 'loading'
    })
  },
  // 消息中心
  toxiaoxi() {
    wx.navigateTo({
      url: '../../common/pages/xiaoxizhongxin/xiaoxizhongxin',
    })
  },
  //跳转开通会员
  tomember() {
    wx.navigateTo({
      url: '../../common/pages/member/member',
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
    this.isphone()
  },
  isphone() {
    if (phone.isPhone() == 'success') {
      this.getLocation()
      this.getChe()
      this.getorder()
    } else {
      wx.reLaunch({
        url: '../../../pages/login/login',
      })
    }
  },
})
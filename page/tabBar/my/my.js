//index.js
//获取应用实例
const app = getApp()
import http from '../../../request/http.js'
Page({
  data: {
    hasUserInfo: false,
    total: 0.00, //钱包余额
    isvip: 0, //是否为储值会员
    rank: 0, //是否为plus会员
    coupon: 0, //卡卷的数量
    NICKNAME: "", //昵称
    cell: "", //手机号
    popShow: false,
  },
  //事件处理函数
  onLoad: function () {
  },
  onShow() {
    this.getwallet()
    this.getcoupon()
    this.gethui()
  },
  //获取钱包
  getwallet() {
    var that = this
    wx.getStorage({
      key: "CELLPHONE",
      success: function (res) {
        http.wallect({
          CELLPHONE: res.data + '',
        }).then(res => {
          that.setData({
            total: parseFloat(res.data.data.datas.TOTAL_FEE).toFixed(2)
          })
        })
      }
    })
  },
  //获取卡卷
  getcoupon() {
    var that = this
    wx.getStorage({
      key: "CELLPHONE",
      success: function (res) {
        http.mycards({
          CELLPHONE: res.data + '',
          pageNow: 1,
          pageSize: 1000,
          status: 0
        }).then(res => {
          var data = res.data.data
          that.setData({
            coupon: data.length
          })
        })
      }
    })
  },
  //获取是不是会员
  gethui() {
    var that = this
    http.memberInfo({
      CELLPHONE: wx.getStorageSync('CELLPHONE')
    }).then(res => {
      var isvip = res.data.data.data.IS_VIP
      var rank = res.data.data.data.VIP_RANK
      var cell = res.data.data.data.CELLPHONE
      var NICKNAME = res.data.data.data.NICKNAME
      that.setData({
        isvip,
        rank,
        cell,
        NICKNAME
      })
    })
  },
  //跳转钱包
  towallet() {
    wx.navigateTo({
      url: '../../my/pages/wallet/wallet',
    })
  },
  //跳转卡卷
  tocoupon() {
    wx.navigateTo({
      url: '../../my/pages/coupon/coupon',
    })
  },
  //跳转车辆管理
  toche() {
    wx.navigateTo({
      url: '../../my/pages/mycar/mycar',
    });
  },
  //跳转开具发票
  tofapiao() {
    wx.navigateTo({
      url: '../../my/pages/fapiao/fapiao',
    });
  },
  // 跳转我的订单
  tojourney() {
    wx.navigateTo({
      url: '../../my/pages/journey/journey',
    })
  },
  // 跳转帮助反馈
  tofankui() {
    wx.navigateTo({
      url: "../../my/pages/bangzhufankui/bangzhufankui"
    })
  },
  // 跳转设置
  toset() {
    wx.navigateTo({
      url: "../../my/pages/set/set"
    })
  },
  //跳转充值会员
  tomember() {
    wx.navigateTo({
      url: '../../common/pages/member/member',
    })
  },
  //跳转停车记录
  totingche() {
    wx.navigateTo({
      url: '../../my/pages/carrecord/carrecord',
    })
  },
  tomember() {
    wx.navigateTo({
      url: '../../common/pages/member/member',
    })
  },
  //跳转滴滴
  todidi() {
    if (this.data.rank != 1) {
      wx.showToast({
        title: '您暂未开通PLUS会员',
        icon: "none"
      })
    } else {
      wx.navigateTo({
        url: '../../didi/didilibao/index',
      })
    }
  },
})
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    total: 0.00, //钱包余额
    isvip: 0, //是否为储值会员
    rank: 0, //是否为plus会员
    coupon: 0, //卡卷的数量
    havePhone: 0,  //是否登录
    NICKNAME:"", //昵称
    cell:"", //手机号
    popShow:false,
  },
  //事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow(){
    // 判断是否登录
    let phone = wx.getStorageSync('CELLPHONE')
    if(phone){
      this.setData({
        havePhone:1
      })
      this.getwallet()
      this.getcoupon()
      this.gethui()
    }else{
      this.setData({
        havePhone:0
      })
    }
  },
  //获取个人信息
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //获取钱包
  getwallet() {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.getStorage({
      key: "CELLPHONE",
      success: function (res) {
        // console.log("data:" + res.data);
        wx.request({
          url: app.data.url + '/api/wallect/wallect.shtml',
          data: {
            CELLPHONE: res.data + '',
          },
          method: 'POST',
          success: function (position) {
            console.log(position)
            //字符串转对象
            wx.hideLoading();
            that.setData({
              total: parseFloat(position.data.data.datas.TOTAL_FEE).toFixed(2)
            })
          },
          dataType: "json"
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
        // console.log("data:" + res.data);
        wx.request({
          url: app.data.url + 'api/cardCase/mycards.shtml',
          data: {
            CELLPHONE: res.data + '',
            pageNow: 1,
            pageSize: 1000,
            status: 0
          },
          method: 'POST',
          success: function (res) {
            wx.hideLoading();
            var data = res.data.data
            console.log(data)
            that.setData({
              coupon: data.length
            })
          },
          dataType: "json"
        })
      }
    })
  },
  //获取是不是会员
  gethui() {
    var that = this
    wx.request({
      url: app.data.url + '/api/member/memberInfo.shtml',
      method: 'post',
      data: {
        CELLPHONE: wx.getStorageSync('CELLPHONE')
      },
      success: (res) => {
        console.log(res)
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
      }
    })
  },
  //跳转钱包
  towallet() {
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../wallet/wallet',
      })
    }else{
      this.setData({
        havePhone:0
      })
    } 
  },
  //跳转卡卷
  tocoupon() {
    
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../coupon/coupon',
      })
    }else{
      this.setData({
        havePhone:0
      })
    }
  },
  //跳转车辆管理
  toche() {
    
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../mycar/mycar',
      });
    }else{
      this.setData({
        havePhone:0
      })
    }
  },
  //跳转开具发票
  tofapiao() {
    
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../fapiao/fapiao',
      });
    }else{
      this.setData({
        havePhone:0
      })
    }
  },
  // 跳转我的订单
  tojourney() {
    
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../journey/journey',
      })
    }else{
      this.setData({
        havePhone:0
      })
    }
  },
  //跳转兑换中心
  toexchange(){
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../exchange/exchange',
      })
    }else{
      this.setData({
        havePhone:0
      })
    }
  },
  // 跳转帮助反馈
  tofankui() {
    wx.navigateTo({
      url: "../bangzhufankui/bangzhufankui"
    })
  },
  // 跳转设置
  toset() {
    wx.navigateTo({
      url: "../set/set"
    })
  },
  //跳转充值会员
  tomember() {
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../member/member',
      })
    }else{
      this.setData({
        havePhone:0
      })
    }
    
  },
  //跳转停车记录
  totingche() {
    
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../carrecord/carrecord',
      })
    }else{
      this.setData({
        havePhone:0
      })
    }
  },
  //跳转邀请有礼
  toinvita() {
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../sharing/huodong/huodong',
      })
    }else{
      this.setData({
        havePhone:0
      })
    }
  },
  tomember() {
   
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../member/member',
      })
    }else{
      this.setData({
        havePhone:0
      })
    }
  },
  //结束弹窗
  toshelf(){
    wx.showToast({
      title: '分享有礼，活动已下线',
      icon:'none'
    })
  },
  //跳转登录
  tologin() {
    wx.reLaunch({
      url: '../login/login',
    })
  },
  //取消登录
  clear() {
    this.setData({
      havePhone: -1
    })
  },
  //跳转滴滴
  todidi() {
    if(this.data.rank != 1){
      wx.showToast({
        title: '您暂未开通PLUS会员',
        icon:"none"
      })
    }else{
      wx.navigateTo({
        url: '../didi/didilibao/index',
      })
    }
  },
})
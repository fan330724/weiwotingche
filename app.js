//app.js

App({
  data: {
    nickName: '',
    avatarUrl: '',
    coupon: '', // 扫码领券的参数
    bcurl: 'https://bc.weiwopark.com',
    // bcurl: 'http://test.weiwopark.com:8081',    //优惠券接口 测试环境与正式环境切换
    // url: 'http://139.9.133.242:8080/',      
    // url: 'http://121.36.83.143:8080/',
    // url: 'https://test.weiwopark.com/',
    //大接口测试环境与生产环境切换
    url: 'https://park.weiwopark.com/',
    tolach: 'home', // 监测扫码入口    
    parkid: '46',
    // 弹窗控件
    showModal: true,
  },
  onLaunch: function () {
    //wx.getSetting是获取用户授权的信息的，除了应用在位置信息授权还能应用在用户信息授权等等
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }
    // 获取openid
    var openid = wx.getStorageSync('openid')
    if (openid) {
      return
    } else {
      wx.login({
        success: (res) => {
          wx.request({
            url: this.data.url + 'api/member/getOpenIdByCode.shtml',
            data: {
              CODE: res.code
            },
            method: "post",
            success: (res) => {
              console.log(res.data.data)
              wx.setStorageSync('openid', res.data.data)
            }
          })
        }
      })
    }
  },
  globalData: {
    appid: 'wxe101ca388b5572a0',
    secret: '64822f952040c5c250684482f342d6e4',
    userInfo: null,
    cellphone: 1234567888123213
  }
})
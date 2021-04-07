const QQMapWX = require('./qqmap-wx-jssdk.min.js');
const qqmapsdk = new QQMapWX({
  // 腾讯地图  个人配置的key;
  key: 'UOQBZ-IGPCV-HNGPE-U6BIS-BCY66-PKFH6'
});
module.exports = {
  //逆解析地址
  nimap: function (latitude, longitude, cb) {
    //地址逆解析获取cityname
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        return cb(res)
      },
    })
  },
  //获取关键词提示
  input: function (value, city, cb) {
    qqmapsdk.getSuggestion({
      keyword: value,
      region: city,

      success: function (res) {
        return cb(res)
      }
    })
  },
  //解析地址
  dimap(address, cb) {
    qqmapsdk.geocoder({
      address,
      success: (res) => {
        return cb(res)
      }
    })
  },

  // 判断用户是否拒绝地理位置信息授权，拒绝的话重新请求授权
  getUserLocation: function (cb) {
    let that = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'error',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.getLocation(function(res){
                        return cb(res)
                      });
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'error',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation(function(res){
            return cb(res)
          });
        } else {
          //调用wx.getLocation的API
          that.getLocation(function(res){
            return cb(res)
          });
        }
      }
    })
  },
  // 获取定位当前位置的经纬度
  getLocation: function (cb) {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        return cb(res)
      },
      fail: function (err) {
        console.log(err);
        if (err.errMsg == 'getLocation:fail auth deny') {
          return
        } else {
          //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
          wx.showModal({
            title: '',
            content: '请在系统设置中打开定位服务',
            confirmText: '确定',
            success: function (res) {
              wx.chooseLocation({
                success() {
                  wx.navigateBack()
                }
              })
            }
          })
        }
      }
    })
  },
}
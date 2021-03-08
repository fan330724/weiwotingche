// pages/home/home.js
const qqmap = require('../../../utils/qqmap.js');
import phone from '../../../utils/phone.js'
import request from '../../../request/http.js'
const regeneratorRuntime = require('../../../lib/runtime/runtime.js')
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
  onLoad: function (options) {

  },

  //获取订单信息
  getorder() {
    var that = this
    wx.getStorage({
      key: 'CELLPHONE',
      success: function (e) {
        request.findOrderHis({
          CELLPHONE: e.data,
          pageNow: 0,
          pageSize: 1,
          IS_RECHARGE: 0
        }).then((res) => {
          if (res.data.data == null) {
            return
          }
          var arr = JSON.parse(res.data.data.datas);
          for (var i = 0; i < that.data.arr.data.length; i++) {
            if (that.data.arr.data[i].NUMBER == arr[0].PLATE_NUMBER) {
              console.log(i)
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
    var that = this;
    wx.getSetting({
      success(res) {
        // scope.userLocation  == undefined代表用户未授权且第一次登陆
        console.log('检查地理位置信息是否授权', res.authSetting['scope.userLocation'])
        if (res.authSetting['scope.userLocation'] == undefined) {
          //如果用户是第一次登陆且未授权的情况，会直接弹窗请求授权   
          // 使用 getlocation 获取用户 经纬度位置
          wx.getLocation({
            type: 'gcj02', //这里我们要指定定位类型是gcj02，因为不填默认是wgs84，定位精确度会相较于gcj02有几百到一千米的偏差，如果对精确度要求较高的请务必加上type:'gcj02'
            success(res) {
              //获取用户位置成功后，将会返回 latitude, longitude 两个字段，代表用户的经纬度位置
              console.log(res)
              //地址逆解析获取cityname
              qqmap.nimap(res.latitude, res.longitude, function (res) {
                console.log(res)
                that.setData({
                  cityname: res.result.address_component.city
                })
              })
            },
            fail(err) {
              console.log(err)
              //用户已授权，但是获取地理位置失败，会弹框提示用户去系统设置中打开定位
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
          })
        }
        //小程序检测到用户不是第一次进入该页面,且未授权
        else if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
            success: function (res) {
              //如果点击取消则显示授权失败
              if (res.cancel) {
                wx.showToast({
                  title: '授权失败',
                  icon: 'success',
                  duration: 1000
                })
              }
              //如果点击确定会打开授权页请求二次授权
              else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用getLocationt的API
                      wx.getLocation({
                        type: 'gcj02',
                        success(res) {
                          //  console.log(res)
                          //地址逆解析获取cityname
                          qqmap.nimap(res.latitude, res.longitude, function (res) {
                            console.log(res)
                            that.setData({
                              cityname: res.result.address_component.city
                            })
                          })
                        },
                        fail(err) {
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
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  }
                })
              }

            }
          })
        } else if (res.authSetting['scope.userLocation'] == true) {
          //授权后默认加载，直接获取定位
          wx.getLocation({
            type: 'gcj02',
            success(res) {
              console.log(res);
              //地址逆解析获取cityname
              qqmap.nimap(res.latitude, res.longitude, function (res) {
                console.log(res)
                that.setData({
                  cityname: res.result.address_component.city
                })
              })
            },
            fail(err) {
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
          })
        }
      }
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
  //跳转大闸蟹小程序     
  tocrab() {
    wx.navigateToMiniProgram({
      appId: 'wx36fe24328e0d18b8',
      path: 'pages/index/index',
      success(res) {
        // 打开成功
        console.log('打开成功')
      }
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
  async isphone(){
    if (phone.isPhone() == 'success') {
      await this.getLocation()
      await this.getChe()
      await this.getorder()
    } else {
      wx.reLaunch({
        url: '../../../pages/login/login',
      })
    }
  },
})
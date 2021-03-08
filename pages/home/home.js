// pages/home/home.js
import phone from '../../utils/phone.js'
const qqmap = require('../../utils/qqmap.js');
import http from '../../request/http.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellphone: "",
    //城市名
    cityname: '',
    //车牌数据
    arr: [],
    state: "车辆未进场",
    flag: true,
    havePhone: -1, //登录弹窗
    showModal: true, //活动弹窗
    num:"", //抽奖次数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var cellphone = wx.getStorageSync('CELLPHONE')
    this.setData({
      cellphone,
    })
    if (cellphone == '') {
      this.setData({
        havePhone: 0
      })
    } else {
      this.setData({
        havePhone: 1
      })
    }
  },

  //获取订单信息
  getorder() {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.getStorage({
      key: 'CELLPHONE',
      success: function (e) {
        wx.request({
          url: app.data.url + 'api/order/findOrderHis.shtml',
          data: {
            CELLPHONE: e.data,
            pageNow: 0,
            pageSize: 1,
            IS_RECHARGE: 0
          },
          method: 'POST',
          success: function (res) {
            // console.log(res)
            if (res.data.data == null) {
              return
            }
            var arr = JSON.parse(res.data.data.datas);
            console.log(arr[0])
            console.log(that.data.arr.data)
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
            wx.hideLoading()
          }
        })
      },
    });
  },
  toshow() {
    wx.navigateTo({
      url: '../show/show?data=1'
    })
  },
  //获取车辆信息
  getChe() {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.getStorage({
      key: 'CELLPHONE',
      success: function (e) {
        wx.request({
          url: app.data.url + '/api/member/memberPlateNumber.shtml',
          data: {
            CELLPHONE: e.data
          },
          method: 'POST',
          success: function (res) {
            var arrs = res.data.data;
            console.log(arrs)
            that.setData({
              arr: arrs
            })
            wx.hideLoading()
          }
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
      url: `../search/search?city=${this.data.cityname}`,
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
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../position/position',
      })
    } else {
      this.setData({
        havePhone: 0
      })
    }
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
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../didi/dididetail/dididetail',
      })
    } else {
      this.setData({
        havePhone: 0
      })
    }
  },
  //跳转月卡详情
  toyueka(){
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../china/china',
      })
    } else {
      this.setData({
        havePhone: 0
      })
    }
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
            url: '../show/show?data=1'
          })
        }
      }
    });
  },
  //添加车辆
  redirect: function (res) {
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../license/license',
      })
    } else {
      this.setData({
        havePhone: 0
      })
    }
  },
  //会员中心
  member() {
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../member/member',
      })
    } else {
      this.setData({
        havePhone: 0
      })
    }
  },
  //优惠停车  优惠洗车
  todiscount(e) {
    var {
      title
    } = e.currentTarget.dataset
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: `../discount/discount?title=${title}`,
      })
    } else {
      this.setData({
        havePhone: 0
      })
    }
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
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../xiaoxizhongxin/xiaoxizhongxin',
      })
    } else {
      this.setData({
        havePhone: 0
      })
    }
  },
  // 中秋活动领取
  tochina() {
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../china/china',
      })
    } else {
      this.setData({
        havePhone: 0
      })
    }
  },
  // 活动领取
  toreceive() {
    if (this.data.havePhone == 1) {
      // wx.navigateTo({
      //   url: '../receive/receive',
      // })
      wx.navigateTo({
        url: '../china/china',
      })
    } else {
      this.setData({
        havePhone: 0
      })
    }
  },
  //跳转开通会员
  tomember() {
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../member/member',
      })
    } else {
      this.setData({
        havePhone: 0
      })
    }
  },
  //跳转抽奖活动
  toLuckydraw(){
    wx.navigateTo({
      url: '../Luckydraw/Luckydraw',
    })
  },
  //跳转活动页
  tohuodong() {
    wx.redirectTo({
      url: '../sharing/huodong/huodong',
    })
  },
  //跳转邀请有礼
  toinvita() {
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../sharing/huodong/huodong',
      })
    } else {
      this.setData({
        havePhone: 0
      })
    }
  },
  //跳转抽奖页
  toLuckydraw(){
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../Luckydraw/Luckydraw',
      })
    } else {
      this.setData({
        havePhone: 0
      })
    }
  },
  //跳转打卡页
  todaka(){
    if (this.data.havePhone == 1) {
      wx.navigateTo({
        url: '../daka/daka',
      })
    } else {
      this.setData({
        havePhone: 0
      })
    }
  },
  // 跳转浦发
  // topufa() {
  //   if (this.data.havePhone == 1) {
  //     wx.navigateTo({
  //       url: '../pufa/pufa',
  //     })
  //   } else {
  //     this.setData({
  //       havePhone: 0
  //     })
  //   }
  // },
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.havePhone == 1) {
      this.getLocation()
      this.getChe()
      this.getorder()
      this.memberInfo()
    }
  },

  //获取抽奖次数
  memberInfo() {
    http.memberInfo(wx.getStorageSync('CELLPHONE')).then((res) => {
      console.log(res.data.data.data.LUCK_FREQ)
      this.setData({
        num: res.data.data.data.LUCK_FREQ
      })
    })
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

  },
   /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function (res) {
  //   if (res.from == 'button') {
  //     let CELLPHONE = wx.getStorageSync('CELLPHONE')
  //     return {
  //       title: '过节大礼包，我只送给你！快快领取吧！',
  //       // desc: '帷幄停车',
  //       path: '/pages/openhongbao/index?cellphone=' + CELLPHONE + '&chnnel=' + wx.getStorageSync('openid') + '&type=0',
  //       imageUrl: 'http://124.70.23.12:8084/gameIcon/image/fenxiang2.png',
  //       success: () => {
  //         wx.showShareMenu({
  //           withShareTicket: true,
  //         })
  //       }
  //     }
  //   } else if (res.from == 'menu') {
  //     let CELLPHONE = wx.getStorageSync('CELLPHONE')
  //     return {
  //       title: '过节大礼包，我只送给你！快快领取吧！',
  //       // desc: '帷幄停车',
  //       path: '/pages/openhongbao/index?cellphone=' + CELLPHONE + '&chnnel=' + wx.getStorageSync('openid') + '&type=0',
  //       imageUrl: 'http://124.70.23.12:8084/gameIcon/image/fenxiang2.png',
  //       success: () => {
  //         wx.showShareMenu({
  //           withShareTicket: true,
  //         })
  //       }
  //     }
  //   }
  // },
})
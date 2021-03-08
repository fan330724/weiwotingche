// pages/index/test.js
const qqmap = require('../../../utils/qqmap.js');
var app = getApp();
import http from '../../../request/http.js'
import request from '../../../request/index/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //地图
    markers: [],
    latitude: null,
    longitude: null,
    // 加入controls点
    controls: [],
    //城市
    city: "",
    cityname: '',
    //停车场列表
    dataList: [],
    active: 1,
    //附近地图的高
    MAPH: '',
    //是否开启实时路况
    enable: false,
    //是否绑定了车牌号
    show: false,
    havePhone: 0,
    cityname: "", //当前定位城市
    animationData: "", //动画
    translate: true, // 平移
    scrollactive: false, //动态添加scroll-view的样式
    scale: 16, //地图大小
    showModal: true, //弹窗控制
    showCur: false, //悬浮窗控制
    showActive: false, //红包弹窗控制
    showOpen: 0, //控制拆红包的状态
    money: "", //红包数据
    price: "", //红包金额
  },

  //关闭弹出框
  hideMask() {
    this.setData({
      showModal: false,
      showCur: true,
    })
  },
  //悬浮窗按钮
  tohuodong() {
    this.setData({
      showCur: false,
      showModal: true,
    })
  },
  //跳转领取记录
  tomember() {
    wx.navigateTo({
      url: '../../index/pages/weiworecord/weiworecord?title=领取记录',
    })
  },
  //跳转搜索页面
  search() {
    wx.navigateTo({
      url: `../../../page/common/pages/search/search?city=${this.data.city}`,
    })
  },
  //地图方法
  //点击定位重新回到当前位置
  controltap() {
    this.mapCtx.moveToLocation()
    this.setData({
      idx: 0
    })
  },
  toanimation() {
    this.setData({
      selectShow: !this.data.selectShow
    })
  },
  //动画
  toani() {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    if (this.data.translate) {
      this.setData({
        translate: false,
        scrollactive: false
      })
      animation.height(220 + 'rpx').step()
    } else {
      this.setData({
        translate: true,
        scrollactive: true
      })
      animation.height(70 + '%').step()
    }
    this.setData({
      animationData: animation.export()
    })
  },
  //滑动地图获取最新数据
  regionchange: function (e) {
    if (!e) {
      return;
    }
    if (e.type == 'begin') {
      return
    }
    if (this.data.active == '1') {
      this.getWeiwo()
    } else if (this.data.active == '2') {
      // this.getCharge()
    } else if (this.data.active == '3') {
      this.getSinopec()
    }
  },
  // 新加点击热点图标跳转事件
  markertap: function (e) {
    console.log(e)
    let markerId = JSON.parse(e.markerId)
    if (this.data.active == 1) {
      // this.setData({
      //   showActive: true,
      //   showOpen: 0,
      // })
      if (markerId.MALLNAME) {
        // console.log('红包')
        http.mallMoney({
          CELLPHONE: wx.getStorageSync('CELLPHONE'),
          LON: this.data.longitude,
          LAT: this.data.latitude,
          ID: markerId.ID,
        }).then((res) => {
          console.log(res.data.data)
          if (res.data.data) {
            this.setData({
              showActive: true,
              showOpen: 0,
              money: {
                // MONEY: res.data.data.MONEY,
                ID: res.data.data.ID
              }
            })
          } else {
            wx.showToast({
              title: res.data.errmsg,
              icon: 'none'
            })
          }
        })
      } else {
        //这里通过页面传参给详情页ID
        wx.navigateTo({
          url: `../../index/pages/markertap/markertap?id=${e.markerId}&static=${this.data.active}`,
        })
      }
    } else if (this.data.active == 3) {
      console.log(markerId)
      this.dh(markerId)
    }
  },
  //点击拆红包
  toopen() {
    this.setData({
      showOpen: 1
    })
    http.getMallReward({
      ID: this.data.money.ID,
      // ID: "C2E04600DADF4FE49C843E2FF62F8E72",
      openid: wx.getStorageSync('openid')
    }).then((res) => {
      console.log(res)
      this.setData({
        showOpen: 2,
        price: res.data.data
      })
    })
  },

  //拆完红包点击确认
  hideMask1() {
    this.setData({
      showActive: false,
      showOpen: 0
    })
  },
  //点击导航
  dh: function (e) {
    // 百度地图转腾讯地图
    var X_PI = 3.14159265358979324 * 3000.0 / 180.0
    var x = e.LON - 0.0065
    var y = e.LAT - 0.006
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
      name: e.NAME,
      address: e.LOCATION
    })
  },
  //点击列表跳转详情
  onmarkertap(e) {
    // console.log(e)
    if (this.data.active == 1) {
      //这里通过页面传参给详情页ID
      wx.navigateTo({
        url: `../../index/pages/markertap/markertap?id=${e.detail}&static=${this.data.active}`,
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取手机配置
    this.getSystemInfo()
    // 获取手机配置结束
    //返回可以用于wx.openLocation的经纬度
    //调用逆解析地址
    this.getLocation();
    this.getChe()
    this.toani()
  },
  //获取手机配置
  getSystemInfo() {
    var that = this
    // 获取手机配置
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res)
        let mapHeight = res.windowHeight - 65 + 'px';
        that.setData({
          MAPH: mapHeight
        })
        //中心控件配置
        var hz = {
          id: 1,
          iconPath: '../../../image/home/center.png',
          clickable: false,
          position: null
        };
        that.getphone(hz, res.screenWidth / 2 - 10, res.windowHeight / 2 - 65)
      },
    })
  },
  //获取解析地址
  getLocation() {
    var that = this;
    //逆解析地址
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        // that.setData({
        //   latitude: 37.79584743923611,
        //   longitude: 112.54726128472223
        // })

        //地址逆解析获取cityname
        qqmap.nimap(that.data.latitude, that.data.longitude, function (res) {
          console.log(res)
          var {
            city,
            district,
            province
          } = res.result.address_component
          that.setData({
            city,
            cityname: [province, city, district]
          })
        })
      }
    })
  },
  //获取图标
  getphone(hz, width, height) {
    var that = this
    var controls = []
    var phone = {};
    phone.left = width;
    phone.top = height;
    phone.width = 20;
    phone.height = 35;
    hz.position = phone;
    controls.push(hz);
    that.setData({
      controls: controls
    })
  },
  //获取车辆信息
  getChe() {
    var that = this
    wx.getStorage({
      key: 'CELLPHONE',
      success: function (e) {
        http.memberPlateNumber({
          CELLPHONE: e.data
        }).then(res => {
          var arrs = res.data.data;
          // console.log(arrs)
          if (arrs.data.length == 0) {
            that.setData({
              show: true
            })
          } else {
            that.setData({
              arr: arrs,
              show: false
            })
          }
        })
      },
    });
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
  //顶部tab切换
  select: function (e) {
    this.setData({
      active: e.currentTarget.dataset.id
    })
    if (e.currentTarget.dataset.id == 1) {
      this.getWeiwo()
      this.setData({
        scale: 16
      })
    }
    // else if (e.currentTarget.dataset.id == 2) {
    //   this.getCharge()
    // } 
    else if (e.currentTarget.dataset.id == 3) {
      this.getSinopec()
      this.setData({
        scale: 14
      })
    }
    // else if (e.currentTarget.dataset.id == 4) {
    //   this.getShare()
    // }
  },
  //帷幄停车数据接口
  getWeiwo: function () {
    var that = this
    wx.showLoading({
      title: '加载地图信息',
      mask: true
    })
    this.mapCtx.getCenterLocation({
      success: function (res) {
        // 第一次进入页面获取到的定位位置为了0 ，安卓Bug
        if (res.longitude == 0) {
          res.longitude = that.data.longitude
          res.latitude = that.data.latitude
        }
        // 百度转腾讯
        var X_PI = 3.14159265358979324 * 3000.0 / 180.0
        var x1 = res.longitude + 0.0065
        var y1 = res.latitude + 0.006
        var z1 = Math.sqrt(x1 * x1 + y1 * y1) + 0.00002 * Math.sin(y1 * X_PI)
        var theta = Math.atan2(y1, x1) + 0.000003 * Math.cos(x1 * X_PI)
        var gg_lon1 = z1 * Math.cos(theta)
        var gg_lat1 = z1 * Math.sin(theta)
        request.findParkInfo({
          LON: gg_lon1 + '',
          LAN: gg_lat1 + ''
        }).then(options => {
          wx.hideLoading()
          var arr = options.data.data.datas;
          var dataMall = options.data.data.dataMall;
          that.setData({
            dataList: arr
          })

          var obj;
          var markers = [];
          //定义图片
          var icoStr0 = "http://124.70.23.12:8084/gameIcon/image/icon.png";
          var icoStr1 = "http://124.70.23.12:8084/gameIcon/image/kongxian.png";
          var icoStr2 = "http://124.70.23.12:8084/gameIcon/image/baoman.png";
          var icoStr3 = "http://124.70.23.12:8084/gameIcon/image/yongji.png";
          var icoStr4 = "http://124.70.23.12:8084/gameIcon/image/hongbao-xiao.png";
          //红包图标
          for (let j = 0; j < dataMall.length; j++) {
            obj = dataMall[j];
            // 百度地图转腾讯地图
            var x = obj.LON - 0.0065
            var y = obj.LAT - 0.006
            var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI)
            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
            var gg_lon = z * Math.cos(theta)
            var gg_lat = z * Math.sin(theta)
            var icoStr, name, callouts, widths, heights, bgcolor;
            //获取图标图片
            icoStr = icoStr4;
            widths = 35;
            heights = 40;
            callouts = {}

            //自定义数组
            var point = {
              longitude: gg_lon,
              latitude: gg_lat,
              iconPath: icoStr,
              width: widths,
              height: heights,
              callout: callouts,
              id: JSON.stringify(obj)
            }
            markers.push(point);
          }
          //停车场图标
          for (let i = 0; i < arr.length; i++) {
            // console.log(arr[i])
            obj = arr[i];
            // 百度地图转腾讯地图
            var x = obj.LON - 0.0065
            var y = obj.LAT - 0.006
            var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI)
            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
            var gg_lon = z * Math.cos(theta)
            var gg_lat = z * Math.sin(theta)
            var icoStr, name, callouts, widths, heights, bgcolor;
            //获取图标图片
            if (obj.IS_WEIWOPARK !== 0) {
              if (obj.EMPTY_SPACE < 10) {
                icoStr = icoStr2;
                bgcolor = "#00925d";
              } else if (obj.EMPTY_SPACE >= 10 && obj.EMPTY_SPACE < 20) {
                icoStr = icoStr3;
                bgcolor = "#ff0600"
              } else {
                icoStr = icoStr1;
              }
              widths = 35,
                heights = 40;
            } else {
              icoStr = icoStr0;
              widths = 35;
              heights = 40;
              callouts = {}
            }

            //自定义数组
            var point = {
              longitude: gg_lon,
              latitude: gg_lat,
              iconPath: icoStr,
              width: widths,
              height: heights,
              callout: callouts,
              id: JSON.stringify(obj)
            }
            markers.push(point);
          }
          that.setData({
            markers
          })
        })
      }
    })
  },
  //中石化数据接口
  getSinopec() {
    var that = this
    wx.showLoading({
      title: '加载地图信息',
      mask: true
    })
    this.mapCtx.getCenterLocation({
      success: function (res) {
        // 第一次进入页面获取到的定位位置为了0 ，安卓Bug
        if (res.longitude == 0) {
          res.longitude = that.data.longitude
          res.latitude = that.data.latitude
        }
        // 百度转腾讯
        var X_PI = 3.14159265358979324 * 3000.0 / 180.0
        var x1 = res.longitude + 0.0065
        var y1 = res.latitude + 0.006
        var z1 = Math.sqrt(x1 * x1 + y1 * y1) + 0.00002 * Math.sin(y1 * X_PI)
        var theta = Math.atan2(y1, x1) + 0.000003 * Math.cos(x1 * X_PI)
        var gg_lon1 = z1 * Math.cos(theta)
        var gg_lat1 = z1 * Math.sin(theta)
        request.findSinopecList({
          LON: gg_lon1 + '',
          LAN: gg_lat1 + ''
        }).then(options => {
          wx.hideLoading()
          var arr = options.data.data.datas;
          that.setData({
            dataList: arr
          })
          var obj;
          var markers = [];
          //定义图片
          var iconD = "http://124.70.23.12:8084/gameIcon/image/jiayou.png";

          for (let i = 0; i < arr.length; i++) {
            // console.log(arr[i])
            obj = arr[i];
            // 百度地图转腾讯地图
            var x = obj.LON - 0.0065
            var y = obj.LAT - 0.006
            var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI)
            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
            var gg_lon = z * Math.cos(theta)
            var gg_lat = z * Math.sin(theta)
            var icoStr, name, callouts, widths, heights, bgcolor;
            //获取图标图片
            //获取图标图片
            icoStr = iconD;
            widths = 30;
            heights = 35;

            //自定义数组
            var point = {
              longitude: gg_lon,
              latitude: gg_lat,
              iconPath: icoStr,
              width: widths,
              height: heights,
              id: JSON.stringify(obj)
            }
            markers.push(point);
          }
          that.setData({
            markers
          })
        })
      }
    })
  },
  //充电停车数据接口
  getCharge: function () {
    var timer;
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      var that = this
      console.log('触摸结束触发事件成功')
      wx.showLoading({
        title: '加载地图信息',
        mask: true
      })
      this.mapCtx.getCenterLocation({
        success: function (res) {

          // 第一次进入页面获取到的定位位置为了0 ，安卓Bug
          if (res.longitude == 0) {
            res.longitude = that.data.longitude
            res.latitude = that.data.latitude
          }
          // 百度转腾讯
          var X_PI = 3.14159265358979324 * 3000.0 / 180.0
          var x1 = res.longitude + 0.0065
          var y1 = res.latitude + 0.006
          var z1 = Math.sqrt(x1 * x1 + y1 * y1) + 0.00002 * Math.sin(y1 * X_PI)
          var theta = Math.atan2(y1, x1) + 0.000003 * Math.cos(x1 * X_PI)
          var gg_lon1 = z1 * Math.cos(theta)
          var gg_lat1 = z1 * Math.sin(theta)
          wx.request({
            url: app.data.url + '/api/charging/ChargingInfo.shtml',
            data: {
              LON: gg_lon1 + '',
              LAN: gg_lat1 + ''
            },
            method: 'POST',
            success: function (options) {
              console.log(options)
              wx.hideLoading()
              var arr = options.data.data.datas;
              if (arr.length > 10) {
                let arrS = arr.slice(0, 10)
                console.log(arrS)
                that.setData({
                  dataList: arrS
                })
              } else if (arr.length == 0) {
                return
              } else {
                that.setData({
                  dataList: arr
                })
              }

              var obj;
              var markers = [];
              //定义图片
              var iconD = "../../image/home/Dpark.png"
              for (let i = 0; i < arr.length; i++) {
                // console.log(arr[i])
                obj = arr[i];
                // 百度地图转腾讯地图
                var x = obj.LON - 0.0065
                var y = obj.LAT - 0.006
                var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI)
                var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
                var gg_lon = z * Math.cos(theta)
                var gg_lat = z * Math.sin(theta)
                var icoStr, name, callouts, widths, heights, bgcolor;
                //获取图标图片
                icoStr = iconD;
                widths = 40;
                heights = 45;
                //自定义数组
                var point = {
                  longitude: gg_lon,
                  latitude: gg_lat,
                  iconPath: icoStr,
                  width: widths,
                  height: heights,
                  callout: callouts,
                  id: JSON.stringify(obj)
                }
                markers.push(point);
              }
              that.setData({
                markers: markers
              })
            }
          })
        }
      })
    }, 200)
  },
  //夜间停车业务
  getNightpark: function () {
    // var timer;
    // if (timer) {
    //   clearTimeout(timer)
    // }
    // timer = setTimeout(() => {
    var that = this
    // console.log('触摸结束触发事件成功')
    wx.showLoading({
      title: '加载地图信息',
      mask: true
    })
    this.mapCtx.getCenterLocation({
      success: function (res) {

        // 第一次进入页面获取到的定位位置为了0 ，安卓Bug
        if (res.longitude == 0) {
          res.longitude = that.data.longitude
          res.latitude = that.data.latitude
        }
        // 百度转腾讯
        var X_PI = 3.14159265358979324 * 3000.0 / 180.0
        var x1 = res.longitude + 0.0065
        var y1 = res.latitude + 0.006
        var z1 = Math.sqrt(x1 * x1 + y1 * y1) + 0.00002 * Math.sin(y1 * X_PI)
        var theta = Math.atan2(y1, x1) + 0.000003 * Math.cos(x1 * X_PI)
        var gg_lon1 = z1 * Math.cos(theta)
        var gg_lat1 = z1 * Math.sin(theta)
        wx.request({
          url: app.data.url + '/api/park/findParkInfo.shtml',
          data: {
            LON: gg_lon1 + '',
            LAN: gg_lat1 + ''
          },
          method: 'POST',
          success: function (options) {
            wx.hideLoading()
            var arr = options.data.data.datas.filter((item) => {
              return item.IS_WEIWOPARK > 0
            });
            console.log(arr)
            if (arr.length > 10) {
              let arrS = arr.slice(0, 10)
              console.log(arrS)
              that.setData({
                dataList: arrS
              })
            } else if (arr.length == 0) {
              that.setData({
                dataList: arr
              })
            } else {
              that.setData({
                dataList: arr
              })
            }

            var obj;
            var markers = [];
            //定义图片
            var iconD = "http://124.70.23.12:8084/gameIcon/image/jiayou.png"
            for (let i = 0; i < arr.length; i++) {
              // console.log(arr[i])
              obj = arr[i];
              // 百度地图转腾讯地图
              var x = obj.LON - 0.0065
              var y = obj.LAT - 0.006
              var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI)
              var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
              var gg_lon = z * Math.cos(theta)
              var gg_lat = z * Math.sin(theta)
              var icoStr, name, callouts, widths, heights, bgcolor;
              //获取图标图片
              icoStr = iconD;
              widths = 40;
              heights = 45;
              //自定义数组
              var point = {
                longitude: gg_lon,
                latitude: gg_lat,
                iconPath: icoStr,
                width: widths,
                height: heights,
                callout: callouts,
                id: JSON.stringify(obj)
              }
              markers.push(point);
            }
            that.setData({
              markers: markers
            })
          }
        })
      }
    })
    // }, 200)
  },
  // 共享停车业务
  getShare: function () {
    var timer;
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      var that = this
      console.log('触摸结束触发事件成功')
      wx.showLoading({
        title: '加载地图信息',
        mask: true
      })
      this.mapCtx.getCenterLocation({
        success: function (res) {

          // 第一次进入页面获取到的定位位置为了0 ，安卓Bug
          if (res.longitude == 0) {
            res.longitude = that.data.longitude
            res.latitude = that.data.latitude
          }
          // 百度转腾讯
          var X_PI = 3.14159265358979324 * 3000.0 / 180.0
          var x1 = res.longitude + 0.0065
          var y1 = res.latitude + 0.006
          var z1 = Math.sqrt(x1 * x1 + y1 * y1) + 0.00002 * Math.sin(y1 * X_PI)
          var theta = Math.atan2(y1, x1) + 0.000003 * Math.cos(x1 * X_PI)
          var gg_lon1 = z1 * Math.cos(theta)
          var gg_lat1 = z1 * Math.sin(theta)
          wx.request({
            url: app.data.url + '/api/park/findParkInfo.shtml',
            data: {
              LON: gg_lon1 + '',
              LAN: gg_lat1 + ''
            },
            method: 'POST',
            success: function (options) {
              wx.hideLoading()
              var arr = options.data.data.datas;
              if (arr.length > 10) {
                let arrS = arr.slice(0, 10)
                console.log(arrS)
                that.setData({
                  dataList: arrS
                })
              } else if (arr.length == 0) {
                return
              } else {
                that.setData({
                  dataList: arr
                })
              }

              var obj;
              var markers = [];
              //定义图片
              var iconD = "../../image/home/nightPark.png"
              for (let i = 0; i < arr.length; i++) {
                // console.log(arr[i])
                obj = arr[i];
                // 百度地图转腾讯地图
                var x = obj.LON - 0.0065
                var y = obj.LAT - 0.006
                var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI)
                var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI)
                var gg_lon = z * Math.cos(theta)
                var gg_lat = z * Math.sin(theta)
                var icoStr, name, callouts, widths, heights, bgcolor;
                //获取图标图片
                icoStr = iconD;
                widths = 40;
                heights = 45;
                //自定义数组
                var point = {
                  longitude: gg_lon,
                  latitude: gg_lat,
                  iconPath: icoStr,
                  width: widths,
                  height: heights,
                  callout: callouts,
                  id: JSON.stringify(obj)
                }
                markers.push(point);
              }
              that.setData({
                markers: markers
              })
            }
          })
        }
      })
    }, 200)
  },

  //扫码
  scanCode() {
    wx.scanCode({
      success(res) {
        console.log(res)
      }
    })
  },
  //开启实时路况
  enable() {
    this.setData({
      enable: !this.data.enable
    })
  },
  toxiaoxi() {
    wx.navigateTo({
      url: '../../common/pages/xiaoxizhongxin/xiaoxizhongxin',
    })
  },
  toAddcar() {
    wx.navigateTo({
      url: '../../common/pages/license/license',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.mapCtx = wx.createMapContext('myMap')
  },
})
// pages/wechatactivities/welfare/welfare.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxcell: "",
    cell: "",
    chnnel: "",
    show: false,
    windowW: "", //动态宽
    windowH: "", //动态高度
    bgpic: "http://124.70.23.12:8084/gameIcon/image/wxcode1.png", //背景图
    qCord: "", //二维码
    qCordW: "", //二维码宽
    qCordH: "", //二维码高
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var {
      cell,
      chnnel
    } = options
    var wxcell = wx.getStorageSync('CELLPHONE')
    that.setData({
      wxcell,
      cell,
      chnnel
    })
    // 获取设备宽高，以备海报全屏显示
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowW: res.windowWidth,
          windowH: res.windowHeight
        })
      },
    })
    that.getBG(that.data.bgpic).then(function (locationData) {
      that.setData({
        bgpic: locationData
      })
    })
  },
  //生成二维码
  tocord() {
    var that = this
    wx.showLoading({
      title: '制作中',
      mask: true
    })
    if (that.data.wxcell) {
      wx.request({
        url: app.data.url + '/api/channel/boundPersonMsg.shtml',
        data: {
          cellPhone: that.data.wxcell,
          chnnel: 'WeChatAccount'
        },
        success: (res) => {
          wx.hideLoading()
          var data = res.data
          var imgUrl = wx.arrayBufferToBase64(data)
          //声明文件系统
          const fs = wx.getFileSystemManager();
          //随机定义路径名称
          var times = new Date().getTime();
          var codeimg = wx.env.USER_DATA_PATH + '/' + times + '.png';
          //将base64图片写入
          fs.writeFile({
            filePath: codeimg,
            data: imgUrl,
            encoding: 'base64',
            success: (res) => {
              //写入成功了的话，新的图片路径就能用了
              that.setData({
                qCord: codeimg,
                show: true
              })
              that.drawCanvas()
            }
          });
        },
        responseType: "arraybuffer"
      })
    } else {
      wx.reLaunch({
        url: `../wxlogin/wxlogin`,
      })
    }
  },
  //接受邀请
  tosucc() {
    var {
      cell,
      chnnel
    } = this.data
    if (this.data.wxcell) {
      wx.reLaunch({
        url: `../../home/home?cell=${cell}&chnnel=${chnnel}`,
      })
    } else {
      wx.reLaunch({
        url: `../../login/login?cell=${cell}&chnnel=${chnnel}`,
        // url: `../../login/login?cell=18735751439&chnnel=wxx`,
      })
    }
  },
  //立即领取
  todetail() {
    if (this.data.wxcell) {
      wx.navigateTo({
        url: '../wxdetails/wxdetails?cell=' + this.data.wxcell,
      })
    } else {
      wx.showModal({
        title: "你还没有登录，是否跳转登录页面",
        success: (res) => {
          if (res.cancel) {
            return
          } else if (res.confirm) {
            wx.reLaunch({
              url: `../wxlogin/wxlogin`,
            })
          }
        }
      })
    }
  },
  //点击关闭
  toclose() {
    this.setData({
      show: false
    })
  },
  // 绘制canvas
  drawCanvas() {
    var that = this
    //创建节点选择器
    var query = wx.createSelectorQuery();
    var windowW = that.data.windowW //获取到的屏幕宽
    var windowH = that.data.windowH //获取到的屏幕高
    //选择id
    query.select('.l11').boundingClientRect()
    query.exec(function (res) {
      console.log(res)
      that.setData({
        qCordW: res[0].width,
        qCordH: res[0].height,
        qCordL: res[0].left,
        qCordT: res[0].top
      })
      // 使用 wx.createContext 获取绘图上下文 ctx
      var context = wx.createCanvasContext('firstCanvas')
      // 海报背景图
      context.drawImage(that.data.bgpic, 0, 0, windowW, windowH)
      // 识别小程序二维码
      // context.drawImage(that.data.qCord, (windowW-that.data.qCordW) / 2, (windowH-(that.data.qCordH+50)) / 2, that.data.qCordW, that.data.qCordH)
      context.drawImage(that.data.qCord, that.data.qCordL, that.data.qCordT, that.data.qCordW, that.data.qCordH)
      context.draw()
    })
  },
  // 点击保存按钮，同时将画布转化为图片
  daochu: function () {
    var that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      canvasId: 'firstCanvas',
      fileType: 'jpg',
      quality: 1,
      success: function (res) {
        console.log(res)
        var shareImage = res.tempFilePath
        if (shareImage) {
          that.eventSave(shareImage)
        }
      }
    })
  },
  // 将商品分享图片保存到本地
  eventSave(shareImage) {
    wx.saveImageToPhotosAlbum({
      filePath: shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  //将线上图片地址下载到本地，此函数进行了封装，只有在需要转换url的时候调用即可
  getBG(url) {
    // Promise函数给我很大的帮助，让我能return出回调函数中的值
    return new Promise(function (resolve) {
      wx.downloadFile({
        url: url,
        success: function (res) {
          console.log(res)
          url = res.tempFilePath
          resolve(url);
        }
      })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
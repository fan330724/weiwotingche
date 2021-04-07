// pages/search/search.js
const qqmap = require('../../../../utils/qqmap.js');
const app = getApp();
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
//获取全局唯一的语音识别管理器recordRecoManager
const manager = plugin.getRecordRecognitionManager();
// 设置采集声音参数
const options = {
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'aac'
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //列表数组
    listarr: [],
    //城市
    city: "",
    //输入的内容
    p: "",
    recordState: false, //录音状态
    show: false, //弹窗状态
    listshow: '' //搜索状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      city: options.city
    })
    this.initRecord()
  },
  onConfirm(e) {
    console.log(e)
    var that = this;
    var city = that.data.city;
    that.setData({
      p: e.detail
    })
    if (e.detail == "") {
      that.setData({
        listarr: ""
      })
    } else {
      let texts = function (res) {
        if (res.data.length == 0) {
          that.setData({
            listshow: true
          })
        } else {
          that.setData({
            listshow: false,
            listarr: res.data
          })
        }
      }
      console.log(city)
      qqmap.input(e.detail, city, texts)
    }
  },
  onConfirm1() {
    var that = this
    var city = that.data.city;
    let texts = function (res) {
      if (res.data.length == 0) {
        that.setData({
          listshow: true
        })
      } else {
        that.setData({
          listshow: false,
          listarr: res.data
        })
      }
    }
    qqmap.input(that.data.p, city, texts)
  },
  clearInput() {
    this.setData({
      p: "",
      listarr: "",
      listshow: false
    })
  },
  onfail() {
    wx.switchTab({
      url: '../../../tabBar/home/home',
    })
  },
  markertap(e) {
    console.log(e)
    var latitude = e.currentTarget.dataset.loaction.lat
    var longitude = e.currentTarget.dataset.loaction.lng
    wx.redirectTo({
      url: `../search-result/search-result?latitude=${latitude}&longitude=${longitude}`,
    })
  },
  toyu() {
    this.setData({
      show: true
    })
  },
  //识别语音 -- 初始化
  initRecord: function () {
    const that = this;
    // 有新的识别内容返回，则会调用此事件
    manager.onRecognize = function (res) {
      console.log(res)
    }
    // 正常开始录音识别时会调用此事件
    manager.onStart = function (res) {
      console.log("成功开始录音识别", res)
    }
    // 识别错误事件
    manager.onError = function (res) {
      console.error("error msg", res)
      wx.showModal({
        title: '提示',
        content: '说话时间太短，请重新说一遍！',
        showCancel: false,
        success: function (res) {}
      })
    }
    //识别结束事件
    manager.onStop = function (res) {
      console.log('..............结束录音')
      console.log('录音临时文件地址 -->' + res.tempFilePath);
      console.log('录音总时长 -->' + res.duration + 'ms');
      console.log('文件大小 --> ' + res.fileSize + 'B');
      console.log('语音内容 --> ' + res.result);
      var result = res.result.replace('。', '').replace('，', '');
      if (result == '') {
        wx.showModal({
          title: '提示',
          content: '听不清楚，请重新说一遍！',
          showCancel: false,
          success: function (res) {}
        })
        return;
      }
      var text = that.data.p + result;
      that.setData({
        p: text
      })
      that.onConfirm1()
    }
  },
  //语音  --按住说话
  touchStart: function (e) {
    wx.vibrateShort() //按键震动效果（15ms）
    manager.start(options)
    this.setData({
      recordState: true, //录音状态为真
      tips: '松开结束',
    })

  },
  //语音  --松开结束
  touchEnd: function (e) {
    // 语音结束识别
    manager.stop();
    this.setData({
      recordState: false,
      show: false
    })
  },

  clearshow() {
    this.setData({
      show: false
    })
  },
})
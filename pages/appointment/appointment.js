// pages/ble/demo.js
// var util = require('../../utils/util.js');
var blePortal = require("../../utils/lanya/blePortal.js");
var deviceName = "";
var key = "";
var app = getApp()

Page({
  data: {
    opblue: 0,  //蓝牙是否开启 
    DSList:[],  // 地锁组
    serch:'',    // 是否找到
    connect:0,  // 是否连接成功
    isstate:'down',    // 升起状态
    RE_NAME:''       // 设备名字 
  },
  onShow: function () {
    deviceName = "";
    key = "";
    console.log(deviceName)
    this.setData({
      connect: 0,
      serch: '',   
    })
    var _this = this;
    //监测蓝牙设备是否开启
    wx.openBluetoothAdapter({
      complete: function (res) {
        if (res.errCode == 10001) {
          wx.showModal({
            title: '请打开蓝牙',
            content: '使用地锁必须开启设备蓝牙',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                return;
              }
            }
          })
        }
      }
    });
    blePortal.init();
    // 拉取绑定的车位锁  最多绑定3个  超过3个隐藏添加入口。
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: `${app.data.url}/api/lock/open.shtml`,
      data:{
        CELLPHONE:wx.getStorageSync('CELLPHONE')
      },
      method:'POST',
      success:(res)=>{
        _this.setData({
          DSList:res.data.data
        })
        if(_this.data.DSList.length==0){
          wx.showModal({
            title: '暂未绑定设备',
            content: '是否前往绑定设备',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../addappointment/addappointment',
                })
              }
            }
          })
        }
        wx.hideLoading()
        console.log(_this.data.DSList, deviceName,key)
      }
    })
  },
  onHide: function () {
    this.disconnectTap()
    console.info("页面关闭");
    wx.hideLoading()
    blePortal.disconnect();
    blePortal.stopScan();
  },
  /**
   *  选择地锁组
   */
  bindPickerChange(e) {
    this.disconnectTap()
    this.setData({
      connect: 0
    })
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let name =this.data.DSList[e.detail.value].RE_NAME
    deviceName = this.data.DSList[e.detail.value].LOCK_NUMBER.slice(this.data.DSList[e.detail.value].LOCK_NUMBER.length-7)
    key = this.data.DSList[e.detail.value].IOS_MAC
    console.log(deviceName,key)
    this.setData({
      RE_NAME: name
    })
    this.scanTap()
  },
/**
 * 点击按钮 根据状态切换
 */
  changeBtn:function(){
    let _this = this;
    if (_this.data.isstate=='up'){
      //降下
      _this.unlockTap()
    }else{
       //升起
      _this.lockTap()
    }
  },
  /**
  * 搜索蓝牙信号
  */
  scanTap: function () {
    var _this = this;
    wx.showLoading({
      title: '正在连接',
      mask:true
    })
    blePortal.startScan(function (deivce) {
      if (deivce.name == deviceName) {
        _this.setData({
          sl:true
        })
        blePortal.stopScan();
        console.log('找到了' + _this.data.sl)
        _this.setData({
          serch:1
        })
        blePortal.setDevice(deivce, key);
      }
    });
    // 定时器轮询是否找到蓝牙设备
    let serchB = setInterval(()=>{
      if (_this.data.serch){
        _this.connectTap()
        clearInterval(serchB)
      }
    }, 
    1000);
    let noSerch  = setTimeout(()=>{
      if (_this.data.serch==''){
        wx.showModal({
          title: '提示',
          content: '未查询到地锁设备',
          showCancel: false
        })
        wx.hideLoading()
        _this.setData({
          serch:0
        })
      }
      clearInterval(serchB)
      blePortal.stopScan();
      },8000
    )
  },
  /**
   * 连接设备
   */
  connectTap: function () {
    var _this = this;
    blePortal.connect(function (isSuc, error, lockState) {
      console.info("连接", error, lockState);
      deviceName = '';
      key = ''
      if (error=='success'){
        wx.hideLoading()
        wx.showToast({
          title: '连接成功',
          mask:true,
        })
        
      }
      if (lockState.state==0){
        _this.setData({
          isstate:'up',
          connect: 1
        })
      }else{
        _this.setData({
          isstate: 'down',
          connect: 1
        })
      }
     
    });
  },
  /**
   * 升起
   */
  lockTap: function () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '正在上升地锁',
    })
    blePortal.lock(function (isSuc, error, lockState) {
      console.info("上锁：" + error, lockState);
      if (lockState.state == 0) {
        _this.setData({
          isstate: 'up',
          connect: 1
        })
      } else {
        _this.setData({
          isstate: 'down',
          connect: 1
        })
      }
       wx.hideLoading()
      wx.showToast({
        mask: true,
        title: '升锁成功',
      })
    });
  },
  /**
   * 降下
   */
  unlockTap: function () {
    let _this = this
    wx.showLoading({
      mask: true,
      title: '正在降下地锁',
    })
    blePortal.unlock(function (isSuc, error, lockState) {
      console.info("降锁：" + error, lockState);
      wx.hideLoading()
      if (lockState.state == 0) {
        _this.setData({
          isstate: 'up',
          connect: 1
        })
      } else {
        _this.setData({
          isstate: 'down',
          connect: 1
        })
      }
      wx.hideLoading()
      wx.showToast({
        mask: true,
        title: '降锁成功',
      })
    });
  },
  /**
   * 断开连接
   */
  disconnectTap: function () {
    console.log(123)
    blePortal.disconnect();
    this.setData({
      connect: 0
    })
  },
  toAdd:function(){
    let list = JSON.stringify(this.data.DSList)
    wx.navigateTo({
      url: `../addappointment/addappointment`,
    })
  }
})
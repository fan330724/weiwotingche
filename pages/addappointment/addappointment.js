// pages/addappointment/addappointment.js
var app = getApp()
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    DSList: '', // 已绑定的设备
    scanId: '', // 扫码或者手动输入的需要绑定的设备号 
    isBox: 1, //控制修改名称的盒子是否显示
    focus: 0, // 控制修改名称的盒子的inpute聚焦
    cNmae: '', // 修改的设备名称
    id: '', // 修改名称的设备id或者解绑的设备id
    isThree: 0, //车牌是否以及满足3个
    clearNmae: '', // 解绑的名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let _this = this
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: `${app.data.url}/api/lock/open.shtml`,
      data: {
        CELLPHONE: wx.getStorageSync('CELLPHONE')
      },
      method: 'POST',
      success: (res) => {
        _this.setData({
          DSList: res.data.data,
          isBox: 1, //控制修改名称的盒子是否显示
          focus: 0, // 控制修改名称的盒子的inpute聚焦
          cNmae: '', // 修改的设备名称
          id: '', // 修改名称的设备id
        })
        wx.hideLoading()
        _this.isthree()
      }
    })
  },
  // 扫码获取设备编号
  scan: function() {
    let _this = this
    wx.scanCode({
      success(res) {
        _this.setData({
          scanId: res.result
        })
      }
    })
  },
  //inpute框事件
  change: function(e) {
    this.setData({
      scanId: e.detail.value
    })
  },
  // 绑定事件
  btnCan: function() {
    wx.showLoading({
      title: '正在绑定',
    })
    let _this = this
    if (_this.data.scanId) {
      wx.request({
        url: `${app.data.url}/api/lock/bound.shtml`,
        data: {
          LOCK_NUMBER: _this.data.scanId,
          CELLPHONE: wx.getStorageSync('CELLPHONE')
        },
        method: 'POST',
        success: (res) => {
          console.log(res)
          wx.hideLoading()
          if (res.data.errcode == 35) {
            wx.showToast({
              title: '未找到该设备号对应的信息',
              icon: 'none'
            })
            return;       
          } else if (res.data.errcode == 37) {
            wx.showToast({
              title: '该设备已绑定',
              icon: 'none'
            })
          }
          else if (res.data.errcode == 36) {
            wx.showToast({
              title: '绑定已绑已达上限',
              icon: 'none'
            })
            }else if (res.data.errcode == 0) {
            wx.request({
              url: `${app.data.url}/api/lock/open.shtml`,
              data: {
                CELLPHONE: wx.getStorageSync('CELLPHONE')
              },
              method: 'POST',
              success: (res) => {
                console.log(res)
                _this.setData({
                  DSList: res.data.data,
                  scanId: ''
                })
                wx.showToast({
                  title: '绑定成功',
                })
                _this.isthree()
              }
            })
          }

        }
      })
    } else {
      wx.showToast({
        title: '请填写设备号',
        icon: 'none'
      })
      return;
    }
  },
  // 修改设备名字开始
  changeName: function(e) {
    this.setData({
      isBox: 0,
      focus: 1
    })
    let ids = e.currentTarget.dataset.id
    this.setData({
      id: ids
    })
  },
  // 取消修改
  noName: function() {
    this.setData({
      isBox: 1,
      focus: 0,
      cName: '',
      id: ''
    })
    console.log(this.data.cName)
  },
  // 修改设备名称inpute事件
  cName: function(e) {
    this.setData({
      cName: e.detail.value
    })
  },
  // 修改确定事件
  userName: function() {
    let _this = this
    if (_this.data.cName) {
      wx.showLoading({
        title: '修改中...',
      })
      wx.request({
        url: `${app.data.url}/api/lock/rename.shtml`,
        data: {
          LOCK_NUMBER: _this.data.id,
          RENAME: _this.data.cName,
          CELLPHONE: wx.getStorageSync('CELLPHONE')
        },
        method: "POST",
        success: function(e) {
          wx.hideLoading()
          if (e.data.errcode == 0) {
            wx.request({
              url: `${app.data.url}/api/lock/open.shtml`,
              data: {
                CELLPHONE: wx.getStorageSync('CELLPHONE')
              },
              method: 'POST',
              success: (res) => {
                _this.setData({
                  DSList: res.data.data,
                  scanId: ''
                })
                wx.showToast({
                  title: '修改成功',
                })
              }
            })
            _this.noName()
          } else {
            wx.showToast({
              title: '未知错误',
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请填写设备名称',
        icon: "none"
      })
      return;
    }

  },
  // 判断 绑定的车牌是否以够3个
  isthree: function() {
    if (this.data.DSList.length == 3) {
      this.setData({
        isThree: 1
      })
      console.log(3)
    } else {
      this.setData({
        isThree: 0
      })
      console.log(0)
    }
  },
  //解除绑定开始
  clearLock: function(e) {
    let _this = this
    this.setData({
      id: e.currentTarget.dataset.id,
      clearNmae: e.currentTarget.dataset.name
    })
    wx.showModal({
      title: '解绑设备',
      content: `是否解除${_this.data.clearNmae}`,
      success(res) {
        if (res.confirm) {
          _this.locker()
        } else if (res.cancel) {
          _this.setData({
            id: '',
            clearNmae: ''
          })
        }
      }
    })
  },

  // 解除绑定
  locker: function() {
    let _this = this
    wx.request({
      url: `${app.data.url}/api/lock/unbound.shtml`,
      data: {
        CELLPHONE: wx.getStorageSync('CELLPHONE'),
        LOCK_NUMBER: _this.data.id
      },
      method: "POST",
      success: (res) => {
        if (res.data.errcode == 0) {
          wx.request({
            url: `${app.data.url}/api/lock/open.shtml`,
            data: {
              CELLPHONE: wx.getStorageSync('CELLPHONE')
            },
            method: 'POST',
            success: (res) => {
              _this.setData({
                DSList: res.data.data,
                id: '',
                clearNmae: ''
              })
              wx.showToast({
                title: '解绑成功',
              })
              _this.isthree()
            }
          })
        }
      }
    })
  }
})
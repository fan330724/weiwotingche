// keyboard.js
var checkNetWork = require("../../utils/CheckNetWork.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   * keyboard1:首页键盘,显示省的简称
   * keyboard2:第二页键盘，显示数字和大写字母
   */
  data: {
    isKeyboard: false, //是否显示键盘
    specialBtn: false,
    tapNum: false, //数字键盘是否可以点击
    isFocus: false, //输入框聚焦
    flag: false, //防止多次点击的阀门
    keyboardNumber: '1234567890',
    keyboardAlph: 'QWERTYUIOPASDFGHJKLZXCVBNM警领学巛港澳',
    keyboard1: '京津沪冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁渝使',
    keyboard2: '',
    keyboard2For: ['完成'],
    keyboardValue: '',
    textArr: [],
    textValue: '',
    placeholder: '请输入车牌',
    newcar: 7,
    newval: 1 //新能源车切换
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  /**
   * 输入框显示键盘状态
   */
  showKeyboard: function() {
    var self = this;
    self.setData({
      isFocus: true,
      isKeyboard: true,
    })
  },
  /**
   * 点击页面隐藏键盘事件
   */
  hideKeyboard: function() {
    var self = this;
    if (self.data.isKeyboard) {
      //说明键盘是显示的，再次点击要隐藏键盘
      if (self.data.textValue) {
        self.setData({
          isKeyboard: false
        })
      } else {
        self.setData({
          isKeyboard: false,
          isFocus: false
        })
      }

    }
  },
  /**
   * 输入框聚焦触发，显示键盘
   */
  bindFocus: function() {
    var self = this;
    if (self.data.isKeyboard) {
      //说明键盘是显示的，再次点击要隐藏键盘
      self.setData({
        isKeyboard: false,
        isFocus: true,
      })
    } else {
      //说明键盘是隐藏的，再次点击显示键盘
      self.setData({
        isFocus: true,
        isKeyboard: true,
      })
    }
  },
  /**
   * 键盘事件
   */
  tapKeyboard: function(e) {
    var self = this;
    //获取键盘点击的内容，并将内容赋值到textarea框中
    var tapIndex = e.target.dataset.index;
    var tapVal = e.target.dataset.val;
    var keyboardValue;
    var specialBtn;
    var tapNum;
    if (tapVal == "巛") {
      //说明是删除
      self.data.textArr.pop();
      if (self.data.textArr.length == 0) {
        //说明没有数据了，返回到省份选择键盘
        this.specialBtn = false;
        this.tapNum = false;
        this.keyboardValue = self.data.keyboard1;
      } else if (self.data.textArr.length == 1) {
        //只能输入字母
        this.tapNum = false;
        this.specialBtn = true;
        this.keyboardValue = self.data.keyboard2;
      } else {
        this.specialBtn = true;
        this.tapNum = true;
        this.keyboardValue = self.data.keyboard2;
      }
      self.data.textValue = self.data.textArr.join("");
      self.setData({
        textValue: self.data.textValue,
        keyboardValue: this.keyboardValue,
        specialBtn: this.specialBtn,
        tapNum: this.tapNum,
      })
      return false
    }
    if (self.data.textArr.length >= self.data.newcar) {
      return false;
    }
    self.data.textArr.push(tapVal);
    self.data.textValue = self.data.textArr.join("");
    self.setData({
      textValue: self.data.textValue,
      keyboardValue: self.data.keyboard2,
      specialBtn: true,
    })
    if (self.data.textArr.length > 1) {
      //展示数字键盘
      self.setData({
        tapNum: true
      })
    }
  },
  /**
   * 特殊键盘事件（删除和完成）
   */
  tapSpecBtn: function(e) {
    var self = this;
    if (self.data.flag) {
      return false
    }
    var btnIndex = e.target.dataset.index;
    if (btnIndex == 0) {
      //说明是完成事件
      if (self.data.textArr.length < self.data.newcar) {
        wx.showToast({
          title: '车牌输入错误',
          icon: "loading",
          mask: true,
          duration: 2000
        })
      } else {
        self.setData({
          flag: true
        })
        if (!checkNetWork.checkNetWorkStatu()) {
          console.log('网络错误')
          self.setData({
            flag: false
          })
        } else {
          //开始请求接口
          console.log("开始请求接口")
          console.log(self.data.textValue)
          // 绑定车牌接口
          self.bCar()
        }
      }
    }
  },
  // 新能源车牌
  switch2Change: function() {
    var _this = this;
    let newval = _this.data.newval;
    if (newval == 0) {
      _this.setData({
        newval: 1
      })
    } else {
      _this.setData({
        newval: 0
      })
    }
    var text = _this.data.textValue
    if (newval == 0) {
      console.log('7位数')
      if (text.length == 8) {
        text = text.substring(0, 7)
        //删除事件
        _this.data.textArr.pop()
      }
      _this.setData({
        newcar: 7,
        textValue: text
      })
    } else {
      console.log("8位数")
      _this.setData({
        newcar: 8,
        textValue: text
      })

    }

  },
  /*
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var self = this;
    //将keyboard1和keyboard2中的所有字符串拆分成一个一个字组成的数组
    self.data.keyboard1 = self.data.keyboard1.split('')
    self.data.keyboard2 = self.data.keyboard2.split('')
    self.setData({
      keyboardValue: self.data.keyboard1
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var self = this;
    self.setData({
      flag: false
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.stopPullDownRefresh()
  },
  //  车牌绑定
  bCar: function() {
    let self = this
    if (self.data.textArr.length < self.data.newcar) {
      wx.showToast({
        title: '车牌输入错误',
        icon: "loading",
        mask: true,
        duration: 2000
      })
      return;
    }
    wx.getStorage({
      key: 'CELLPHONE',
      success: function(e) {
        wx.request({
          url: app.data.url + '/api/member/bindingPlateNumber.shtml',
          data: {
            CELLPHONE: e.data,
            PLATENUMBER: self.data.textValue,
          },
          method: 'POST',
          success: function(res) {
            console.log(res)
            if (res.data.errcode == 15) {
              wx.showModal({
                title: '提示',
                content: '车牌已存在，请核对后输入',
                showCancel: false
              })
              self.setData({
                flag: false
              })
            } else {
              wx.showToast({
                title: '绑定成功',
                icon:"none"
              })
              wx.reLaunch({
                url: '../home/home',
              })
            }
          }
        })
      },
    })
  }
})
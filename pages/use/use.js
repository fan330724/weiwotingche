// pages/use/use.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: "", //传过来的数据
    imgUrl: "", //二维码图片
    show: false, //下拉显示
    selectlist: "", //下拉列表
    index: -1, //列表的索引
    id: "", //停车场列表id
    isKeyboard: false, //是否显示键盘
    tapNum: false, //数字键盘是否可以点击
    flag: false, //防止多次点击的阀门
    keyboardNumber: '1234567890',
    keyboardAlph: 'QWERTYUIOPASDFGHJKLZXCVBNM警领学巛港澳',
    keyboard1: '京津沪冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁渝使',
    keyboard2: '',
    keyboard2For: ['完成'],
    keyboardValue: '',
    textArr: [],
    textValue: '', //输入框的值
    CODE: '',
    placeholder: "请填写车牌号",
    isShow: "true"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var item = JSON.parse(options.item)
    console.log(item)
    this.setData({
      list: item
    })
    this.requestlist()
  },
  tocopy() {
    wx.setClipboardData({
      data: this.data.CODE,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  request(url) {
    wx.showLoading({
      title: '加载中'
    })
    console.log(this.data.list.ID)
    setTimeout(() => {
      wx.request({
        url: app.data.url + url,
        data: {
          id: this.data.list.ID
        },
        responseType: "arraybuffer",
        method: 'get',
        success: (res) => {
          wx.hideLoading()
          console.log(res)
          setTimeout(() => {
            var imgUrl = wx.arrayBufferToBase64(res.data)
            this.setData({
              imgUrl
            })
          }, 300)

        }
      })
    }, 300)
  },
  clickshow() {
    this.setData({
      show: !this.data.show
    })
  },
  //点击下拉列表
  optionTap(e) {
    var {
      id,
      index
    } = e.currentTarget.dataset
    console.log(index)
    this.setData({
      index,
      id,
      show: !this.data.show
    })
  },
  //去使用
  touse() {
    if (this.data.textValue == '') {
      wx.showToast({
        title: '请输入正确的车牌号',
        icon: 'none'
      })
    } else if (this.data.index == -1) {
      wx.showToast({
        title: '请选择停车场',
        icon: 'none'
      })
    } else {
      wx.showModal({
        title: "请确认停车场和车牌号",
        success: (res) => {
          if (res.cancel) {
            return
          } else if (res.confirm) {
            wx.showLoading({
              title: '加载中',
            })
            wx.request({
              url: app.data.url + '/api/parkCoupon/wwCoupon.shtml',
              method: "post",
              data: {
                PARK_ID: this.data.id,
                CARD_ID: this.data.list.ID,
                PLATE_NUMBER: this.data.textValue,
              },
              success: (res) => {
                wx.hideLoading()
                console.log(res.data)
                var err = res.data.errmsg
                if (res.data.data != null) {
                  wx.showToast({
                    title: '停车券兑换成功，出场自动减免',
                    icon: "none",
                  })
                  setTimeout(() => {
                    wx.navigateBack()
                  }, 1500)
                } else {
                  wx.showToast({
                    title: err,
                    icon: "none"
                  })
                }
              }
            })
          }
        }
      })

    }


  },
  //车场列表接口
  requestlist() {
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.data.url + '/api/parkCoupon/wwParkList.shtml',
      method: "post",
      success: (res) => {
        console.log(res.data.data)
        var data = res.data.data
        this.setData({
          selectlist: data
        })
        wx.hideLoading()
      }
    })
  },
  /**
   * 输入框显示键盘状态
   */
  showKeyboard: function () {
    this.setData({
      isKeyboard: true,
      isShow: false
    })
    console.log(111)
  },
  /**
   * 输入框隐藏键盘状态
   */
  hideKeyboard() {
    this.setData({
      isKeyboard: false,
    })
  },
  /**
   * 键盘事件
   */
  tapKeyboard: function (e) {
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
    if (self.data.textArr.length >= 8) {
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
  tapSpecBtn: function (e) {
    var self = this;
    if (self.data.flag) {
      return false
    }
    var btnIndex = e.target.dataset.index;
    if (btnIndex == 0) {
      //说明是完成事件
      this.setData({
        isKeyboard: false,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
  onShow: function () {
    // this.request('/api/gas/qrcode.shtml');
    let cardType = this.data.list.CARD_TYPE
    let cardName = this.data.list.CARD_NAME
    switch (cardType) {
      case 'GAS-S':
      case 'WASH-CXJ':
        switch(cardName){
          case '车速洁':{
            wx.request({
              url: app.data.url + '/api/parkCoupon/tlwCoupon.shtml',
              data: {
                CARD_ID: this.data.list.ID
              },
              method: "post",
              success: (res) => {
                this.setData({
                  CODE: res.data.data.CODE
                })
              }
            })
            break;
          }
          default :{
            this.request('/api/carwash/qrcode.shtml')
            break;
          }
        }
      case 'PARK-TLW':
      case 'PARK-TCL':
        wx.request({
          url: app.data.url + '/api/parkCoupon/tlwCoupon.shtml',
          data: {
            CARD_ID: this.data.list.ID
          },
          method: "post",
          success: (res) => {
            this.setData({
              CODE: res.data.data.CODE
            })
          }
        })
        break;
    }
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
})
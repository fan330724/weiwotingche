// pages/openfq/openfq.js
var app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    totolID: '', //订单发票ID
    park_ID: '', //车场ID
    index: '1', //tab状态
    totolPrice: '', // 订单发票金额
    // 发票填写信息
    NAME: '', //名称
    CELLPHONE: '', //电话
    ADDR_CELL: '', //地址电话
    MALL: '', //邮箱
    BACK_CARD: '', //银行账号 
    TAX_NO: '', //税号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    let {
      price,
      id,
      park_id
    } = options;
    _this.setData({
      totolPrice: price,
      totolID: id,
      park_ID: park_id
    })
    console.log(_this.data.park_ID)
  },
  // tab切换
  change: function(e) {
    if (e.currentTarget.dataset.id == this.data.index) {
      return
    } else {
      this.setData({
        index: e.currentTarget.dataset.id,
        NAME: '', //名称
        CELLPHONE: '', //电话
        ADDR_CELL: '', //地址电话
        MALL: '', //邮箱
        BACK_CARD: '' //银行账号
      })
    }

  },
  //修改名称
  changeName: function(e) {
    this.setData({
      NAME: e.detail.value
    })
  },
  // 修改电话
  changeCellphone: function(e) {
    this.setData({
      CELLPHONE: e.detail.value
    })
  },
  // 修改地址电话
  changeAddr_cell: function(e) {
    this.setData({
      ADDR_CELL: e.detail.value
    })
  },
  // 修改邮箱
  changeMall: function(e) {
    this.setData({
      MALL: e.detail.value
    })
  },
  // 修改税号
  changeTax_no: function(e) {
    this.setData({
      TAX_NO: e.detail.value
    })
  },
  //修改银行账户
  changeBcak_card: function(e) {
    this.setData({
      BACK_CARD: e.detail.value
    })
  },
  // 提交发票信息
  pull: function() {
    let _this = this
    var pattern = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (_this.data.index == 1 || _this.data.index == 3) {
      if (_this.data.NAME !== '' || _this.data.CELLPHONE !== '' || _this.data.MALL !== ''){
        if (pattern.test(_this.data.CELLPHONE)){
          _this.Axios()
        } else {
          wx.showToast({
            title: '信息错误',
            icon: 'loading',
            duration: 2000
          })
        }
      } else {
        wx.showToast({
          title: '信息错误',
          icon: 'loading',
          duration: 2000
        })
      }
    } else {
      if (_this.data.NAME !== '' || _this.data.CELLPHONE !== '' || _this.data.MALL !== '' || _this.data.TAX_NO !=='') {
        if (pattern.test(_this.data.CELLPHONE)){
          _this.Axios()
        } else {
          wx.showToast({
            title: '信息错误',
            icon: 'loading',
            duration: 2000
          })
        }
      } else {
        wx.showToast({
          title: '信息错误',
          icon: 'loading',
          duration: 2000
        })
      }
    }
  },
  //请求接口
  Axios: function() {
    let _this = this
    wx.showLoading({
      title: '开票中',
    })
    wx.request({
      url: app.data.url+'/api/invoic/post.shtml', //仅为示例，并非真实的接口地址
      data: {
        ID: _this.data.totolID, 
        NAME: _this.data.NAME,
        CELLPHONE: _this.data.CELLPHONE,
        ADDR_CELL: _this.data.ADDR_CELL,
        BACK_CARD: _this.data.BACK_CARD,
        TOTAL: _this.data.totolPrice,
        MAIL: _this.data.MALL,
        PARK_ID: _this.data.park_ID
      },
      method:"POST",
      success(res) {
        wx.hideLoading()
        console.log(res)
        let abs = res;
        if(res.data.errcode==0){
          wx.showModal({
            title: '开票成功',
            content: '已发送至填写的邮箱',
            confirmText:'确定',
            showCancel:false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta:2
                })
              }
            }
          })
        }else{
          wx.showToast({
            title: '开票失败',
            duration: 4000
          })
        }
      }
    })
  }
})  
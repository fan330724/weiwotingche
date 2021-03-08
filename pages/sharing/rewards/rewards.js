// pages/sharing/rewards/rewards.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: "", //人数
    num1: "", //油量
    cellphone: "", //电话
    disabled: false, //禁用输入框
    name: "", //姓名
    dizhi: "", //地址
    show: true,
    winlist: '',
    disa: true,
    index: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var {
      num,
      num1,
      index
    } = options
    var winlist = JSON.parse(options.winlist)
    this.setData({
      num,
      num1,
      cellphone: wx.getStorageSync('CELLPHONE'),
      winlist,
      index
    })
  },

  toSubmit(e){
    var {text,number,textarea} = e.detail.value
    if(text == '' || number == '' || textarea == ''){
      wx.showToast({
        title: '请输入',
        icon:"none"
      })
    }else{
      if(this.data.disa){
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: app.data.url + 'api/channel/getMemberMsg.shtml',
          method:"post",
          data: {
            CELLPHONE: wx.getStorageSync('CELLPHONE'),
            TELPHONE: number,
            NAME: text,
            ADDRESS: textarea,
            CARD_TYPE: this.data.num1
          },
          success:(res) => {
            wx.hideLoading()
            console.log(res)
            var data = res.data.data
            console.log(data)
            if(data == 'success'){
              wx.showToast({
                title: '领取成功',
                success:()=>{
                  this.setData({
                    disa:false,
                    disabled: true, //禁用输入框
                  })
                }
              })
            }else{
              wx.showToast({
                title: '领取失败',
              })
            } 
          },
        })
      }else{
        wx.showToast({
          title: '已经领过了',
          icon:"none"
        })
      }
    }
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
    if (this.data.index == 1) {
      this.data.winlist.filter((v) => {
        console.log(v)
        if (v.CARD_TYPE == this.data.num1) {
          this.setData({
            disabled: true,
            show: false,
            cellphone: v.TELPHONE, //电话
            name: v.NAME, //姓名
            dizhi: v.ADDRESS, //地址
          })
        }
      })
    } else if (this.data.index == 2) {
      this.data.winlist.filter((v) => {
        console.log(v)
        if (v.CARD_TYPE == this.data.num1) {
          this.setData({
            disabled: true,
            show: false,
            cellphone: v.TELPHONE, //电话
            name: v.NAME, //姓名
            dizhi: v.ADDRESS, //地址
          })
        }
      })
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
    this.onShow()
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